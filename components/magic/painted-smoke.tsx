"use client";

import React, { useEffect, useRef } from "react";

/**
 * MagicalSmoke - Inverted 'S' Path to Top of Page (below menu bar), with Raining Ism-e-Allah,
 * Arabic Alphabet (Alif to Ya), Talismantic Symbols & Ground Star Sparkles.
 *
 * Flow:
 * 1. Smoke + Ism-e-Allah + Haroof-e-Tahajji + Symbols all emerge together from the lamp nozzle.
 * 2. They travel up along the inverted 'S' curve all the way to the top of the page
 *    (stopping just below the menu bar, so they never collide with it).
 * 3. At the top, the smoke stays aloft and gently dissipates from right to left.
 * 4. Meanwhile, the Ism-e-Allah, Arabic letters, and symbols detach and rain downward toward the ground (zameen).
 * 5. Upon reaching the ground, each glyph vanishes and bursts into a twinkling star sparkle that fades out.
 */

const ASMA_UL_HUSNA = [
  "الرَّحْمَٰنُ", "الرَّحِيمُ", "الْمَلِكُ", "الْقُدُّوسُ", "السَّلَامُ", "الْمُؤْمِنُ", "الْمُهَيْمِنُ", "الْعَزِيزُ", "الْجَبَّارُ", "الْمُتَكَبِّرُ",
  "الْخَالِقُ", "الْبَارِئُ", "الْمُصَوِّرُ", "الْغَفَّارُ", "الْقَهَّارُ", "الْوَهَّابُ", "الرَّزَّاقُ", "الْفَتَّاحُ", "الْعَلِيمُ", "الْقَابِضُ",
  "الْبَاسِطُ", "الْخَافِضُ", "الرَّافِعُ", "الْمُعِزُّ", "الْمُذِلُّ", "السَّمِيعُ", "الْبَصِيرُ", "الْحَكَمُ", "الْعَدْلُ", "اللَّطِيفُ",
  "الْخَبِيرُ", "الْحَلِيمُ", "الْعَظِيمُ", "الْغَفُورُ", "الشَّكُورُ", "الْعَلِيُّ", "الْكَبِيرُ", "الْحَفِيظُ", "الْمُقِيتُ", "الْحَسِيبُ",
  "الْجَلِيلُ", "الْكَرِيمُ", "الرَّقِيبُ", "الْمُجِيبُ", "الْوَاسِعُ", "الْحَكِيمُ", "الْوَدُودُ", "الْمَجِيدُ", "الْبَاعِثُ", "الشَّهِيدُ",
  "الْحَقُّ", "الْوَكِيلُ", "الْقَوِيُّ", "الْمَتِينُ", "الْوَلِيُّ", "الْحَمِيدُ", "الْمُحْصِي", "الْمُبْدِئُ", "الْمُعِيدُ", "الْمُحْيِي",
  "الْمُمِيتُ", "الْحَيُّ", "الْقَيُّومُ", "الْوَاجِدُ", "الْمَاجِدُ", "الْوَاحِدُ", "الصَّمَدُ", "الْقَادِرُ", "الْمُقْتَدِرُ", "الْمُقَدِّمُ",
  "الْمُؤَخِّرُ", "الْأَوَّلُ", "الْآخِرُ", "الظَّاهِرُ", "الْبَاطِنُ", "الْوَالِي", "الْمُتَعَالِي", "الْبَرُّ", "التَّوَّابُ", "الْمُنْتَقِمُ",
  "الْعَفُوُّ", "الرَّءُوفُ", "مَالِكُ الْمُلْكِ", "ذُو الْجَلَالِ وَالْإِكْرَامِ", "الْمُقْسِطُ", "الْجَامِعُ", "الْغَنِيُّ", "الْمُغْنِي", "الْمَانِعُ", "الضَّارُّ",
  "النَّافِعُ", "النُّورُ", "الْهَادِي", "الْبَدِيعُ", "الْبَاقِي", "الْوَارِثُ", "الرَّشِيدُ", "الصَّبُورُ",
];

const ARABIC_ALPHABET = [
  "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص",
  "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "ه", "و", "ي",
];

const TALISMAN_SYMBOLS = [
  "☉", "☽", "☿", "♀", "♂", "♃", "♄", "✦", "✧", "۞", "۩", "⚶", "⚸", "⚹", "✺", "❂", "✵", "◈", "❖",
];

const DEFAULT_GLYPHS: string[] = [
  ...ASMA_UL_HUSNA,
  ...ARABIC_ALPHABET,
  ...TALISMAN_SYMBOLS,
];

