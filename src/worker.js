// EvenPlay games server. The pages are served from /public; this handles the game rooms.
//   Color Clash:  GET /api/new  -> { code },  GET /api/room/<CODE>     -> WebSocket
//   Letter Flip:  GET /api/lf/new -> { code }, GET /api/lf/room/<CODE> -> WebSocket
//   Rummy:        GET /api/rm/new -> { code }, GET /api/rm/room/<CODE> -> WebSocket
//   Deal Rush:    GET /api/dr/new -> { code }, GET /api/dr/room/<CODE> -> WebSocket
//   Dice Dash:    GET /api/dd/new -> { code }, GET /api/dd/room/<CODE> -> WebSocket
//   Survey Showdown: GET /api/ss/new -> { code }, GET /api/ss/room/<CODE> -> WebSocket
//   High Rollers: GET /api/hr/new -> { code }, GET /api/hr/room/<CODE> -> WebSocket
//   Play someone new: POST /api/lobby/match {game, player} -> { code, waiting }, GET /api/lobby -> players waiting per game
//   (a room joined with ?pub=1 is a public table: it tells the lobby while it waits, and when it fills)
import { DurableObject } from "cloudflare:workers";
import * as colorClash from "../public/color-clash/game.js";
import * as letterFlip from "../public/letter-flip/rules.js";
import * as rummy from "../public/rummy/rules.js";
import * as dealRush from "../public/deal-rush/rules.js";
import * as diceDash from "../public/dice-dash/rules.js";
import * as survey from "../public/survey-showdown/rules.js";
import * as highRollers from "../public/high-rollers/rules.js";

const WORDS = [
  "TIGER", "MANGO", "COMET", "LUCKY", "OCEAN", "PEACH", "ROCKET", "SUNNY", "MAPLE", "JAZZY",
  "PANDA", "RIVER", "STORM", "HONEY", "CANDY", "PIXEL", "ZEBRA", "LEMON", "CORAL", "BLAZE",
];
// Names for the computer player. The page always says it's the computer.
const BOTS = ["Lucky Lou", "Dicey Dana", "Big Mike", "Ace", "Queenie", "Slick Rick", "Penny", "Domino", "Mo Money", "Skip", "Sunny", "Wild Card Willa", "Tex", "Professor Pip", "Rosie", "Captain Kev"];
const IDLE_MS = 7 * 24 * 60 * 60 * 1000; // a room with no moves for a week is cleared

function makeCode() {
  const a = new Uint32Array(2);
  crypto.getRandomValues(a);
  return WORDS[a[0] % WORDS.length] + String(10 + (a[1] % 90));
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

// Leaderboard games and their short names.
const GAMES = { cc: "Color Clash", lf: "Letter Flip", rm: "Rummy", dr: "Deal Rush", dd: "Dice Dash", ss: "Survey Showdown", hr: "High Rollers" };
// SHA-256 of the admin password. The password itself is never stored here.
const ADMIN_HASH = "5ca2cc9864014fa43bdc0fcb376d6851c68bc8dbf0226dc5b9d1ba86afeea571";
const PLAYER_RE = /^[A-Z2-9]{12}$/;

// Names shown on the leaderboards: no slurs or crude words. Letters that stand in for others (0 for o, 1 for i, $ for s) are read as those letters.
const BAD = ["fuck", "shit", "bitch", "cunt", "dick", "cock", "pussy", "asshole", "bastard", "whore", "slut", "nigg", "nigga", "fag", "retard",
  "rape", "porn", "penis", "vagina", "boob", "tits", "cum", "jizz", "dildo", "anal", "nazi", "hitler", "kkk", "chink", "spic", "kike", "wetback",
  "tranny", "twat", "wank", "prick", "douche", "motherf", "hoe", "pedo", "molest", "kill yourself", "kys"];
export function cleanName(raw) {
  let name = String(raw || "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 24);
  const flat = name.toLowerCase().replace(/0/g, "o").replace(/[1!|]/g, "i").replace(/3/g, "e").replace(/4|@/g, "a").replace(/5|\$/g, "s").replace(/7/g, "t").replace(/[^a-z ]/g, "");
  const squashed = flat.replace(/ /g, "");
  if (BAD.some((w) => flat.includes(w) || squashed.includes(w.replace(/ /g, "")))) return "Player";
  return name || "Player";
}
async function sha256(text) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname.startsWith("/api/board") || url.pathname.startsWith("/api/admin") || url.pathname.startsWith("/api/lobby")) {
      return env.BOARD.get(env.BOARD.idFromName("main")).fetch(req);
    }
    if (/^\/api\/((lf|rm|dr|dd|ss|hr)\/)?new$/.test(url.pathname)) return json({ code: makeCode() });
    const m = url.pathname.match(/^\/api\/(?:(lf|rm|dr|dd|ss|hr)\/)?room\/([A-Z0-9]{3,16})$/);
    if (m) {
      if (req.headers.get("Upgrade") !== "websocket") return json({ error: "Expected a WebSocket" }, 426);
      const ns = { lf: env.LF_ROOMS, rm: env.RM_ROOMS, dr: env.DR_ROOMS, dd: env.DD_ROOMS, ss: env.SS_ROOMS, hr: env.HR_ROOMS }[m[1]] || env.ROOMS;
      return ns.get(ns.idFromName(m[2])).fetch(req);
    }
    return env.ASSETS.fetch(req);
  },
};

