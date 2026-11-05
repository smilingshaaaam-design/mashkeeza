
"use client";

import React, { useEffect, useRef } from "react";

const ASMA = [
  "الرَّحْمَٰنُ", "الرَّحِيمُ", "الْمَلِكُ", "الْقُدُّوسُ",
  "السَّلَامُ", "الْمُؤْمِنُ", "الْمُهَيْمِنُ", "الْعَزِيزُ",
  "الْجَبَّارُ", "الْمُتَكَبِّرُ", "الْخَالِقُ", "الْبَارِئُ",
  "الْمُصَوِّرُ", "الْغَفَّارُ", "الْقَهَّارُ", "الْوَهَّابُ",
  "الرَّزَّاقُ", "الْفَتَّاحُ", "الْعَلِيمُ", "الْقَابِضُ",
  "الْبَاسِطُ", "الْخَافِضُ", "الرَّافِعُ", "الْمُعِزُّ",
  "الْمُذِلُّ", "السَّمِيعُ", "الْبَصِيرُ", "الْحَكَمُ",
  "الْعَدْلُ", "اللَّطِيفُ", "الْخَبِيرُ", "الْحَلِيمُ",
  "الْعَظِيمُ", "الْغَفُورُ", "الشَّكُورُ", "الْعَلِيُّ",
  "الْكَبِيرُ", "الْحَفِيظُ", "الْمُقِيتُ", "الْحَسِيبُ",
  "الْجَلِيلُ", "الْكَرِيمُ", "الرَّقِيبُ", "الْمُجِيبُ",
  "الْوَاسِعُ", "الْحَكِيمُ", "الْوَدُودُ", "الْمَجِيدُ",
  "الْبَاعِثُ", "الشَّهِيدُ", "الْحَقُّ", "الْوَكِيلُ",
  "الْقَوِيُّ", "الْمَتِينُ", "الْوَلِيُّ", "الْحَمِيدُ",
  "الْمُحْصِي", "الْمُبْدِئُ", "الْمُعِيدُ", "الْمُحْيِي",
  "الْمُمِيتُ", "الْحَيُّ", "الْقَيُّومُ", "الْوَاجِدُ",
  "الْمَاجِدُ", "الْوَاحِدُ", "الصَّمَدُ", "الْقَادِرُ",
  "الْمُقْتَدِرُ", "الْمُقَدِّمُ", "الْمُؤَخِّرُ", "الْأَوَّلُ",
  "الْآخِرُ", "الظَّاهِرُ", "الْبَاطِنُ", "الْوَالِي",
  "الْمُتَعَالِي", "الْبَرُّ", "التَّوَّابُ", "الْمُنْتَقِمُ",
  "الْعَفُوُّ", "الرَّؤُوفُ", "مَالِكُ الْمُلْكِ",
  "ذُو الْجَلَالِ وَالْإِكْرَامِ", "الْمُقْسِطُ",
  "الْجَامِعُ", "الْغَنِيُّ", "الْمُغْنِي", "الْمَانِعُ",
  "الضَّارُّ", "النَّافِعُ", "النُّورُ", "الْهَادِي",
  "الْبَدِيعُ", "الْبَاقِي", "الْوَارِثُ", "الرَّشِيدُ",
  "الصَّبُورُ"
];

