"use client";

import React, { useEffect, useRef } from "react";

const DEFAULT_GLYPHS = [
  "الرَّحْمَٰنُ", "الرَّحِيمُ", "الْمَلِكُ", "الْقُدُّوسُ", "السَّلَامُ",
  "النُّورُ", "الْهَادِي", "الْبَاقِي", "الْحَيُّ", "الْقَيُّومُ",
  "الم", "يس", "طه", "حم", "ق", "ن",
  "ا", "ب", "ج", "د", "ه", "و",
  "☉", "☽", "☿", "♀", "♂", "♃", "♄",
];

// Rich Purple, Violet, Magenta aur Blue shades (No Golden)
const SMOKE_HUES =;
const GLITTER_HUES =;

const TAU = Math.PI * 2;
const rand = (a: number, b: number) => Math.random() * (b - a) + a;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const smooth = (a: number, b: number, x: number) => {
  const v = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return v * v * (3 - 2 * v);
};

interface Props {
  originX?: number;
  originY?: number;
  glyphs?: string[];
  direction?: "left" | "right";
  spiral?: "straight-drop" | "down" | "under" | "over";
  drift?: number;
  speed?: number;
  showGlyphs?: boolean;
  debug?: boolean;
}

type Kind = "puff" | "wisp" | "glyph" | "spark";
type Wind = { x: number; y: number; px: number; py: number; power: number };
type Path = { x: Float32Array; y: Float32Array; nx: Float32Array; ny: Float32Array };

/* ---------- Ribbon ka Rasta ---------- */

const CTRL_STRAIGHT_DROP: [number, number][] = [,
 ,
 ,
 ,
 ,
 ,
 ,
 ,
 ,
 ,
 ,
];

const CTRL_OVER: [number, number][] = [, [-45, -35], [-80, -75], [-80, -125], [-45, -165], [5, -178],
  [55, -150], [75, -105], [100, -85], [160, -85], [220, -120], [280, -165],
  [350, -190], [420, -225], [460, -250],
];

const CTRL_UNDER: [number, number][] = [, [22, -40], [42, -88], [28, -135], [-20, -152], [-65, -122],
  [-62, -72], [-18, -58], [45, -68], [110, -95], [170, -112], [230, -147],
  [290, -177], [350, -202], [420, -232], [460, -250],
];

const CTRL_DOWN: [number, number][] = [, [-25, 30], [-60, 70], [-92, 120], [-60, 150], [-15, 128],
  [-28, 88], [-70, 45], [-95, -10], [-80, -70], [-30, -108], [30, -122],
  [100, -118], [170, -130], [240, -155], [300, -185], [360, -210],
  [420, -235], [460, -250],
];

const N = 220;

