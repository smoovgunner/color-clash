// EvenPlay games server. The pages are served from /public; this handles the game rooms.
//   Color Clash:  GET /api/new  -> { code },  GET /api/room/<CODE>     -> WebSocket
//   Letter Flip:  GET /api/lf/new -> { code }, GET /api/lf/room/<CODE> -> WebSocket
//   Rummy:        GET /api/rm/new -> { code }, GET /api/rm/room/<CODE> -> WebSocket
import { DurableObject } from "cloudflare:workers";
import * as colorClash from "../public/game.js";
import * as letterFlip from "../public/letter-flip/rules.js";
import * as rummy from "../public/rummy/rules.js";

const WORDS = [
  "TIGER", "MANGO", "COMET", "LUCKY", "OCEAN", "PEACH", "ROCKET", "SUNNY", "MAPLE", "JAZZY",
  "PANDA", "RIVER", "STORM", "HONEY", "CANDY", "PIXEL", "ZEBRA", "LEMON", "CORAL", "BLAZE",
];
const IDLE_MS = 7 * 24 * 60 * 60 * 1000; // a room with no moves for a week is cleared

function makeCode() {
  const a = new Uint32Array(2);
  crypto.getRandomValues(a);
  return WORDS[a[0] % WORDS.length] + String(10 + (a[1] % 90));
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (/^\/api\/((lf|rm)\/)?new$/.test(url.pathname)) return json({ code: makeCode() });
    const m = url.pathname.match(/^\/api\/(?:(lf|rm)\/)?room\/([A-Z0-9]{3,16})$/);
    if (m) {
      if (req.headers.get("Upgrade") !== "websocket") return json({ error: "Expected a WebSocket" }, 426);
      const ns = { lf: env.LF_ROOMS, rm: env.RM_ROOMS }[m[1]] || env.ROOMS;
      return ns.get(ns.idFromName(m[2])).fetch(req);
    }
    return env.ASSETS.fetch(req);
  },
};

class Room extends DurableObject {
  constructor(ctx, env, rules) {
    super(ctx, env);
    this.rules = rules;
    this.st = null;
    ctx.blockConcurrencyWhile(async () => {
      this.st = (await ctx.storage.get("st")) || null;
    });
  }

  async fetch(req) {
    const code = new URL(req.url).pathname.split("/").pop();
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ seat: -1, token: null, code });
    return new Response(null, { status: 101, webSocket: client });
  }

  sockets() {
    return this.ctx.getWebSockets().filter((ws) => ws.readyState === 1);
  }

  connected() {
    const c = [false, false];
    for (const ws of this.sockets()) {
      const a = ws.deserializeAttachment();
      if (a && a.seat >= 0) c[a.seat] = true;
    }
    return c;
  }

  async save() {
    await this.ctx.storage.put("st", this.st);
    await this.ctx.storage.setAlarm(Date.now() + IDLE_MS);
  }

  broadcast(extra) {
    const connected = this.connected();
    for (const ws of this.sockets()) {
      const a = ws.deserializeAttachment() || { seat: -1 };
      try {
        ws.send(JSON.stringify({ type: "state", code: a.code, view: this.rules.viewFor(this.st, a.seat, connected), ...(extra || {}) }));
      } catch (e) { /* socket going away */ }
    }
  }

  async webSocketMessage(ws, raw) {
    let m;
    try { m = JSON.parse(raw); } catch (e) { return; }
    const att = ws.deserializeAttachment() || { seat: -1 };

    if (m.type === "ping") { ws.send('{"type":"pong"}'); return; }

    if (m.type === "hello") {
      const token = String(m.token || "").slice(0, 64);
      const name = String(m.name || "").trim().slice(0, 24) || "Player";
      if (!this.st) this.st = { ...this.rules.newTable() };
      let seat = this.st.seats.findIndex((p) => p && p.token === token);
      if (seat < 0 && token) {
        seat = this.st.seats.findIndex((p) => !p);
        if (seat >= 0) this.st.seats[seat] = { token, name };
      }
      if (seat >= 0) this.st.seats[seat].name = name;
      ws.serializeAttachment({ seat, token, code: att.code });
      await this.save();
      this.broadcast();
      return;
    }

    if (m.type === "act") {
      if (!this.st) return;
      const err = this.rules.applyAction(this.st, att.seat, m.action);
      if (err) { ws.send(JSON.stringify({ type: "error", message: err })); return; }
      await this.save();
      this.broadcast();
      return;
    }

    if (m.type === "leave") {
      if (this.st && att.seat >= 0) {
        this.st.seats[att.seat] = null;
        this.st.status = "waiting";
        this.st.wins = [0, 0];
        await this.save();
      }
      ws.serializeAttachment({ seat: -1, token: null, code: att.code });
      try { ws.close(1000, "left"); } catch (e) {}
      this.broadcast();
    }
  }

  async webSocketClose(ws) {
    try { ws.close(); } catch (e) {}
    if (this.st) this.broadcast();
  }

  async webSocketError(ws) {
    if (this.st) this.broadcast();
  }

  async alarm() {
    // Nobody has made a move for a week: clear the room so its code can be reused.
    if (this.sockets().length) { await this.ctx.storage.setAlarm(Date.now() + IDLE_MS); return; }
    await this.ctx.storage.deleteAll();
    this.st = null;
  }
}

export class GameRoom extends Room {
  constructor(ctx, env) { super(ctx, env, colorClash); }
}
export class LetterRoom extends Room {
  constructor(ctx, env) { super(ctx, env, letterFlip); }
}
export class RummyRoom extends Room {
  constructor(ctx, env) { super(ctx, env, rummy); }
}
