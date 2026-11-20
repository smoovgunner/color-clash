// Letter Flip rules. Shared by the game server (rooms) and the page (practice games).
// Each card has a different letter on each side; a blank card can be any letter.
// A card id is its two letters ("**" for a blank) plus a number, like "AS7".
import { WORDS } from "./words.js";

export { WORDS };

const PAIRS = [
  // vowel cards
  "AS", "AT", "AR", "AL", "AN", "AD", "AM", "AP",
  "ES", "ET", "ER", "EL", "EN", "ED", "EB", "EC", "EG", "EH",
  "IS", "IT", "IR", "IN", "IK", "IF",
  "OS", "OT", "OL", "OD", "OM", "OW", "OY",
  "UP", "UB", "UG", "UN",
  // consonant cards
  "ST", "SH", "SC", "TR", "TW", "RL", "RD", "LP", "NK", "NG", "MB", "MH", "PC", "KY", "FV", "JX", "ZA",
  // blanks
  "**", "**", "**",
];

const STARTERS = [
  "GAME", "CARD", "PLAY", "WORD", "TIME", "LOVE", "HOME", "BEST", "FAST", "SLAM", "FLIP", "COLD",
  "WARM", "RAIN", "STAR", "MOON", "BOOK", "SONG", "LAKE", "HAND", "FIRE", "GOLD", "BEAR", "LION",
  "CAKE", "MILK", "ROSE", "SALT", "TREE", "WIND", "BOAT", "LAMP", "SHOE", "DOOR", "SNOW", "BELL",
];

export const HAND_SIZE = 12;

export const isBlank = (id) => id[0] === "*";
export const sides = (id) => (isBlank(id) ? [] : [id[0], id[1]]);
export const cardText = (id) => (isBlank(id) ? "Blank, any letter" : id[0] + " or " + id[1]);

function rand(n) {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % n;
}
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export function newTable() {
  return { seats: [null, null], status: "waiting", mode: "turns", wins: [0, 0], nextStarter: 0, events: [], evn: 0 };
}

function addEvent(st, ev) {
  st.evn = (st.evn || 0) + 1;
  ev.n = st.evn;
  st.events = [ev].concat(st.events || []).slice(0, 25);
}

/** Which spot changes, and to what, when the word becomes `next`. Or a reason it can't. */
export function diff(word, next) {
  next = String(next || "").toUpperCase().replace(/[^A-Z]/g, "");
  if (next.length !== 4) return { err: "Words in Letter Flip have exactly four letters." };
  const cur = word.join("");
  if (next === cur) return { err: "That's the same word. Change one letter." };
  const spots = [];
  for (let i = 0; i < 4; i++) if (next[i] !== cur[i]) spots.push(i);
  if (spots.length > 1) return { err: next + " changes " + spots.length + " letters. Change just one." };
  if (!WORDS.has(next)) return { err: next + " isn't in the dictionary." };
  return { pos: spots[0], letter: next[spots[0]], word: next };
}

/** A card in `hand` that can show `letter`: a matching card first, a blank only if needed. */
export function cardFor(hand, letter) {
  return hand.find((c) => !isBlank(c) && (c[0] === letter || c[1] === letter)) || hand.find(isBlank) || null;
}

function endByCount(st, why) {
  const a = st.hands[0].length, b = st.hands[1].length;
  st.status = "over";
  st.winner = a === b ? -1 : a < b ? 0 : 1;
  if (st.winner >= 0) st.wins[st.winner] += 1;
  addEvent(st, { t: "end", why, winner: st.winner });
}

/**
 * Apply one move for the player in `seat`. Changes `st` in place.
 * action: {t:"deal", mode} | {t:"play", word} | {t:"play", card, letter, pos} |
 *         {t:"draw"} | {t:"pass"} | {t:"stuck"}
 * Returns null when the move was made, or a sentence saying why it couldn't be.
 */
