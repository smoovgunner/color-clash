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
export const REFILL = 5;              // points mode: cards you get when your hand runs out
export const TARGETS = [50, 100, 150, 200, 250, 300];

// letter values, as in classic word games
const VALUE = { A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
  N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10 };
export const letterValue = (ch) => VALUE[ch] || 0;
export const wordValue = (w) => w.split("").reduce((n, ch) => n + letterValue(ch), 0);

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

/** Which spot changes, and to what, when the word becomes `next`. Or a reason it can't. */
export function diff(word, next) {
  next = String(next || "").toUpperCase().replace(/[^A-Z]/g, "");
  if (next.length !== 4) return { err: "Words in Letter Flip have exactly four letters." };
  const cur = word.join("");
  if (next === cur) return { err: "That's the same word. Change one letter." };
  const spots = [];
  for (let i = 0; i < 4; i++) if (next[i] !== cur[i]) spots.push(i);
  if (spots.length > 1) return { err: next + " changes " + spots.length + " letters. Change just one." };
  return { pos: spots[0], letter: next[spots[0]], word: next, real: WORDS.has(next) };
}

/** A card in `hand` that can show `letter`: a matching card first, a blank only if needed. */
export function cardFor(hand, letter) {
  return hand.find((c) => !isBlank(c) && (c[0] === letter || c[1] === letter)) || hand.find(isBlank) || null;
}

export function newTable() {
  return { seats: [null, null], status: "waiting", mode: "turns", target: 100, wins: [0, 0], nextStarter: 0, events: [], evn: 0 };
}

function addEvent(st, ev) {
  st.evn = (st.evn || 0) + 1;
  ev.n = st.evn;
  st.events = [ev].concat(st.events || []).slice(0, 25);
}

function endGame(st, why) {
  let winner;
  if (st.mode === "points") winner = st.points[0] === st.points[1] ? -1 : st.points[0] > st.points[1] ? 0 : 1;
  else {
    const a = st.hands[0].length, b = st.hands[1].length;
    winner = a === b ? -1 : a < b ? 0 : 1;
  }
  st.status = "over";
  st.winner = winner;
  if (winner >= 0) st.wins[winner] += 1;
  addEvent(st, { t: "end", why, winner, mode: st.mode, points: (st.points || []).slice() });
}

/** Take one card from the pile; in points mode, played cards are shuffled back in when it runs out. */
function takeCard(st) {
  if (!st.pile.length && st.mode === "points" && st.played.length) {
    st.pile = shuffle(st.played);
    st.played = [];
  }
  return st.pile.pop() || null;
}

