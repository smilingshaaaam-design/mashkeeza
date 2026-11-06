"use client";

import React, { useEffect, useRef } from "react";

const DEFAULT_GLYPHS = [
  "الرَّحْمَٰنُ", "الرَّحِيمُ", "الْمَلِكُ", "الْقُدُّوسُ", "السَّلَامُ",
  "النُّورُ", "الْهَادِي", "الْبَاقِي", "الْحَيُّ", "الْقَيُّومُ",
  "الم", "يس", "طه", "حم", "ق", "ن",
  "ا", "ب", "ج", "د", "ه", "و",
  "☉", "☽", "☿", "♀", "♂", "♃", "♄",
];

// Golden aur blue colors ka mix
const SMOKE_HUES = [44, 40, 46, 205, 215, 222];

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
  speed?: number;
}

type Path = { x: Float32Array; y: Float32Array; nx: Float32Array; ny: Float32Array };

// Agarbatti / Lamp ka specific tightly curled rasta
const CTRL_DOWN: [number, number][] = [
  [0, 0], [-25, 30], [-60, 70], [-92, 120], [-60, 150], [-15, 128],
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
    nx[j] = -ty / l; ny[j] = tx / l;
  }
  return { x, y, nx, ny };
}

const makeCanvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
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
    f *= 2; a *= 0.5;
  }
  return v;
};

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0]; else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x]; else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c]; else [r, g, b] = [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
};

const noiseSprites = new Map<string, HTMLCanvasElement>();
const getNoiseSprite = (hue: number, variant: number) => {
  const key = `${hue}|${variant}`;
  if (noiseSprites.has(key)) return noiseSprites.get(key)!;
  const S = 128;
  const c = makeCanvas(S, S); const g = c.getContext("2d")!;
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
      const [R, G, B] = hslToRgb(hue + (n - 0.5) * 34, 88, 50 + 30 * n);
      const i = (py * S + px) * 4;
      img.data[i] = R; img.data[i + 1] = G; img.data[i + 2] = B; img.data[i + 3] = a * 255;
    }
  }
  g.putImageData(img, 0, 0);
  noiseSprites.set(key, c); return c;
};

const getGlyphSprite = (text: string, hue: number, size: number) => {
  const px = Math.round(size); const SC = 2;
  const c = makeCanvas(px * SC * 4, px * SC * 3); const g = c.getContext("2d")!;
  g.font = `${px * SC}px "Amiri","Noto Naskh Arabic",serif`;
  g.textAlign = "center"; g.textBaseline = "middle";
  g.shadowColor = `hsla(${hue},100%,80%,1)`; g.shadowBlur = 16 * SC;
  g.fillStyle = `hsla(${hue},100%,96%,1)`;
  g.fillText(text, c.width / 2, c.height / 2); return c;
};

type Kind = "puff" | "glyph";

class SmokeParticle {
  x = 0; y = 0;
  u = 0; 
  alpha = 0; baseAlpha: number;
  maxLife: number;
  size: number; hue: number;
  variant = Math.floor(rand(0, 3));
  seed = rand(0, 1000);
  // Tight radius for incense look
  rad = rand(0.01, 0.2); 
  th0 = rand(0, TAU);
  spin = rand(0.1, 0.25) * (Math.random() < 0.5 ? -1 : 1);
  rot = rand(0, TAU); rotSpeed = rand(-0.005, 0.005);
  text = ""; blinkRate = 2;

  constructor(public kind: Kind, glyphs: string[]) {
    if (kind === "puff") {
      this.hue = pick(SMOKE_HUES);
      this.size = rand(0.6, 1.2); 
      // Base alpha heavily reduced to fix white screen
      this.baseAlpha = rand(0.01, 0.04); 
      this.maxLife = rand(350, 450);
    } else {
      this.text = pick(glyphs);
      this.hue = pick([44, 48, 205]);
      this.size = rand(10, 16); 
      this.baseAlpha = rand(0.7, 1);
      this.blinkRate = rand(1.5, 3);
      this.maxLife = rand(400, 500);
    }
  }

