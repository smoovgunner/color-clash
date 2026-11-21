// Deal Rush rules. Shared by the game server (rooms) and the page (practice games).
// Two players. Collect three full property sets of different colors to win.
// Card ids are "c0".."c105"; CARDS maps each id to what the card is.

export const COLORS = {
  brown:     { name: "Brown",      size: 2, rent: [1, 2] },
  lightblue: { name: "Light Blue", size: 3, rent: [1, 2, 3] },
  pink:      { name: "Pink",       size: 3, rent: [1, 2, 4] },
  orange:    { name: "Orange",     size: 3, rent: [1, 3, 5] },
  red:       { name: "Red",        size: 3, rent: [2, 3, 6] },
  yellow:    { name: "Yellow",     size: 3, rent: [2, 4, 6] },
  green:     { name: "Green",      size: 3, rent: [2, 4, 7] },
  darkblue:  { name: "Dark Blue",  size: 2, rent: [3, 8] },
  station:   { name: "Station",    size: 4, rent: [1, 2, 3, 4] },
  utility:   { name: "Utility",    size: 2, rent: [1, 2] },
};
const PROP_VALUE = { brown: 1, lightblue: 1, pink: 2, orange: 2, red: 3, yellow: 3, green: 4, darkblue: 4, station: 2, utility: 2 };
export const ACTIONS = {
  steal:  { name: "Set Steal",    value: 5, text: "Take one full property set from your opponent." },
  noway:  { name: "No Way!",      value: 4, text: "Block an action played against you, or block a No Way! played back at you." },
  swipe:  { name: "Swipe",        value: 3, text: "Take one property from your opponent that isn't part of a full set." },
  swap:   { name: "Swap",         value: 3, text: "Trade one of your properties for one of theirs. Neither can be part of a full set." },
  debt:   { name: "Collect Debt", value: 3, text: "Your opponent pays you 5 million." },
  party:  { name: "Party Time",   value: 2, text: "Your opponent pays you 2 million." },
  bonus:  { name: "Bonus Draw",   value: 1, text: "Draw 2 more cards." },
  double: { name: "Double Rent",  value: 1, text: "Play with a Rent card to double the rent." },
  house:  { name: "House",        value: 3, text: "Add to a full set: plus 3 million rent. Not stations or utilities." },
  hotel:  { name: "Hotel",        value: 4, text: "Add to a full set that has a house: plus 4 million rent. Not stations or utilities." },
};
export const HAND_LIMIT = 7;
export const PLAYS = 3;
export const SETS_TO_WIN = 3;
export const BANK_TARGETS = [0, 30, 50, 75];   // 0 = no bank win
export const GRACE_TURNS = 3;                  // bankruptcy can't happen during a player's first 3 turns

// ---- the deck: 106 cards ----
const DEFS = [];
const add = (n, d) => { for (let i = 0; i < n; i++) DEFS.push({ ...d }); };
add(1, { kind: "money", value: 10 }); add(2, { kind: "money", value: 5 }); add(3, { kind: "money", value: 4 });
add(3, { kind: "money", value: 3 }); add(5, { kind: "money", value: 2 }); add(6, { kind: "money", value: 1 });
add(2, { kind: "action", act: "steal" }); add(3, { kind: "action", act: "noway" }); add(3, { kind: "action", act: "swipe" });
add(3, { kind: "action", act: "swap" }); add(3, { kind: "action", act: "debt" }); add(3, { kind: "action", act: "party" });
add(10, { kind: "action", act: "bonus" }); add(2, { kind: "action", act: "double" }); add(3, { kind: "action", act: "house" });
add(2, { kind: "action", act: "hotel" });
for (const pair of [["darkblue", "green"], ["red", "yellow"], ["pink", "orange"], ["lightblue", "brown"], ["station", "utility"]])
  add(2, { kind: "rent", colors: pair, value: 1 });
