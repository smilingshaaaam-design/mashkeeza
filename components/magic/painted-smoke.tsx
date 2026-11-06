"use client";

import React, { useEffect, useRef } from "react";

/**
 * MagicalSmoke - Purple, Blue, Cyan, Pink + subtle Golden realistic smoke
 * with twinkling small & occasional large firefly dots (jugnu).
 *
 * - Origin se 1.5 - 2 inch seedha nikal kar neechay aur upar randomly swing karta hai
 * - Origin point par zyada density aur dheemi smooth speed
 * - Zero tuple-conversion TypeScript errors (uses clean { x, y } point objects)
 */

const DEFAULT_GLYPHS: string[] = [
  "الرَّحْمَٰنُ", "الرَّحِيمُ", "الْمَلِكُ", "الْقُدُّوسُ", "السَّلَامُ",
  "النُّورُ", "الْهَادِي", "الْبَاقِي", "الْحَيُّ", "الْقَيُّومُ",
  "الم", "يس", "طه", "حم", "ق", "ن",
  "ا", "ب", "ج", "د", "ه", "و",
  "☉", "☽", "☿", "♀", "♂", "♃", "♄",
];

// Purple, Royal Blue, Cyan, Pink + thora sa Golden (~14%)
const SMOKE_HUES: number[] = [
  274, 280, 286, 268, 294, // Rich Purple & Violet
  215, 224, 232,           // Royal Blue
  188, 195,                // Cyan
  325, 336,                // Pink / Magenta
  44, 48,                  // Subtle Golden
];

const DOT_HUES: number[] = [
  282, 292, 270, // Purple
  218, 228,      // Blue
  190, 196,      // Cyan
  330, 340,      // Pink
  45, 50,        // Subtle Golden
];

const TAU = Math.PI * 2;
const rand = (a: number, b: number): number => Math.random() * (b - a) + a;
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const smooth = (a: number, b: number, x: number): number => {
  const v = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return v * v * (3 - 2 * v);
};

export interface MagicalSmokeProps {
  originX?: number;
  originY?: number;
  glyphs?: string[];
  direction?: "left" | "right";
  spiral?: "straight-swing" | "down" | "under" | "over";
  drift?: number;
  speed?: number;
  showGlyphs?: boolean;
  debug?: boolean;
}

type Kind = "puff" | "wisp" | "glyph" | "spark";
type Wind = { x: number; y: number; px: number; py: number; power: number };
type PathData = { x: Float32Array; y: Float32Array; nx: Float32Array; ny: Float32Array };
type CtrlPoint = { x: number; y: number };

const pt = (x: number, y: number): CtrlPoint => ({ x, y });

/* ---------- Ribbon Paths ---------- */

// Nali se 1.5 - 2 inch (~125px) bilkul seedha nikal kar neechay aur upar random swing karta hai
const CTRL_STRAIGHT_SWING: CtrlPoint[] = [
  pt(0, 0),
  pt(45, 0),
  pt(90, 1),
  pt(128, 3),     // ~1.5 - 2 inch seedha
  pt(168, 26),    // Neechay jhukna shuru
  pt(212, 62),    // Neechay ki taraf swing
  pt(258, 42),    // Upar ki taraf swing
  pt(305, -14),   // Mazeed upar wave
  pt(355, 22),    // Phir neechay ki lehar
  pt(408, -28),   // Phir upar swing
  pt(465, -55),   // End mein phailta hua
];

const CTRL_OVER: CtrlPoint[] = [
  pt(0, 0), pt(-45, -35), pt(-80, -75), pt(-80, -125), pt(-45, -165), pt(5, -178),
  pt(55, -150), pt(75, -105), pt(100, -85), pt(160, -85), pt(220, -120), pt(280, -165),
  pt(350, -190), pt(420, -225), pt(460, -250),
];

const CTRL_UNDER: CtrlPoint[] = [
  pt(0, 0), pt(22, -40), pt(42, -88), pt(28, -135), pt(-20, -152), pt(-65, -122),
  pt(-62, -72), pt(-18, -58), pt(45, -68), pt(110, -95), pt(170, -112), pt(230, -147),
  pt(290, -177), pt(350, -202), pt(420, -232), pt(460, -250),
];

const CTRL_DOWN: CtrlPoint[] = [
  pt(0, 0), pt(-25, 30), pt(-60, 70), pt(-92, 120), pt(-60, 150), pt(-15, 128),
  pt(-28, 88), pt(-70, 45), pt(-95, -10), pt(-80, -70), pt(-30, -108), pt(30, -122),
  pt(100, -118), pt(170, -130), pt(240, -155), pt(300, -185), pt(360, -210),
  pt(420, -235), pt(460, -250),
];