const MUQATTAAT = [
  "الم", "المص", "الر", "المر",
  "كهيعص", "طه", "طسم", "طس",
  "يس", "ص", "حم", "حم عسق", "ق", "ن"
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

// Artistic fictional labels, not authenticated traditional names.
const SYMBOLIC_MUWAKKIL_LABELS = ABJAD.map(
  letter => `أثير ${letter}`
);

const random = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const pick = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

type ParticleType =
  | "smoke"
  | "asma"
  | "muqattaat"
  | "abjad"
  | "planet"
  | "symbolic"
  | "star";

class SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  hue: number;
  wave: number;
  rotation: number;
  rotationSpeed: number;
  text: string;
  type: ParticleType;

  // Fantasy smoke and sparkle properties
  drift: number;
  swirl: number;
  pulse: number;
  stretch: number;
  sparkleSize: number;
  twinkleSpeed: number;
  trailLength: number;

  constructor(
    width: number,
    height: number,
    type: ParticleType
  ) {
    this.type = type;

    // Original emission position preserved
    this.x = width * 0.76 + random(-4, 4);
    this.y = height * 0.64 + random(-5, 5);

    this.wave = random(0, Math.PI * 2);

    this.vx = random(-0.35, 0.35);
    this.vy = random(-1.2, -0.45);

    this.life = 0;
    this.maxLife = random(180, 360);

    this.alpha = random(0.15, 0.42);
    this.size = random(12, 28);

    this.rotation = random(0, Math.PI * 2);
    this.rotationSpeed = random(-0.008, 0.008);

    // Mystical Arabian Nights color palette
    this.hue = pick([
      275, 285, 265, 225, 215, 195, 188,
      44, 48, 52, 320
    ]);

    this.text = "";

    this.drift = random(0.5, 2.2);
    this.swirl = random(0.8, 2.8);
    this.pulse = random(0, Math.PI * 2);
    this.stretch = random(1.8, 4.8);
    this.sparkleSize = random(1, 3);
    this.twinkleSpeed = random(0.04, 0.12);
    this.trailLength = random(12, 38);

    switch (type) {
      case "smoke":
        // Longer, rising incense-style vapor
        this.vx = random(-0.22, 0.22);
        this.vy = random(-1.65, -0.75);

        this.size = random(22, 48);
        this.alpha = random(0.12, 0.28);
        this.maxLife = random(320, 620);

        this.stretch = random(2.8, 6.5);
        this.swirl = random(1.2, 3.8);
        this.drift = random(0.8, 2.5);

        this.hue = pick([
          275, 285, 265, 230, 215, 195, 188,
          44, 48, 52
        ]);
        break;

      case "asma":
        this.text = pick(ASMA);
        this.size = random(17, 27);
        this.alpha = random(0.55, 0.85);
        this.maxLife = random(240, 400);
        break;

      case "muqattaat":
        this.text = pick(MUQATTAAT);
        this.size = random(22, 34);
        this.hue = 44;
        this.alpha = 0.8;
        break;

      case "abjad":
        this.text = pick(ABJAD);
        this.size = random(19, 29);
        this.hue = 188;
        this.alpha = 0.75;
        break;

      case "planet": {
        const planet = pick(PLANETS);
        this.text = planet.symbol;
        this.hue = planet.hue;
        this.size = random(25, 37);
        this.alpha = 0.8;
        break;
      }

      case "symbolic":
        this.text = pick(SYMBOLIC_MUWAKKIL_LABELS);
        this.size = random(13, 20);
        this.hue = 275;
        this.alpha = 0.65;
        break;

      case "star":
        this.size = random(1.2, 3.8);
        this.sparkleSize = random(1.5, 4.5);
        this.hue = pick([44, 48, 52, 188, 205, 275]);
        this.alpha = random(0.45, 0.95);
        this.maxLife = random(100, 260);
        this.vx = random(-0.45, 0.45);
        this.vy = random(-0.8, -0.15);
        this.trailLength = random(8, 30);
        break;

      default:
        this.size = random(14, 42);
        this.alpha = random(0.08, 0.25);
    }
  }

  update() {
    this.life++;

    const progress = this.life / this.maxLife;

    const time = this.life * 0.018 + this.wave;

    // Wide magical swirling motion
    const spiralX =
      Math.sin(time * this.swirl) * this.drift;

    const spiralY =
      Math.cos(time * 0.012 + this.wave) * 0.18;

    this.x +=
      this.vx +
      Math.sin(time) * 0.48 +
      spiralX;

    this.y +=
      this.vy +
      spiralY;

    this.vx +=
      Math.sin(this.life * 0.025 + this.wave) * 0.006;

    // Smoke rises slowly and spreads as it ascends
    if (this.type === "smoke") {
      this.vy -= 0.0015;

      this.size += 0.065;

      this.alpha *= 0.9985;

      this.rotation +=
        this.rotationSpeed +
        Math.sin(time * 0.7) * 0.002;

      // Long curling vapor movement
      this.x +=
        Math.sin(this.life * 0.012 + this.wave) *
        (0.45 + progress * 1.4);

      // Gradual color transitions through purple, blue and gold
      if (progress > 0.25 && progress < 0.7) {
        this.hue += Math.sin(this.life * 0.01) * 0.08;
      }
    } else {
      this.rotation += this.rotationSpeed;
    }

    // Twinkling stars
    if (this.type === "star") {
      this.pulse += this.twinkleSpeed;

      this.alpha =
        0.25 +
        Math.abs(Math.sin(this.pulse)) * 0.75;

      this.size =
        this.sparkleSize *
        (0.65 + Math.abs(Math.sin(this.pulse)) * 0.7);

      this.x +=
        Math.sin(this.life * 0.04 + this.wave) * 0.3;
    }

    if (this.type !== "smoke" && this.type !== "star" && progress > 0.72) {
      this.alpha -= 0.009;
    }

    if (progress > 0.85) {
      this.alpha -= 0.003;
    }

    this.alpha = Math.max(0, this.alpha);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.type === "smoke") {
      // Large soft magical vapor cloud
      const radius = this.size * this.stretch;

      const gradient = ctx.createRadialGradient(
        0, 0, 0,
        0, 0, radius
      );

      gradient.addColorStop(
        0,
        `hsla(${this.hue}, 100%, 82%, ${this.alpha * 0.38})`
      );

      gradient.addColorStop(
        0.18,
        `hsla(${this.hue}, 95%, 72%, ${this.alpha * 0.30})`
      );

      gradient.addColorStop(
        0.42,
        `hsla(${this.hue + 18}, 85%, 62%, ${this.alpha * 0.20})`
      );

      gradient.addColorStop(
        0.68,
        `hsla(${this.hue + 35}, 75%, 52%, ${this.alpha * 0.10})`
      );

      gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.rotate(this.rotation);

      // Elongated smoke wisps like incense
      ctx.scale(
        0.42 + Math.abs(Math.sin(this.life * 0.012)) * 0.35,
        1.6 + Math.abs(Math.cos(this.life * 0.01)) * 1.4
      );

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Inner luminous vapor strand
      const innerGradient = ctx.createRadialGradient(
        0, 0, 0,
        0, 0, this.size * 2.2
      );

      innerGradient.addColorStop(
        0,
        `hsla(${this.hue + 25}, 100%, 88%, ${this.alpha * 0.20})`
      );

      innerGradient.addColorStop(
        0.5,
        `hsla(${this.hue}, 100%, 70%, ${this.alpha * 0.12})`
      );

      innerGradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle = innerGradient;
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        this.size * 0.55,
        this.size * 2.8,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

    } else if (this.type === "star") {
      // Star-like magical sparkles
      ctx.globalCompositeOperation = "lighter";

      const glow = ctx.createRadialGradient(
        0, 0, 0,
        0, 0, this.sparkleSize * 5
      );

      glow.addColorStop(
        0,
        `hsla(${this.hue}, 100%, 95%, ${this.alpha})`
      );

      glow.addColorStop(
        0.25,
        `hsla(${this.hue}, 100%, 78%, ${this.alpha * 0.8})`
      );

      glow.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(
        0, 0,
        this.sparkleSize * 5,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Bright central point
      ctx.fillStyle =
        `hsla(${this.hue}, 100%, 98%, ${this.alpha})`;

      ctx.shadowColor =
        `hsla(${this.hue}, 100%, 75%, ${this.alpha})`;

      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.arc(
        0, 0,
        this.sparkleSize * 0.65,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Four-point star flare
      ctx.beginPath();
      ctx.moveTo(0, -this.sparkleSize * 3.2);
      ctx.lineTo(this.sparkleSize * 0.45, 0);
      ctx.lineTo(0, this.sparkleSize * 3.2);
      ctx.lineTo(-this.sparkleSize * 0.45, 0);
      ctx.closePath();
      ctx.fill();

    } else {
      ctx.globalCompositeOperation = "lighter";

      const color =
        `hsla(${this.hue}, 100%, 78%, ${this.alpha})`;

      ctx.font =
        `bold ${this.size}px "Amiri", "Noto Naskh Arabic", "Times New Roman", serif`;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.shadowColor =
        `hsla(${this.hue}, 100%, 65%, ${this.alpha})`;

      ctx.shadowBlur = 18;

      ctx.fillStyle = color;
      ctx.fillText(this.text, 0, 0);
    }

    ctx.restore();
  }
}

export function PaintedSmoke() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let particles: SmokeParticle[] = [];

    let width = 0;
    let height = 450;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const MAX_PARTICLES = 750;

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;

      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight || 450;

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    const spawnSmoke = () => {
      if (particles.length < MAX_PARTICLES) {
        // More layered vapor for richer smoke
        for (let i = 0; i < 4; i++) {
          particles.push(
            new SmokeParticle(width, height, "smoke")
          );
        }
      }
    };

    const spawnSymbol = () => {
      if (particles.length >= MAX_PARTICLES) return;

      const r = Math.random();

      let type: ParticleType;

      if (r < 0.34) {
        type = "asma";
      } else if (r < 0.48) {
        type = "abjad";
      } else if (r < 0.61) {
        type = "muqattaat";
      } else if (r < 0.76) {
        type = "planet";
      } else if (r < 0.88) {
        type = "symbolic";
      } else {
        type = "star";
      }

      particles.push(
        new SmokeParticle(width, height, type)
      );
    };

    // Additional magical stars floating through the scene
    const spawnStar = () => {
      if (particles.length >= MAX_PARTICLES) return;

      const star = new SmokeParticle(width, height, "star");

      // Stars appear throughout the page
      star.x = random(width * 0.08, width * 0.96);
      star.y = random(height * 0.12, height * 0.88);

      particles.push(star);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      spawnSmoke();

      // Existing symbolic particles
      if (Math.random() < 0.12) {
        spawnSymbol();
      }

      // Twinkling stars scattered across the page
      if (Math.random() < 0.18) {
        spawnStar();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];

        particle.update();
        particle.draw(ctx);

        if (
          particle.alpha <= 0.01 ||
          particle.life >= particle.maxLife ||
          particle.y < -120 ||
          particle.x < -180 ||
          particle.x > width + 180
        ) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      particles = [];
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      <canvas
        ref={canvasRef}
        className="w-full h-full mix-blend-screen opacity-95"
      />
    </div>
  );
}
