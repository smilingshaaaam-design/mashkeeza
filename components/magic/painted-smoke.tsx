"use client";

import React, { useEffect, useRef } from "react";

const DEFAULT_GLYPHS = [
  "الرَّحْمَٰنُ", "الرَّحِيمُ", "الْمَلِكُ", "الْقُدُّوسُ", "السَّلَامُ",
  "النُّورُ", "الْهَادِي", "الْبَاقِي", "الْحَيُّ", "الْقَيُّومُ",
  "الم", "يس", "طه", "حم", "ق", "ن",
  "ا", "ب", "ج", "د", "ه", "و",
  "☉", "☽", "☿", "♀", "♂", "♃", "♄",
];

const SMOKE_HUES = [44, 40, 46, 275, 282, 268, 292, 215, 222, 205, 232];
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

type Kind = "puff" | "wisp" | "glyph" | "spark" | "halo";

// --- NOISE & TEXTURE GEN ---
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

// CURL NOISE (Fluid Dynamics Simulation)
// Ye divergence-free noise field banata hai jisse dhuan aapas mein fluid ki tarah ghoomta hai
const getCurl = (x: number, y: number, t: number, seed: number) => {
  const eps = 0.1;
  const n1 = fbm(x, y + eps, seed + t);
  const n2 = fbm(x, y - eps, seed + t);
  const n3 = fbm(x + eps, y, seed + t);
  const n4 = fbm(x - eps, y, seed + t);
  return {
    vx: (n1 - n2) / (2 * eps),
    vy: -(n3 - n4) / (2 * eps)
  };
};

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
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

// Caching Sprites for Performance
const noiseSprites = new Map<string, HTMLCanvasElement>();
const getNoiseSprite = (hue: number, variant: number) => {
  const key = `${hue}|${variant}`;
  if (noiseSprites.has(key)) return noiseSprites.get(key)!;
  const S = 128;
  const c = makeCanvas(S, S);
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
      const [R, G, B] = hslToRgb(hue + (n - 0.5) * 34, 88, 50 + 30 * n);
      const i = (py * S + px) * 4;
      img.data[i] = R; img.data[i + 1] = G; img.data[i + 2] = B; img.data[i + 3] = a * 255;
    }
  }
  g.putImageData(img, 0, 0);
  noiseSprites.set(key, c);
  return c;
};

const getSoftSprite = (hue: number, light: number) => {
  const S = 96; const c = makeCanvas(S, S); const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(S/2, S/2, 0, S/2, S/2, S/2);
  gr.addColorStop(0, `hsla(${hue},95%,${light}%,0.95)`);
  gr.addColorStop(0.35, `hsla(${hue},90%,${light - 14}%,0.40)`);
  gr.addColorStop(1, `hsla(${hue},80%,50%,0)`);
  g.fillStyle = gr; g.fillRect(0, 0, S, S); return c;
};

const getGlyphSprite = (text: string, hue: number, size: number) => {
  const px = Math.round(size); const SC = 2; const pad = 16;
  const c = makeCanvas(px * SC * 4, px * SC * 3); const g = c.getContext("2d")!;
  g.font = `${px * SC}px "Amiri","Noto Naskh Arabic",serif`;
  g.textAlign = "center"; g.textBaseline = "middle";
  g.shadowColor = `hsla(${hue},100%,80%,1)`; g.shadowBlur = 24 * SC;
  g.fillStyle = `hsla(${hue},100%,96%,1)`;
  g.fillText(text, c.width / 2, c.height / 2); return c;
};

// --- FLUID PARTICLE SYSTEM ---
class FluidParticle {
  x: number; y: number;
  vx: number; vy: number; // Velocity vectors for physics
  life = 0; maxLife: number;
  alpha = 0; baseAlpha: number;
  size: number; hue: number; variant = Math.floor(rand(0, 3));
  seed = rand(0, 1000);
  rot = rand(0, TAU); rotSpeed = rand(-0.02, 0.02);
  text = ""; blinkRate = 2;

  constructor(public kind: Kind, glyphs: string[], ox: number, oy: number, dir: number) {
    this.x = ox + rand(-10, 10);
    this.y = oy + rand(-10, 10);
    
    // Nali (spout) se nikalne ka force (Cinematic thrust)
    this.vx = (rand(1.5, 4.5) * dir) + rand(-0.5, 0.5);
    this.vy = rand(-2, 1); 

    if (kind === "puff") {
      this.hue = pick(SMOKE_HUES); this.size = rand(0.5, 1.5);
      this.baseAlpha = rand(0.04, 0.12); this.maxLife = rand(300, 500);
    } else if (kind === "halo") {
      this.hue = pick(SMOKE_HUES); this.size = rand(2, 4);
      this.baseAlpha = rand(0.02, 0.05); this.maxLife = rand(300, 500);
    } else if (kind === "glyph") {
      this.text = pick(glyphs); this.hue = pick([44, 48, 205]);
      this.size = rand(12, 18); this.baseAlpha = rand(0.8, 1);
      this.blinkRate = rand(1.2, 3); this.maxLife = rand(350, 600);
    } else {
      this.hue = pick(SMOKE_HUES); this.size = rand(0.5, 1.5);
      this.baseAlpha = rand(0.1, 0.2); this.maxLife = rand(300, 500);
    }
  }

