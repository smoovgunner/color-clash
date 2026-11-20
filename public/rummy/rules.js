// Rummy rules (basic two-player rummy). Shared by the game server and the page (practice games).
// A card is rank + suit: ranks A 2-9 T J Q K (T is ten), suits S H D C. "TH" is the 10 of Hearts.

export const RANKS = "A23456789TJQK";
export const SUITS = "SHDC";
const RANK_NAME = { A: "Ace", T: "10", J: "Jack", Q: "Queen", K: "King" };
const SUIT_NAME = { S: "Spades", H: "Hearts", D: "Diamonds", C: "Clubs" };
export const HAND_SIZE = 10;
export const TARGET = 100;

export const rankOf = (c) => RANKS.indexOf(c[0]) + 1; // Ace low: 1 .. King 13
export const rankName = (c) => RANK_NAME[c[0]] || c[0];
export const suitName = (c) => SUIT_NAME[c[1]];
export const cardName = (c) => rankName(c) + " of " + suitName(c);
export const points = (c) => Math.min(10, rankOf(c));
export const handPoints = (h) => h.reduce((n, c) => n + points(c), 0);
export const sortCards = (h) => h.slice().sort((a, b) => SUITS.indexOf(a[1]) - SUITS.indexOf(b[1]) || rankOf(a) - rankOf(b));
const byRank = (h) => h.slice().sort((a, b) => rankOf(a) - rankOf(b));