const SMOKE_HUES: number[] = [
  272, 280, 288, 265, // Deep & Royal Purple
  218, 226, 234,      // Rich Royal Blue
  188, 194, 200,      // Vibrant Cyan
  42, 46, 38,         // Warm Golden
];

const DOT_HUES: number[] = [
  44, 48, 38,         // Golden fireflies
  190, 198,           // Cyan sparkles
  278, 290, 325,      // Purple & Magenta
  220,                // Blue
];

const GLYPH_HUES: number[] = [
  45, 48, 42,         // Golden calligraphy
  192, 198,           // Cyan glow
  282, 295,           // Violet-purple glow
];

const TAU = Math.PI * 2;
const rand = (a: number, b: number): number => Math.random() * (b - a) + a;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const smooth = (a: number, b: number, x: number): number => {
  const v = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return v * v * (3 - 2 * v);
};

interface Props {
  originX?: number;
  originY?: number;
  groundY?: number; // Normalized ground level (0 to 1, default 0.94 near bottom of screen)
  menuHeight?: number; // Top menu bar height in px. Smoke rises to just below this line (0 = very top of page)
  targetSelector?: string; // CSS selector of the element smoke should rise up to (e.g. "#hero-tagline"). Overrides menuHeight/heightBoost
  heightBoost?: number; // Vertical stretch multiplier (1 = fit exactly, >1 = taller)
  topGap?: number; // Extra gap (px) kept between smoke path and menu bar. Smaller = taller smoke
  glyphs?: string[];
  direction?: "left" | "right";
  spiral?: "inverted-s-top" | "full-roam" | "straight-swing" | "down" | "under" | "over";
  drift?: number;
  speed?: number;
  showGlyphs?: boolean;
  debug?: boolean;
}

type Kind = "puff" | "wisp" | "glyph" | "spark" | "flash";
type Wind = { x: number; y: number; px: number; py: number; power: number };
type Path = { x: Float32Array; y: Float32Array; nx: Float32Array; ny: Float32Array };
type CtrlPoint = { x: number; y: number };

const pt = (x: number, y: number): CtrlPoint => ({ x, y });

/* ---------- Inverted 'S' Path Rising Left & Flowing Across Top of Page ---------- */

const CTRL_INVERTED_S_TOP: CtrlPoint[] = [
  pt(0, 0),          // 1. Lamp nozzle origin
  pt(55, -18),       // 2. Exits lamp slightly forward (left) and curves upward
  pt(115, -68),      // 3. Curves smoothly into the lower belly of the inverted 'S'
  pt(95, -135),      // 4. Sweeps inward/upward to form the middle S-bend
  pt(35, -195),      // 5. Rises gracefully toward the upper height
  pt(-45, -245),     // 6. Reaches top-right side
  pt(90, -258),      // 7. Flows smoothly from right to left across the top
  pt(270, -252),     // 8. Continues gliding across the center-top
  pt(460, -260),     // 9. Flows toward the upper-left area
  pt(650, -252),     // 10. Gently lingers & fades out on the far upper-left
];

const CTRL_FULL_ROAM: CtrlPoint[] = [
  pt(0, 0),
  pt(65, -3),
  pt(135, 4),
  pt(210, 55),
  pt(290, 105),
  pt(360, 40),
  pt(325, -45),
  pt(410, -115),
  pt(510, -65),
  pt(595, 25),
  pt(680, -70),
  pt(760, -175),
  pt(840, -250),
];

const CTRL_STRAIGHT_SWING: CtrlPoint[] = [
  pt(0, 0),
  pt(65, -2),
  pt(130, 3),
  pt(195, 48),
  pt(265, 85),
  pt(340, 25),
  pt(415, -55),
  pt(490, -110),
  pt(565, -40),
  pt(645, -125),
  pt(730, -205),
];

const CTRL_OVER: CtrlPoint[] = [
  pt(0, 0), pt(45, -35), pt(80, -75), pt(80, -125), pt(45, -165), pt(-5, -178),
  pt(-55, -150), pt(-75, -105), pt(100, -85), pt(180, -85), pt(260, -120), pt(350, -165),
  pt(450, -190), pt(560, -225), pt(680, -250),
];

const CTRL_UNDER: CtrlPoint[] = [
  pt(0, 0), pt(-22, -40), pt(-42, -88), pt(-28, -135), pt(20, -152), pt(65, -122),
  pt(62, -72), pt(18, -58), pt(85, -68), pt(160, -95), pt(240, -112), pt(330, -147),
  pt(430, -177), pt(530, -202), pt(630, -232), pt(720, -250),
];

