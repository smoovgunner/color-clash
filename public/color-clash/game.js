// Color Clash game rules. Shared by the game server (rooms) and the page (practice games).
// A card is a 3-character id: color (r y g b, or w for wild), value (0-9, S skip, R reverse,
// D draw two, W wild, F wild draw four), and a copy letter so duplicates stay distinct.

export const COLORS = { r: "Red", y: "Yellow", g: "Green", b: "Blue" };
export const VALS = { S: "Skip", R: "Reverse", D: "Draw Two", W: "Wild", F: "Wild Draw Four" };

export const cardName = (id) =>
  id[0] === "w" ? VALS[id[1]] : COLORS[id[0]] + " " + (VALS[id[1]] || id[1]);

function rand(n) {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % n;
}

export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function newDeck() {
  const d = [];
  for (const c of "rygb") {
    d.push(c + "0a");
    for (const v of "123456789SRD") d.push(c + v + "a", c + v + "b");
  }
  for (let i = 0; i < 4; i++) d.push("wW" + i, "wF" + i);
  return shuffle(d);
}

/** An empty table: two seats, no cards yet. */
export function newTable() {
  return { seats: [null, null], status: "waiting", wins: [0, 0], nextStarter: 0, events: [], evn: 0 };
}

export function fits(id, st) {
  if (id[0] === "w") return true;
  const top = st.discard[st.discard.length - 1];
  return id[0] === st.color || id[1] === top[1];
}

// House rules (optional, chosen when dealing): play all your cards of one number or symbol at once,
// and draw cards start a draw war: answer a Draw Two or Wild Draw Four with another, or take the whole pile of owed cards.
export const isDrawCard = (id) => id[1] === "D" || id[1] === "F";

export function canPlay(st, seat, id) {
  if (st.status !== "playing" || st.turn !== seat) return false;
  if (!st.hands[seat].includes(id)) return false;
  if (st.owe) return isDrawCard(id);
  if (st.drawn) return id === st.drawn && fits(id, st);
  return fits(id, st);
}

function drawInto(st, seat, n) {
  for (let i = 0; i < n; i++) {
    if (!st.deck.length) {
      const top = st.discard.pop();
      st.deck = shuffle(st.discard);
      st.discard = [top];
      if (!st.deck.length) return;
    }
    st.hands[seat].push(st.deck.pop());
  }
}

function addEvent(st, ev) {
  st.evn = (st.evn || 0) + 1;
  ev.n = st.evn;
  st.events = [ev].concat(st.events || []).slice(0, 25);
}

/**
 * Apply one move for the player in `seat`. Changes `st` in place.
 * action: {t:"deal", house?} | {t:"play", card, cards?, color} | {t:"draw"} | {t:"pass"}
 * With house rules, `cards` lists several cards of the same number or symbol, played in that order.
 * Returns null when the move was made, or a sentence saying why it couldn't be.
 */
