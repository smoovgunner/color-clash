// Survey Showdown rules: a one-on-one survey game. Shared by the game server and the page.
import { QUESTIONS } from "./questions.js";

export const ROUNDS = 4;
export const MULTIPLIER = [1, 1, 2, 3];
export const STRIKES = 3;
export const COUNT = QUESTIONS.length;

function rand(n) { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// ---- answer matching ----
const SKIP = new Set(["a", "an", "the", "my", "your", "some", "their", "his", "her", "of", "to", "and", "or"]);
function stem(w) {
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 4 && /(sses|xes|ches|shes|oes)$/.test(w)) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}
export function norm(text) {
  return String(text || "").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9 ]+/g, " ").split(/\s+/)
    .filter((w) => w && !SKIP.has(w)).map(stem);
}
function dist(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
const close = (a, b) => a === b || (a.length >= 5 && dist(a, b) <= 1) || (a.length >= 9 && dist(a, b) <= 2);
/** How well a guess fits one way of saying an answer: 3 exact, 2 contains it, 1 close spelling, 0 no. */
function fit(guess, alias) {
  const g = norm(guess), a = norm(alias);
  if (!g.length || !a.length) return 0;
  if (g.join(" ") === a.join(" ")) return 3;
  if (g.length <= a.length + 3 && a.every((w) => g.some((x) => close(x, w)))) return 2;
  if (close(g.join(""), a.join(""))) return 1;
  return 0;
}
/** Which answer a guess matches: its index, or -1. */
export function matchAnswer(q, guess) {
  let best = -1, bestFit = 0;
  q[1].forEach(([aliases], i) => {
    for (const alias of aliases.split("|")) { const f = fit(guess, alias); if (f > bestFit) { bestFit = f; best = i; } }
  });
  return best;
}
export const answerText = (q, i) => q[1][i][0].split("|")[0];

// ---- game ----
export function newTable() {
  return { seats: [null, null], status: "waiting", wins: [0, 0], nextStarter: 0, events: [], evn: 0 };
}
function addEvent(st, ev) {
  st.evn = (st.evn || 0) + 1; ev.n = st.evn;
  st.events = [ev].concat(st.events || []).slice(0, 40);
}
const Q = (st) => QUESTIONS[st.qs[st.round - 1]];
const mult = (st) => MULTIPLIER[st.round - 1];

function startRound(st) {
  const starter = (st.starter + st.round - 1) % 2;
  Object.assign(st, { phase: "faceoff", revealed: Q(st)[1].map(() => false), bank: 0, strikes: 0, control: null,
    face: { first: starter, tries: 0, hits: [] }, turn: starter, showAll: false });
  addEvent(st, { t: "round", round: st.round, mult: mult(st), q: Q(st)[0], answers: Q(st)[1].length, s: starter });
}
function award(st, seat, how) {
  st.scores[seat] += st.bank;
  addEvent(st, { t: "award", s: seat, pts: st.bank, how, scores: st.scores.slice() });
  const left = Q(st)[1].map((a, i) => (st.revealed[i] ? null : { i, text: answerText(Q(st), i), pts: a[1] })).filter(Boolean);
  if (left.length) addEvent(st, { t: "reveal", left });
  st.phase = "roundover"; st.showAll = true; st.bank = 0;
}
function reveal(st, i) {
  st.revealed[i] = true;
  st.bank += Q(st)[1][i][1] * mult(st);
}

/**
 * Apply one move. Returns null, or a sentence saying why it couldn't happen.
 *  {t:"deal"} | {t:"guess", text} | {t:"next"}
 */
export function applyAction(st, seat, action) {
  if (seat !== 0 && seat !== 1) return "You're watching this game, not playing in it.";
  const t = action && action.t;
  if (t === "deal") {
    if (!st.seats[0] || !st.seats[1]) return "Both players need to be here to start.";
    if (st.status === "playing") return "A game is already in progress.";
    // avoid repeating the last game's questions when we can
    const recent = new Set(st.recent || []);
    let pool = shuffle([...Array(COUNT).keys()].filter((i) => !recent.has(i)));
    if (pool.length < ROUNDS) pool = shuffle([...Array(COUNT).keys()]);
    const starter = st.nextStarter ?? 0;
    Object.assign(st, { status: "playing", qs: pool.slice(0, ROUNDS), round: 1, scores: [0, 0], winner: null, starter, nextStarter: 1 - starter });
    st.recent = (st.recent || []).concat(st.qs).slice(-24);
    addEvent(st, { t: "deal", s: starter });
    startRound(st);
    return null;
  }
  if (st.status !== "playing") return "No game is being played right now.";

  if (t === "next") {
    if (st.phase !== "roundover") return "Finish this round first.";
    if (st.round >= ROUNDS) {
      const [a, b] = st.scores;
      st.status = "over"; st.winner = a === b ? -1 : a > b ? 0 : 1;
      if (st.winner >= 0) st.wins[st.winner] += 1;
      addEvent(st, { t: "end", scores: st.scores.slice(), winner: st.winner });
      return null;
    }
    st.round += 1;
    startRound(st);
    return null;
  }

  if (t !== "guess") return "Unknown move.";
  if (st.phase === "roundover") return "This round is over. Choose Next question.";
  if (st.turn !== seat) return "It's not your turn to answer.";
  const text = String(action.text || "").trim().slice(0, 60);
  if (!norm(text).length) return "Type an answer first.";
  const q = Q(st);
  const i = matchAnswer(q, text);
  if (i >= 0 && st.revealed[i]) return answerText(q, i) + " is already on the board. Try a different answer.";
  const hit = i >= 0;
  if (hit) reveal(st, i);
  addEvent(st, { t: "guess", s: seat, text, idx: i, answer: hit ? answerText(q, i) : null, pts: hit ? q[1][i][1] : 0, phase: st.phase, mult: mult(st) });

  if (st.phase === "faceoff") {
    const f = st.face;
    f.hits.push({ seat, idx: i });
    const other = 1 - f.first;
    if (f.hits.length % 2 === 1) {
      // first guess of a pair: the top answer wins control straight away
      if (i === 0) return takeControl(st, seat);
      st.turn = other;
      return null;
    }
    const [x, y] = f.hits.slice(-2);
    const rank = (h) => (h.idx < 0 ? 99 : h.idx);
    if (rank(x) === 99 && rank(y) === 99) {
      f.tries += 1;
      if (f.tries >= 3) return takeControl(st, f.first);
      st.turn = f.first;
      addEvent(st, { t: "faceoff-again" });
      return null;
    }
    return takeControl(st, rank(x) <= rank(y) ? x.seat : y.seat);
  }

  if (st.phase === "play") {
    if (hit) {
      if (st.revealed.every(Boolean)) award(st, seat, "cleared");
      return null;
    }
    st.strikes += 1;
    addEvent(st, { t: "strike", s: seat, count: st.strikes });
    if (st.strikes >= STRIKES) {
      st.phase = "steal"; st.turn = 1 - seat;
      addEvent(st, { t: "steal", s: 1 - seat, bank: st.bank });
    }
    return null;
  }

  if (st.phase === "steal") {
    award(st, hit ? seat : st.control, hit ? "stole" : "kept");
    return null;
  }
  return null;
}
function takeControl(st, seat) {
  st.control = seat; st.turn = seat; st.phase = "play";
  addEvent(st, { t: "control", s: seat });
  if (st.revealed.every(Boolean)) award(st, seat, "cleared");
  return null;
}

export function viewFor(st, seat, connected) {
  const playing = st.status === "playing" || st.status === "over";
  let board = [], question = "";
  if (playing && st.qs) {
    const q = Q(st);
    question = q[0];
    board = q[1].map((a, i) => (st.revealed[i] || st.showAll ? { n: i + 1, text: answerText(q, i), pts: a[1], got: !!st.revealed[i] } : { n: i + 1, hidden: true }));
  }
  return {
    you: seat,
    names: st.seats.map((p) => (p ? p.name : "")),
    present: st.seats.map((p) => !!p),
    connected: connected || [false, false],
    status: st.status,
    round: playing ? st.round : 0,
    rounds: ROUNDS,
    mult: playing ? mult(st) : 1,
    question, board,
    phase: playing ? st.phase : null,
    turn: playing ? st.turn : null,
    control: playing ? st.control : null,
    strikes: playing ? st.strikes : 0,
    bank: playing ? st.bank : 0,
    scores: playing ? st.scores.slice() : [0, 0],
    winner: st.winner ?? null,
    wins: st.wins.slice(),
    events: (st.events || []).slice(),
    evn: st.evn || 0,
  };
}

// ---- the computer ----
const WRONG = QUESTIONS.flatMap((q) => q[1].map((a) => a[0].split("|")[0]));
export function cpuAction(st, seat) {
  if (st.status !== "playing" || st.turn !== seat || st.phase === "roundover") return null;
  const q = Q(st);
  const chance = st.phase === "faceoff" ? 0.6 : st.phase === "steal" ? 0.45 : 0.55;
  const open = q[1].map((a, i) => (st.revealed[i] ? null : { i, w: a[1] })).filter(Boolean);
  if (open.length && Math.random() < chance) {
    let r = Math.random() * open.reduce((n, x) => n + x.w, 0);
    for (const x of open) { r -= x.w; if (r <= 0) return { t: "guess", text: answerText(q, x.i) }; }
    return { t: "guess", text: answerText(q, open[0].i) };
  }
  for (let k = 0; k < 30; k++) {
    const w = WRONG[rand(WRONG.length)];
    if (matchAnswer(q, w) < 0) return { t: "guess", text: w };
  }
  return { t: "guess", text: "Something else" };
}