const CTRL_DOWN: CtrlPoint[] = [
  pt(0, 0), pt(25, 30), pt(60, 70), pt(92, 120), pt(60, 150), pt(15, 128),
  pt(28, 88), pt(70, 45), pt(95, -10), pt(80, -70), pt(120, -108), pt(200, -122),
  pt(290, -118), pt(380, -130), pt(470, -155), pt(560, -185), pt(650, -210),
  pt(730, -235),
];

const N = 360;

/**
 * k  = horizontal scale (also used for particle sizes / spread)
 * ky = vertical scale (so the path can stretch to the top of the page independently)
 */
function buildPath(
  ox: number, oy: number, k: number, ky: number, sgn: number, reach: number, ctrl: CtrlPoint[]
): Path {
  const pts: CtrlPoint[] = ctrl.map((c) => ({
    x: ox + sgn * c.x * k * reach,
    y: oy + c.y * ky,
  }));
  const P = (i: number): CtrlPoint => pts[Math.max(0, Math.min(pts.length - 1, i))];
  const dense: CtrlPoint[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = P(i - 1);
    const p1 = P(i);
    const p2 = P(i + 1);
    const p3 = P(i + 2);
    for (let s = 0; s < 24; s++) {
      const t = s / 24;
      const t2 = t * t;
      const t3 = t2 * t;
      const cr = (a: number, b: number, c: number, d: number): number =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      dense.push({
        x: cr(p0.x, p1.x, p2.x, p3.x),
        y: cr(p0.y, p1.y, p2.y, p3.y),
      });
    }
  }
  dense.push(pts[pts.length - 1]);

  const len: number[] = [0];
  for (let i = 1; i < dense.length; i++) {
    len.push(len[i - 1] + Math.hypot(dense[i].x - dense[i - 1].x, dense[i].y - dense[i - 1].y));
  }
  const total = len[len.length - 1];

  const x = new Float32Array(N);
  const y = new Float32Array(N);
  let seg = 0;
  for (let j = 0; j < N; j++) {
    const target = (total * j) / (N - 1);
    while (seg < len.length - 2 && len[seg + 1] < target) seg++;
    const f = (target - len[seg]) / Math.max(1e-6, len[seg + 1] - len[seg]);
    x[j] = dense[seg].x + (dense[seg + 1].x - dense[seg].x) * f;
    y[j] = dense[seg].y + (dense[seg + 1].y - dense[seg].y) * f;
  }
  const nx = new Float32Array(N);
  const ny = new Float32Array(N);
  for (let j = 0; j < N; j++) {
    const a = Math.max(0, j - 1);
    const b = Math.min(N - 1, j + 1);
    const tx = x[b] - x[a];
    const ty = y[b] - y[a];
    const l = Math.hypot(tx, ty) || 1;
    nx[j] = -ty / l;
    ny[j] = tx / l;
  }
  return { x, y, nx, ny };
}

/* ---------- Procedural Smoke, Firefly Dot, Star Sparkle & Glyph Textures ---------- */

const makeCanvas = (w: number, h: number): HTMLCanvasElement => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};

const hash = (x: number, y: number, s: number): number => {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

const vnoise = (x: number, y: number, s: number): number => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s);
  const b = hash(xi + 1, yi, s);
  const c = hash(xi, yi + 1, s);
  const d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};

const fbm = (x: number, y: number, s: number): number => {
  let v = 0;
  let a = 0.5;
  let f = 1;
  for (let o = 0; o < 4; o++) {
    v += a * vnoise(x * f, y * f, s + o * 17);
    f *= 2;
    a *= 0.5;
  }
  return v;
};

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
};

const noiseSprites = new Map<string, HTMLCanvasElement>();
const getNoiseSprite = (hue: number, variant: number): HTMLCanvasElement => {
  const key = `${hue}|${variant}`;
  let c = noiseSprites.get(key);
  if (c) return c;
  const S = 128;
  c = makeCanvas(S, S);
  const g = c.getContext("2d")!;
  const img = g.createImageData(S, S);
  const seed = variant * 101 + hue;
  for (let py = 0; py < S; py++) {
    for (let px = 0; px < S; px++) {
      const fx = px / S;
      const fy = py / S;
      const r = Math.hypot(fx * 2 - 1, fy * 2 - 1);
      const fall = 1 - smooth(0.15, 1, r);
      const wv = fbm(fx * 2.2, fy * 2.2, seed + 5);
      const n = fbm(fx * 3.4 + wv * 1.4, fy * 3.4 + wv * 1.4, seed);
      const a = Math.min(1, Math.max(0, (n - 0.3) * 2.1)) * fall;
      const [R, G, B] = hslToRgb(hue + (n - 0.5) * 24, 95, 36 + 22 * n);
      const i = (py * S + px) * 4;
      img.data[i] = R;
      img.data[i + 1] = G;
      img.data[i + 2] = B;
      img.data[i + 3] = a * 255;
    }
  }
  g.putImageData(img, 0, 0);
  noiseSprites.set(key, c);
  return c;
};