const N = 220;

function buildPath(
  ox: number,
  oy: number,
  k: number,
  sgn: number,
  reach: number,
  ctrl: CtrlPoint[]
): PathData {
  const pts: CtrlPoint[] = ctrl.map((c) => ({
    x: ox + sgn * c.x * k * reach,
    y: oy + c.y * k,
  }));

  const getPt = (i: number): CtrlPoint => pts[Math.max(0, Math.min(pts.length - 1, i))];
  const dense: CtrlPoint[] = [];

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = getPt(i - 1);
    const p1 = getPt(i);
    const p2 = getPt(i + 1);
    const p3 = getPt(i + 2);

    for (let s = 0; s < 20; s++) {
      const t = s / 20;
      const t2 = t * t;
      const t3 = t2 * t;
      const cr = (a: number, b: number, c: number, d: number): number =>
        0.5 *
        (2 * b +
          (-a + c) * t +
          (2 * a - 5 * b + 4 * c - d) * t2 +
          (-a + 3 * b - 3 * c + d) * t3);
      dense.push({
        x: cr(p0.x, p1.x, p2.x, p3.x),
        y: cr(p0.y, p1.y, p2.y, p3.y),
      });
    }
  }
  dense.push(pts[pts.length - 1]);

  const len: number[] = [0];
  for (let i = 1; i < dense.length; i++) {
    len.push(
      len[i - 1] +
        Math.hypot(dense[i].x - dense[i - 1].x, dense[i].y - dense[i - 1].y)
    );
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

/* ---------- Procedural Smoke & Firefly Dot Textures ---------- */

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
      const [R, G, B] = hslToRgb(hue + (n - 0.5) * 26, 90, 50 + 30 * n);
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
  gr.addColorStop(0, `hsla(${hue},95%,${light}%,0.95)`);
  gr.addColorStop(0.35, `hsla(${hue},90%,${light - 14}%,0.40)`);
  gr.addColorStop(0.7, `hsla(${hue},85%,${light - 28}%,0.10)`);
  gr.addColorStop(1, `hsla(${hue},80%,50%,0)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, S, S);
  softSprites.set(key, c);
  return c;
};

// Gol chamkeelay jugnu dot sprite (no stars)
const dotSprites = new Map<number, HTMLCanvasElement>();
const getDotSprite = (hue: number): HTMLCanvasElement => {
  let c = dotSprites.get(hue);
  if (c) return c;
  const S = 48;
  const mid = S / 2;
  c = makeCanvas(S, S);
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(mid, mid, 0, mid, mid, mid);
  gr.addColorStop(0, "rgba(255, 255, 255, 1)");
  gr.addColorStop(0.18, `hsla(${hue}, 100%, 84%, 0.95)`);
  gr.addColorStop(0.48, `hsla(${hue}, 100%, 66%, 0.42)`);
  gr.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, S, S);
  dotSprites.set(hue, c);
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
  g.shadowColor = `hsla(${hue},100%,72%,1)`;
  g.shadowBlur = 16 * SC;
  g.fillStyle = `hsla(${hue},100%,92%,1)`;
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
  turns = rand(0.5, 1.5) * (Math.random() < 0.5 ? -1 : 1);
  spin = rand(0.14, 0.42) * (Math.random() < 0.5 ? -1 : 1);
  rot = rand(0, TAU);
  rotSpeed = rand(-0.003, 0.003);
  off = rand(-1, 1);
  text = "";
  blinkRate = 2;

  constructor(public kind: Kind, glyphs: string[]) {
    this.depth = rand(0.7, 1.32);

    if (kind === "puff") {
      this.hue = pick(SMOKE_HUES);
      this.size = rand(0.85, 1.35) * this.depth;
      this.baseAlpha = rand(0.11, 0.22); // Zyada wazeh aur ghana
      this.maxLife = rand(460, 620);
    } else if (kind === "wisp") {
      this.hue = pick(SMOKE_HUES);
      this.size = rand(0.75, 1.3) * this.depth;
      this.baseAlpha = rand(0.18, 0.34); // Ghani core stream
      this.maxLife = rand(440, 580);
    } else if (kind === "glyph") {
      this.text = pick(glyphs);
      this.hue = pick([280, 290, 195, 46, 330]);
      this.size = rand(11, 17);
      this.baseAlpha = rand(0.8, 1);
      this.blinkRate = rand(1.2, 2.8);
      this.maxLife = rand(440, 580);
    } else {
      // 88% chotay barik jugnu dots, 12% kaheen-kaheen baray dots
      const isBig = Math.random() < 0.12;
      this.hue = pick(DOT_HUES);
      this.size = isBig ? rand(1.7, 2.6) : rand(0.45, 0.95);
      this.baseAlpha = isBig ? rand(0.9, 1) : rand(0.65, 0.92);
      this.blinkRate = rand(2.2, 5.2);
      this.maxLife = rand(440, 620);
    }
  }

  update(t: number, dt: number, wind: Wind, path: PathData, k: number): void {
    this.u += (dt / this.maxLife) * (this.kind === "spark" ? 0.85 : 1);
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

    // Pehle 1.5 - 2 inch (u < 0.24) seedha aur tight, uske baad random swing & spread
    const swing = smooth(0.22, 0.48, u);

    let offN = 0;
    let offT = 0;
    if (this.kind === "puff" || this.kind === "wisp") {
      const spread = (this.kind === "puff" ? 3.5 + 54 * swing : 2.5 + 32 * swing) * this.depth;
      const r = this.rad * k * spread;
      const th = this.th0 + TAU * this.turns * u + t * this.spin;
      const randWave =
        Math.sin(t * 0.9 + this.seed + u * 6) * k * 14 * swing +
        Math.cos(t * 0.6 + this.seed * 1.4) * k * 10 * swing;
      offN = Math.cos(th) * r + randWave;
      offT = Math.sin(th) * r * 0.72;
    } else if (this.kind === "glyph") {
      offN = this.off * k * (5 + 44 * swing) + Math.sin(t * 0.85 + this.seed) * k * 8 * swing;
    } else {
      offN =
        this.off * k * (5 + 62 * swing) * this.depth +
        Math.sin(t * 0.95 + this.seed) * k * 11 * swing;
      offT = Math.cos(t * 0.75 + this.seed) * k * 9 * swing;
    }

    if (wind.power > 0.01) {
      const ddx = px - wind.px;
      const ddy = py - wind.py;
      const d2 = ddx * ddx + ddy * ddy;
      if (d2 < 160 * 160) {
        const fo = (1 - Math.sqrt(d2) / 160) * wind.power;
        this.dx += wind.x * fo * 0.32 * dt;
        this.dy += wind.y * fo * 0.32 * dt;
      }
    }
    const relax = Math.pow(0.97, dt);
    this.dx *= relax;
    this.dy *= relax;

    let wx = 0;
    let wy = 0;
    if (this.kind === "glyph" || this.kind === "spark") {
      wx = Math.sin(t * 0.65 + this.seed) * k * 9 * swing;
      wy = Math.cos(t * 0.55 + this.seed * 1.7) * k * 9 * swing;
    }

    this.x = px + nx * offN + tx * offT + this.dx + wx;
    this.y = py + ny * offN + ty * offT + this.dy + wy;
    this.rot += this.rotSpeed * dt;

    // Origin point par foran zyada density (originBoost = 1.65)
    const originBoost = 1 + 0.65 * (1 - smooth(0.05, 0.32, u));
    const env = smooth(0, 0.03, u) * (1 - smooth(0.6, 1, u));
    this.alpha = this.baseAlpha * env * originBoost;

    if (this.kind === "spark") {
      const b = 0.5 + 0.5 * Math.sin(t * this.blinkRate + this.seed);
      this.alpha *= 0.12 + 0.88 * b * b;
    } else if (this.kind === "glyph") {
      const b = 0.5 + 0.5 * Math.sin(t * this.blinkRate + this.seed);
      this.alpha *= 0.15 + 0.85 * b * b;
    }
  }

  draw(ctx: CanvasRenderingContext2D, k: number): void {
    if (this.alpha <= 0.003) return;
    const u = this.u;

    if (this.kind === "puff" || this.kind === "wisp") {
      const s =
        this.kind === "puff"
          ? k * (12 + 44 * u) * this.size
          : k * (6 + 17 * u) * this.size;
      ctx.globalAlpha = Math.min(1, this.alpha);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.drawImage(getNoiseSprite(this.hue, this.variant), -s, -s, s * 2, s * 2);
      ctx.restore();
    } else if (this.kind === "spark") {
      const s = this.size * 3.0;
      ctx.globalAlpha = Math.min(1, this.alpha);
      ctx.drawImage(getDotSprite(this.hue), this.x - s, this.y - s, s * 2, s * 2);
    } else {
      const r = this.size * 2.2;
      ctx.globalAlpha = Math.min(1, this.alpha * 0.55);
      ctx.drawImage(getSoftSprite(this.hue, 76), this.x - r, this.y - r, r * 2, r * 2);
      ctx.globalAlpha = Math.min(1, this.alpha);
      const sp = getGlyphSprite(this.text, this.hue, this.size);
      const w = sp.width / 2;
      const h = sp.height / 2;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(Math.sin(this.rot * 20) * 0.15);
      ctx.drawImage(sp, -w / 2, -h / 2, w, h);
      ctx.restore();
    }
  }
}

/* ---------- Component ---------- */

export function MagicalSmoke({
  originX = 0.76,
  originY = 0.64,
  glyphs = DEFAULT_GLYPHS,
  direction = "left",
  spiral = "straight-swing",
  drift = 1,
  speed = 0.55,
  showGlyphs = false,
  debug = false,
}: MagicalSmokeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const MAX = reduced ? 350 : 2800;
    const rate = reduced ? 0.35 : 1;
    const reach = Math.max(0.3, drift);
    const sgn = direction === "left" ? -1 : 1;
    const ctrl =
      spiral === "straight-swing"
        ? CTRL_STRAIGHT_SWING
        : spiral === "down"
        ? CTRL_DOWN
        : spiral === "under"
        ? CTRL_UNDER
        : CTRL_OVER;

    const ext = {
      up: Math.max(20, -Math.min(...ctrl.map((c) => c.y))),
      down: Math.max(20, ...ctrl.map((c) => c.y)),
      fwd: Math.max(...ctrl.map((c) => c.x)),
      back: Math.max(0, -Math.min(...ctrl.map((c) => c.x))),
    };

    let w = 0;
    let h = 0;
    let k = 1;
    let path: PathData = buildPath(0, 0, 1, sgn, reach, ctrl);
    let raf = 0;
    let particles: Particle[] = [];
    let t = 0;
    let last = performance.now();
    const acc = { puff: 0, wisp: 0, glyph: 0, spark: 0 };
    const wind: Wind = { x: 0, y: 0, px: -999, py: -999, power: 0 };

    for (const hue of SMOKE_HUES) {
      for (let v = 0; v < 3; v++) {
        getNoiseSprite(hue, v);
      }
    }
    for (const dh of DOT_HUES) {
      getDotSprite(dh);
    }

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
      const limits: number[] = [h / 478, (fwdAvail * 0.96) / (ext.fwd * reach)];
      if (ext.up > 0) limits.push((oy * 0.97) / ext.up);
      if (ext.back > 0) limits.push((backAvail * 0.96) / (ext.back * reach));
      if (ext.down > 0) limits.push(((h - oy) * 0.97) / ext.down);
      k = Math.max(0.35, Math.min(...limits));
      path = buildPath(ox, oy, k, sgn, reach, ctrl);
    };
    resize();
    window.addEventListener("resize", resize);

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
    const tm = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    window.addEventListener("mousemove", mm);
    window.addEventListener("touchmove", tm, { passive: true });

    const emit = (kind: Kind) => {
      if (particles.length < MAX) {
        particles.push(new Particle(kind, glyphs));
      }
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 16.667, 3) * speed;
      last = now;
      t += dt / 60;

      ctx.clearRect(0, 0, w, h);

      // Origin par ghana smoke generate karne ke liye zyada emission rate
      acc.puff += dt * 1.85 * rate;
      acc.wisp += dt * 2.15 * rate;
      if (showGlyphs) acc.glyph += dt * 0.14 * rate;
      acc.spark += dt * 1.15 * rate;

      while (acc.puff >= 1) {
        acc.puff--;
        emit("puff");
      }
      while (acc.wisp >= 1) {
        acc.wisp--;
        emit("wisp");
      }
      while (acc.glyph >= 1) {
        acc.glyph--;
        emit("glyph");
      }
      while (acc.spark >= 1) {
        acc.spark--;
        emit("spark");
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(t, dt, wind, path, k);
      }
      particles = particles.filter((p) => p.u < 1);

      ctx.globalCompositeOperation = "screen";
      for (const p of particles) {
        if (p.kind === "puff") p.draw(ctx, k);
      }
      for (const p of particles) {
        if (p.kind === "wisp") p.draw(ctx, k);
      }

      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        if (p.kind === "glyph") p.draw(ctx, k);
      }
      for (const p of particles) {
        if (p.kind === "spark") p.draw(ctx, k);
      }

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
      }

      wind.power *= Math.pow(0.92, dt);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("touchmove", tm);
      particles = [];
    };
  }, [originX, originY, glyphs, direction, spiral, drift, speed, showGlyphs, debug]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20" aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full mix-blend-screen opacity-95" />
    </div>
  );
}

export const PaintedSmoke = MagicalSmoke;

export default MagicalSmoke;
