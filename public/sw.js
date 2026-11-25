// EvenPlay app helper: lets the site install as an app. Games always load fresh from the network,
// so there's never an old version stuck on a device. With no connection, a short notice is shown.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  if (e.request.mode !== "navigate") return;
  e.respondWith(fetch(e.request).catch(() => new Response(
    '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>EvenPlay: no connection</title><body style="background:#0a2a29;color:#f3efe6;font:20px/1.5 system-ui;padding:24px"><h1>No internet connection</h1><p>EvenPlay needs the internet to play. Check your connection, then try again.</p><p><a href="/" style="color:#f0b43a">Try again</a></p></body></html>',
    { headers: { "content-type": "text/html; charset=utf-8" } })));
});