add(3, { kind: "rent", colors: "any", value: 3 });
for (const c of Object.keys(COLORS)) add(COLORS[c].size + (c === "station" ? 0 : 0), { kind: "prop", color: c, value: PROP_VALUE[c] });
add(1, { kind: "wild", colors: ["darkblue", "green"], value: 4 }); add(1, { kind: "wild", colors: ["green", "station"], value: 4 });
add(1, { kind: "wild", colors: ["utility", "station"], value: 2 }); add(1, { kind: "wild", colors: ["lightblue", "station"], value: 4 });
add(1, { kind: "wild", colors: ["lightblue", "brown"], value: 1 }); add(2, { kind: "wild", colors: ["pink", "orange"], value: 2 });
add(2, { kind: "wild", colors: ["red", "yellow"], value: 3 }); add(2, { kind: "wild", colors: "any", value: 0 });
export const CARDS = {};
DEFS.forEach((d, i) => {
  if (d.kind === "action") d.value = ACTIONS[d.act].value;
  CARDS["c" + i] = { id: "c" + i, ...d };
});
export const DECK_SIZE = DEFS.length; // 106

// ---- words ----
const colorList = (cs) => (cs === "any" ? "any color" : cs.map((c) => COLORS[c].name).join(" or "));
export function cardName(id) {
  const c = CARDS[id];
  if (!c) return "a card";
  if (c.kind === "money") return c.value + " million";
  if (c.kind === "action") return ACTIONS[c.act].name;
  if (c.kind === "rent") return "Rent: " + colorList(c.colors);
  if (c.kind === "prop") return COLORS[c.color].name + " property";
  return "Wild property: " + colorList(c.colors);
}
export const moneyWords = (n) => n + " million";

