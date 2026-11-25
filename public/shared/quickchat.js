// Quick chat: a few preset messages players can send each other. Nothing can be typed,
// so strangers can't swap phone numbers or say anything unkind. Each message travels as a number.
export const EMOTES = ["Good luck!", "Good game!", "Nice move!", "Thanks!", "Oops!", "Wow!", "Rematch?", "Take your time.", "Be right back."];

const get = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const set = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

/**
 * opts: { send(i), say(text), nameOf(seat), getView(), isOnline(), ping(), words? }
 * Returns { update(), receive(msg) }. Call update() after each new game state, receive() for "emote" messages.
 */
export function quickChat(opts) {
  const words = opts.words || EMOTES;
  const banner = document.getElementById("banner");
  const box = document.createElement("section");
  box.className = "panel"; box.hidden = true; box.id = "chat-panel";
  box.setAttribute("aria-labelledby", "chat-h");
  box.innerHTML = '<h2 id="chat-h">Quick chat</h2><div class="row" id="chat-btns" style="display:flex;flex-wrap:wrap;gap:8px"></div>' +
    '<p id="chat-last" class="muted" style="margin:10px 0 0;min-height:1.4em"></p>';
  banner.insertAdjacentElement("afterend", box);
  const btns = box.querySelector("#chat-btns"), last = box.querySelector("#chat-last");
  let on = get("ep-chat") !== "off", lastSent = 0;

  function draw() {
    btns.replaceChildren();
    if (on) words.forEach((w, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn small"; b.textContent = w;
      b.addEventListener("click", () => {
        const now = Date.now();
        if (now - lastSent < 2500) { opts.say("Wait a moment before sending another message."); return; }
        lastSent = now; opts.send(i);
      });
      btns.append(b);
    });
    const t = document.createElement("button");
    t.type = "button"; t.className = "btn small"; t.setAttribute("aria-pressed", on ? "false" : "true");
    t.textContent = on ? "Turn quick chat off" : "Turn quick chat on";
    t.addEventListener("click", () => {
      on = !on; set("ep-chat", on ? "on" : "off"); draw();
      opts.say(on ? "Quick chat on." : "Quick chat off. You won't see or hear messages.");
      btns.querySelector("button:last-child").focus();
    });
    btns.append(t);
  }
  draw();

  return {
    update() {
      const v = opts.getView();
      box.hidden = !(opts.isOnline() && v && v.you >= 0 && v.present && v.present[0] && v.present[1]);
    },
    receive(m) {
      const v = opts.getView();
      if (!on || !v || !words[m.i]) return;
      const mine = m.seat === v.you;
      const text = (mine ? "You said: " : opts.nameOf(m.seat) + " says: ") + words[m.i];
      last.textContent = text;
      if (!mine) { opts.say(text); if (opts.ping) opts.ping(); }
      else opts.say("Sent: " + words[m.i]);
    },
  };
}
