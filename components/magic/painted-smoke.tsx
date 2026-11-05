
"use client";

import React, { useEffect, useRef } from "react";

// ------------------------------------------------------
// DATA
// ------------------------------------------------------

const ASMA = [
  "الله", "الرحمن", "الرحيم", "الملك", "القدوس",
  "السلام", "المؤمن", "المهيمن", "العزيز", "الجبار",
  "المتكبر", "الخالق", "البارئ", "المصور", "الغفار",
  "القهار", "الوهاب", "الرزاق", "الفتاح", "العليم",
  "القابض", "الباسط", "الخافض", "الرافع", "المعز",
  "المذل", "السميع", "البصير", "الحكم", "العدل",
  "اللطيف", "الخبير", "الحليم", "العظيم", "الغفور",
  "الشكور", "العلي", "الكبير", "الحفيظ", "المقيت",
  "الحسيب", "الجليل", "الكريم", "الرقيب", "المجيب",
  "الواسع", "الحكيم", "الودود", "المجيد", "الباعث",
  "الشهيد", "الحق", "الوكيل", "القوي", "المتين",
  "الولي", "الحميد", "المحصي", "المبدئ", "المعيد",
  "المحيي", "المميت", "الحي", "القيوم", "الواجد",
  "الماجد", "الواحد", "الصمد", "القادر", "المقتدر",
  "المقدم", "المؤخر", "الأول", "الآخر", "الظاهر",
  "الباطن", "الوالي", "المتعالي", "البر", "التواب",
  "المنتقم", "العفو", "الرؤوف", "مالك الملك", "ذو الجلال والإكرام",
  "المقسط", "الجامع", "الغني", "المغني", "المانع",
  "الضار", "النافع", "النور", "الهادي", "البديع",
  "الباقي", "الوارث", "الرشيد", "الصبور"
];

const MUQATTAAT = [
  "الم", "المص", "الر", "المر",
  "كهيعص", "طه", "طسم", "طس",
  "يس", "ص", "حم", "حم عسق",
  "ق", "ن"
];

const ABJAD = [
  "ا", "ب", "ج", "د", "ه", "و", "ز",
  "ح", "ط", "ي", "ك", "ل", "م", "ن",
  "س", "ع", "ف", "ص", "ق", "ر", "ش",
  "ت", "ث", "خ", "ذ", "ض", "ظ", "غ"
];

const PLANETS = [
  { symbol: "☉", name: "الشمس", hue: 44 },
  { symbol: "☽", name: "القمر", hue: 205 },
  { symbol: "☿", name: "عطارد", hue: 188 },
  { symbol: "♀", name: "الزهرة", hue: 320 },
  { symbol: "♂", name: "المريخ", hue: 0 },
  { symbol: "♃", name: "المشتري", hue: 275 },
  { symbol: "♄", name: "زحل", hue: 230 }
];

// ------------------------------------------------------
// TYPES
// ------------------------------------------------------

type SmokeParticle = {
  x: number;
  y: number;
  age: number;
  life: number;
  size: number;
  drift: number;
  seed: number;
  hue: number;
};

type GlyphParticle = {
  progress: number;
  speed: number;
  text: string;
  size: number;
  alpha: number;
  hue: number;
  wobble: number;
};

// ------------------------------------------------------
// COMPONENT
// ------------------------------------------------------