class Room extends DurableObject {
  constructor(ctx, env, rules, game) {
    super(ctx, env);
    this.rules = rules;
    this.game = game;
    this.st = null;
    ctx.blockConcurrencyWhile(async () => {
      this.st = (await ctx.storage.get("st")) || null;
    });
  }

  async fetch(req) {
    const u = new URL(req.url);
    const code = u.pathname.split("/").pop();
    // A computer game: the first visitor of an empty room asks for the computer to sit in seat 2.
    if (u.searchParams.get("pub") === "1" && !this.st) { this.st = { ...this.rules.newTable(), pub: true, code }; await this.save(); }
    if (u.searchParams.get("cpu") === "1" && !this.st) {
      this.st = { ...this.rules.newTable(), cpu: true };
      this.st.seats[1] = { token: "cpu", name: BOTS[Math.floor(Math.random() * BOTS.length)], player: null, bot: true };
      await this.save();
    }
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

    if (m.type === "ping") {
      ws.send('{"type":"pong"}');
      // a public table still waiting for a second player: tell the lobby we're still here
      if (this.st && this.st.pub && att.seat >= 0 && this.waitingForPlayer()) this.lobby("touch");
      return;
    }

    if (m.type === "hello") {
      const token = String(m.token || "").slice(0, 64);
      const name = cleanName(m.name);
      const player = PLAYER_RE.test(String(m.player || "")) ? m.player : null;
      if (!this.st) this.st = { ...this.rules.newTable() };
      let seat = this.st.seats.findIndex((p) => p && p.token === token);
      if (seat < 0 && token && token !== "cpu") {
        seat = this.st.seats.findIndex((p) => !p);
        if (seat >= 0) this.st.seats[seat] = { token, name, player };
      }
      if (seat >= 0) { this.st.seats[seat].name = name; if (player) this.st.seats[seat].player = player; }
      ws.serializeAttachment({ seat, token, code: att.code });
      await this.save();
      this.broadcast();
      if (this.st.pub) this.lobby(this.waitingForPlayer() ? "touch" : "drop");
      return;
    }

    if (m.type === "act") {
      if (!this.st) return;
      const err = this.rules.applyAction(this.st, att.seat, m.action);
      if (err) { ws.send(JSON.stringify({ type: "error", message: err })); return; }
      await this.afterMove();
      return;
    }

    if (m.type === "leave") {
      // Leaving a game in progress counts as a loss on the leaderboards.
      if (this.st && att.seat >= 0 && this.st.status === "playing") await this.report(1 - att.seat, "left");
      if (this.st && att.seat >= 0) {
        this.st.seats[att.seat] = null;
        this.st.status = "waiting";
        this.st.wins = [0, 0];
        await this.save();
      }
      ws.serializeAttachment({ seat: -1, token: null, code: att.code });
      try { ws.close(1000, "left"); } catch (e) {}
      this.broadcast();
      if (this.st && this.st.pub) this.lobby(this.waitingForPlayer() ? "touch" : "drop");
    }
  }

  /** A public table with exactly one player, who is still connected. */
  waitingForPlayer() {
    const st = this.st;
    if (!st || !st.pub || st.status === "playing") return false;
    const seated = st.seats.filter(Boolean).length;
    const c = this.connected();
    return seated === 1 && st.seats.some((p, i) => p && c[i]);
  }

  /** Tell the lobby this public table is waiting ("touch") or no longer open ("drop"). */
  lobby(what) {
    if (!this.game || !this.st || !this.st.code) return;
    const now = Date.now();
    if (what === "touch" && this.lastTouch && now - this.lastTouch < 20000) return;
    if (what === "touch") this.lastTouch = now; else this.lastTouch = 0;
    const board = this.env.BOARD.get(this.env.BOARD.idFromName("main"));
    const name = (this.st.seats.find(Boolean) || {}).name || "Player";
    const player = (this.st.seats.find(Boolean) || {}).player || null;
    this.ctx.waitUntil(board.fetch("https://board/lobby/" + what, { method: "POST", body: JSON.stringify({ game: this.game, code: this.st.code, name, player }) }).catch(() => {}));
  }

