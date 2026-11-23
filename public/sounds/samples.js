// Recorded sounds for EvenPlay games: Kenney's "Casino Audio" pack (CC0, kenney.nl).
// Each game keeps its made-in-the-browser sound as a fallback until the recording has loaded.
const buffers = {}, loading = {};
function load(ac, file) {
  if (loading[file]) return;
  loading[file] = fetch("/sounds/" + file)
    .then((r) => r.arrayBuffer())
    .then((b) => new Promise((res, rej) => ac.decodeAudioData(b, res, rej)))
    .then((buf) => { buffers[file] = buf; })
    .catch(() => {});
}
/**
 * Swap some of a game's sound effects for recordings.
 * map: { sfxName: { files: ["card-place-2.mp3", ...], vol: 0.9, layer: false } }
 * layer: true plays the old sound on top (for example a chime with the chips).
 */
export function useSamples(SFX, map, audio) {
  for (const [name, spec] of Object.entries(map)) {
    const synth = SFX[name];
    SFX[name] = (ac, t) => {
      for (const f of spec.files) load(ac, f);
      const f = spec.files[Math.floor(Math.random() * spec.files.length)];
      const b = buffers[f];
      if (!b) { if (synth) synth(ac, t); return; }
      const src = ac.createBufferSource(); src.buffer = b;
      const g = ac.createGain(); g.gain.value = spec.vol ?? 0.9;
      src.connect(g).connect(ac.destination);
      src.start(t);
      if (spec.layer && synth) synth(ac, t);
    };
  }
  // load the recordings after the first tap or key press (browsers only allow sound after one)
  const warm = () => { const ac = audio(); if (ac) for (const spec of Object.values(map)) for (const f of spec.files) load(ac, f); };
  document.addEventListener("pointerdown", warm, { once: true });
  document.addEventListener("keydown", warm, { once: true });
}