export default function PaintedSmoke() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let lastTime = 0;
    let elapsed = 0;
    let glyphTimer = 0;
    let dataIndex = 0;
    let disposed = false;

    const smoke: SmokeParticle[] = [];
    const glyphs: GlyphParticle[] = [];

    const random = (min: number, max: number) =>
      min + Math.random() * (max - min);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Original smoke source position:
    // 76% from left, 64% from top.
    const source = () => ({
      x: width * 0.76,
      y: height * 0.64
    });

    // S-shaped rising smoke path.
    // The smoke starts at the original source position
    // and gradually curls as it rises.
    const getSmokePath = (progress: number) => {
      const p = Math.max(0, Math.min(1, progress));
      const startX = width * 0.76;
      const startY = height * 0.64;

      const x =
        startX -
        p * width * 0.12 +
        Math.sin(p * Math.PI * 2.4) * width * 0.105;

      const y = startY - p * height * 0.57;

      return { x, y };
    };

    const spawnSmoke = () => {
      const origin = source();

      smoke.push({
        x: origin.x + random(-3, 3),
        y: origin.y + random(-2, 2),
        age: 0,
        life: random(2.8, 5.2),
        size: random(8, 19),
        drift: random(-0.7, 0.7),
        seed: random(0, Math.PI * 2),
        hue: random(185, 285)
      });
    };

    const spawnGlyph = () => {
      const allSymbols = [
        ...ASMA,
        ...MUQATTAAT,
        ...ABJAD,
        ...PLANETS.map((planet) => planet.symbol)
      ];

      const text = allSymbols[dataIndex % allSymbols.length];
      dataIndex++;

      glyphs.push({
        progress: random(0.02, 0.18),
        speed: random(0.045, 0.085),
        text,
        size: random(12, 20),
        alpha: random(0.3, 0.65),
        hue: random(185, 285),
        wobble: random(0, Math.PI * 2)
      });
    };

    // --------------------------------------------------
    // DRAW SMOKE PARTICLE
    // --------------------------------------------------

    const drawSmokeParticle = (particle: SmokeParticle) => {
      const lifeProgress = particle.age / particle.life;
      const fadeIn = Math.min(1, lifeProgress * 5);
      const fadeOut = Math.min(1, (1 - lifeProgress) * 3);
      const alpha = Math.max(0, fadeIn * fadeOut * 0.12);

      if (alpha <= 0) return;

      const path = getSmokePath(lifeProgress);

      const wave =
        Math.sin(particle.seed + elapsed * 1.4) * 8;

      const driftX =
        particle.drift * particle.age * 8 + wave;

      const driftY = -particle.age * 5;

      const x = path.x + driftX;
      const y = path.y + driftY;

      const size =
        particle.size + lifeProgress * 15;

      const gradient = ctx.createRadialGradient(
        x,
        y,
        0,
        x,
        y,
        size
      );

      gradient.addColorStop(
        0,
        `hsla(${particle.hue}, 65%, 85%, ${alpha})`
      );
      gradient.addColorStop(
        0.35,
        `hsla(${particle.hue}, 60%, 72%, ${alpha * 0.55})`
      );
      gradient.addColorStop(
        1,
        `hsla(${particle.hue}, 55%, 65%, 0)`
      );

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // --------------------------------------------------
    // DRAW SOFT SMOKE RIBBON
    // --------------------------------------------------

    const drawSmokeRibbon = () => {
      const origin = source();

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Main soft smoke trail
      for (let layer = 0; layer < 4; layer++) {
        ctx.beginPath();

        const offset = (layer - 1.5) * 7;

        for (let i = 0; i <= 90; i++) {
          const p = i / 90;
          const point = getSmokePath(p);

          const wave =
            Math.sin(p * 17 + elapsed * 1.1 + layer) *
            (4 + p * 8);

          const x = point.x + offset + wave;
          const y = point.y;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        const gradient = ctx.createLinearGradient(
          origin.x,
          origin.y,
          width * 0.6,
          height * 0.05
        );

        gradient.addColorStop(
          0,
          `rgba(220, 205, 255, ${0.055 - layer * 0.008})`
        );
        gradient.addColorStop(
          0.5,
          `rgba(170, 190, 255, ${0.035 - layer * 0.004})`
        );
        gradient.addColorStop(
          1,
          "rgba(180, 220, 255, 0)"
        );

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 15 + layer * 12;
        ctx.stroke();
      }

      // Thin luminous center line
      ctx.beginPath();

      for (let i = 0; i <= 90; i++) {
        const p = i / 90;
        const point = getSmokePath(p);

        const wave =
          Math.sin(p * 16 + elapsed * 1.3) * 5;

        const x = point.x + wave;
        const y = point.y;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle = "rgba(210, 220, 255, 0.10)";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.restore();
    };

    // --------------------------------------------------
    // DRAW INCENSE SOURCE GLOW
    // --------------------------------------------------

    const drawSourceGlow = () => {
      const origin = source();

      const pulse =
        1 + Math.sin(elapsed * 2.2) * 0.12;

      const radius = 19 * pulse;

      const gradient = ctx.createRadialGradient(
        origin.x,
        origin.y,
        0,
        origin.x,
        origin.y,
        radius
      );

      gradient.addColorStop(0, "rgba(255, 225, 175, 0.30)");
      gradient.addColorStop(0.25, "rgba(210, 190, 255, 0.13)");
      gradient.addColorStop(1, "rgba(180, 190, 255, 0)");

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(origin.x, origin.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // --------------------------------------------------
    // DRAW FLOATING ARABIC / SYMBOL GLYPHS
    // --------------------------------------------------

    const drawGlyph = (glyph: GlyphParticle) => {
      const point = getSmokePath(glyph.progress);

      const wobbleX =
        Math.sin(glyph.wobble + elapsed * 1.7) * 12;

      const wobbleY =
        Math.cos(glyph.wobble + elapsed) * 5;

      const x = point.x + wobbleX;
      const y = point.y + wobbleY;

      const fadeIn = Math.min(1, glyph.progress * 5);
      const fadeOut = Math.min(1, (1 - glyph.progress) * 4);
      const alpha = glyph.alpha * fadeIn * fadeOut;

      if (alpha <= 0) return;

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.shadowColor = `hsla(${glyph.hue}, 90%, 80%, ${alpha})`;
      ctx.shadowBlur = 13;

      ctx.font = `${glyph.size}px "Amiri", "Noto Naskh Arabic", serif`;
      ctx.fillStyle = `hsla(${glyph.hue}, 75%, 88%, ${alpha})`;

      ctx.fillText(glyph.text, x, y);
      ctx.restore();
    };

    // --------------------------------------------------
    // ANIMATION LOOP
    // --------------------------------------------------

    const animate = (time: number) => {
      if (disposed) return;

      const delta = lastTime
        ? Math.min((time - lastTime) / 1000, 0.04)
        : 0.016;

      lastTime = time;
      elapsed += delta;

      ctx.clearRect(0, 0, width, height);

      // Continuous smoke emission
      const emissionCount = 3;

      for (let i = 0; i < emissionCount; i++) {
        spawnSmoke();
      }

      // Slowly introduce symbolic particles
      glyphTimer += delta;

      if (glyphTimer > 0.72) {
        glyphTimer = 0;
        spawnGlyph();
      }

      // Draw the continuous smoke ribbon first
      drawSmokeRibbon();

      // Update and draw smoke particles
      for (let i = smoke.length - 1; i >= 0; i--) {
        const particle = smoke[i];

        particle.age += delta;

        if (particle.age >= particle.life) {
          smoke.splice(i, 1);
          continue;
        }

        drawSmokeParticle(particle);
      }

      // Update and draw floating glyphs
      for (let i = glyphs.length - 1; i >= 0; i--) {
        const glyph = glyphs[i];

        glyph.progress += glyph.speed * delta;

        if (glyph.progress >= 1) {
          glyphs.splice(i, 1);
          continue;
        }

        drawGlyph(glyph);
      }

      drawSourceGlow();

      animationFrame = window.requestAnimationFrame(animate);
    };

    // --------------------------------------------------
    // INITIALIZE
    // --------------------------------------------------

    resize();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(resize)
        : null;

    resizeObserver?.observe(canvas);

    window.addEventListener("resize", resize);

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      smoke.length = 0;
      glyphs.length = 0;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        pointerEvents: "none"
      }}
    />
  );
}