  update(t: number, dt: number, dir: number) {
    this.life += dt;
    const progress = this.life / this.maxLife;
    if (progress >= 1) return;

    // 1. Curl Noise / Fluid Force
    const noiseScale = 0.003;
    const timeScale = t * 0.2;
    const curl = getCurl(this.x * noiseScale, this.y * noiseScale, timeScale, this.seed);
    
    // Turbulence force multiplier based on life (grows as it spreads)
    const turbulence = 1.5 + (progress * 4);

    // 2. Base Buoyancy (Dhuan hamesha thoda upar uthta hai)
    const buoyancy = -0.5 - (progress * 1.5);

    // 3. Guiding cinematic flow (Aage ki taraf dhakelna)
    const guideX = (0.5 * dir);

    // Apply forces to velocity
    this.vx += (curl.vx * turbulence + guideX) * dt * 0.05;
    this.vy += (curl.vy * turbulence + buoyancy) * dt * 0.05;

    // Apply drag/friction (Fluid resistance)
    this.vx *= 0.96;
    this.vy *= 0.96;

    // Update position
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.rot += this.rotSpeed * dt;

    // Scale over time for thick volume
    if (this.kind === "puff" || this.kind === "halo" || this.kind === "wisp") {
        this.size += dt * 0.02;
    }

    // Alpha lifecycle (Fade in, hold, fade out)
    const env = smooth(0, 0.15, progress) * (1 - smooth(0.6, 1, progress));
    this.alpha = this.baseAlpha * env;

    if (this.kind === "glyph") {
      const b = 0.5 + 0.5 * Math.sin(t * this.blinkRate + this.seed);
      this.alpha *= 0.2 + 0.8 * b * b;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0.005) return;
    
    if (this.kind === "puff" || this.kind === "wisp") {
      const s = 60 * this.size;
      ctx.globalAlpha = Math.min(1, this.alpha);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.drawImage(getNoiseSprite(this.hue, this.variant), -s, -s, s * 2, s * 2);
      ctx.restore();
    } else if (this.kind === "halo") {
      const r = 80 * this.size;
      ctx.globalAlpha = Math.min(1, this.alpha);
      ctx.drawImage(getSoftSprite(this.hue, 60), this.x - r, this.y - r, r * 2, r * 2);
    } else if (this.kind === "glyph") {
      const r = this.size * 3.5;
      ctx.globalAlpha = Math.min(1, this.alpha * 0.5);
      ctx.drawImage(getSoftSprite(this.hue, 85), this.x - r, this.y - r, r * 2, r * 2);
      
      ctx.globalAlpha = Math.min(1, this.alpha);
      const sp = getGlyphSprite(this.text, this.hue, this.size);
      const w = sp.width / 2; const h = sp.height / 2;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(Math.sin(this.rot * 20) * 0.15);
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

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const MAX = reduced ? 300 : 1500;
    const rate = reduced ? 0.3 : 1;
    const sgn = direction === "left" ? -1 : 1;
    
    let w = 0, h = 0;
    let ox = 0, oy = 0;
    let particles: FluidParticle[] = [];
    let raf = 0, t = 0, last = performance.now();
    const acc = { puff: 0, wisp: 0, halo: 0, glyph: 0 };

    for (const hue of SMOKE_HUES) for (let v = 0; v < 3; v++) getNoiseSprite(hue, v);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth; h = parent.clientHeight || 450;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ox = w * originX;
      oy = h * originY;
    };
    resize();
    window.addEventListener("resize", resize);

    const emit = (kind: Kind) => {
      if (particles.length < MAX) particles.push(new FluidParticle(kind, glyphs, ox, oy, sgn));
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 16.667, 3) * speed;
      last = now; t += dt / 60;
      ctx.clearRect(0, 0, w, h);

      // Smooth stream emission
      acc.puff += dt * 3.5 * rate;
      acc.wisp += dt * 1.5 * rate;
      acc.halo += dt * 0.8 * rate; 
      acc.glyph += dt * 0.15 * rate;
      
      while (acc.puff >= 1) { acc.puff--; emit("puff"); }
      while (acc.wisp >= 1) { acc.wisp--; emit("wisp"); }
      while (acc.halo >= 1) { acc.halo--; emit("halo"); }
      while (acc.glyph >= 1) { acc.glyph--; emit("glyph"); }

      for (let i = 0; i < particles.length; i++) particles[i].update(t, dt, sgn);
      particles = particles.filter((p) => (p.life / p.maxLife) < 1);

      // Rendering Passes
      ctx.globalCompositeOperation = "screen";
      for (const p of particles) if (p.kind === "halo") p.draw(ctx);
      
      ctx.globalCompositeOperation = "screen";
      for (const p of particles) if (p.kind === "puff") p.draw(ctx);
      for (const p of particles) if (p.kind === "wisp") p.draw(ctx);
      
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) if (p.kind === "glyph") p.draw(ctx);
      
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

export default MagicalSmoke;