export function applyAction(st, seat, action) {
  if (seat !== 0 && seat !== 1) return "You're watching this game, not playing in it.";
  const t = action && action.t;

  if (t === "deal") {
    if (!st.seats[0] || !st.seats[1]) return "Both players need to be here before dealing.";
    if (st.status === "playing") return "A round is already in progress.";
    const deck = shuffle(PAIRS.map((p, i) => p + i));
    const hands = [deck.splice(0, HAND_SIZE), deck.splice(0, HAND_SIZE)];
    const start = STARTERS[rand(STARTERS.length)];
    const starter = st.nextStarter ?? 0;
    Object.assign(st, {
      status: "playing", mode: action.mode === "speed" ? "speed" : "turns",
      word: start.split(""), pile: deck, hands, turn: starter, passes: 0, stuck: [false, false],
      winner: null, nextStarter: 1 - starter,
    });
    addEvent(st, { t: "deal", s: starter, word: start, mode: st.mode });
    return null;
  }

  if (st.status !== "playing") return "No round is being played right now.";
  const turns = st.mode === "turns";
  if (turns && st.turn !== seat) return "It's not your turn yet.";
  const hand = st.hands[seat];

  if (t === "play") {
    let pos, letter, next, card;
    if (action.word) {
      const d = diff(st.word, action.word);
      if (d.err) return d.err;
      ({ pos, letter, word: next } = d);
      card = cardFor(hand, letter);
      if (!card) return "You don't have a card with " + letter + " on it.";
    } else {
      if (action.from && action.from !== st.word.join("")) return "Too slow! The word is now " + st.word.join("") + ".";
      card = action.card;
      pos = action.pos;
      letter = String(action.letter || "").toUpperCase();
      if (!hand.includes(card)) return "That card isn't in your hand.";
      if (!(pos >= 0 && pos < 4)) return "Pick a spot from 1 to 4.";
      if (!/^[A-Z]$/.test(letter)) return "Pick a letter for that card.";
      if (!isBlank(card) && card[0] !== letter && card[1] !== letter) return "That card doesn't have " + letter + " on it.";
      const w = st.word.slice(); w[pos] = letter;
      const d = diff(st.word, w.join(""));
      if (d.err) return d.err;
      next = d.word;
    }
    const from = st.word.join("");
    hand.splice(hand.indexOf(card), 1);
    st.word = next.split("");
    st.passes = 0;
    st.stuck = [false, false];
    addEvent(st, { t: "play", s: seat, card, letter, pos, from, to: next, left: hand.length });
    if (!hand.length) {
      st.status = "over"; st.winner = seat; st.wins[seat] += 1;
      addEvent(st, { t: "win", s: seat });
    } else if (turns) st.turn = 1 - seat;
    return null;
  }

  if (t === "draw") {
    if (!st.pile.length) return turns ? "The draw pile is empty. Pass instead." : "The draw pile is empty. If you can't make a word, choose I'm stuck.";
    const card = st.pile.pop();
    hand.push(card);
    st.passes = 0;
    st.stuck[seat] = false;
    addEvent(st, { t: "draw", s: seat, card });
    if (turns) st.turn = 1 - seat;
    return null;
  }

  if (t === "pass") {
    if (!turns) return "In a speed round there are no turns to pass.";
    if (st.pile.length) return "There are still cards to draw. Draw one instead of passing.";
    st.passes = (st.passes || 0) + 1;
    addEvent(st, { t: "pass", s: seat });
    st.turn = 1 - seat;
    if (st.passes >= 2) endByCount(st, "Neither player could make a word.");
    return null;
  }

  if (t === "stuck") {
    if (turns) return "Stuck only applies in speed rounds.";
    if (st.pile.length) return "There are still cards to draw. Draw one first.";
    if (st.stuck[seat]) return null;
    st.stuck[seat] = true;
    addEvent(st, { t: "stuck", s: seat });
    if (st.stuck[0] && st.stuck[1]) endByCount(st, "Both players are stuck.");
    return null;
  }

  return "Unknown move.";
}

/** What one player is allowed to see. */
export function viewFor(st, seat, connected) {
  const playing = st.status === "playing" || st.status === "over";
  const hide = (ev) => (ev.t === "draw" && ev.s !== seat ? { t: ev.t, s: ev.s, n: ev.n } : ev);
  return {
    you: seat,
    names: st.seats.map((p) => (p ? p.name : "")),
    present: st.seats.map((p) => !!p),
    connected: connected || [false, false],
    status: st.status,
    mode: st.mode,
    word: playing ? st.word.join("") : "",
    hand: playing && seat >= 0 ? st.hands[seat].slice() : [],
    counts: playing ? [st.hands[0].length, st.hands[1].length] : [0, 0],
    pile: playing ? st.pile.length : 0,
    turn: playing ? st.turn : null,
    stuck: playing ? st.stuck.slice() : [false, false],
    winner: st.winner ?? null,
    wins: st.wins.slice(),
    events: (st.events || []).map(hide),
    evn: st.evn || 0,
  };
}

/** Every word one hand could make from the current word: [{card, letter, pos, word}]. */
export function movesFor(st, seat) {
  const out = [];
  const seen = new Set();
  for (const card of st.hands[seat]) {
    const letters = isBlank(card) ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("") : sides(card);
    for (const letter of letters) {
      for (let pos = 0; pos < 4; pos++) {
        if (st.word[pos] === letter) continue;
        const w = st.word.slice(); w[pos] = letter;
        const word = w.join("");
        if (WORDS.has(word) && !seen.has(card + word)) { seen.add(card + word); out.push({ card, letter, pos, word }); }
      }
    }
  }
  return out;
}

/** The computer's move: a plain card before a blank, and its least flexible card first. */
export function cpuAction(st, seat) {
  const moves = movesFor(st, seat);
  if (!moves.length) {
    if (st.pile.length) return { t: "draw" };
    return st.mode === "turns" ? { t: "pass" } : { t: "stuck" };
  }
  moves.sort((a, b) => (isBlank(a.card) - isBlank(b.card)));
  const plain = moves.filter((m) => !isBlank(m.card));
  const pick = (plain.length ? plain : moves)[rand(plain.length || moves.length)];
  return { t: "play", card: pick.card, letter: pick.letter, pos: pick.pos };
}
