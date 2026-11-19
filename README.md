# Color Clash

A color-and-number card game for two, made so blind and sighted players can play together:
drawn cards for sighted players, and full screen reader support (every card is a labeled
button, every move is announced, sound effects, headings for each part of the table).

Made by smoovgunner with Claude.

## How it runs
- `public/` — the page (`index.html`) and the game rules (`game.js`).
- `src/worker.js` — a Cloudflare Worker that hands out game codes, plus a Durable Object
  (`GameRoom`) per game that keeps the cards and sends each player only their own hand.

## Develop
    npm install
    npx wrangler dev        # http://localhost:8787
    npx wrangler deploy     # publish