function rand(n) { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function newDeck() { const d = []; for (const s of SUITS) for (const r of RANKS) d.push(r + s); return shuffle(d); }

/** "set", "run", or null for a group of cards. */
export function meldKind(cards) {
  if (!Array.isArray(cards) || cards.length < 3 || new Set(cards).size !== cards.length) return null;
  if (cards.length <= 4 && cards.every((c) => c[0] === cards[0][0])) return "set";
  if (cards.every((c) => c[1] === cards[0][1])) {
    const r = byRank(cards).map(rankOf);
    if (r.every((v, i) => i === 0 || v === r[i - 1] + 1)) return "run";
  }
  return null;
}
/** Can `card` be added to this meld? */
export function fitsMeld(meld, card) {
  if (meld.cards.includes(card)) return false;
  if (meld.kind === "set") return meld.cards.length < 4 && card[0] === meld.cards[0][0];
  if (card[1] !== meld.cards[0][1]) return false;
  const r = byRank(meld.cards).map(rankOf);
  return rankOf(card) === r[0] - 1 || rankOf(card) === r[r.length - 1] + 1;
}
export function describeMeld(meld) {
  const cs = meld.kind === "run" ? byRank(meld.cards) : meld.cards;
  if (meld.kind === "set") return (meld.cards.length === 4 ? "four " : "three ") + rankName(cs[0]) + (rankName(cs[0]).endsWith("x") ? "es" : "s");
  return "a run of " + suitName(cs[0]) + ": " + cs.map(rankName).join(", ");
}

/** Melds hidden in a hand: [{kind, cards}] (sets, then runs; may share cards). */
export function findMelds(hand) {
  const out = [];
  const ranks = {};
  for (const c of hand) (ranks[c[0]] = ranks[c[0]] || []).push(c);
  for (const r in ranks) if (ranks[r].length >= 3) out.push({ kind: "set", cards: ranks[r].slice() });
  for (const s of SUITS) {
    const suit = byRank(hand.filter((c) => c[1] === s));
    let run = [];
    for (const c of suit) {
      if (run.length && rankOf(c) === rankOf(run[run.length - 1]) + 1) run.push(c);
      else { if (run.length >= 3) out.push({ kind: "run", cards: run }); run = [c]; }
    }
    if (run.length >= 3) out.push({ kind: "run", cards: run });
  }
  return out;
}

export function newTable() {
  return { seats: [null, null], status: "waiting", scores: [0, 0], nextStarter: 0, events: [], evn: 0, matchOver: false };
}
function addEvent(st, ev) {
  st.evn = (st.evn || 0) + 1; ev.n = st.evn;
  st.events = [ev].concat(st.events || []).slice(0, 25);
}
export const MAX_RESHUFFLES = 3;
function drawStock(st) {
  if (!st.stock.length) {
    st.reshuffles = (st.reshuffles || 0) + 1;
    const top = st.discard.pop();
    st.stock = shuffle(st.discard);
    st.discard = top ? [top] : [];
    if (!st.stock.length) return null;
  }
  return st.stock.pop();
}
function wentOut(st, seat) {
  const other = 1 - seat;
  const pts = handPoints(st.hands[other]);
  st.scores[seat] += pts;
  st.status = "over";
  st.winner = seat;
  st.matchOver = st.scores[seat] >= TARGET;
  addEvent(st, { t: "out", s: seat, pts, left: st.hands[other].slice(), scores: st.scores.slice(), match: st.matchOver });
}

/**
 * Apply one move for the player in `seat`. Changes `st` in place.
 * action: {t:"deal"} | {t:"draw", from:"stock"|"discard"} | {t:"meld", cards:[...]} |
 *         {t:"layoff", card, meld} | {t:"discard", card}
 * Returns null when the move was made, or a sentence saying why it couldn't be.
 */
export function applyAction(st, seat, action) {
  if (seat !== 0 && seat !== 1) return "You're watching this game, not playing in it.";
  const t = action && action.t;

  if (t === "deal") {
    if (!st.seats[0] || !st.seats[1]) return "Both players need to be here before dealing.";
    if (st.status === "playing") return "A round is already in progress.";
    if (st.matchOver) { st.scores = [0, 0]; st.matchOver = false; }
    const deck = newDeck();
    const hands = [deck.splice(0, HAND_SIZE), deck.splice(0, HAND_SIZE)];
    const discard = [deck.pop()];
    const starter = st.nextStarter ?? 0;
    Object.assign(st, { status: "playing", stock: deck, discard, hands, melds: [], meldSeq: 0,
      turn: starter, phase: "draw", taken: null, winner: null, nextStarter: 1 - starter, reshuffles: 0 });
    addEvent(st, { t: "deal", s: starter, top: discard[0] });
    return null;
  }

  if (st.status !== "playing") return "No round is being played right now.";
  if (st.turn !== seat) return "It's not your turn yet.";
  const hand = st.hands[seat];

  if (t === "draw") {
    if (st.phase !== "draw") return "You already drew this turn.";
    let card;
    if (action.from === "discard") {
      if (!st.discard.length) return "The discard pile is empty.";
      card = st.discard.pop();
      st.taken = card;
    } else {
      card = drawStock(st);
      if (!card || st.reshuffles >= MAX_RESHUFFLES) {
        if (card) st.stock.push(card);
        st.status = "over"; st.winner = -1;
        addEvent(st, { t: "stalemate", scores: st.scores.slice() });
        return null;
      }
      st.taken = null;
    }
    hand.push(card);
    st.phase = "play";
    addEvent(st, { t: "draw", s: seat, from: action.from === "discard" ? "discard" : "stock", card });
    return null;
  }

  if (st.phase !== "play") return "Draw a card first.";

  if (t === "meld") {
    const cards = action.cards || [];
    if (!cards.every((c) => hand.includes(c))) return "Those cards aren't all in your hand.";
    const kind = meldKind(cards);
    if (!kind) return cards.length < 3 ? "A meld needs at least three cards." : "Those cards don't make a set or a run.";
    for (const c of cards) hand.splice(hand.indexOf(c), 1);
    const meld = { id: "m" + (++st.meldSeq), kind, cards: kind === "run" ? byRank(cards) : cards.slice(), by: seat };
    st.melds.push(meld);
    addEvent(st, { t: "meld", s: seat, meld: { ...meld, cards: meld.cards.slice() } });
    if (!hand.length) wentOut(st, seat);
    return null;
  }

  if (t === "layoff") {
    const meld = st.melds.find((m) => m.id === action.meld);
    if (!meld) return "That meld isn't on the table.";
    if (!hand.includes(action.card)) return "That card isn't in your hand.";
    if (!fitsMeld(meld, action.card)) return cardName(action.card) + " doesn't fit " + describeMeld(meld) + ".";
    hand.splice(hand.indexOf(action.card), 1);
    meld.cards.push(action.card);
    if (meld.kind === "run") meld.cards = byRank(meld.cards);
    addEvent(st, { t: "layoff", s: seat, card: action.card, meld: { ...meld, cards: meld.cards.slice() } });
    if (!hand.length) wentOut(st, seat);
    return null;
  }

  if (t === "discard") {
    if (!hand.includes(action.card)) return "That card isn't in your hand.";
    if (action.card === st.taken && hand.length > 1) return "You can't throw back the card you just took from the discard pile.";
    hand.splice(hand.indexOf(action.card), 1);
    st.discard.push(action.card);
    addEvent(st, { t: "discard", s: seat, card: action.card });
    if (!hand.length) { wentOut(st, seat); return null; }
    st.turn = 1 - seat; st.phase = "draw"; st.taken = null;
    return null;
  }

  return "Unknown move.";
}

/** What one player is allowed to see. */
export function viewFor(st, seat, connected) {
  const playing = st.status === "playing" || st.status === "over";
  const hide = (ev) => (ev.t === "draw" && ev.from === "stock" && ev.s !== seat ? { t: ev.t, s: ev.s, from: ev.from, n: ev.n } : ev);
  return {
    you: seat,
    names: st.seats.map((p) => (p ? p.name : "")),
    present: st.seats.map((p) => !!p),
    connected: connected || [false, false],
    status: st.status,
    hand: playing && seat >= 0 ? sortCards(st.hands[seat]) : [],
    counts: playing ? [st.hands[0].length, st.hands[1].length] : [0, 0],
    stock: playing ? st.stock.length : 0,
    top: playing && st.discard.length ? st.discard[st.discard.length - 1] : null,
    discardCount: playing ? st.discard.length : 0,
    melds: playing ? st.melds.map((m) => ({ ...m, cards: m.cards.slice() })) : [],
    turn: playing ? st.turn : null,
    phase: playing ? st.phase : null,
    taken: playing && st.turn === seat ? st.taken : null,
    winner: st.winner ?? null,
    scores: st.scores.slice(),
    matchOver: !!st.matchOver,
    target: TARGET,
    events: (st.events || []).map(hide),
    evn: st.evn || 0,
  };
}

/** The computer's next single move. */
export function cpuAction(st, seat) {
  const hand = st.hands[seat];
  if (st.phase === "draw") {
    const top = st.discard[st.discard.length - 1];
    if (top) {
      const helps = findMelds(hand.concat(top)).some((m) => m.cards.includes(top)) || st.melds.some((m) => fitsMeld(m, top));
      if (helps) return { t: "draw", from: "discard" };
    }
    return { t: "draw", from: "stock" };
  }
  const melds = findMelds(hand);
  if (melds.length) {
    melds.sort((a, b) => b.cards.length - a.cards.length);
    // never meld every card if that would leave nothing for a required discard: going out by melding is allowed
    return { t: "meld", cards: melds[0].cards };
  }
  for (const c of hand) {
    const m = st.melds.find((x) => fitsMeld(x, c));
    if (m) return { t: "layoff", card: c, meld: m.id };
  }
  // discard: the highest card that has no partner (same rank, or a near neighbor in its suit)
  const near = (c) => hand.filter((o) => o !== c && (o[0] === c[0] || (o[1] === c[1] && Math.abs(rankOf(o) - rankOf(c)) <= 2))).length;
  const choices = hand.filter((c) => c !== st.taken || hand.length === 1);
  choices.sort((a, b) => near(a) - near(b) || points(b) - points(a));
  return { t: "discard", card: choices[0] };
}
