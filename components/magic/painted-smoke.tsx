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
  | "sparkle";

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

    // Emission position - Made tighter for incense stick effect
    this.x = width * 0.76 + random(-2, 2);
    this.y = height * 0.64 + random(-2, 2);

    this.wave = random(0, Math.PI * 2);
    this.life = 0;
    this.rotation = random(0, Math.PI * 2);
    this.rotationSpeed = random(-0.008, 0.008);
    this.text = "";

    this.hue = pick([275, 285, 220, 230, 188, 44]);

    switch (type) {
      case "asma":
        this.text = pick(ASMA);
        this.size = random(17, 27);
        this.alpha = random(0.55, 0.85);
        this.maxLife = random(150, 250);
        this.vx = random(-0.15, 0.15);
        this.vy = random(-2.5, -1.5);
        break;

      case "muqattaat":
        this.text = pick(MUQATTAAT);
        this.size = random(22, 34);
        this.hue = 44;
        this.alpha = 0.8;
        this.maxLife = random(150, 250);
        this.vx = random(-0.15, 0.15);
        this.vy = random(-2.5, -1.5);
        break;

      case "abjad":
        this.text = pick(ABJAD);
        this.size = random(19, 29);
        this.hue = 188;
        this.alpha = 0.75;
        this.maxLife = random(150, 250);
        this.vx = random(-0.15, 0.15);
        this.vy = random(-2.5, -1.5);
        break;

      case "planet": {
        const planet = pick(PLANETS);
        this.text = planet.symbol;
        this.hue = planet.hue;
        this.size = random(25, 37);
        this.alpha = 0.8;
        this.maxLife = random(150, 250);
        this.vx = random(-0.15, 0.15);
        this.vy = random(-2.5, -1.5);
        break;
      }

      case "symbolic":
        this.text = pick(SYMBOLIC_MUWAKKIL_LABELS);
        this.size = random(13, 20);
        this.hue = 275;
        this.alpha = 0.65;
        this.maxLife = random(150, 250);
        this.vx = random(-0.15, 0.15);
        this.vy = random(-2.5, -1.5);
        break;

      case "sparkle":
        this.size = random(1.5, 3.5);
        this.alpha = random(0.8, 1);
        this.maxLife = random(150, 300);
        this.hue = pick([44, 188, 275]);
        this.vx = random(-0.2, 0.2);
        this.vy = random(-3.5, -1.5); // Faster upward movement
        break;

      default: // smoke
        this.size = random(10, 20); // Smaller initial size to prevent spread
        this.alpha = random(0.15, 0.4); 
        this.maxLife = random(150, 350); 
        this.vx = random(-0.1, 0.1); // Reduced horizontal movement (straight up)
        this.vy = random(-3.5, -1.8); // Much faster vertical speed
    }
  }

  update() {
    this.life++;
    const progress = this.life / this.maxLife;
    
    // Narrow sway for incense stick style (no increasing spread)
    const sway = 0.25; 

    // Faster animation wave
    this.x += this.vx + Math.sin(this.life * 0.05 + this.wave) * sway;
    this.y += this.vy;

    // Reduced horizontal drift
    this.vx += Math.sin(this.life * 0.04 + this.wave) * 0.002;
    this.vy -= 0.002;

    this.rotation += this.rotationSpeed;

    if (this.type === "smoke") {
      this.size += 0.015; // Extremely slow expansion to keep it narrow
      this.alpha *= 0.992; // Smooth fade out
    } else if (this.type === "sparkle") {
      // Faster twinkling effect
      this.alpha = (0.2 + Math.abs(Math.sin(this.life * 0.25)) * 0.8) * (1 - progress);
    } else {
      if (progress > 0.6) {
        this.alpha -= 0.015;
      }
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

      gradient.addColorStop(0, `hsla(${this.hue}, 85%, 75%, ${this.alpha * 0.5})`);
      gradient.addColorStop(0.35, `hsla(${this.hue}, 75%, 65%, ${this.alpha * 0.3})`);
      gradient.addColorStop(0.7, `hsla(${this.hue}, 65%, 45%, ${this.alpha * 0.1})`);
      gradient.addColorStop(1, "rgba(0,0,0,0)");

      ctx.rotate(this.rotation);
      ctx.scale(1.15, 0.72);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();

    } else if (this.type === "sparkle") {
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = `hsla(${this.hue}, 100%, 80%, ${this.alpha})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, ${this.alpha})`;
      
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();

    } else {
      ctx.globalCompositeOperation = "lighter";
      const color = `hsla(${this.hue}, 100%, 78%, ${this.alpha})`;

      ctx.font = `bold ${this.size}px "Amiri", "Noto Naskh Arabic", "Times New Roman", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.shadowColor = `hsla(${this.hue}, 100%, 65%, ${this.alpha})`;
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

    const MAX_PARTICLES = 900;

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
        for (let i = 0; i < 2; i++) {
          particles.push(
            new SmokeParticle(width, height, "smoke")
          );
        }
        if (Math.random() < 0.6) {
          particles.push(
            new SmokeParticle(width, height, "sparkle")
          );
        }
      }
    };

    const spawnSymbol = () => {
      if (particles.length >= MAX_PARTICLES) return;

      const r = Math.random();
      let type: ParticleType;

      if (r < 0.38) type = "asma";
      else if (r < 0.53) type = "abjad";
      else if (r < 0.67) type = "muqattaat";
      else if (r < 0.82) type = "planet";
      else type = "symbolic";

      particles.push(new SmokeParticle(width, height, type));
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      spawnSmoke();

      // Increased probability to match the faster speed
      if (Math.random() < 0.2) {
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
