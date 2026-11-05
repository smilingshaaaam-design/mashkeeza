"use client";

import React, { useEffect, useRef } from "react";

/**
 * MagicalSmoke - genie-lamp style ribbon smoke
 *
 * Video se copy kiya hua behaviour:
 *  1. Dhuan nali (origin) se uthta hai aur pehle ek gol curl banata hai
 *  2. Phir ek lamba, patla S-shape ribbon ban kar door tak behta hai
 *  3. Ribbon mein kai patli strands hain: golden core + neela glow kinare par
 *  4. Chhote, patle haroof ribbon ke aas paas tairte hain, saath mein twinkle karte sitare
 *  5. Poori motion bahut dheemi aur lehrati hui hai
 *
 * Props:
 *  originX / originY : nali ki position (canvas ke relative, 0-1)
 *  direction         : "left" (default) = ribbon left ki taraf behta hai, "right" = video jaisa seedha
 *  drift             : ribbon kitni door tak jaye (1 = normal, 1.3 = zyada lamba)
 *  speed             : 1 = video jaisi dheemi speed, 0.7 = aur dheemi, 1.4 = tez
 *  glyphs            : apne haroof
 */

const DEFAULT_GLYPHS = [
  "الرَّحْمَٰنُ", "الرَّحِيمُ", "الْمَلِكُ", "الْقُدُّوسُ", "السَّلَامُ",
  "النُّورُ", "الْهَادِي", "الْبَاقِي", "الْحَيُّ", "الْقَيُّومُ",
  "الم", "يس", "طه", "حم", "ق", "ن",
  "ا", "ب", "ج", "د", "ه", "و",
  "☉", "☽", "☿", "♀", "♂", "♃", "♄",
];

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
  drift?: number;
  speed?: number;
}

type Kind = "strand" | "haze" | "glyph" | "spark";
type Wind = { x: number; y: number; px: number; py: number; power: number };
type Path = { x: Float32Array; y: Float32Array; nx: Float32Array; ny: Float32Array };

/* ---------- Ribbon ka rasta (video ke frame se naapa hua) ---------- */
// (dx, dy) nali se, video pixels mein; dy negative = upar
const CTRL: [number, number][] = [
  [0, 0], [-45, -35], [-80, -75], [-80, -125], [-45, -165], [5, -178],
  [55, -150], [75, -105], [100, -85], [160, -85], [220, -120], [280, -165],
  [350, -190], [420, -225], [460, -250],
];
const N = 220;

