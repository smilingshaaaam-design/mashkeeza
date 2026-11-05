"use client";

import React, { useEffect, useRef } from "react";

/**
 * MagicalSmoke
 * - Ek hi source point se upar uthta dhuan (incense-style) with soft swirl
 * - Arabic glyphs (Asma, Muqatta'at, Abjad) + planet symbols smoke ke saath behte hain
 * - Mouse/touch se smoke halka sa dhakelta hai (wind effect)
 * - prefers-reduced-motion respect karta hai
 *
 * Props:
 *  originX / originY : emission point (0-1, canvas ke relative)
 *  glyphs            : apne text/symbols pass kar sakte ho
 */

const DEFAULT_GLYPHS = [
  "الرَّحْمَٰنُ", "الرَّحِيمُ", "الْمَلِكُ", "الْقُدُّوسُ", "السَّلَامُ",
  "النُّورُ", "الْهَادِي", "الْبَاقِي", "الْحَيُّ", "الْقَيُّومُ",
  "الم", "يس", "طه", "حم", "ق", "ن",
  "ا", "ب", "ج", "د", "ه", "و",
  "☉", "☽", "☿", "♀", "♂", "♃", "♄",
];

const PALETTE = [275, 285, 225, 188, 44]; // violet, indigo, cyan, gold

const rand = (a: number, b: number) => Math.random() * (b - a) + a;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

interface Props {
  originX?: number;
  originY?: number;
  glyphs?: string[];
  /** Left ki taraf kitna bahe: 0 = seedha upar, 1 = normal, 2 = bahut tez */
  drift?: number;
}

type Kind = "smoke" | "glyph" | "spark";

class Particle {
  x: number;
  y: number;
  vx = 0;
  vy: number;
  size: number;
  alpha = 0;
  baseAlpha: number;
  life = 0;
  maxLife: number;
  hue: number;
  seed = rand(0, 1000);
  rot = rand(0, Math.PI * 2);
  rotSpeed = rand(-0.01, 0.01);
  text = "";

  constructor(public kind: Kind, ox: number, oy: number, glyphs: string[]) {
    this.x = ox + rand(-3, 3);
    this.y = oy + rand(-2, 2);
    this.hue = pick(PALETTE);
    this.maxLife = rand(180, 340);

    if (kind === "glyph") {
      this.text = pick(glyphs);
      this.size = rand(16, 30);
      this.baseAlpha = rand(0.6, 0.9);
      this.vy = rand(-1.9, -1.1);
    } else if (kind === "spark") {
      this.size = rand(1, 2.8);
      this.baseAlpha = rand(0.7, 1);
      this.vy = rand(-3, -1.2);
      this.vx = rand(-0.25, 0.25);
    } else {
      this.size = rand(8, 16);
      this.baseAlpha = rand(0.12, 0.3);
      this.vy = rand(-2.6, -1.4);
    }
  }

  update(t: number, wind: { x: number; y: number; px: number; py: number; power: number }, drift: number) {
    this.life++;
    const p = this.life / this.maxLife;

    // swirl: height ke saath sway badhta hai, bilkul real dhuan jaisa
    const sway = 0.4 + p * 1.4;
    // bal khaata hua: height ke hisaab se wave, jo left ke saath combine hota hai
    this.vx += Math.sin(t * 0.9 + this.seed + this.y * 0.02) * 0.02 * sway;
    // left pull: shuru mein halka, upar jaate hue badhta hai (curve banta hai)
    this.vx -= drift * (0.008 + p * 0.03);
    this.vx *= 0.985;

    // mouse wind
    if (wind.power > 0.01) {
      const dx = this.x - wind.px;
      const dy = this.y - wind.py;
      const d2 = dx * dx + dy * dy;
      if (d2 < 160 * 160) {
        const f = (1 - Math.sqrt(d2) / 160) * wind.power;
        this.vx += wind.x * f * 0.05;
        this.vy += wind.y * f * 0.02;
      }
    }

    this.x += this.vx;
    this.y += this.vy;
    this.vy *= 0.999;
    this.rot += this.rotSpeed;

    if (this.kind === "smoke") {
      this.size += 0.12 + p * 0.1; // upar jaate hue phailta hai
    }

    // fade in -> hold -> fade out
    const fadeIn = Math.min(1, this.life / 20);
    const fadeOut = p > 0.55 ? 1 - (p - 0.55) / 0.45 : 1;
    this.alpha = this.baseAlpha * fadeIn * Math.max(0, fadeOut);

    if (this.kind === "spark") {
      this.alpha *= 0.4 + Math.abs(Math.sin(this.life * 0.25)) * 0.6;
    }
  }

  dead(w: number) {
    return this.life >= this.maxLife || this.alpha < 0.005 && this.life > 30 || this.y < -80 || this.x < -100 || this.x > w + 100;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.kind === "smoke") {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
      g.addColorStop(0, `hsla(${this.hue},80%,72%,${this.alpha * 0.55})`);
      g.addColorStop(0.45, `hsla(${this.hue},70%,58%,${this.alpha * 0.25})`);
      g.addColorStop(1, "hsla(0,0%,0%,0)");
      ctx.rotate(this.rot);
      ctx.scale(1.2, 0.75);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.kind === "spark") {
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = `hsla(${this.hue},100%,80%,${this.alpha})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `hsla(${this.hue},100%,60%,${this.alpha})`;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = "lighter";
      ctx.rotate(Math.sin(this.rot) * 0.15); // halka sa jhulna, poora ghumna nahi
      ctx.font = `bold ${this.size}px "Amiri","Noto Naskh Arabic","Times New Roman",serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = `hsla(${this.hue},100%,65%,${this.alpha})`;
      ctx.shadowBlur = 18;
      ctx.fillStyle = `hsla(${this.hue},100%,80%,${this.alpha})`;
      ctx.fillText(this.text, 0, 0);
    }
    ctx.restore();
  }
}

export function MagicalSmoke({
  originX = 0.76,
  originY = 0.64,
  glyphs = DEFAULT_GLYPHS,
  drift = 1,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const MAX = reduced ? 150 : 800;

    let w = 0;
    let h = 0;
    let raf = 0;
    let particles: Particle[] = [];
    let t = 0;
    const wind = { x: 0, y: 0, px: -999, py: -999, power: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight || 450;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect();
      const x = clientX - r.left;
      const y = clientY - r.top;
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

    const frame = () => {
      t += 0.016;
      const ox = w * originX;
      const oy = h * originY;

      ctx.clearRect(0, 0, w, h);

      if (particles.length < MAX) {
        for (let i = 0; i < 2; i++) particles.push(new Particle("smoke", ox, oy, glyphs));
        if (Math.random() < 0.5) particles.push(new Particle("spark", ox, oy, glyphs));
        if (Math.random() < 0.12) particles.push(new Particle("glyph", ox, oy, glyphs));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update(t, wind, drift);
        p.draw(ctx);
        if (p.dead(w)) particles.splice(i, 1);
      }

      wind.power *= 0.92; // wind dheere dheere shaant hoti hai
      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("touchmove", tm);
      particles = [];
    };
  }, [originX, originY, glyphs, drift]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20" aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full mix-blend-screen" />
    </div>
  );
}

// Purane import ke liye alias: app/page.tsx mein { PaintedSmoke } chalta rahega
export const PaintedSmoke = MagicalSmoke;

export default MagicalSmoke;