const softSprites = new Map<string, HTMLCanvasElement>();
const getSoftSprite = (hue: number, light: number): HTMLCanvasElement => {
  const key = `${hue}|${light}`;
  let c = softSprites.get(key);
  if (c) return c;
  const S = 96;
  c = makeCanvas(S, S);
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  gr.addColorStop(0, `hsla(${hue},95%,${light}%,0.9)`);
  gr.addColorStop(0.35, `hsla(${hue},90%,${light - 14}%,0.35)`);
  gr.addColorStop(0.7, `hsla(${hue},85%,${light - 28}%,0.08)`);
  gr.addColorStop(1, `hsla(${hue},80%,40%,0)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, S, S);
  softSprites.set(key, c);
  return c;
};

const dotSprites = new Map<number, HTMLCanvasElement>();
const getDotSprite = (hue: number): HTMLCanvasElement => {
  let c = dotSprites.get(hue);
  if (c) return c;
  const S = 48;
  const mid = S / 2;
  c = makeCanvas(S, S);
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(mid, mid, 0, mid, mid, mid);
  gr.addColorStop(0, `hsla(${hue}, 100%, 92%, 1)`);
  gr.addColorStop(0.22, `hsla(${hue}, 100%, 72%, 0.9)`);
  gr.addColorStop(0.55, `hsla(${hue}, 100%, 55%, 0.28)`);
  gr.addColorStop(1, `hsla(${hue}, 100%, 45%, 0)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, S, S);
  dotSprites.set(hue, c);
  return c;
};

