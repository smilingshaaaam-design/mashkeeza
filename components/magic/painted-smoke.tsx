
const random = (min: number, max: number) =>
  Math.random() * (max - min) + min;

type ParticleType =
  | "smoke"
  | "asma"
  | "muqattaat"
  | "abjad"
  | "planet";

const SYMBOLS = [
  "۞", "✦", "✧", "◈", "☼", "☽", "۩", "✺"
];

// S-shaped flowing smoke path
function getSmokePath(t: number, w: number, h: number) {
  const p0 = { x: w * 0.76, y: h * 0.64 };
  const p1 = { x: w * 0.24, y: h * 0.34 };
  const p2 = { x: w * 0.78, y: h * 0.12 };

  const cubic = (
    a: number, b: number, c: number, d: number, t: number
  ) =>
    Math.pow(1-t, 3)*a +
    3*Math.pow(1-t, 2)*t*b +
    3*(1-t)*t*t*c +
    t*t*t*d;

  let x: number;
  let y: number;

  if (t < 0.48) {
    const u = t / 0.48;

    x = cubic(p0.x, w*0.57, w*0.12, p1.x, u);
    y = cubic(p0.y, h*0.61, h*0.56, p1.y, u);
  } else {
    const u = (t - 0.48) / 0.52;

    x = cubic(p1.x, w*0.34, w*0.67, p2.x, u);
    y = cubic(p1.y, h*0.10, h*0.07, p2.y, u);
  }

  return { x, y };
}

class SmokeParticle {
  x = 0;
  y = 0;
  size: number;
  alpha: number;
  progress = 0;
  speed: number;
  wave: number;
  hue: number;
  type: ParticleType;
  text: string;
  rotation: number;
  seed: number;

  constructor(
    width: number,
    height: number,
    type: ParticleType
  ) {
    this.type = type;

    // ORIGINAL EMISSION POSITION PRESERVED
    this.x = width * 0.76;
    this.y = height * 0.64;

    this.progress = random(0, 0.012);
    this.speed = random(0.0025, 0.0045);

    this.wave = random(0, Math.PI * 2);
    this.seed = random(0, 100);

    this.size = random(14, 34);
    this.alpha = random(0.12, 0.28);

    this.hue = [188, 195, 205, 275, 44][
      Math.floor(Math.random() * 5)
    ];

    this.rotation = random(-1, 1);
    this.text = "";

    switch (type) {
      case "asma":
        this.text = ASMA[Math.floor(Math.random() * ASMA.length)];
        this.size = random(17, 28);
        this.alpha = 0.8;
        this.hue = 44;
        break;

      case "muqattaat":
        this.text = MUQATTAAT[
          Math.floor(Math.random() * MUQATTAAT.length)
        ];
        this.size = random(22, 34);
        this.hue = 188;
        this.alpha = 0.8;
        break;

      case "abjad":
        this.text = ABJAD[
          Math.floor(Math.random() * ABJAD.length)
        ];
        this.size = random(18, 30);
        this.hue = 275;
        this.alpha = 0.8;
        break;

      case "planet": {
        const planet = PLANETS[
          Math.floor(Math.random() * PLANETS.length)
        ];
        this.text = planet.symbol;
        this.hue = planet.hue;
        this.size = random(25, 36);
        this.alpha = 0.85;
        break;
      }

      default:
        this.size = random(18, 42);
        this.alpha = random(0.12, 0.3);
    }
  }

  update(width: number, height: number) {
    this.progress += this.speed;

    const t = Math.min(this.progress, 1);

    const path = getSmokePath(t, width, height);

    const turbulence =
      Math.sin(this.progress * 35 + this.wave) *
      (8 + this.progress * 30);

    const secondaryWave =
      Math.cos(this.progress * 24 + this.seed) *
      (5 + this.progress * 18);

    this.x = path.x + turbulence;
    this.y = path.y + secondaryWave;

    if (this.type === "smoke") {
      // Smoke expands naturally as it travels
      this.size += 0.045;
      this.alpha *= 0.999;
    } else {
      this.alpha = Math.min(
        this.alpha,
        this.progress < 0.72 ? 0.8 : this.alpha - 0.006
      );
    }

    this.rotation += 0.002;

    if (this.progress > 0.88) {
      this.alpha *= 0.97;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0.005) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.type === "smoke") {
      ctx.globalCompositeOperation = "screen";

      // Volumetric cloud with soft translucent layers
      const gradient = ctx.createRadialGradient(
        0, 0, 0,
        0, 0, this.size
      );

      gradient.addColorStop(
        0,
        `hsla(${this.hue}, 65%, 90%, ${this.alpha * 0.55})`
      );

      gradient.addColorStop(
        0.22,
        `hsla(195, 75%, 80%, ${this.alpha * 0.34})`
      );

      gradient.addColorStop(
        0.48,
        `hsla(205, 70%, 68%, ${this.alpha * 0.19})`
      );

      gradient.addColorStop(
        0.72,
        `hsla(275, 65%, 65%, ${this.alpha * 0.10})`
      );

      gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.rotate(this.rotation);

      // Long organic smoke wisps
      ctx.scale(1.9, 0.72);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();

      // Golden luminous smoke highlights
      const gold = ctx.createRadialGradient(
        0, 0, 0,
        0, 0, this.size * 0.8
      );

      gold.addColorStop(
        0,
        `hsla(44, 100%, 85%, ${this.alpha * 0.12})`
      );

      gold.addColorStop(
        1,
        "rgba(255,190,70,0)"
      );

      ctx.fillStyle = gold;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.8, 0, Math.PI * 2);
      ctx.fill();

    } else {
      ctx.globalCompositeOperation = "lighter";

      ctx.font =
        `bold ${this.size}px "Amiri", "Noto Naskh Arabic", serif`;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.shadowColor =
        `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;

      ctx.shadowBlur = 22;

      ctx.fillStyle =
        `hsla(${this.hue}, 100%, 85%, ${this.alpha})`;

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

    let width = 0;
    let height = 450;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let frame = 0;
    let animationFrameId = 0;

    let particles: SmokeParticle[] = [];

    const MAX_PARTICLES = 850;

    const resize = () => {
      width = canvas.parentElement!.clientWidth;
      height = canvas.parentElement!.clientHeight || 450;

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // Continuous dense smoke ribbon
    const emitSmoke = () => {
      for (let i = 0; i < 3; i++) {
        if (particles.length >= MAX_PARTICLES) break;

        particles.push(
          new SmokeParticle(width, height, "smoke")
        );
      }
    };

    // Symbols travel along the same smoke path
    const emitSymbols = () => {
      if (particles.length >= MAX_PARTICLES) return;

      const r = Math.random();

      let type: ParticleType;

      if (r < 0.40) type = "asma";
      else if (r < 0.57) type = "abjad";
      else if (r < 0.72) type = "muqattaat";
      else type = "planet";

      particles.push(
        new SmokeParticle(width, height, type)
      );
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smoke never stops emitting
      emitSmoke();

      // Controlled calligraphy emission
      if (frame % 9 === 0 && Math.random() < 0.85) {
        emitSymbols();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.update(width, height);
        p.draw(ctx);

        if (
          p.progress >= 1 ||
          p.alpha < 0.006
        ) {
          particles.splice(i, 1);
        }
      }

      frame++;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
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