function buildPath(
  ox: number, oy: number, k: number, sgn: number, reach: number, ctrl: [number, number][]
): Path {
  const pts = ctrl.map(([dx, dy]) => [ox + sgn * dx * k * reach, oy + dy * k]);
  const P = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  const dense: number[][] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    for (let s = 0; s < 20; s++) {
      const t = s / 20, t2 = t * t, t3 = t2 * t;
      const cr = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      dense.push([cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  dense.push(pts[pts.length - 1]);

  const len: number[] =;
  for (let i = 1; i < dense.length; i++) {
    len.push(len[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
  }
  const total = len[len.length - 1];

  const x = new Float32Array(N), y = new Float32Array(N);
  let seg = 0;
  for (let j = 0; j < N; j++) {
    const target = (total * j) / (N - 1);
    while (seg < len.length - 2 && len[seg + 1] < target) seg++;
    const f = (target - len[seg]) / Math.max(1e-6, len[seg + 1] - len[seg]);
    x[j] = dense[seg][0] + (dense[seg + 1][0] - dense[seg][0]) * f;
    y[j] = dense[seg][1] + (dense[seg + 1][1] - dense[seg][1]) * f;
  }
  const nx = new Float32Array(N), ny = new Float32Array(N);
  for (let j = 0; j < N; j++) {
    const a = Math.max(0, j - 1), b = Math.min(N - 1, j + 1);
    const tx = x[b] - x[a], ty = y[b] - y[a];
    const l = Math.hypot(tx, ty) || 1;
    nx[j] = -ty / l;
    ny[j] = tx / l;
  }
  return { x, y, nx, ny };
}
/* ---------- Procedural Smoke & Glitter Textures ---------- */

const makeCanvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};

const hash = (x: number, y: number, s: number) => {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

const vnoise = (x: number, y: number, s: number) => {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};

const fbm = (x: number, y: number, s: number) => {
  let v = 0, a = 0.5, f = 1;
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
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
};

const noiseSprites = new Map<string, HTMLCanvasElement>();
const getNoiseSprite = (hue: number, variant: number) => {
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
      const fx = px / S, fy = py / S;
      const r = Math.hypot(fx * 2 - 1, fy * 2 - 1);
      const fall = 1 - smooth(0.15, 1, r);
      const wv = fbm(fx * 2.2, fy * 2.2, seed + 5);
      const n = fbm(fx * 3.4 + wv * 1.4, fy * 3.4 + wv * 1.4, seed);
      const a = Math.min(1, Math.max(0, (n - 0.3) * 2.1)) * fall;
      const [R, G, B] = hslToRgb(hue + (n - 0.5) * 28, 90, 48 + 32 * n);
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
const getSoftSprite = (hue: number, light: number) => {
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

const glitterSprites = new Map<number, HTMLCanvasElement>();
const getGlitterSprite = (hue: number) => {
  let c = glitterSprites.get(hue);
  if (c) return c;
  const S = 64;
  const mid = S / 2;
  c = makeCanvas(S, S);
  const g = c.getContext("2d")!;

  const gr = g.createRadialGradient(mid, mid, 0, mid, mid, mid * 0.85);
  gr.addColorStop(0, "rgba(255, 255, 255, 1)");
  gr.addColorStop(0.2, `hsla(${hue}, 100%, 82%, 0.9)`);
  gr.addColorStop(0.55, `hsla(${hue}, 100%, 65%, 0.3)`);
  gr.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, S, S);

  g.save();
  g.translate(mid, mid);
  g.fillStyle = "rgba(255, 255, 255, 0.95)";
  for (let i = 0; i < 2; i++) {
    g.rotate((Math.PI / 2) * i);
    g.beginPath();
    g.moveTo(0, -mid * 0.78);
    g.quadraticCurveTo(2.2, -2.2, mid * 0.78, 0);
    g.quadraticCurveTo(2.2, 2.2, 0, mid * 0.78);
    g.quadraticCurveTo(-2.2, 2.2, -mid * 0.78, 0);
    g.quadraticCurveTo(-2.2, -2.2, 0, -mid * 0.78);
    g.fill();
  }
  g.restore();

  glitterSprites.set(hue, c);
  return c;
};

const glyphSprites = new Map<string, HTMLCanvasElement>();
const getGlyphSprite = (text: string, hue: number, size: number) => {
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
  turns = rand(0.5, 1.4) * (Math.random() < 0.5 ? -1 : 1);
  spin = rand(0.12, 0.38) * (Math.random() < 0.5 ? -1 : 1);
  rot = rand(0, TAU);
  rotSpeed = rand(-0.003, 0.003);
  off = rand(-1, 1);
  text = "";
  blinkRate = 2;

  constructor(public kind: Kind, glyphs: string[]) {
    this.depth = rand(0.68, 1.35);

    if (kind === "puff") {
      this.hue = pick(SMOKE_HUES);
      this.size = rand(0.85, 1.35) * this.depth;
      this.baseAlpha = rand(0.08, 0.17);
      this.maxLife = rand(480, 660);
    } else if (kind === "wisp") {
      this.hue = pick(SMOKE_HUES);
      this.size = rand(0.75, 1.3) * this.depth;
      this.baseAlpha = rand(0.14, 0.28);
      this.maxLife = rand(460, 620);
    } else if (kind === "glyph") {
      this.text = pick(glyphs);
      this.hue = pick([280, 290, 220, 270]);
      this.size = rand(11, 17);
      this.baseAlpha = rand(0.75, 0.95);
      this.blinkRate = rand(1.2, 2.6);
      this.maxLife = rand(450, 600);
    } else {
      this.hue = pick(GLITTER_HUES);
      this.size = rand(1.1, 2.8) * this.depth;
      this.baseAlpha = rand(0.85, 1);
      this.blinkRate = rand(2.5, 5.5);
      this.maxLife = rand(450, 650);
    }
  }

  update(t: number, dt: number, wind: Wind, path: Path, k: number) {
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

    const chaos = smooth(0.16, 0.45, u);

    let offN = 0;
    let offT = 0;
    if (this.kind === "puff" || this.kind === "wisp") {
      const spread = (this.kind === "puff" ? 4 + 58 * chaos : 3 + 34 * chaos) * this.depth;
      const r = this.rad * k * spread;
      const th = this.th0 + TAU * this.turns * u + t * this.spin;
      const randWave =
        Math.sin(t * 0.85 + this.seed + u * 6) * k * 14 * chaos +
        Math.cos(t * 0.55 + this.seed * 1.4) * k * 10 * chaos;
      offN = Math.cos(th) * r + randWave;
      offT = Math.sin(th) * r * 0.75;
    } else if (this.kind === "glyph") {
      offN = this.off * k * (6 + 44 * chaos) + Math.sin(t * 0.8 + this.seed) * k * 8 * chaos;
    } else {
      offN =
        this.off * k * (8 + 68 * chaos) * this.depth +
        Math.sin(t * 0.9 + this.seed) * k * 12 * chaos;
      offT = Math.cos(t * 0.7 + this.seed) * k * 10 * chaos;
    }

    if (wind.power > 0.01) {
      const ddx = px - wind.px;
      const ddy = py - wind.py;
      const d2 = ddx * ddx + ddy * ddy;
      if (d2 < 160 * 160) {
        const fo = (1 - Math.sqrt(d2) / 160) * wind.power;
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
      wx = Math.sin(t * 0.65 + this.seed) * k * 10 * chaos;
      wy = Math.cos(t * 0.55 + this.seed * 1.7) * k * 10 * chaos;
    }

    this.x = px + nx * offN + tx * offT + this.dx + wx;
    this.y = py + ny * offN + ty * offT + this.dy + wy;
    this.rot += this.rotSpeed * dt;

    const env = smooth(0, 0.08, u) * (1 - smooth(0.62, 1, u));
    this.alpha = this.baseAlpha * env;

    if (this.kind === "spark") {
      const twinkle = 0.5 + 0.5 * Math.sin(t * this.blinkRate + this.seed);
      this.alpha *= 0.1 + 0.9 * Math.pow(twinkle, 3);
    } else if (this.kind === "glyph") {
      const b = 0.5 + 0.5 * Math.sin(t * this.blinkRate + this.seed);
      this.alpha *= 0.15 + 0.85 * b * b;
    }
  }

  draw(ctx: CanvasRenderingContext2D, k: number) {
    if (this.alpha <= 0.003) return;
    const u = this.u;

    if (this.kind === "puff" || this.kind === "wisp") {
      const s =
        this.kind === "puff"
          ? k * (13 + 46 * u) * this.size
          : k * (6 + 18 * u) * this.size;
      ctx.globalAlpha = Math.min(1, this.alpha);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.drawImage(getNoiseSprite(this.hue, this.variant), -s, -s, s * 2, s * 2);
      ctx.restore();
    } else if (this.kind === "spark") {
      const pulse = 0.85 + 0.35 * Math.sin(this.rot * 25 + this.seed);
      const s = this.size * 3.8 * pulse;
      ctx.globalAlpha = Math.min(1, this.alpha);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot * 4);
      ctx.drawImage(getGlitterSprite(this.hue), -s, -s, s * 2, s * 2);
      ctx.restore();
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
  originX = 0.25,
  originY = 0.35,
  glyphs = DEFAULT_GLYPHS,
  direction = "right",
  spiral = "straight-drop",
  drift = 1,
  speed = 0.55,
  showGlyphs = false,
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
    const MAX = reduced ? 300 : 2500;
    const rate = reduced ? 0.3 : 1;
    const reach = Math.max(0.3, drift);
    const sgn = direction === "left" ? -1 : 1;
    const ctrl =
      spiral === "straight-drop"
        ? CTRL_STRAIGHT_DROP
        : spiral === "down"
        ? CTRL_DOWN
        : spiral === "under"
        ? CTRL_UNDER
        : CTRL_OVER;

    const ext = {
      up: Math.max(20, -Math.min(...ctrl.map((c) => c[1]))),
      down: Math.max(20, ...ctrl.map((c) => c[1])),
      fwd: Math.max(...ctrl.map((c) => c[0])),
      back: Math.max(0, -Math.min(...ctrl.map((c) => c[0]))),
    };

    let w = 0;
    let h = 0;
    let k = 1;
    let path: Path = buildPath(0, 0, 1, sgn, reach, ctrl);
    let raf = 0;
    let particles: Particle[] = [];
    let t = 0;
    let last = performance.now();
    const acc = { puff: 0, wisp: 0, glyph: 0, spark: 0 };
    const wind: Wind = { x: 0, y: 0, px: -999, py: -999, power: 0 };

    for (const hue of SMOKE_HUES) for (let v = 0; v < 3; v++) getNoiseSprite(hue, v);
    for (const gh of GLITTER_HUES) getGlitterSprite(gh);

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
      const limits = [h / 478, (fwdAvail * 0.96) / (ext.fwd * reach)];
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
    const tm = (e: TouchEvent) => onMove(e.touches[0].clientX, e.touches[0].clientY);
    window.addEventListener("mousemove", mm);
    window.addEventListener("touchmove", tm, { passive: true });

    const emit = (kind: Kind) => {
      if (particles.length < MAX) particles.push(new Particle(kind, glyphs));
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 16.667, 3) * speed;
      last = now;
      t += dt / 60;

      ctx.clearRect(0, 0, w, h);

      acc.puff += dt * 1.45 * rate;
      acc.wisp += dt * 1.65 * rate;
      if (showGlyphs) acc.glyph += dt * 0.14 * rate;
      acc.spark += dt * 0.95 * rate;

      while (acc.puff >= 1) { acc.puff--; emit("puff"); }
      while (acc.wisp >= 1) { acc.wisp--; emit("wisp"); }
      while (acc.glyph >= 1) { acc.glyph--; emit("glyph"); }
      while (acc.spark >= 1) { acc.spark--; emit("spark"); }

      for (let i = 0; i < particles.length; i++) particles[i].update(t, dt, wind, path, k);
      particles = particles.filter((p) => p.u < 1);

      ctx.globalCompositeOperation = "screen";
      for (const p of particles) if (p.kind === "puff") p.draw(ctx, k);
      for (const p of particles) if (p.kind === "wisp") p.draw(ctx, k);

      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) if (p.kind === "glyph") p.draw(ctx, k);
      for (const p of particles) if (p.kind === "spark") p.draw(ctx, k);

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