export function applyAction(st, seat, action) {
  if (seat !== 0 && seat !== 1) return "You're watching this game, not playing in it.";
  const t = action && action.t;

  if (t === "deal") {
    if (!st.seats[0] || !st.seats[1]) return "Both players need to be here before dealing.";
    if (st.status === "playing") return "A round is already in progress.";
    const deck = newDeck();
    const hands = [[], []];
    for (let i = 0; i < 7; i++) { hands[0].push(deck.pop()); hands[1].push(deck.pop()); }
    let first = deck.pop();
    while (first[0] === "w" || !/\d/.test(first[1])) { deck.unshift(first); first = deck.pop(); }
    const starter = st.nextStarter ?? 0;
    if (typeof action.house === "boolean") st.house = action.house;
    Object.assign(st, {
      status: "playing", deck, hands, discard: [first], color: first[0],
      turn: starter, drawn: null, winner: null, nextStarter: 1 - starter, owe: 0,
    });
    addEvent(st, { t: "deal", s: starter, card: first, house: !!st.house });
    return null;
  }

  if (st.status !== "playing") return "No round is being played right now.";
  if (st.turn !== seat) return "It's not your turn yet.";

  if (t === "play") {
    const cards = Array.isArray(action.cards) && action.cards.length ? action.cards.slice(0, 12) : [action.card];
    const id = cards[0];
    if (typeof id !== "string" || !canPlay(st, seat, id)) return st.owe ? "Draw war! Play a Draw Two or Wild Draw Four, or take the cards." : "That card can't be played right now.";
    if (cards.length > 1) {
      if (!st.house) return "Play one card at a time. Stacking is a house rule that's off this round.";
      if (st.drawn) return "You can only play the card you just drew.";
      const hand = st.hands[seat].slice();
      for (const c of cards) {
        if (typeof c !== "string" || c[1] !== id[1]) return "You can only stack cards with the same number or symbol.";
        const i = hand.indexOf(c); if (i < 0) return "That card isn't in your hand.";
        hand.splice(i, 1);
      }
    }
    const last = cards[cards.length - 1];
    let color = last[0];
    if (last[0] === "w") {
      if (!COLORS[action.color]) return "Choose a color for the wild card.";
      color = action.color;
    }
    for (const c of cards) { st.hands[seat].splice(st.hands[seat].indexOf(c), 1); st.discard.push(c); }
    st.color = color;
    st.drawn = null;
    const v = id[1];
    const penalty = cards.reduce((n, c) => n + (c[1] === "D" ? 2 : c[1] === "F" ? 4 : 0), 0);
    if (penalty && st.house) st.owe = (st.owe || 0) + penalty;
    else if (penalty) drawInto(st, 1 - seat, penalty);
    addEvent(st, { t: "play", s: seat, card: id, cards: cards.length > 1 ? cards.slice() : undefined, color, left: st.hands[seat].length, owe: st.owe || 0, house: !!st.house });
    if (!st.hands[seat].length) {
      st.status = "over";
      st.winner = seat;
      st.wins[seat] += 1;
      st.owe = 0;
      addEvent(st, { t: "win", s: seat });
    } else if (st.owe) {
      st.turn = 1 - seat; // draw war: the other player answers or takes the cards
    } else {
      st.turn = "SRDF".includes(v) ? seat : 1 - seat;
    }
    return null;
  }

  if (t === "draw") {
    if (st.owe) {
      // lost the draw war: take every owed card, and the turn goes back to the other player
      const n = st.owe; st.owe = 0;
      drawInto(st, seat, n);
      st.turn = 1 - seat;
      addEvent(st, { t: "take", s: seat, count: n });
      return null;
    }
    if (st.drawn) return "You already drew this turn. Play that card or pass.";
    drawInto(st, seat, 1);
    const card = st.hands[seat][st.hands[seat].length - 1];
    const can = !!card && fits(card, st);
    if (can) st.drawn = card; else st.turn = 1 - seat;
    addEvent(st, { t: "draw", s: seat, card, can });
    return null;
  }

  if (t === "pass") {
    if (!st.drawn) return "Draw a card before passing.";
    st.drawn = null;
    st.turn = 1 - seat;
    addEvent(st, { t: "pass", s: seat });
    return null;
  }

  return "Unknown move.";
}

/** What one player is allowed to see: their own hand, only counts of the other's. */
export function viewFor(st, seat, connected) {
  const playing = st.status === "playing" || st.status === "over";
  const hide = (ev) => (ev.t === "draw" && ev.s !== seat ? { t: ev.t, s: ev.s, can: ev.can, n: ev.n } : ev);
  return {
    you: seat,
    names: st.seats.map((p) => (p ? p.name : "")),
    present: st.seats.map((p) => !!p),
    connected: connected || [false, false],
    status: st.status,
    hand: playing && seat >= 0 ? st.hands[seat].slice() : [],
    counts: playing ? [st.hands[0].length, st.hands[1].length] : [0, 0],
    top: playing ? st.discard[st.discard.length - 1] : null,
    color: playing ? st.color : null,
    deckCount: playing ? st.deck.length : 0,
    turn: playing ? st.turn : null,
    drawn: playing && st.turn === seat ? st.drawn : null,
    house: !!st.house,
    owe: playing ? st.owe || 0 : 0,
    winner: st.winner ?? null,
    wins: st.wins.slice(),
    events: (st.events || []).map(hide),
    evn: st.evn || 0,
  };
}

/** The computer opponent's move: plain cards first, action cards next, wilds last. */
export function cpuAction(st, seat) {
  const hand = st.hands[seat];
  const counts = { r: 0, y: 0, g: 0, b: 0 };
  for (const c of hand) if (c[0] !== "w") counts[c[0]]++;
  const best = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  if (st.owe) {
    const d = hand.filter(isDrawCard).sort((a, b) => (a[1] === "D" ? 0 : 1) - (b[1] === "D" ? 0 : 1))[0];
    return d ? { t: "play", card: d, color: best } : { t: "draw" };
  }
  if (st.drawn) {
    return fits(st.drawn, st) ? { t: "play", card: st.drawn, color: best } : { t: "pass" };
  }
  const ok = hand.filter((c) => fits(c, st));
  if (!ok.length) return { t: "draw" };
  const rank = (c) => (c[0] === "w" ? (c[1] === "F" ? 4 : 3) : "SRD".includes(c[1]) ? 1 : 0);
  ok.sort((a, b) => rank(a) - rank(b));
  const first = ok[0];
  if (st.house && first[0] !== "w") {
    // stack every card of the same number, ending on the color it holds most of
    const rest = hand.filter((c) => c !== first && c[1] === first[1] && c[0] !== "w").sort((a, b) => counts[a[0]] - counts[b[0]]);
    if (rest.length) return { t: "play", card: first, cards: [first, ...rest], color: best };
  }
  return { t: "play", card: first, color: best };
}