// Twinkling 4-point star sparkle sprite for ground impact
const starFlashSprites = new Map<number, HTMLCanvasElement>();
const getStarFlashSprite = (hue: number): HTMLCanvasElement => {
  let c = starFlashSprites.get(hue);
  if (c) return c;
  const S = 72;
  const mid = S / 2;
  c = makeCanvas(S, S);
  const g = c.getContext("2d")!;

  // Soft outer star halo
  const gr = g.createRadialGradient(mid, mid, 0, mid, mid, mid);
  gr.addColorStop(0, `hsla(${hue}, 100%, 97%, 1)`);
  gr.addColorStop(0.18, `hsla(${hue}, 100%, 78%, 0.85)`);
  gr.addColorStop(0.48, `hsla(${hue}, 100%, 58%, 0.25)`);
  gr.addColorStop(1, `hsla(${hue}, 100%, 45%, 0)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, S, S);

  // Crisp 4-point star rays (sitaray jaisi chamak)
  g.save();
  g.translate(mid, mid);
  g.fillStyle = `hsla(${hue}, 100%, 96%, 0.95)`;
  for (let r = 0; r < 2; r++) {
    g.rotate((r * Math.PI) / 2);
    g.beginPath();
    g.moveTo(0, -mid * 0.88);
    g.quadraticCurveTo(2.4, -2.4, mid * 0.88, 0);
    g.quadraticCurveTo(2.4, 2.4, 0, mid * 0.88);
    g.quadraticCurveTo(-2.4, 2.4, -mid * 0.88, 0);
    g.quadraticCurveTo(-2.4, -2.4, 0, -mid * 0.88);
    g.closePath();
    g.fill();
  }
  g.restore();

  starFlashSprites.set(hue, c);
  return c;
};

const glyphSprites = new Map<string, HTMLCanvasElement>();
const getGlyphSprite = (text: string, hue: number, size: number): HTMLCanvasElement => {
  const px = Math.round(size);
  const key = `${text}|${hue}|${px}`;
  let c = glyphSprites.get(key);
  if (c) return c;
  const SC = 2;
  const pad = 16;
  const font = `${px * SC}px "Amiri","Noto Naskh Arabic","Times New Roman",serif`;
  const probe = makeCanvas(1, 1).getContext("2d")!;
  probe.font = font;
  const tw = Math.ceil(probe.measureText(text).width);
  c = makeCanvas(tw + pad * 2 * SC, px * SC * 2 + pad * 2 * SC);
  const g = c.getContext("2d")!;
  g.font = font;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.shadowColor = `hsla(${hue},100%,65%,1)`;
  g.shadowBlur = 14 * SC;
  g.fillStyle = `hsla(${hue},100%,86%,1)`;
  g.fillText(text, c.width / 2, c.height / 2);
  glyphSprites.set(key, c);
  return c;
};

/* ---------- Particle ---------- */

class Particle {
  x = 0;
  y = 0;
  u = 0;
  dx = 0;
  dy = 0;
  alpha = 0;
  baseAlpha: number;
  maxLife: number;
  size = 1;
  depth = 1;
  hue: number;
  variant = Math.floor(rand(0, 3));
  seed = rand(0, 1000);
  rad = Math.sqrt(rand(0.02, 1));
  th0 = rand(0, TAU);
  turns = rand(0.9, 2.2) * (Math.random() < 0.5 ? -1 : 1);
  spin = rand(0.18, 0.45) * (Math.random() < 0.5 ? -1 : 1);
  rot = rand(0, TAU);
  rotSpeed = rand(-0.004, 0.004);
  off = rand(-1, 1);
  text = "";
  blinkRate = 2;

  // Glyph ascent-then-rain state
  isRaining = false;
  releaseU = rand(0.46, 0.86); // Detaches along the upper portion of the smoke path
  rainFallSpeed = rand(1.15, 2.05);
  rainDriftX = rand(-0.22, 0.22);
  rainSwayFreq = rand(1.1, 2.3);
  rainSwayAmp = rand(5, 13);
  hasFlashed = false;

  constructor(public kind: Kind, glyphs: string[]) {
    this.depth = rand(0.7, 1.32);

    if (kind === "puff") {
      this.hue = pick(SMOKE_HUES);
      this.size = rand(0.85, 1.3) * this.depth;
      this.baseAlpha = rand(0.055, 0.115);
      this.maxLife = rand(720, 960);
    } else if (kind === "wisp") {
      this.hue = pick(SMOKE_HUES);
      this.size = rand(0.75, 1.25) * this.depth;
      this.baseAlpha = rand(0.095, 0.19);
      this.maxLife = rand(680, 920);
    } else if (kind === "glyph") {
      this.text = pick(glyphs);
      this.hue = pick(GLYPH_HUES);
      this.size = rand(13, 20);
      this.baseAlpha = rand(0.84, 1.0);
      this.blinkRate = rand(1.1, 2.4);
      this.maxLife = rand(680, 900);
    } else if (kind === "flash") {
      this.hue = 45;
      this.size = rand(2.4, 3.8);
      this.baseAlpha = 1.0;
      this.maxLife = rand(48, 72); // Twinkles brightly on the ground then fades out
    } else {
      const isLarge = Math.random() < 0.12;
      this.hue = pick(DOT_HUES);
      this.size = isLarge ? rand(1.6, 2.6) : rand(0.35, 0.8);
      this.baseAlpha = isLarge ? rand(0.85, 1.0) : rand(0.55, 0.85);
      this.blinkRate = rand(2.2, 5.0);
      this.maxLife = rand(660, 900);
    }
  }

  update(
    t: number,
    dt: number,
    wind: Wind,
    path: Path,
    k: number,
    groundLevelPx: number,
    onSpawnFlash: (x: number, y: number, hue: number) => void
  ): void {
    // 1. Ground star flash particle (sitaray jaisa jagmagana)
    if (this.kind === "flash") {
      this.u += dt / this.maxLife;
      if (this.u >= 1) return;
      const peak = smooth(0, 0.16, this.u);
      const fade = 1 - smooth(0.28, 1.0, this.u);
      // Rapid star-like shimmer pulse before vanishing
      const twinkle = 0.65 + 0.35 * Math.sin(this.u * Math.PI * 5);
      this.alpha = this.baseAlpha * peak * fade * twinkle;
      return;
    }

    // 2. Glyph: First rises inside smoke from lamp to top, then rains down to the ground
    if (this.kind === "glyph" && this.isRaining) {
      this.y += this.rainFallSpeed * dt * Math.max(0.75, k);
      this.x += (this.rainDriftX + Math.sin(t * this.rainSwayFreq + this.seed) * 0.28) * dt;
      this.rot += this.rotSpeed * 0.45 * dt;

      // Keep full visibility while falling, fade slightly right at ground contact
      const distToGround = groundLevelPx - this.y;
      const groundApproach = distToGround < 32 ? Math.max(0, distToGround / 32) : 1;
      const b = 0.5 + 0.5 * Math.sin(t * this.blinkRate + this.seed);
      this.alpha = this.baseAlpha * groundApproach * (0.45 + 0.55 * b * b);

      // Hit the ground (zameen): vanish and burst into a twinkling star sparkle
      if (this.y >= groundLevelPx) {
        if (!this.hasFlashed) {
          this.hasFlashed = true;
          onSpawnFlash(this.x, groundLevelPx, this.hue);
        }
        this.u = 1; // Remove glyph immediately on ground impact
      }
      return;
    }

    // 3. Standard path progression (from lamp up the inverted 'S' to the top of the page)
    this.u += (dt / this.maxLife) * (this.kind === "spark" ? 0.88 : 1);
    const u = this.u;
    if (u >= 1) return;

    const idx = u * (N - 1);
    const i = Math.floor(idx);
    const f = idx - i;
    const j = Math.min(N - 1, i + 1);
    const px = path.x[i] + (path.x[j] - path.x[i]) * f;
    const py = path.y[i] + (path.y[j] - path.y[i]) * f;
    const nx = path.nx[i] + (path.nx[j] - path.nx[i]) * f;
    const ny = path.ny[i] + (path.ny[j] - path.ny[i]) * f;
    const tx = ny;
    const ty = -nx;

    const chaos = smooth(0.1, 0.36, u);
    const roamBoost = smooth(0.42, 0.95, u);

    let offN = 0;
    let offT = 0;
    if (this.kind === "puff" || this.kind === "wisp") {
      const spread = (this.kind === "puff" ? 4 + 62 * chaos + 38 * roamBoost : 3 + 42 * chaos + 26 * roamBoost) * this.depth;
      const r = this.rad * k * spread;
      const th = this.th0 + TAU * this.turns * u + t * this.spin;
      const randWave =
        Math.sin(t * 0.95 + this.seed + u * 8.5) * k * (18 * chaos + 20 * roamBoost) +
        Math.cos(t * 0.65 + this.seed * 1.4 - u * 5.5) * k * (14 * chaos + 16 * roamBoost);
      offN = Math.cos(th) * r + randWave;
      offT = Math.sin(th) * r * 0.82;
    } else if (this.kind === "glyph") {
      offN = this.off * k * (6 + 44 * chaos) + Math.sin(t * 0.85 + this.seed + u * 5) * k * 11 * chaos;
      offT = Math.cos(t * 0.65 + this.seed) * k * 11 * chaos;
    } else {
      offN =
        this.off * k * (6 + 68 * chaos + 42 * roamBoost) * this.depth +
        Math.sin(t * 0.95 + this.seed + u * 6) * k * 14 * chaos;
      offT = Math.cos(t * 0.75 + this.seed) * k * 12 * chaos;
    }

    if (wind.power > 0.01) {
      const ddx = px - wind.px;
      const ddy = py - wind.py;
      const d2 = ddx * ddx + ddy * ddy;
      if (d2 < 170 * 170) {
        const fo = (1 - Math.sqrt(d2) / 170) * wind.power;
        this.dx += wind.x * fo * 0.3 * dt;
        this.dy += wind.y * fo * 0.3 * dt;
      }
    }
    const relax = Math.pow(0.97, dt);
    this.dx *= relax;
    this.dy *= relax;

    let wx = 0;
    let wy = 0;
    if (this.kind === "glyph" || this.kind === "spark") {
      wx = Math.sin(t * 0.65 + this.seed) * k * (11 * chaos + 9 * roamBoost);
      wy = Math.cos(t * 0.55 + this.seed * 1.7) * k * (11 * chaos + 9 * roamBoost);
    }

    this.x = px + nx * offN + tx * offT + this.dx + wx;
    this.y = py + ny * offN + ty * offT + this.dy + wy;
    this.rot += this.rotSpeed * dt;

    // Once glyph reaches the upper portion of the smoke path, detach & start raining down
    if (this.kind === "glyph" && u >= this.releaseU) {
      this.isRaining = true;
      return;
    }

    const originDensityBoost =
      this.kind === "puff" || this.kind === "wisp"
        ? 1 + 0.5 * (1 - smooth(0.05, 0.22, u))
        : 1;

    // Smoke stays aloft at the top and gently fades out as it travels left
    const fadeOut = 1 - smooth(0.68, 1.0, u);
    const env = smooth(0, 0.03, u) * fadeOut;
    this.alpha = this.baseAlpha * env * originDensityBoost;

    if (this.kind === "spark") {
      const twinkle = 0.5 + 0.5 * Math.sin(t * this.blinkRate + this.seed);
      this.alpha *= 0.12 + 0.88 * Math.pow(twinkle, 2.5);
    } else if (this.kind === "glyph") {
      const b = 0.5 + 0.5 * Math.sin(t * this.blinkRate + this.seed);
      this.alpha *= 0.35 + 0.65 * b * b;
    }
  }

  draw(ctx: CanvasRenderingContext2D, k: number): void {
    if (this.alpha <= 0.003) return;
    const u = this.u;

    if (this.kind === "puff" || this.kind === "wisp") {
      const s =
        this.kind === "puff"
          ? k * (11 + 52 * u) * this.size
          : k * (5 + 22 * u) * this.size;
      ctx.globalAlpha = Math.min(0.65, this.alpha);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.drawImage(getNoiseSprite(this.hue, this.variant), -s, -s, s * 2, s * 2);
      ctx.restore();
    } else if (this.kind === "spark") {
      const s = this.size * 3.0;
      ctx.globalAlpha = Math.min(1, this.alpha);
      ctx.drawImage(getDotSprite(this.hue), this.x - s, this.y - s, s * 2, s * 2);
    } else if (this.kind === "flash") {
      // Expand sharply on impact, twinkle like a star, then shrink/fade away
      const expand = this.u < 0.22 ? 0.4 + (this.u / 0.22) * 1.1 : 1.5 - (this.u - 0.22) * 0.65;
      const s = this.size * 6.5 * Math.max(0.25, expand);
      ctx.globalAlpha = Math.min(1, this.alpha);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.u * 0.8);
      ctx.drawImage(getStarFlashSprite(this.hue), -s, -s, s * 2, s * 2);
      ctx.restore();
    } else {
      const r = this.size * 2.0;
      ctx.globalAlpha = Math.min(1, this.alpha * 0.45);
      ctx.drawImage(getSoftSprite(this.hue, 68), this.x - r, this.y - r, r * 2, r * 2);
      ctx.globalAlpha = Math.min(1, this.alpha);
      const sp = getGlyphSprite(this.text, this.hue, this.size);
      const w = sp.width / 2;
      const h = sp.height / 2;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(Math.sin(this.rot * 18) * 0.12);
      ctx.drawImage(sp, -w / 2, -h / 2, w, h);
      ctx.restore();
    }
  }
}

/* ---------- Component ---------- */

export function MagicalSmoke({
  originX = 0.76,
  originY = 0.64,
  groundY = 0.94,
  menuHeight = 90,
  topGap = 0,
  heightBoost = 1.4,
  targetSelector,
  glyphs = DEFAULT_GLYPHS,
  direction = "left",
  spiral = "inverted-s-top",
  drift = 1.25,
  speed = 0.55,
  showGlyphs = true,
  debug = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const MAX = reduced ? 350 : 2800;
    const rate = reduced ? 0.3 : 1;
    const reach = Math.max(0.3, drift);
    const sgn = direction === "left" ? -1 : 1;
    const ctrl: CtrlPoint[] =
      spiral === "inverted-s-top"
        ? CTRL_INVERTED_S_TOP
        : spiral === "full-roam"
        ? CTRL_FULL_ROAM
        : spiral === "straight-swing"
        ? CTRL_STRAIGHT_SWING
        : spiral === "down"
        ? CTRL_DOWN
        : spiral === "under"
        ? CTRL_UNDER
        : CTRL_OVER;

    const ext = {
      up: Math.max(20, -Math.min(...ctrl.map((c) => c.y))),
      down: Math.max(20, ...ctrl.map((c) => c.y)),
      fwd: Math.max(1, ...ctrl.map((c) => c.x)),
      back: Math.max(0, -Math.min(...ctrl.map((c) => c.x))),
    };

    let w = 0;
    let h = 0;
    let k = 1;
    let ky = 1; // vertical scale
    let topLimit = menuHeight; // y (px) where the smoke path ends at the top
    let path: Path = buildPath(0, 0, 1, 1, sgn, reach, ctrl);
    let raf = 0;
    let particles: Particle[] = [];
    let t = 0;
    let last = performance.now();
    const acc = { puff: 0, wisp: 0, glyph: 0, spark: 0 };
    const wind: Wind = { x: 0, y: 0, px: -999, py: -999, power: 0 };

    for (const hue of SMOKE_HUES) for (let v = 0; v < 3; v++) getNoiseSprite(hue, v);
    for (const dh of DOT_HUES) getDotSprite(dh);
    for (const gh of GLYPH_HUES) getStarFlashSprite(gh);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight || 450;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const ox = w * originX;
      const oy = h * originY;
      const fwdAvail = direction === "left" ? ox : w - ox;
      const backAvail = direction === "left" ? w - ox : ox;

      // Horizontal scale (vertical-up limit removed so the path can reach the top)
      const limits: number[] = [
        h / 360,
        (fwdAvail * 0.96) / Math.max(1, ext.fwd * reach),
      ];
      if (ext.back > 0) limits.push((backAvail * 0.94) / Math.max(1, ext.back * reach));
      k = Math.max(0.45, Math.min(...limits));

      // Vertical scale: origin -> top of page (just below the menu bar)
      let topMargin = menuHeight + topGap; // menu + optional gap (smaller = taller)
      let boost = heightBoost;
      const targetEl = targetSelector ? document.querySelector(targetSelector) : null;
      if (targetEl) {
        // Smoke rises ABOVE the target element (e.g. the tagline): one element-height over its top edge
        const tr = targetEl.getBoundingClientRect();
        const pr = parent.getBoundingClientRect();
        topMargin = tr.top - pr.top - tr.height + topGap;
        boost = 1;
      }
      topLimit = topMargin;
      const upAvail = Math.max(60, oy - topMargin);
      ky = (upAvail / ext.up) * boost; // extra stretch for more height

      // Paths that go downward (e.g. "down") must not exit the bottom of the page
      if (ext.down > 20) {
        ky = Math.min(ky, ((h - oy) * 0.96) / ext.down);
      }

      path = buildPath(ox, oy, k, ky, sgn, reach, ctrl);
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("load", resize);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(parent);
    if (targetSelector) {
      const el = document.querySelector(targetSelector);
      if (el) ro?.observe(el);
    }

    const onMove = (cx: number, cy: number) => {
      const r = canvas.getBoundingClientRect();
      const x = cx - r.left;
      const y = cy - r.top;
      wind.x = x - wind.px;
      wind.y = y - wind.py;
      wind.px = x;
      wind.py = y;
      wind.power = Math.min(1, Math.hypot(wind.x, wind.y) / 25);
    };
    const mm = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const tm = (e: TouchEvent) => onMove(e.touches[0].clientX, e.touches[0].clientY);
    window.addEventListener("mousemove", mm);
    window.addEventListener("touchmove", tm, { passive: true });

    const emit = (kind: Kind) => {
      if (particles.length < MAX) particles.push(new Particle(kind, glyphs));
    };

    const spawnFlash = (fx: number, fy: number, hue: number) => {
      const flash = new Particle("flash", glyphs);
      flash.x = fx;
      flash.y = fy;
      flash.hue = hue;
      particles.push(flash);
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 16.667, 3) * speed;
      last = now;
      t += dt / 60;

      ctx.clearRect(0, 0, w, h);

      acc.puff += dt * 1.45 * rate;
      acc.wisp += dt * 1.7 * rate;
      if (showGlyphs) acc.glyph += dt * 0.28 * rate;
      acc.spark += dt * 1.15 * rate;

      while (acc.puff >= 1) { acc.puff--; emit("puff"); }
      while (acc.wisp >= 1) { acc.wisp--; emit("wisp"); }
      while (acc.glyph >= 1) { acc.glyph--; emit("glyph"); }
      while (acc.spark >= 1) { acc.spark--; emit("spark"); }

      const groundLevelPx = h * groundY;
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(t, dt, wind, path, k, groundLevelPx, spawnFlash);
      }
      particles = particles.filter((p) => p.u < 1);

      ctx.globalCompositeOperation = "screen";
      for (const p of particles) if (p.kind === "puff") p.draw(ctx, k);
      for (const p of particles) if (p.kind === "wisp") p.draw(ctx, k);

      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) if (p.kind === "glyph") p.draw(ctx, k);
      for (const p of particles) if (p.kind === "spark") p.draw(ctx, k);
      for (const p of particles) if (p.kind === "flash") p.draw(ctx, k);

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      if (debug) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(path.x[0], path.y[0], 8, 0, TAU);
        ctx.moveTo(path.x[0] - 14, path.y[0]);
        ctx.lineTo(path.x[0] + 14, path.y[0]);
        ctx.moveTo(path.x[0], path.y[0] - 14);
        ctx.lineTo(path.x[0], path.y[0] + 14);
        ctx.stroke();

        // Ground line debug indicator
        ctx.strokeStyle = "gold";
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(0, groundLevelPx);
        ctx.lineTo(w, groundLevelPx);
        ctx.stroke();

        // Menu bar limit debug indicator
        ctx.strokeStyle = "cyan";
        ctx.beginPath();
        ctx.moveTo(0, topLimit);
        ctx.lineTo(w, topLimit);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      wind.power *= Math.pow(0.92, dt);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("load", resize);
      ro?.disconnect();
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("touchmove", tm);
      particles = [];
    };
  }, [originX, originY, groundY, menuHeight, topGap, heightBoost, targetSelector, glyphs, direction, spiral, drift, speed, showGlyphs, debug]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20" aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full mix-blend-screen opacity-95" />
    </div>
  );
}

export const PaintedSmoke = MagicalSmoke;

export default MagicalSmoke;
