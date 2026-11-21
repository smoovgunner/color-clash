# Color Clash

A color-and-number card game for two, made so blind and sighted players can play together:
drawn cards for sighted players, and full screen reader support (every card is a labeled
button, every move is announced, sound effects, headings for each part of the table).

Made by smoovgunner with Claude.

## How it runs
- `public/` — the EvenPlay home page, and one folder per game (its page and its rules).
- `src/worker.js` — a Cloudflare Worker that hands out game codes, plus a Durable Object
  (`GameRoom`) per game that keeps the cards and sends each player only their own hand.

## Develop
    npm install
    npx wrangler dev        # http://localhost:8787
    npx wrangler deploy     # publish

## Games
- **EvenPlay home** (`/`) — lists every game.
- **Color Clash** (`/color-clash/`) — match colors and numbers.
- **Letter Flip** (`/letter-flip/`) — change one letter at a time to make a new four-letter word.
  Take-turns or speed rounds. Words come from the public-domain ENABLE word list.
- **Rummy** (`/rummy/`) — basic two-player rummy: sets, runs, lay-offs, first to 100.
- **Deal Rush** (`/deal-rush/`) — property-trading card game: collect 3 full sets of different colors.