  /** Save, tell everyone, record finished games, and let the computer move if it's its turn. */
  async afterMove() {
    const st = this.st;
    if (st.status === "playing") st.reported = false;
    const final = st.status === "over" && !st.reported && (this.rules === rummy ? st.matchOver : true);
    if (final) { st.reported = true; await this.report(st.winner, "end"); }
    await this.save();
    this.broadcast();
    this.scheduleCpu();
  }

  cpuTurn() {
    const st = this.st;
    if (!st || !st.cpu || st.status !== "playing") return false;
    const p = st.pending;
    if (p) return p.kind === "pay" ? p.payer === 1 : p.waiting === 1;
    return st.turn === 1;
  }

  scheduleCpu() {
    if (!this.cpuTurn() || this.cpuTimer) return;
    const wait = this.rules === letterFlip || this.rules === survey ? 2400 : this.rules === dealRush ? 1700 : 1500;
    this.cpuTimer = setTimeout(async () => {
      this.cpuTimer = null;
      if (!this.cpuTurn()) return;
      const a = this.rules.cpuAction(this.st, 1);
      if (!a || this.rules.applyAction(this.st, 1, a)) return; // nothing sensible to do: wait for the player
      await this.afterMove();
    }, wait);
  }

  /** Send a finished game to the leaderboards. winner: seat number, or -1 for a tie. */
  async report(winner, how) {
    const st = this.st;
    if (!this.game || winner == null) return;
    const seats = st.seats;
    try {
      const board = this.env.BOARD.get(this.env.BOARD.idFromName("main"));
      if (st.cpu) {
        const me = seats[0];
        if (!me || !me.player) return;
        await board.fetch("https://board/record", { method: "POST", body: JSON.stringify({ game: this.game, mode: "cpu", results: [{ player: me.player, name: me.name, r: winner === -1 ? "tie" : winner === 0 ? "win" : "loss" }] }) });
      } else {
        const [a, b] = seats;
        if (!a || !b || !a.player || !b.player || a.player === b.player) return; // playing yourself doesn't count
        const res = (i) => (winner === -1 ? "tie" : winner === i ? "win" : "loss");
        await board.fetch("https://board/record", { method: "POST", body: JSON.stringify({ game: this.game, mode: "pvp", results: [{ player: a.player, name: a.name, r: res(0) }, { player: b.player, name: b.name, r: res(1) }] }) });
      }
    } catch (e) { /* the leaderboard is never allowed to break a game */ }
  }