/**
 * Apply one move for the player in `seat`. Changes `st` in place.
 * action: {t:"deal", mode, target} | {t:"play", word} | {t:"play", card, letter, pos, from} |
 *         {t:"draw"} | {t:"pass"}
 * Returns null when the move was made (a wrong word is a move: it costs the turn),
 * or a sentence saying why nothing happened.
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
    const mode = action.mode === "points" ? "points" : "turns";
    const target = TARGETS.includes(Number(action.target)) ? Number(action.target) : 100;
    Object.assign(st, {
      status: "playing", mode, target, word: start.split(""), used: [start], pile: deck, played: [],
      hands, points: [0, 0], turn: starter, passes: 0, winner: null, nextStarter: 1 - starter,
    });
    addEvent(st, { t: "deal", s: starter, word: start, mode, target });
    return null;
  }

  if (st.status !== "playing") return "No round is being played right now.";
  if (st.turn !== seat) return "It's not your turn yet.";
  const hand = st.hands[seat];
  const points = st.mode === "points";

  if (t === "play") {
    let pos, letter, next, card, real;
    if (action.word) {
      const d = diff(st.word, action.word);
      if (d.err) return d.err;
      ({ pos, letter, word: next, real } = d);
      card = cardFor(hand, letter);
      if (!card) return "You don't have a card with " + letter + " on it.";
    } else {
      if (action.from && action.from !== st.word.join("")) return "The word is now " + st.word.join("") + ".";
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
      ({ word: next, real } = d);
    }
    // A word that isn't real, or was already played this round, costs the turn.
    const repeat = st.used.includes(next);
    if (!real || repeat) {
      addEvent(st, { t: "miss", s: seat, word: next, why: repeat ? "used" : "unknown" });
      st.turn = 1 - seat;
      return null;
    }
    const from = st.word.join("");
    hand.splice(hand.indexOf(card), 1);
    st.played.push(card);
    st.word = next.split("");
    st.used.push(next);
    st.passes = 0;
    const gained = points ? wordValue(next) : 0;
    if (points) st.points[seat] += gained;
    addEvent(st, { t: "play", s: seat, card, letter, pos, from, to: next, left: hand.length, gained, total: points ? st.points[seat] : null });
    if (points && st.points[seat] >= st.target) {
      st.status = "over"; st.winner = seat; st.wins[seat] += 1;
      addEvent(st, { t: "win", s: seat, mode: "points", points: st.points.slice() });
      return null;
    }
    if (!hand.length) {
      if (!points) {
        st.status = "over"; st.winner = seat; st.wins[seat] += 1;
        addEvent(st, { t: "win", s: seat, mode: "turns" });
        return null;
      }
      let got = 0;
      for (let i = 0; i < REFILL; i++) { const c = takeCard(st); if (!c) break; hand.push(c); got++; }
      addEvent(st, { t: "refill", s: seat, got });
      if (!got) { endGame(st, "There are no cards left to deal."); return null; }
    }
    st.turn = 1 - seat;
    return null;
  }

  if (t === "draw") {
    const card = takeCard(st);
    if (!card) return "The draw pile is empty. Pass instead.";
    hand.push(card);
    st.passes = 0;
    addEvent(st, { t: "draw", s: seat, card });
    st.turn = 1 - seat;
    return null;
  }

  if (t === "pass") {
    if (st.pile.length || (points && st.played.length)) return "There are still cards to draw. Draw one instead of passing.";
    st.passes = (st.passes || 0) + 1;
    addEvent(st, { t: "pass", s: seat });
    st.turn = 1 - seat;
    if (st.passes >= 2) endGame(st, "Neither player could make a word.");
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
    target: st.target || 100,
    word: playing ? st.word.join("") : "",
    used: playing ? st.used.slice() : [],
    hand: playing && seat >= 0 ? st.hands[seat].slice() : [],
    counts: playing ? [st.hands[0].length, st.hands[1].length] : [0, 0],
    pile: playing ? st.pile.length + (st.mode === "points" ? st.played.length : 0) : 0,
    points: playing && st.points ? st.points.slice() : [0, 0],
    turn: playing ? st.turn : null,
    winner: st.winner ?? null,
    wins: st.wins.slice(),
    events: (st.events || []).map(hide),
    evn: st.evn || 0,
  };
}

/** Every new, real word one hand could make from the current word: [{card, letter, pos, word}]. */
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
        if (WORDS.has(word) && !st.used.includes(word) && !seen.has(card + word)) { seen.add(card + word); out.push({ card, letter, pos, word }); }
      }
    }
  }
  return out;
}

/** The computer's move: plain cards before blanks; in points mode, the highest-scoring word. */
export function cpuAction(st, seat) {
  const moves = movesFor(st, seat);
  if (!moves.length) return st.pile.length || (st.mode === "points" && st.played.length) ? { t: "draw" } : { t: "pass" };
  const plain = moves.filter((m) => !isBlank(m.card));
  const pool = plain.length ? plain : moves;
  let pick;
  if (st.mode === "points") pick = pool.slice().sort((a, b) => wordValue(b.word) - wordValue(a.word))[rand(Math.min(3, pool.length))];
  else pick = pool[rand(pool.length)];
  return { t: "play", card: pick.card, letter: pick.letter, pos: pick.pos };
}
