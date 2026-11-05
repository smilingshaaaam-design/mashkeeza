
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
  | "symbolic";

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

  constructor(
    width: number,
    height: number,
    type: ParticleType
  ) {
    this.type = type;

    // RESTORED ORIGINAL EMISSION POSITION
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

    this.hue = pick([275, 275, 188, 188, 44]);

    this.text = "";

    switch (type) {
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

      default:
        this.size = random(14, 42);
        this.alpha = random(0.08, 0.25);
    }
  }

  update() {
    this.life++;

    const progress = this.life / this.maxLife;

    this.x += this.vx +
      Math.sin(this.life * 0.018 + this.wave) * 0.48;

    this.y += this.vy;

    this.vx +=
      Math.sin(this.life * 0.025 + this.wave) * 0.006;

    this.vy -= 0.001;

    this.rotation += this.rotationSpeed;

    if (this.type === "smoke") {
      this.size += 0.045;
      this.alpha *= 0.998;
    }

    if (this.type !== "smoke" && progress > 0.72) {
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
      const gradient = ctx.createRadialGradient(
        0, 0, 0,
        0, 0, this.size
      );

      gradient.addColorStop(
        0,
        `hsla(${this.hue}, 75%, 82%, ${this.alpha * 0.32})`
      );

      gradient.addColorStop(
        0.35,
        `hsla(${this.hue}, 65%, 67%, ${this.alpha * 0.19})`
      );

      gradient.addColorStop(
        0.7,
        `hsla(${this.hue}, 55%, 55%, ${this.alpha * 0.07})`
      );

      gradient.addColorStop(1, "rgba(0,0,0,0)");

      ctx.rotate(this.rotation);
      ctx.scale(1.15, 0.72);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
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
        for (let i = 0; i < 3; i++) {
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

      if (r < 0.38) {
        type = "asma";
      } else if (r < 0.53) {
        type = "abjad";
      } else if (r < 0.67) {
        type = "muqattaat";
      } else if (r < 0.82) {
        type = "planet";
      } else {
        type = "symbolic";
      }

      particles.push(
        new SmokeParticle(width, height, type)
      );
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      spawnSmoke();

      if (Math.random() < 0.12) {
        spawnSymbol();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];

        particle.update();
        particle.draw(ctx);

        if (
          particle.alpha <= 0.01 ||
          particle.life >= particle.maxLife ||
          particle.y < -80 ||
          particle.x < -100 ||
          particle.x > width + 100
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
