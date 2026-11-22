// High Rollers rules: a casino dice game for two. Shared by the game server and the page.
// Six casinos, numbered 1 to 6, each holding cash. On your turn roll all your dice left, then put every
// die showing one number on that casino. When all dice are out, the most dice at each casino wins its
// biggest bill, the next most the next bill. Players who tie at a casino win nothing there.
// With two players each also rolls 4 white house dice: they count as a third player who keeps nothing.

export const ROUNDS = 4;
export const OWN_DICE = 8;
export const HOUSE_DICE = 4;
export const MIN_CASH = 50000;
export const HOUSE = 2; // the house dice count as player 2 at payout
// 54 bills, $10,000 to $90,000
const BILLS = { 10: 6, 20: 8, 30: 8, 40: 6, 50: 6, 60: 5, 70: 5, 80: 5, 90: 5 };

function rand(n) { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
export const money = (n) => "$" + n.toLocaleString("en-US");
const sum = (a) => a.reduce((x, y) => x + y, 0);

export function newTable() {
  return { seats: [null, null], status: "waiting", wins: [0, 0], nextStarter: 0, events: [], evn: 0 };
}
function addEvent(st, ev) {
  st.evn = (st.evn || 0) + 1; ev.n = st.evn;
  st.events = [ev].concat(st.events || []).slice(0, 40);
}

function fillCasinos(st) {
  for (const c of st.casinos) {
    c.bills = []; c.dice = [0, 0, 0];
    while (sum(c.bills) < MIN_CASH && st.deck.length) c.bills.push(st.deck.shift());
    c.bills.sort((a, b) => b - a);
  }
}
function startRound(st) {
  st.left = [[OWN_DICE, HOUSE_DICE], [OWN_DICE, HOUSE_DICE]];
  fillCasinos(st);
  const starter = (st.starter + st.round - 1) % 2;
  st.turn = starter; st.roll = null; st.phase = "roll"; st.payout = null;
  addEvent(st, { t: "round", round: st.round, s: starter, casinos: st.casinos.map((c) => c.bills.slice()) });
}
const diceLeft = (st, p) => st.left[p][0] + st.left[p][1];

/** Who gets what at one casino. Returns [{who, bill}] plus the list of players who tied out. */
export function payoutFor(c) {
  const counts = c.dice.map((n, who) => ({ who, n })).filter((x) => x.n > 0);
  const freq = {}; for (const x of counts) freq[x.n] = (freq[x.n] || 0) + 1;
  const tied = counts.filter((x) => freq[x.n] > 1).map((x) => x.who);
  const ranked = counts.filter((x) => freq[x.n] === 1).sort((a, b) => b.n - a.n);
  const paid = ranked.slice(0, c.bills.length).map((x, i) => ({ who: x.who, bill: c.bills[i], n: x.n }));
  return { paid, tied, leftover: c.bills.slice(paid.length) };
}

function endRound(st) {
  const results = st.casinos.map((c, i) => {
    const r = payoutFor(c);
    for (const p of r.paid) if (p.who < 2) { st.cash[p.who] += p.bill; st.bills[p.who] += 1; }
    st.deck.push(...shuffle(r.leftover.slice())); // unpaid bills go to the bottom of the pile
    return { v: i + 1, bills: c.bills.slice(), dice: c.dice.slice(), paid: r.paid, tied: r.tied };
  });
  // house winnings leave the game
  addEvent(st, { t: "payout", round: st.round, results, cash: st.cash.slice() });
  st.payout = results; st.roll = null; st.turn = null;
  if (st.round >= ROUNDS) {
    const [a, b] = st.cash, [x, y] = st.bills;
    st.status = "over";
    st.winner = a !== b ? (a > b ? 0 : 1) : x !== y ? (x > y ? 0 : 1) : -1;
    if (st.winner >= 0) st.wins[st.winner] += 1;
    addEvent(st, { t: "end", cash: st.cash.slice(), bills: st.bills.slice(), winner: st.winner });
  } else st.phase = "roundover";
}

/**
 * Apply one move. Returns null, or a sentence saying why it couldn't happen.
 *  {t:"deal"} | {t:"roll"} | {t:"place", v} | {t:"next"}
 */
export function applyAction(st, seat, action) {
  if (seat !== 0 && seat !== 1) return "You're watching this game, not playing in it.";
  const t = action && action.t;
  if (t === "deal") {
    if (!st.seats[0] || !st.seats[1]) return "Both players need to be here to start.";
    if (st.status === "playing") return "A game is already in progress.";
    const deck = [];
    for (const [k, n] of Object.entries(BILLS)) for (let i = 0; i < n; i++) deck.push(Number(k) * 1000);
    const starter = st.nextStarter ?? 0;
    Object.assign(st, { status: "playing", deck: shuffle(deck), casinos: [1, 2, 3, 4, 5, 6].map(() => ({ bills: [], dice: [0, 0, 0] })),
      cash: [0, 0], bills: [0, 0], round: 1, winner: null, starter, nextStarter: 1 - starter });
    addEvent(st, { t: "deal", s: starter });
    startRound(st);
    return null;
  }
  if (st.status !== "playing") return "No game is being played right now.";

  if (t === "next") {
    if (st.phase !== "roundover") return "Finish this round first.";
    st.round += 1;
    startRound(st);
    return null;
  }
  if (st.phase === "roundover") return "This round is over. Choose Next round.";
  if (st.turn !== seat) return "It's not your turn yet.";

  if (t === "roll") {
    if (st.phase !== "roll") return "You've rolled. Choose a number to place.";
    const [own, house] = st.left[seat];
    const dice = [];
    for (let i = 0; i < own; i++) dice.push({ v: 1 + rand(6), h: false });
    for (let i = 0; i < house; i++) dice.push({ v: 1 + rand(6), h: true });
    dice.sort((a, b) => a.v - b.v || a.h - b.h);
    st.roll = dice; st.phase = "place";
    addEvent(st, { t: "roll", s: seat, dice: dice.map((d) => ({ ...d })) });
    return null;
  }

  if (t === "place") {
    if (st.phase !== "place") return "Roll the dice first.";
    const v = Number(action.v);
    const own = st.roll.filter((d) => d.v === v && !d.h).length, house = st.roll.filter((d) => d.v === v && d.h).length;
    if (!own && !house) return "You didn't roll any " + v + "s. Pick a number you rolled.";
    const c = st.casinos[v - 1];
    c.dice[seat] += own; c.dice[HOUSE] += house;
    st.left[seat][0] -= own; st.left[seat][1] -= house;
    st.roll = null;
    addEvent(st, { t: "place", s: seat, v, own, house, dice: c.dice.slice(), left: diceLeft(st, seat) });
    // next player who still has dice
    const other = 1 - seat;
    if (diceLeft(st, other)) { st.turn = other; st.phase = "roll"; }
    else if (diceLeft(st, seat)) { st.turn = seat; st.phase = "roll"; }
    else { endRound(st); return null; }
    addEvent(st, { t: "turn", s: st.turn, left: diceLeft(st, st.turn) });
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
    round: playing ? st.round : 0,
    rounds: ROUNDS,
    phase: playing ? st.phase : null,
    turn: playing ? st.turn : null,
    casinos: playing ? st.casinos.map((c) => ({ bills: c.bills.slice(), dice: c.dice.slice() })) : [],
    roll: playing && st.roll ? st.roll.map((d) => ({ ...d })) : null,
    left: playing ? st.left.map((x) => x.slice()) : [[0, 0], [0, 0]],
    cash: playing ? st.cash.slice() : [0, 0],
    bills: playing ? st.bills.slice() : [0, 0],
    payout: playing && st.payout ? st.payout : null,
    winner: st.winner ?? null,
    wins: st.wins.slice(),
    events: (st.events || []).slice(),
    evn: st.evn || 0,
  };
}

// ---- the computer ----
/** What a casino is worth to `me` minus what it's worth to the other player, as things stand. */
function edge(c, me) {
  const r = payoutFor(c);
  let v = 0;
  for (const p of r.paid) { if (p.who === me) v += p.bill; else if (p.who === 1 - me) v -= p.bill; }
  return v;
}
export function cpuAction(st, seat) {
  if (st.status !== "playing" || st.turn !== seat || st.phase === "roundover") return null;
  if (st.phase === "roll") return { t: "roll" };
  const values = [...new Set(st.roll.map((d) => d.v))];
  const total = st.left[seat][0];
  let best = null;
  for (const v of values) {
    const own = st.roll.filter((d) => d.v === v && !d.h).length, house = st.roll.filter((d) => d.v === v && d.h).length;
    const c = st.casinos[v - 1];
    const before = edge(c, seat);
    const after = edge({ bills: c.bills, dice: c.dice.map((n, i) => n + (i === seat ? own : i === HOUSE ? house : 0)) }, seat);
    // dice are worth keeping for later turns; spend them where they buy the most
    const spend = own * (total > 4 ? 9000 : 4000);
    // a casino with a big top bill is worth claiming early even if nobody is there yet
    const claim = c.dice[0] + c.dice[1] + c.dice[2] === 0 && own ? c.bills[0] * 0.25 : 0;
    const score = after - before - spend + claim + rand(3000);
    if (!best || score > best.score) best = { v, score };
  }
  return { t: "place", v: best.v };
}