  update(t: number, dt: number, path: Path, k: number) {
    this.u += (dt / this.maxLife) * 0.7; // Slowed down for elegant movement
    const u = this.u;
    if (u >= 1) return;

    const idx = u * (N - 1);
    const i = Math.floor(idx);
    const f = idx - i;
    const j = Math.min(N - 1, i + 1);
    
    // Follow the path strictly
    const px = path.x[i] + (path.x[j] - path.x[i]) * f;
    const py = path.y[i] + (path.y[j] - path.y[i]) * f;
    const nx = path.nx[i] + (path.nx[j] - path.nx[i]) * f;
    const ny = path.ny[i] + (path.ny[j] - path.ny[i]) * f;

    let offN = 0;
    
    if (this.kind === "puff") {
      // Very tight spread (doesn't scatter)
      const spread = 2 + 15 * u; 
      const r = this.rad * k * spread;
      const th = this.th0 + t * this.spin;
      // Wavy sine motion for 3D twist effect instead of random scatter
      offN = Math.cos(th) * r + Math.sin(t * 0.8 + this.seed + u * 8) * k * 4;
    } else {
      offN = Math.sin(t * 0.6 + this.seed) * k * (5 + 10 * u);
    }

    this.x = px + nx * offN;
    this.y = py + ny * offN - (u * 20); // slight extra upward drift
    this.rot += this.rotSpeed * dt;

    // Fade in and out smoothly
    const env = smooth(0, 0.1, u) * (1 - smooth(0.7, 1, u));
    this.alpha = this.baseAlpha * env;

    if (this.kind === "glyph") {
      const b = 0.5 + 0.5 * Math.sin(t * this.blinkRate + this.seed);
      this.alpha *= 0.2 + 0.8 * b * b;
    }
  }

  draw(ctx: CanvasRenderingContext2D, k: number) {
    if (this.alpha <= 0.002) return;
    const u = this.u;

    if (this.kind === "puff") {
      // Keeps size relatively stable so it doesn't blow out
      const s = k * (15 + 25 * u) * this.size;
      ctx.globalAlpha = Math.min(1, this.alpha);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.drawImage(getNoiseSprite(this.hue, this.variant), -s, -s, s * 2, s * 2);
      ctx.restore();
    } else {
      ctx.globalAlpha = Math.min(1, this.alpha);
      const sp = getGlyphSprite(this.text, this.hue, this.size);
      const w = sp.width / 2; const h = sp.height / 2;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(Math.sin(this.rot * 15) * 0.1);
      ctx.drawImage(sp, -w / 2, -h / 2, w, h);
      ctx.restore();
    }
  }
}

export function MagicalSmoke({
  originX = 0.76,
  originY = 0.64,
  glyphs = DEFAULT_GLYPHS,
  direction = "left",
  speed = 1,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const MAX = 800; // Controlled particle count
    const sgn = direction === "left" ? -1 : 1;
    
    let w = 0, h = 0, k = 1;
    let path = buildPath(0, 0, 1, sgn, 1, CTRL_DOWN);
    let raf = 0, t = 0, last = performance.now();
    let particles: SmokeParticle[] = [];
    const acc = { puff: 0, glyph: 0 };

    for (const hue of SMOKE_HUES) for (let v = 0; v < 3; v++) getNoiseSprite(hue, v);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth; h = parent.clientHeight || 450;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const ox = w * originX; const oy = h * originY;
      const fwdAvail = direction === "left" ? ox : w - ox;
      
      const limits = [h / 478, (fwdAvail * 0.96) / (460 * 1), (oy * 0.97) / 250];
      k = Math.max(0.35, Math.min(...limits));
      path = buildPath(ox, oy, k, sgn, 1, CTRL_DOWN);
    };
    resize();
    window.addEventListener("resize", resize);

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 16.667, 3) * speed;
      last = now; t += dt / 60;
      ctx.clearRect(0, 0, w, h);

      // Smooth emission rate
      acc.puff += dt * 1.5;
      acc.glyph += dt * 0.1;
      
      while (acc.puff >= 1) { 
        acc.puff--; 
        if (particles.length < MAX) particles.push(new SmokeParticle("puff", glyphs)); 
      }
      while (acc.glyph >= 1) { 
        acc.glyph--; 
        if (particles.length < MAX) particles.push(new SmokeParticle("glyph", glyphs)); 
      }

      for (let i = 0; i < particles.length; i++) particles[i].update(t, dt, path, k);
      particles = particles.filter((p) => p.u < 1);

      // Draw Base Smoke
      ctx.globalCompositeOperation = "screen";
      for (const p of particles) if (p.kind === "puff") p.draw(ctx, k);
      
      // Draw Glowing Glyphs
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) if (p.kind === "glyph") p.draw(ctx, k);
      
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      particles = [];
    };
  }, [originX, originY, glyphs, direction, speed]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20" aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full mix-blend-screen opacity-95" />
    </div>
  );
}

export const PaintedSmoke = MagicalSmoke;
export default MagicalSmoke;
