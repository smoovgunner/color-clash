// Dice Dash rules (a five-dice scorecard game). Shared by the game server and the page.
// Two players take turns; each turn: up to 3 rolls, holding any dice between rolls, then score one box.

export const BOXES = [
  { id: "ones", name: "Ones", upper: 1 }, { id: "twos", name: "Twos", upper: 2 }, { id: "threes", name: "Threes", upper: 3 },
  { id: "fours", name: "Fours", upper: 4 }, { id: "fives", name: "Fives", upper: 5 }, { id: "sixes", name: "Sixes", upper: 6 },
  { id: "three", name: "Three of a Kind", help: "Three dice the same: score all five dice." },
  { id: "four", name: "Four of a Kind", help: "Four dice the same: score all five dice." },
  { id: "full", name: "Full House", help: "Three of one number and two of another: 25 points." },
  { id: "small", name: "Small Straight", help: "Four in a row, like 2 3 4 5: 30 points." },
  { id: "large", name: "Large Straight", help: "Five in a row, like 1 2 3 4 5: 40 points." },
  { id: "five", name: "Five of a Kind", help: "All five dice the same: 50 points. Each extra one later is worth 100 bonus points." },
  { id: "chance", name: "Chance", help: "Anything: score all five dice." },
];
export const BOX_IDS = BOXES.map((b) => b.id);
export const ROLLS = 3;
export const UPPER_BONUS_AT = 63, UPPER_BONUS = 35, FIVE_BONUS = 100;

function rand(n) { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; }
const counts = (d) => { const c = [0, 0, 0, 0, 0, 0, 0]; for (const v of d) c[v]++; return c; };
const sum = (d) => d.reduce((a, b) => a + b, 0);
const runOf = (d) => { const s = new Set(d); let best = 0, cur = 0; for (let v = 1; v <= 6; v++) { cur = s.has(v) ? cur + 1 : 0; best = Math.max(best, cur); } return best; };

/** Points `dice` would score in `box`. `joker`: an extra five of a kind counts as a full house / straight. */
export function scoreFor(box, dice, joker) {
  const c = counts(dice), max = Math.max(...c);
  const b = BOXES.find((x) => x.id === box);
  if (b.upper) return c[b.upper] * b.upper;
  switch (box) {
    case "three": return max >= 3 ? sum(dice) : 0;
    case "four": return max >= 4 ? sum(dice) : 0;
    case "full": return (c.includes(3) && c.includes(2)) || joker ? 25 : 0;
    case "small": return runOf(dice) >= 4 || joker ? 30 : 0;
    case "large": return runOf(dice) >= 5 || joker ? 40 : 0;
    case "five": return max === 5 ? 50 : 0;
    case "chance": return sum(dice);
  }
  return 0;
}
export const isFive = (dice) => dice.length === 5 && dice.every((v) => v === dice[0]);
/** Is this an extra five of a kind (the Five of a Kind box already holds 50)? */
export const jokerOn = (card, dice) => isFive(dice) && card.five === 50;

export function totals(card, bonus) {
  const upper = BOXES.filter((b) => b.upper).reduce((n, b) => n + (card[b.id] ?? 0), 0);
  const upperBonus = upper >= UPPER_BONUS_AT ? UPPER_BONUS : 0;
  const lower = BOXES.filter((b) => !b.upper).reduce((n, b) => n + (card[b.id] ?? 0), 0);
  return { upper, upperBonus, lower, fiveBonus: bonus || 0, total: upper + upperBonus + lower + (bonus || 0) };
}

export function newTable() {
  return { seats: [null, null], status: "waiting", wins: [0, 0], nextStarter: 0, events: [], evn: 0 };
}
function addEvent(st, ev) {
  st.evn = (st.evn || 0) + 1; ev.n = st.evn;
  st.events = [ev].concat(st.events || []).slice(0, 30);
}
function startTurn(st, p) {
  st.turn = p; st.dice = [0, 0, 0, 0, 0]; st.held = [false, false, false, false, false]; st.rolls = 0;
}

/**
 * Apply one move. Returns null, or a sentence saying why it couldn't happen.
 *  {t:"deal"} | {t:"roll", held:[5 booleans]} | {t:"score", box}
 */