  async webSocketClose(ws) {
    try { ws.close(); } catch (e) {}
    if (this.st) this.broadcast();
    if (this.st && this.st.pub && !this.waitingForPlayer() && this.st.seats.filter(Boolean).length < 2) this.lobby("drop");
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
  constructor(ctx, env) { super(ctx, env, colorClash, "cc"); }
}
export class LetterRoom extends Room {
  constructor(ctx, env) { super(ctx, env, letterFlip, "lf"); }
}
export class RummyRoom extends Room {
  constructor(ctx, env) { super(ctx, env, rummy, "rm"); }
}
export class DealRoom extends Room {
  constructor(ctx, env) { super(ctx, env, dealRush, "dr"); }
}
export class DiceRoom extends Room {
  constructor(ctx, env) { super(ctx, env, diceDash, "dd"); }
}

export class SurveyRoom extends Room {
  constructor(ctx, env) { super(ctx, env, survey, "ss"); }
}

// ---------------- leaderboards ----------------
// One record per player per game per mode ("pvp" or "cpu"):  e:<game>:<mode>:<player> -> {name, cur, best, wins, losses, t}
// Removed players: ban:<player>
export class CasinoRoom extends Room {
  constructor(ctx, env) { super(ctx, env, highRollers, "hr"); }
}

export class Board extends DurableObject {
  async fetch(req) {
    const url = new URL(req.url);
    const S = this.ctx.storage;
    const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

    // ---- the lobby: public tables waiting for a second player ----
    const FRESH = 70000;
    const loadLobby = async () => {
      if (!this.waiting) this.waiting = (await S.get("lobby")) || [];
      const now = Date.now();
      this.waiting = this.waiting.filter((w) => now - w.ts < FRESH);
      return this.waiting;
    };
    const saveLobby = () => S.put("lobby", this.waiting);
    if (url.pathname === "/lobby/touch" || url.pathname === "/lobby/drop") {
      const b = await req.json().catch(() => ({}));
      const list = await loadLobby();
      this.waiting = list.filter((w) => !(w.game === b.game && w.code === b.code));
      if (url.pathname === "/lobby/touch" && GAMES[b.game]) this.waiting.push({ game: b.game, code: b.code, name: cleanName(b.name), player: b.player || null, ts: Date.now() });
      await saveLobby();
      return json({ ok: true });
    }
    if (url.pathname === "/api/lobby") {
      const list = await loadLobby();
      const counts = {};
      for (const g of Object.keys(GAMES)) counts[g] = list.filter((w) => w.game === g).length;
      return json({ waiting: counts });
    }
    if (url.pathname === "/api/lobby/match" && req.method === "POST") {
      const b = await req.json().catch(() => ({}));
      if (!GAMES[b.game]) return json({ error: "Unknown game." }, 400);
      const list = await loadLobby();
      const me = PLAYER_RE.test(String(b.player || "")) ? b.player : null;
      const open = list.filter((w) => w.game === b.game && (!me || w.player !== me)).sort((x, y) => x.ts - y.ts)[0];
      if (open) {
        this.waiting = list.filter((w) => w !== open);
        await saveLobby();
        return json({ code: open.code, waiting: false, host: open.name });
      }
      // nobody waiting: open a new public table (the room joins the lobby when the player sits down)
      const mine = list.find((w) => w.game === b.game && me && w.player === me);
      return json({ code: mine ? mine.code : "P" + makeCode(), waiting: true });
    }

    if (url.pathname === "/record" && req.method === "POST") {
      const { game, mode, results } = await req.json();
      if (!GAMES[game] || !["pvp", "cpu"].includes(mode)) return json({ ok: false });
      for (const x of results || []) {
        if (!PLAYER_RE.test(x.player) || (await S.get("ban:" + x.player))) continue;
        const key = "e:" + game + ":" + mode + ":" + x.player;
        const e = (await S.get(key)) || { cur: 0, best: 0, wins: 0, losses: 0 };
        e.name = cleanName(x.name);
        if (x.r === "win") { e.cur += 1; e.wins += 1; e.best = Math.max(e.best, e.cur); }
        else if (x.r === "loss") { e.cur = 0; e.losses += 1; }
        e.t = Date.now();
        await S.put(key, e);
      }
      return json({ ok: true });
    }

    if (url.pathname === "/api/board") {
      const game = url.searchParams.get("game");
      if (!GAMES[game]) return json({ games: GAMES });
      const top = async (mode) => {
        const all = await S.list({ prefix: "e:" + game + ":" + mode + ":" });
        return [...all.values()].filter((e) => e.wins > 0)
          .sort((a, b) => b.best - a.best || b.cur - a.cur || b.wins - a.wins || a.t - b.t)
          .slice(0, 25).map(({ name, cur, best, wins, losses }) => ({ name, cur, best, wins, losses }));
      };
      return json({ game, title: GAMES[game], pvp: await top("pvp"), cpu: await top("cpu") });
    }

    if (url.pathname === "/api/board/me") {
      const player = url.searchParams.get("player");
      if (!PLAYER_RE.test(player || "")) return json({ error: "That isn't a player code." }, 400);
      const out = {};
      for (const g of Object.keys(GAMES)) for (const mode of ["pvp", "cpu"]) {
        const e = await S.get("e:" + g + ":" + mode + ":" + player);
        if (e) (out[g] = out[g] || {})[mode] = { cur: e.cur, best: e.best, wins: e.wins, losses: e.losses, name: e.name };
      }
      return json({ stats: out });
    }

    if (url.pathname === "/api/admin" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      if ((await sha256(String(body.password || ""))) !== ADMIN_HASH) return json({ error: "Wrong password." }, 403);
      if (body.action === "list") {
        const all = await S.list({ prefix: "e:" });
        const rows = [];
        for (const [k, e] of all) { const [, game, mode, player] = k.split(":"); rows.push({ game, mode, player, name: e.name, best: e.best, cur: e.cur, wins: e.wins }); }
        const bans = [...(await S.list({ prefix: "ban:" })).keys()].map((k) => k.slice(4));
        return json({ rows, bans });
      }
      if (body.action === "remove" && PLAYER_RE.test(body.player || "")) {
        const keys = [...(await S.list({ prefix: "e:" })).keys()].filter((k) => k.endsWith(":" + body.player));
        await S.delete(keys);
        await S.put("ban:" + body.player, { t: Date.now() });
        return json({ ok: true, removed: keys.length });
      }
      if (body.action === "unban" && PLAYER_RE.test(body.player || "")) { await S.delete("ban:" + body.player); return json({ ok: true }); }
      return json({ error: "Unknown action." }, 400);
    }
    return json({ error: "Not found" }, 404);
  }
}