function buildPath(ox: number, oy: number, k: number, sgn: number, reach: number): Path {
  const pts = CTRL.map(([dx, dy]) => [ox + sgn * dx * k * reach, oy + dy * k]);
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

  const len = [0];
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

/* ---------- Sprite caches (ek baar banao, baar baar draw karo) ---------- */

const makeCanvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
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

const sparkSprites = new Map<number, HTMLCanvasElement>();
const getSparkSprite = (hue: number) => {
  let c = sparkSprites.get(hue);
  if (c) return c;
  const S = 48;
  c = makeCanvas(S, S);
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  gr.addColorStop(0, `hsla(${hue},100%,95%,1)`);
  gr.addColorStop(0.2, `hsla(${hue},100%,80%,0.8)`);
  gr.addColorStop(1, `hsla(${hue},100%,60%,0)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, S, S);
  sparkSprites.set(hue, c);
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
  g.shadowColor = `hsla(${hue},100%,70%,1)`;
  g.shadowBlur = 10 * SC;
  g.fillStyle = `hsla(${hue},100%,88%,1)`;
  g.fillText(text, c.width / 2, c.height / 2);
  glyphSprites.set(key, c);
  return c;
};

/* ---------- Particle ---------- */

class Particle {
  x = 0;
  y = 0;
  u = 0; // ribbon par position: 0 = nali, 1 = ribbon ka end
  dx = 0; // mouse se dhakka (dheere wapas aata hai)
  dy = 0;
  alpha = 0;
  baseAlpha: number;
  maxLife: number;
  size: number;
  hue: number;
  light = 70;
  seed = rand(0, 1000);
  strand = 0;
  ampMul = 1;
  freq = 2;
  phase = 0;
  jit = rand(-1, 1);
  off = rand(-1, 1);
  rot = rand(0, TAU);
  text = "";

  constructor(public kind: Kind, glyphs: string[]) {
    if (kind === "strand") {
      this.strand = Math.floor(rand(0, 6));
      const blue = this.strand >= 4;
      this.hue = blue ? rand(205, 220) : rand(38, 50);
      this.light = blue ? 72 : rand(66, 80);
      this.ampMul = blue ? 1.35 + (this.strand - 4) * 0.3 : 0.55 + this.strand * 0.2;
      this.freq = 1.8 + this.strand * 0.28;
      this.phase = this.strand * 1.7;
      this.size = rand(0.8, 1.3);
      this.baseAlpha = blue ? rand(0.12, 0.26) : rand(0.2, 0.42);
      this.maxLife = rand(380, 520);
    } else if (kind === "haze") {
      const blue = Math.random() < 0.45;
      this.hue = blue ? 212 : 45;
      this.light = blue ? 66 : 72;
      this.size = rand(0.8, 1.3);
      this.baseAlpha = rand(0.04, 0.09);
      this.maxLife = rand(380, 520);
    } else if (kind === "glyph") {
      this.text = pick(glyphs);
      this.hue = Math.random() < 0.65 ? 44 : 205;
      this.size = rand(9, 16);
      this.baseAlpha = rand(0.55, 0.9);
      this.maxLife = rand(380, 520);
    } else {
      this.hue = pick([44, 48, 205, 215]);
      this.size = rand(0.8, 2.2);
      this.baseAlpha = rand(0.7, 1);
      this.maxLife = rand(380, 560);
    }
  }

  update(t: number, dt: number, wind: Wind, path: Path, k: number) {
    this.u += (dt / this.maxLife) * (this.kind === "spark" ? 0.8 : 1);
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

    let lat = 0;
    if (this.kind === "strand") {
      // har strand ek behti hui lehar: ribbon mein bal aur patli lehrein banati hai
      const A = k * (4 + 38 * Math.pow(u, 0.8)) * this.ampMul;
      lat =
        A * Math.sin(TAU * this.freq * u - t * 1.4 + this.phase) +
        A * 0.3 * Math.sin(TAU * this.freq * 2.3 * u - t * 1.9 + this.phase * 1.3) +
        this.jit * k * 1.6;
    } else if (this.kind === "haze") {
      lat = this.off * k * (6 + 34 * u) + Math.sin(t * 0.8 + this.seed) * k * 4;
    } else if (this.kind === "glyph") {
      lat = this.off * k * (8 + 44 * u) + Math.sin(t * 0.9 + this.seed) * k * 6;
    } else {
      lat = this.off * k * (10 + 62 * u) + Math.sin(t * 0.7 + this.seed) * k * 5;
    }

    // mouse wind: dhakka lagta hai, phir ribbon wapas apni jagah le leta hai
    if (wind.power > 0.01) {
      const ddx = px - wind.px;
      const ddy = py - wind.py;
      const d2 = ddx * ddx + ddy * ddy;
      if (d2 < 160 * 160) {
        const fo = (1 - Math.sqrt(d2) / 160) * wind.power;
        this.dx += wind.x * fo * 0.35 * dt;
        this.dy += wind.y * fo * 0.35 * dt;
      }
    }
    const relax = Math.pow(0.97, dt);
    this.dx *= relax;
    this.dy *= relax;

    this.x = px + nx * lat + this.dx;
    this.y = py + ny * lat + this.dy;
    this.rot += 0.004 * dt;

    const env = smooth(0, 0.08, u) * (1 - smooth(0.7, 1, u));
    this.alpha = this.baseAlpha * env;
    if (this.kind === "glyph") this.alpha *= 0.75 + 0.25 * Math.sin(t * 3 + this.seed);
    if (this.kind === "spark") this.alpha *= 0.3 + Math.abs(Math.sin(t * 4 + this.seed)) * 0.7;
  }

  draw(ctx: CanvasRenderingContext2D, k: number, u: number) {
    if (this.alpha <= 0.003) return;
    ctx.globalAlpha = Math.min(1, this.alpha);

    if (this.kind === "strand") {
      const s = k * (3.2 + 3.5 * u) * this.size;
      ctx.drawImage(getSoftSprite(Math.round(this.hue), Math.round(this.light)), this.x - s, this.y - s, s * 2, s * 2);
    } else if (this.kind === "haze") {
      const s = k * (16 + 26 * u) * this.size;
      ctx.drawImage(getSoftSprite(this.hue, this.light), this.x - s, this.y - s, s * 2, s * 2);
    } else if (this.kind === "spark") {
      const s = this.size * 3.2;
      ctx.drawImage(getSparkSprite(this.hue), this.x - s, this.y - s, s * 2, s * 2);
    } else {
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
  drift = 1,
  speed = 1,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const MAX = reduced ? 300 : 2000;
    const rate = reduced ? 0.3 : 1;
    const reach = Math.max(0.3, drift);
    const sgn = direction === "left" ? -1 : 1;

    let w = 0;
    let h = 0;
    let k = 1;
    let path: Path = buildPath(0, 0, 1, sgn, reach);
    let raf = 0;
    let particles: Particle[] = [];
    let t = 0;
    let last = performance.now();
    const acc = { strand: 0, haze: 0, glyph: 0, spark: 0 };
    const wind: Wind = { x: 0, y: 0, px: -999, py: -999, power: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight || 450;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const ox = w * originX;
      const oy = h * originY;
      const avail = direction === "left" ? ox : w - ox;
      k = Math.max(0.35, Math.min(h / 478, (avail * 0.96) / (460 * reach), (oy * 0.97) / 255));
      path = buildPath(ox, oy, k, sgn, reach);
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

    const order: Kind[] = ["haze", "strand", "glyph", "spark"];

    const frame = (now: number) => {
      // dt = 1 matlab 60fps ka ek frame
      const dt = Math.min((now - last) / 16.667, 3) * speed;
      last = now;
      t += (dt / 60);

      ctx.clearRect(0, 0, w, h);

      acc.strand += dt * 2.2 * rate;
      acc.haze += dt * 0.5 * rate;
      acc.glyph += dt * 0.07 * rate;
      acc.spark += dt * 0.3 * rate;
      while (acc.strand >= 1) { acc.strand--; emit("strand"); }
      while (acc.haze >= 1) { acc.haze--; emit("haze"); }
      while (acc.glyph >= 1) { acc.glyph--; emit("glyph"); }
      while (acc.spark >= 1) { acc.spark--; emit("spark"); }

      for (let i = 0; i < particles.length; i++) particles[i].update(t, dt, wind, path, k);
      particles = particles.filter((p) => p.u < 1);

      ctx.globalCompositeOperation = "lighter";
      for (const kind of order) {
        for (const p of particles) if (p.kind === kind) p.draw(ctx, k, p.u);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

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
  }, [originX, originY, glyphs, direction, drift, speed]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20" aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full mix-blend-screen opacity-95" />
    </div>
  );
}

// Purane import ke liye alias: app/page.tsx mein { PaintedSmoke } chalta rahega
export const PaintedSmoke = MagicalSmoke;

export default MagicalSmoke;