// ---- helpers ----
function rand(n) { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const isProp = (id) => CARDS[id] && (CARDS[id].kind === "prop" || CARDS[id].kind === "wild");
export const canBe = (id, color) => {
  const c = CARDS[id];
  if (c.kind === "prop") return c.color === color;
  if (c.kind === "wild") return c.colors === "any" || c.colors.includes(color);
  return false;
};
export const isFull = (set) => set.cards.length >= COLORS[set.color].size && set.cards.some((id) => CARDS[id].kind === "prop");
export function setRent(set) {
  const n = Math.min(set.cards.length, COLORS[set.color].size);
  if (!n) return 0;
  let r = COLORS[set.color].rent[n - 1];
  if (isFull(set)) r += (set.house ? 3 : 0) + (set.hotel ? 4 : 0);
  return r;
}
export function rentFor(table, color) {
  return table.filter((s) => s.color === color).reduce((m, s) => Math.max(m, setRent(s)), 0);
}
export function fullColors(table) { return new Set(table.filter(isFull).map((s) => s.color)); }
export const payValue = (id) => (CARDS[id].kind === "wild" && CARDS[id].colors === "any" ? 0 : CARDS[id].value);
export function worth(st, p) {
  return st.banks[p].reduce((n, id) => n + CARDS[id].value, 0) + st.tables[p].reduce((n, s) => n + s.cards.reduce((m, id) => m + payValue(id), 0), 0);
}
const findSetOf = (table, id) => table.find((s) => s.cards.includes(id));

function placeProp(st, p, id, color) {
  const table = st.tables[p];
  let set = table.find((s) => s.color === color && !isFull(s) && s.cards.length < COLORS[color].size);
  if (!set) { set = { id: "s" + (++st.setSeq), color, cards: [], house: null, hotel: null }; table.push(set); }
  set.cards.push(id);
  return set;
}
/** Put a property that changed hands on its new owner's table, keeping its color when it can. */
function receiveProp(st, p, id, prevColor) {
  const c = CARDS[id];
  const color = c.kind === "prop" ? c.color : prevColor && canBe(id, prevColor) ? prevColor : c.colors === "any" ? prevColor || "brown" : c.colors[0];
  return placeProp(st, p, id, color);
}
function removeFromTable(st, p, id) {
  const table = st.tables[p];
  const set = findSetOf(table, id);
  if (!set) return null;
  set.cards.splice(set.cards.indexOf(id), 1);
  tidy(st, p);
  return set.color;
}
/** Empty sets disappear; a house or hotel left without a set goes to its owner's bank. */
function tidy(st, p) {
  st.tables[p] = st.tables[p].filter((s) => {
    if (s.cards.length) return true;
    if (s.house) st.banks[p].push(s.house);
    if (s.hotel) st.banks[p].push(s.hotel);
    return false;
  });
}

function addEvent(st, ev) {
  st.evn = (st.evn || 0) + 1; ev.n = st.evn;
  st.events = [ev].concat(st.events || []).slice(0, 30);
}
function draw(st, p, n) {
  const got = [];
  for (let i = 0; i < n; i++) {
    if (!st.deck.length) { st.deck = shuffle(st.discard); st.discard = []; }
    if (!st.deck.length) break;
    const id = st.deck.pop();
    st.hands[p].push(id); got.push(id);
  }
  return got;
}
function startTurn(st, p) {
  st.turn = p; st.plays = 0; st.phase = "play"; st.pending = null;
  st.turnsTaken[p] = (st.turnsTaken[p] || 0) + 1;
  const n = st.hands[p].length ? 2 : 5;
  const got = draw(st, p, n);
  addEvent(st, { t: "turn", s: p, cards: got });
}
export const bankOf = (st, p) => st.banks[p].reduce((n, id) => n + CARDS[id].value, 0);
function gameOver(st, p, ev) {
  st.status = "over"; st.winner = p; st.wins[p] += 1; st.pending = null;
  addEvent(st, { t: "win", s: p, ...ev });
}
function checkWin(st) {
  for (const p of [st.turn, 1 - st.turn]) {
    if (fullColors(st.tables[p]).size >= SETS_TO_WIN) { gameOver(st, p, { why: "sets", sets: [...fullColors(st.tables[p])] }); return true; }
    if (st.opts.bankWin && bankOf(st, p) >= st.opts.bankWin) { gameOver(st, p, { why: "bank", bank: bankOf(st, p) }); return true; }
  }
  return false;
}
/** Bankruptcy: a player who couldn't pay in full loses, once their first turns are over. */
function bankrupt(st, payer, payee) {
  if (!st.opts.bankrupt || (st.turnsTaken[payer] || 0) <= GRACE_TURNS) return false;
  gameOver(st, payee, { why: "bankrupt", loser: payer });
  return true;
}

export function newTable() {
  return { seats: [null, null], status: "waiting", wins: [0, 0], nextStarter: 0, events: [], evn: 0 };
}

// ---- payments ----
/** The smallest fair payment of `amount`: money first, then loose properties, full sets last. */
export function autoPay(st, p, amount) {
  const bank = st.banks[p].slice().sort((a, b) => CARDS[a].value - CARDS[b].value);
  const props = [];
  for (const s of st.tables[p]) for (const id of s.cards) if (payValue(id) > 0) props.push({ id, full: isFull(s) });
  const all = bank.concat(props.map((x) => x.id));
  const total = all.reduce((n, id) => n + payValue(id), 0);
  if (total <= amount) return all;
  const bankTotal = bank.reduce((n, id) => n + CARDS[id].value, 0);
  if (bankTotal >= amount) {
    // fewest million over: try every combination of bank cards (banks are small)
    let best = null, bestSum = Infinity;
    const vals = bank.map((id) => CARDS[id].value);
    const lim = Math.min(bank.length, 16);
    for (let mask = 1; mask < 1 << lim; mask++) {
      let sum = 0; for (let i = 0; i < lim; i++) if (mask & (1 << i)) sum += vals[i];
      if (sum >= amount && sum < bestSum) { bestSum = sum; best = mask; if (sum === amount) break; }
    }
    if (best !== null) return bank.filter((_, i) => i < lim && best & (1 << i));
  }
  const out = bank.slice();
  let sum = bankTotal;
  props.sort((a, b) => a.full - b.full || payValue(a.id) - payValue(b.id));
  for (const x of props) { if (sum >= amount) break; out.push(x.id); sum += payValue(x.id); }
  return out;
}

function payNow(st, payer, payee, cards, amount, why) {
  const moved = [];
  for (const id of cards) {
    const bi = st.banks[payer].indexOf(id);
    if (bi >= 0) { st.banks[payer].splice(bi, 1); st.banks[payee].push(id); moved.push(id); continue; }
    const prev = removeFromTable(st, payer, id);
    if (prev) { receiveProp(st, payee, id, prev); moved.push(id); }
  }
  const total = moved.reduce((n, id) => n + payValue(id), 0);
  addEvent(st, { t: "paid", s: payer, to: payee, cards: moved, total, amount, why });
  st.pending = null;
  if (total < amount && bankrupt(st, payer, payee)) return;
  checkWin(st);
}

function startPayment(st, payer, payee, amount, why) {
  if (worth(st, payer) === 0) {
    addEvent(st, { t: "paid", s: payer, to: payee, cards: [], total: 0, amount, why, broke: true });
    st.pending = null;
    bankrupt(st, payer, payee);
    return;
  }
  st.pending = { kind: "pay", payer, payee, amount, why };
}

// ---- resolving actions after No Way! chances ----
function resolve(st, a) {
  const me = a.actor, them = 1 - me;
  if (a.type === "rent") return startPayment(st, them, me, a.amount, "rent");
  if (a.type === "debt") return startPayment(st, them, me, 5, "debt");
  if (a.type === "party") return startPayment(st, them, me, 2, "party");
  if (a.type === "swipe") {
    const prev = removeFromTable(st, them, a.take);
    if (prev) receiveProp(st, me, a.take, prev);
    addEvent(st, { t: "swiped", s: me, card: a.take });
  } else if (a.type === "swap") {
    const prevGive = removeFromTable(st, me, a.give);
    const prevTake = removeFromTable(st, them, a.take);
    if (prevTake) receiveProp(st, me, a.take, prevTake);
    if (prevGive) receiveProp(st, them, a.give, prevGive);
    addEvent(st, { t: "swapped", s: me, give: a.give, take: a.take });
  } else if (a.type === "steal") {
    const i = st.tables[them].findIndex((s) => s.id === a.set);
    if (i >= 0) {
      const [set] = st.tables[them].splice(i, 1);
      st.tables[me].push(set);
      addEvent(st, { t: "stole", s: me, color: set.color, cards: set.cards.slice() });
    }
  }
  st.pending = null;
  checkWin(st);
}

/**
 * Apply one move. Changes `st` in place. Returns null, or a sentence saying why it couldn't happen.
 *  {t:"deal"}
 *  On your turn (up to 3 plays):
 *   {t:"bank", card} | {t:"property", card, color} | {t:"move", card, color} (free)
 *   {t:"rent", card, color, doubles:[ids]} | {t:"action", card, take?, give?, set?}
 *   {t:"end"} | {t:"discard", cards:[ids]}
 *  When asked: {t:"respond", nope:bool} | {t:"pay", cards:[ids]} | {t:"pay", auto:true}
 */
export function applyAction(st, seat, action) {
  if (seat !== 0 && seat !== 1) return "You're watching this game, not playing in it.";
  const t = action && action.t;

  if (t === "deal") {
    if (!st.seats[0] || !st.seats[1]) return "Both players need to be here before dealing.";
    if (st.status === "playing") return "A game is already in progress.";
    const deck = shuffle(Object.keys(CARDS));
    const bankWin = BANK_TARGETS.includes(Number(action.bankWin)) ? Number(action.bankWin) : 0;
    Object.assign(st, { status: "playing", deck, discard: [], hands: [deck.splice(0, 5), deck.splice(0, 5)],
      banks: [[], []], tables: [[], []], setSeq: 0, pending: null, winner: null, turnsTaken: [0, 0],
      opts: { bankWin, bankrupt: !!action.bankrupt } });
    const starter = st.nextStarter ?? 0;
    st.nextStarter = 1 - starter;
    addEvent(st, { t: "deal", s: starter, opts: { ...st.opts } });
    startTurn(st, starter);
    return null;
  }
  if (st.status !== "playing") return "No game is being played right now.";
  const hand = st.hands[seat];
  const P = st.pending;

  // answers to the other player's moves
  if (t === "respond") {
    if (!P || P.kind !== "respond" || P.waiting !== seat) return "Nothing is waiting for your answer.";
    if (action.nope) {
      const nw = hand.find((id) => CARDS[id].kind === "action" && CARDS[id].act === "noway");
      if (!nw) return "You don't have a No Way! card.";
      hand.splice(hand.indexOf(nw), 1); st.discard.push(nw);
      P.nopes += 1; P.waiting = 1 - seat;
      addEvent(st, { t: "noway", s: seat, nopes: P.nopes });
      return null;
    }
    st.pending = null;
    addEvent(st, { t: "accept", s: seat, blocked: P.nopes % 2 === 1, a: P.a });
    if (P.nopes % 2 === 0) resolve(st, P.a);
    return null;
  }
  if (t === "pay") {
    if (!P || P.kind !== "pay" || P.payer !== seat) return "You don't owe anything right now.";
    let cards = action.auto ? autoPay(st, seat, P.amount) : (action.cards || []);
    const owned = new Set(st.banks[seat].concat(...st.tables[seat].map((s) => s.cards)));
    if (!cards.every((id) => owned.has(id))) return "You can only pay with your own bank and properties.";
    if (cards.some((id) => payValue(id) === 0)) return "A wild property that matches any color is worth nothing, so it can't pay a debt.";
    const total = cards.reduce((n, id) => n + payValue(id), 0);
    if (total < P.amount && total < worth(st, seat)) return "That's " + total + " million. You owe " + P.amount + " million. Add more, or pay everything you have.";
    payNow(st, seat, P.payee, cards, P.amount, P.why);
    return null;
  }

  if (st.turn !== seat) return "It's not your turn yet.";
  if (P) return P.kind === "pay" ? "Wait while your opponent pays." : "Wait for your opponent to answer.";

  if (t === "discard") {
    if (st.phase !== "discard") return "You only discard at the end of your turn, when you have more than " + HAND_LIMIT + " cards.";
    const need = hand.length - HAND_LIMIT;
    const cards = action.cards || [];
    if (cards.length !== need || !cards.every((id) => hand.includes(id)) || new Set(cards).size !== cards.length)
      return "Choose exactly " + need + (need === 1 ? " card" : " cards") + " to discard.";
    for (const id of cards) { hand.splice(hand.indexOf(id), 1); st.discard.push(id); }
    addEvent(st, { t: "discard", s: seat, cards });
    startTurn(st, 1 - seat);
    return null;
  }
  if (st.phase === "discard") return "Discard down to " + HAND_LIMIT + " cards to finish your turn.";

  if (t === "end") {
    addEvent(st, { t: "end", s: seat });
    if (hand.length > HAND_LIMIT) { st.phase = "discard"; return null; }
    startTurn(st, 1 - seat);
    return null;
  }

  if (t === "move") {
    return "Wild cards stay the color you played them as.";
    // eslint-disable-next-line no-unreachable
    const id = action.card, color = action.color;
    const set = findSetOf(st.tables[seat], id);
    if (!set || CARDS[id].kind !== "wild") return "Only wild properties on your table can be moved.";
    if (!COLORS[color] || !canBe(id, color)) return "That wild card can't be " + (COLORS[color] ? COLORS[color].name : "that color") + ".";
    if (set.color === color) return "It's already " + COLORS[color].name + ".";
    removeFromTable(st, seat, id);
    placeProp(st, seat, id, color);
    addEvent(st, { t: "move", s: seat, card: id, color });
    checkWin(st);
    return null;
  }

  // everything below uses one of your 3 plays
  const id = action.card;
  if (!hand.includes(id)) return "That card isn't in your hand.";
  const c = CARDS[id];
  if (st.plays >= PLAYS) return "You've used all 3 plays this turn. Choose End turn.";
  const use = (n = 1) => { hand.splice(hand.indexOf(id), 1); st.plays += n; };

  if (t === "bank") {
    if (isProp(id)) return "Properties can't go in the bank. Play them on your table.";
    use(); st.banks[seat].push(id);
    addEvent(st, { t: "bank", s: seat, card: id });
    checkWin(st);
    return null;
  }
  if (t === "property") {
    if (!isProp(id)) return "That isn't a property.";
    const color = c.kind === "prop" ? c.color : action.color;
    if (!COLORS[color] || !canBe(id, color)) return "Pick a color this card can be.";
    use(); placeProp(st, seat, id, color);
    addEvent(st, { t: "property", s: seat, card: id, color });
    checkWin(st);
    return null;
  }
  if (t === "rent") {
    if (c.kind !== "rent") return "That isn't a Rent card.";
    const color = action.color;
    if (!COLORS[color] || (c.colors !== "any" && !c.colors.includes(color))) return "This Rent card can't charge for that color.";
    const base = rentFor(st.tables[seat], color);
    if (!base) return "You don't have any " + COLORS[color].name + " properties to charge rent on.";
    const doubles = (action.doubles || []).filter((d, i, a) => a.indexOf(d) === i);
    if (!doubles.every((d) => hand.includes(d) && CARDS[d].kind === "action" && CARDS[d].act === "double")) return "Those Double Rent cards aren't in your hand.";
    if (st.plays + 1 + doubles.length > PLAYS) return "Each Double Rent uses a play, and you don't have enough plays left.";
    use(1 + doubles.length);
    for (const d of doubles) { hand.splice(hand.indexOf(d), 1); st.discard.push(d); }
    st.discard.push(id);
    const amount = base * 2 ** doubles.length;
    const a = { type: "rent", actor: seat, color, amount, doubles: doubles.length };
    addEvent(st, { t: "act", s: seat, a, card: id });
    st.pending = { kind: "respond", a, nopes: 0, waiting: 1 - seat };
    return null;
  }
  if (t === "action") {
    if (c.kind !== "action") return "That isn't an action card.";
    const them = 1 - seat;
    const loose = (p, cid) => { const s = findSetOf(st.tables[p], cid); return s && !isFull(s); };
    let a;
    switch (c.act) {
      case "noway": return "No Way! is played when your opponent does something to you. You can also put it in your bank.";
      case "double": return "Double Rent is played together with a Rent card. You can also put it in your bank.";
      case "bonus": {
        use(); st.discard.push(id);
        const got = draw(st, seat, 2);
        addEvent(st, { t: "bonus", s: seat, cards: got });
        return null;
      }
      case "house": case "hotel": {
        const set = st.tables[seat].find((s) => s.id === action.set);
        if (!set || !isFull(set)) return "Put a " + ACTIONS[c.act].name + " on one of your full sets.";
        if (set.color === "station" || set.color === "utility") return "Stations and utilities can't have houses or hotels.";
        if (c.act === "house" && set.house) return "That set already has a house.";
        if (c.act === "hotel" && !set.house) return "A hotel needs a house on the set first.";
        if (c.act === "hotel" && set.hotel) return "That set already has a hotel.";
        use(); set[c.act] = id;
        addEvent(st, { t: "build", s: seat, what: c.act, color: set.color });
        return null;
      }
      case "debt": a = { type: "debt", actor: seat }; break;
      case "party": a = { type: "party", actor: seat }; break;
      case "swipe":
        if (!loose(them, action.take)) return "Pick one of your opponent's properties that isn't part of a full set.";
        a = { type: "swipe", actor: seat, take: action.take }; break;
      case "swap":
        if (!loose(them, action.take)) return "Pick one of your opponent's properties that isn't part of a full set.";
        if (!loose(seat, action.give)) return "Pick one of your properties that isn't part of a full set to give.";
        a = { type: "swap", actor: seat, take: action.take, give: action.give }; break;
      case "steal": {
        const set = st.tables[them].find((s) => s.id === action.set);
        if (!set || !isFull(set)) return "Pick one of your opponent's full sets.";
        a = { type: "steal", actor: seat, set: set.id, color: set.color }; break;
      }
      default: return "Unknown card.";
    }
    use(); st.discard.push(id);
    addEvent(st, { t: "act", s: seat, a, card: id });
    st.pending = { kind: "respond", a, nopes: 0, waiting: them };
    return null;
  }
  return "Unknown move.";
}

/** What one player is allowed to see: their own hand, everything on the table. */
export function viewFor(st, seat, connected) {
  const playing = st.status === "playing" || st.status === "over";
  const hide = (ev) => {
    if ((ev.t === "turn" || ev.t === "bonus") && ev.s !== seat) return { ...ev, cards: ev.cards.map(() => null) };
    return ev;
  };
  const P = st.pending;
  return {
    you: seat,
    names: st.seats.map((p) => (p ? p.name : "")),
    present: st.seats.map((p) => !!p),
    connected: connected || [false, false],
    status: st.status,
    hand: playing && seat >= 0 ? st.hands[seat].slice() : [],
    counts: playing ? [st.hands[0].length, st.hands[1].length] : [0, 0],
    deck: playing ? st.deck.length : 0,
    banks: playing ? st.banks.map((b) => b.slice()) : [[], []],
    tables: playing ? st.tables.map((tb) => tb.map((s) => ({ ...s, cards: s.cards.slice() }))) : [[], []],
    turn: playing ? st.turn : null,
    plays: playing ? st.plays : 0,
    opts: st.opts ? { ...st.opts } : { bankWin: 0, bankrupt: false },
    turnsTaken: playing && st.turnsTaken ? st.turnsTaken.slice() : [0, 0],
    graceTurns: GRACE_TURNS,
    phase: playing ? st.phase : null,
    pending: P ? JSON.parse(JSON.stringify(P)) : null,
    winner: st.winner ?? null,
    wins: st.wins.slice(),
    events: (st.events || []).map(hide),
    evn: st.evn || 0,
  };
}

// ---- the computer opponent ----
export function cpuAction(st, seat) {
  const P = st.pending, hand = st.hands[seat], them = 1 - seat;
  const has = (act) => hand.find((id) => CARDS[id].kind === "action" && CARDS[id].act === act);
  if (P && P.kind === "respond" && P.waiting === seat) {
    const nw = has("noway");
    if (!nw) return { t: "respond", nope: false };
    const a = P.a;
    const mine = a.actor !== seat; // it's being done to me
    const big = a.type === "steal" || (a.type === "rent" && a.amount >= 4) || a.type === "debt" || a.type === "swipe" || a.type === "swap";
    return { t: "respond", nope: mine ? big : true };
  }
  if (P && P.kind === "pay" && P.payer === seat) return { t: "pay", auto: true };
  if (st.turn !== seat || P) return null;
  if (st.phase === "discard") {
    const need = hand.length - HAND_LIMIT;
    const keep = (id) => (CARDS[id].act === "noway" || CARDS[id].act === "steal" ? 100 : isProp(id) ? 50 + CARDS[id].value : CARDS[id].value);
    return { t: "discard", cards: hand.slice().sort((a, b) => keep(a) - keep(b)).slice(0, need) };
  }
  if (st.plays >= PLAYS) return { t: "end" };
  const myTable = st.tables[seat], theirTable = st.tables[them];
  // 1. steal a full set
  const steal = has("steal");
  const theirFull = theirTable.filter(isFull);
  if (steal && theirFull.length) {
    theirFull.sort((a, b) => setRent(b) - setRent(a));
    return { t: "action", card: steal, set: theirFull[0].id };
  }
  // 2. properties, best color first
  const progress = (color) => { const s = myTable.find((x) => x.color === color && !isFull(x)); return s ? s.cards.length / COLORS[color].size : 0; };
  for (const id of hand.filter(isProp)) {
    const c = CARDS[id];
    if (c.kind === "prop") return { t: "property", card: id, color: c.color };
    if (c.colors === "any") {
      const open = myTable.find((s) => !isFull(s));
      if (open) return { t: "property", card: id, color: open.color };
      continue;
    }
    const color = c.colors.slice().sort((a, b) => progress(b) - progress(a))[0];
    return { t: "property", card: id, color };
  }
  // 3. draw more
  const bonus = has("bonus");
  if (bonus) return { t: "action", card: bonus };
  // 4. rent
  const rents = hand.filter((id) => CARDS[id].kind === "rent");
  let bestRent = null;
  for (const id of rents) {
    const cs = CARDS[id].colors === "any" ? Object.keys(COLORS) : CARDS[id].colors;
    for (const color of cs) { const r = rentFor(myTable, color); if (r && (!bestRent || r > bestRent.r)) bestRent = { id, color, r }; }
  }
  if (bestRent && bestRent.r >= 2 && worth(st, them) > 0) {
    const dbl = has("double");
    return { t: "rent", card: bestRent.id, color: bestRent.color, doubles: dbl && bestRent.r >= 3 && st.plays <= 1 ? [dbl] : [] };
  }
  // 5. collect
  for (const act of ["debt", "party"]) { const id = has(act); if (id && worth(st, them) > 0) return { t: "action", card: id }; }
  // 6. swipe something useful
  const swipe = has("swipe");
  const looseTheirs = theirTable.filter((s) => !isFull(s)).flatMap((s) => s.cards);
  if (swipe && looseTheirs.length) {
    looseTheirs.sort((a, b) => (myTable.some((s) => canBe(b, s.color)) - myTable.some((s) => canBe(a, s.color))) || payValue(b) - payValue(a));
    return { t: "action", card: swipe, take: looseTheirs[0] };
  }
  // 7. buildings
  for (const act of ["hotel", "house"]) {
    const id = has(act);
    const set = id && myTable.find((s) => isFull(s) && s.color !== "station" && s.color !== "utility" && (act === "house" ? !s.house : s.house && !s.hotel));
    if (set) return { t: "action", card: id, set: set.id };
  }
  // 8. bank money, then spare actions
  const money = hand.filter((id) => CARDS[id].kind === "money").sort((a, b) => CARDS[b].value - CARDS[a].value);
  if (money.length) return { t: "bank", card: money[0] };
  const spare = hand.filter((id) => !isProp(id) && !["noway", "steal"].includes(CARDS[id].act) && CARDS[id].kind !== "rent");
  if (spare.length && st.banks[seat].length < 6) return { t: "bank", card: spare[0] };
  return { t: "end" };
}