export function applyAction(st, seat, action) {
  if (seat !== 0 && seat !== 1) return "You're watching this game, not playing in it.";
  const t = action && action.t;
  if (t === "deal") {
    if (!st.seats[0] || !st.seats[1]) return "Both players need to be here to start.";
    if (st.status === "playing") return "A game is already in progress.";
    const starter = st.nextStarter ?? 0;
    Object.assign(st, { status: "playing", cards: [{}, {}], bonus: [0, 0], round: 1, winner: null, nextStarter: 1 - starter, starter });
    startTurn(st, starter);
    addEvent(st, { t: "deal", s: starter });
    return null;
  }
  if (st.status !== "playing") return "No game is being played right now.";
  if (st.turn !== seat) return "It's not your turn yet.";

  if (t === "roll") {
    if (st.rolls >= ROLLS) return "You've rolled 3 times. Choose a box to score.";
    const held = st.rolls === 0 ? [false, false, false, false, false] : (Array.isArray(action.held) ? action.held.slice(0, 5).map(Boolean) : st.held);
    if (st.rolls > 0 && held.every(Boolean)) return "You're holding all five dice. Let go of at least one to roll, or choose a box to score.";
    st.held = held;
    st.dice = st.dice.map((v, i) => (held[i] ? v : 1 + rand(6)));
    st.rolls += 1;
    addEvent(st, { t: "roll", s: seat, dice: st.dice.slice(), held: held.slice(), rolls: st.rolls });
    return null;
  }

  if (t === "score") {
    if (!st.rolls) return "Roll the dice first.";
    const box = action.box;
    if (!BOX_IDS.includes(box)) return "Pick a box on your scorecard.";
    const card = st.cards[seat];
    if (card[box] !== undefined) return "You've already filled that box.";
    const joker = jokerOn(card, st.dice);
    const pts = scoreFor(box, st.dice, joker);
    card[box] = pts;
    let bonus = 0;
    if (isFive(st.dice) && card.five === 50 && box !== "five") { st.bonus[seat] += FIVE_BONUS; bonus = FIVE_BONUS; }
    addEvent(st, { t: "score", s: seat, box, pts, bonus, dice: st.dice.slice(), total: totals(card, st.bonus[seat]).total });
    // next turn, or the end
    const other = 1 - seat;
    const done = (p) => BOX_IDS.every((b) => st.cards[p][b] !== undefined);
    if (done(0) && done(1)) {
      const a = totals(st.cards[0], st.bonus[0]).total, b = totals(st.cards[1], st.bonus[1]).total;
      st.status = "over"; st.winner = a === b ? -1 : a > b ? 0 : 1;
      if (st.winner >= 0) st.wins[st.winner] += 1;
      addEvent(st, { t: "end", totals: [a, b], winner: st.winner });
      return null;
    }
    if (other === st.starter) st.round += 1;
    startTurn(st, other);
    addEvent(st, { t: "turn", s: other, round: st.round });
    return null;
  }
  return "Unknown move.";
}

export function viewFor(st, seat, connected) {
  const playing = st.status === "playing" || st.status === "over";
  return {
    you: seat,
    names: st.seats.map((p) => (p ? p.name : "")),
    present: st.seats.map((p) => !!p),
    connected: connected || [false, false],
    status: st.status,
    cards: playing ? st.cards.map((c) => ({ ...c })) : [{}, {}],
    bonus: playing ? st.bonus.slice() : [0, 0],
    dice: playing ? st.dice.slice() : [0, 0, 0, 0, 0],
    held: playing ? st.held.slice() : [false, false, false, false, false],
    rolls: playing ? st.rolls : 0,
    round: playing ? st.round : 0,
    turn: playing ? st.turn : null,
    winner: st.winner ?? null,
    wins: st.wins.slice(),
    events: (st.events || []).slice(),
    evn: st.evn || 0,
  };
}

// ---- the computer opponent ----
function bestBox(card, dice) {
  const joker = jokerOn(card, dice);
  const open = BOX_IDS.filter((b) => card[b] === undefined);
  // value of a box: points, with a little weight for keeping hard boxes and for the upper bonus
  const weight = { five: 0.6, large: 0.9, small: 0.9, full: 0.9, chance: 0.5, three: 0.8, four: 0.85 };
  let best = null;
  for (const b of open) {
    const pts = scoreFor(b, dice, joker);
    const box = BOXES.find((x) => x.id === b);
    let v = pts * (weight[b] || 1);
    if (box.upper) v += (pts >= box.upper * 3 ? 6 : 0) - (pts === 0 ? box.upper : 0);
    if (pts === 0) v -= b === "chance" ? 20 : b === "five" ? 2 : b === "ones" ? 0 : 4;
    if (!best || v > best.v) best = { b, v, pts };
  }
  return best;
}
export function cpuAction(st, seat) {
  if (st.status !== "playing" || st.turn !== seat) return null;
  if (!st.rolls) return { t: "roll" };
  const card = st.cards[seat], d = st.dice;
  const best = bestBox(card, d);
  if (st.rolls >= ROLLS || best.pts >= 25 && ["full", "small", "large", "five"].includes(best.b)) return { t: "score", box: best.b };
  // keep what helps: a run when straights are open, otherwise the most common number
  const c = counts(d);
  let keepVal = 6; for (let v = 6; v >= 1; v--) if (c[v] > c[keepVal]) keepVal = v;
  let held = d.map((v) => v === keepVal);
  if ((card.large === undefined || card.small === undefined) && runOf(d) >= 3 && c[keepVal] < 3) {
    const seen = new Set(); held = d.map((v) => { if (seen.has(v)) return false; seen.add(v); return true; });
    // drop the end of the run that doesn't fit
    const s = [...new Set(d)].sort((a, b) => a - b);
    let bestRun = [], cur = [];
    for (const v of s) { cur = cur.length && v === cur[cur.length - 1] + 1 ? cur.concat(v) : [v]; if (cur.length > bestRun.length) bestRun = cur; }
    const used = new Set(); held = d.map((v) => (bestRun.includes(v) && !used.has(v) ? (used.add(v), true) : false));
  }
  if (held.every(Boolean)) return { t: "score", box: best.b };
  return { t: "roll", held };
}
