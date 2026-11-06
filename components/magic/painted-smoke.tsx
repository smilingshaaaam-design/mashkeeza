<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Magical Smoke - Original Coordinates + Multicolor &amp; Glitters</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%;
      height: 100%;
      background: #06040d;
      overflow: hidden;
    }
    .smoke-wrapper {
      position: fixed;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 20;
    }
    canvas {
      width: 100%;
      height: 100%;
      display: block;
      mix-blend-mode: screen;
      opacity: 0.95;
    }
  </style>
</head>
<body>
  <div class="smoke-wrapper" aria-hidden="true">
    <canvas id="smokeCanvas"></canvas>
  </div>

  <script>
    const CONFIG = {
      originX: 0.76,
      originY: 0.64,
      direction: "left",   // "left" | "right"
      spiral: "down",      // "down" | "under" | "over"
      drift: 1,
      speed: 0.55,         // Dheemi natural speed
      showGlyphs: false,
      debug: false
    };

    const DEFAULT_GLYPHS = [
      "الرَّحْمَٰنُ", "الرَّحِيمُ", "الْمَلِكُ", "الْقُدُّوسُ", "السَّلَامُ",
      "النُّورُ", "الْهَادِي", "الْبَاقِي", "الْحَيُّ", "الْقَيُّومُ",
      "الم", "يس", "طه", "حم", "ق", "ن",
      "ا", "ب", "ج", "د", "ه", "و",
      "☉", "☽", "☿", "♀", "♂", "♃", "♄"
    ];

    // Purple, Blue, Cyan, Pink + thora sa Golden (~14%)
    const SMOKE_HUES = [
      275, 282, 268, 292, 262,   // Purple / Violet
      215, 222, 205, 232,        // Blue
      188, 194,                  // Cyan
      322, 332,                  // Pink
      44, 42                     // Thora Golden
    ];

    // Jugnu dots ke rang (Purple, Blue, Cyan, Pink, aur thora Golden)
    const DOT_HUES = [
      280, 290, 270,             // Purple
      210, 225,                  // Blue
      185, 195,                  // Cyan
      325, 338,                  // Pink
      45, 48                     // Thora Golden
    ];

    const TAU = Math.PI * 2;
    const rand = (a, b) => Math.random() * (b - a) + a;
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const smooth = (a, b, x) => {
      const v = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return v * v * (3 - 2 * v);
    };

    /* ---------- Original Coordinates from your Smoke.tsx ---------- */
    const CTRL_OVER = [
      [0, 0], [-45, -35], [-80, -75], [-80, -125], [-45, -165], [5, -178],
      [55, -150], [75, -105], [100, -85], [160, -85], [220, -120], [280, -165],
      [350, -190], [420, -225], [460, -250]
    ];

    const CTRL_UNDER = [
      [0, 0], [22, -40], [42, -88], [28, -135], [-20, -152], [-65, -122],
      [-62, -72], [-18, -58], [45, -68], [110, -95], [170, -112], [230, -147],
      [290, -177], [350, -202], [420, -232], [460, -250]
    ];

    const CTRL_DOWN = [
      [0, 0], [-25, 30], [-60, 70], [-92, 120], [-60, 150], [-15, 128],
      [-28, 88], [-70, 45], [-95, -10], [-80, -70], [-30, -108], [30, -122],
      [100, -118], [170, -130], [240, -155], [300, -185], [360, -210],
      [420, -235], [460, -250]
    ];

    const N = 220;

    function buildPath(ox, oy, k, sgn, reach, ctrl) {
      const pts = ctrl.map(([dx, dy]) => [ox + sgn * dx * k * reach, oy + dy * k]);
      const P = (i) => pts[Math.max(0, Math.min(pts.length - 1, i))];
      const dense = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
        for (let s = 0; s < 20; s++) {
          const t = s / 20, t2 = t * t, t3 = t2 * t;
          const cr = (a, b, c, d) =>
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

    /* ---------- Procedural Smoke & Firefly Dot Textures ---------- */
    const makeCanvas = (w, h) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      return c;
    };

    const hash = (x, y, s) => {
      let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 1442695041);
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
    };

    const vnoise = (x, y, s) => {
      const xi = Math.floor(x), yi = Math.floor(y);
      const xf = x - xi, yf = y - yi;
      const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
      const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    };

    const fbm = (x, y, s) => {
      let v = 0, a = 0.5, f = 1;
      for (let o = 0; o < 4; o++) {
        v += a * vnoise(x * f, y * f, s + o * 17);
        f *= 2;
        a *= 0.5;
      }
      return v;
    };

    const hslToRgb = (h, s, l) => {
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

    const noiseSprites = new Map();
    const getNoiseSprite = (hue, variant) => {
      const key = `${hue}|${variant}`;
      let c = noiseSprites.get(key);
      if (c) return c;
      const S = 128;
      c = makeCanvas(S, S);
      const g = c.getContext("2d");
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

    const softSprites = new Map();
    const getSoftSprite = (hue, light) => {
      const key = `${hue}|${light}`;
      let c = softSprites.get(key);
      if (c) return c;
      const S = 96;
      c = makeCanvas(S, S);
      const g = c.getContext("2d");
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

    // Jugnu (firefly) gol chamkeelay dots - no stars
    const sparkSprites = new Map();
    const getSparkSprite = (hue) => {
      let c = sparkSprites.get(hue);
      if (c) return c;
      const S = 48;
      c = makeCanvas(S, S);
      const g = c.getContext("2d");
      const gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
      gr.addColorStop(0, `hsla(${hue},100%,96%,1)`);
      gr.addColorStop(0.22, `hsla(${hue},100%,78%,0.85)`);
      gr.addColorStop(0.55, `hsla(${hue},95%,60%,0.25)`);
      gr.addColorStop(1, `hsla(${hue},100%,50%,0)`);
      g.fillStyle = gr;
      g.fillRect(0, 0, S, S);
      sparkSprites.set(hue, c);
      return c;
    };

    const glyphSprites = new Map();
    const getGlyphSprite = (text, hue, size) => {
      const px = Math.round(size);
      const key = `${text}|${hue}|${px}`;
      let c = glyphSprites.get(key);
      if (c) return c;
      const SC = 2;
      const pad = 16;
      const font = `${px * SC}px "Amiri","Noto Naskh Arabic","Times New Roman",serif`;
      const probe = makeCanvas(1, 1).getContext("2d");
      probe.font = font;
      const tw = Math.ceil(probe.measureText(text).width);
      c = makeCanvas(tw + pad * 2 * SC, px * SC * 2 + pad * 2 * SC);
      const g = c.getContext("2d");
      g.font = font;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.shadowColor = `hsla(${hue},100%,70%,1)`;
      g.shadowBlur = 16 * SC;
      g.fillStyle = `hsla(${hue},100%,92%,1)`;
      g.fillText(text, c.width / 2, c.height / 2);
      glyphSprites.set(key, c);
      return c;
    };

    /* ---------- Particle ---------- */
    class Particle {
      constructor(kind, glyphs) {
        this.kind = kind;
        this.x = 0;
        this.y = 0;
        this.u = 0;
        this.dx = 0;
        this.dy = 0;
        this.alpha = 0;
        this.variant = Math.floor(rand(0, 3));
        this.seed = rand(0, 1000);
        this.rad = Math.sqrt(rand(0.02, 1));
        this.th0 = rand(0, TAU);
        this.turns = rand(0.6, 1.7) * (Math.random() < 0.5 ? -1 : 1);
        this.spin = rand(0.15, 0.5) * (Math.random() < 0.5 ? -1 : 1);
        this.rot = rand(0, TAU);
        this.rotSpeed = rand(-0.004, 0.004);
        this.off = rand(-1, 1);
        this.text = "";

        if (kind === "puff") {
          this.hue = pick(SMOKE_HUES);
          this.size = rand(0.8, 1.3);
          this.baseAlpha = rand(0.07, 0.16);
          this.maxLife = rand(380, 520);
        } else if (kind === "wisp") {
          this.hue = pick(SMOKE_HUES);
          this.size = rand(0.7, 1.3);
          this.baseAlpha = rand(0.12, 0.26);
          this.maxLife = rand(360, 500);
        } else if (kind === "glyph") {
          this.text = pick(glyphs);
          this.hue = pick([280, 205, 325, 44]);
          this.size = rand(11, 18);
          this.baseAlpha = rand(0.8, 1);
          this.blinkRate = rand(1.2, 3);
          this.maxLife = rand(380, 520);
        } else {
          // 88% chotay barik dots, 12% kaheen-kaheen baray dots
          const isBig = Math.random() < 0.12;
          this.hue = pick(DOT_HUES);
          this.size = isBig ? rand(1.6, 2.5) : rand(0.42, 0.88);
          this.baseAlpha = isBig ? rand(0.9, 1) : rand(0.65, 0.95);
          this.blinkRate = rand(1.8, 4.2);
          this.maxLife = rand(380, 560);
        }
      }

      update(t, dt, wind, path, k) {
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
        const tx = ny;
        const ty = -nx;

        let offN = 0;
        let offT = 0;
        if (this.kind === "puff" || this.kind === "wisp") {
          const spread = this.kind === "puff" ? 6 + 52 * u : 4 + 30 * u;
          const r = this.rad * k * spread;
          const th = this.th0 + TAU * this.turns * u + t * this.spin;
          offN = Math.cos(th) * r + Math.sin(t * 0.7 + this.seed + u * 5) * k * 7;
          offT = Math.sin(th) * r * 0.7;
        } else if (this.kind === "glyph") {
          offN = this.off * k * (8 + 44 * u) + Math.sin(t * 0.9 + this.seed) * k * 6;
        } else {
          offN = this.off * k * (10 + 62 * u) + Math.sin(t * 0.7 + this.seed) * k * 5;
        }

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

        let wx = 0;
        let wy = 0;
        if (this.kind === "glyph" || this.kind === "spark") {
          wx = Math.sin(t * 0.6 + this.seed) * k * 9;
          wy = Math.cos(t * 0.5 + this.seed * 1.7) * k * 9;
        }

        this.x = px + nx * offN + tx * offT + this.dx + wx;
        this.y = py + ny * offN + ty * offT + this.dy + wy;
        this.rot += this.rotSpeed * dt;

        const env = smooth(0, 0.1, u) * (1 - smooth(0.6, 1, u));
        this.alpha = this.baseAlpha * env;
        if (this.kind === "glyph" || this.kind === "spark") {
          const b = 0.5 + 0.5 * Math.sin(t * this.blinkRate + this.seed);
          this.alpha *= 0.15 + 0.85 * b * b;
        }
      }

      draw(ctx, k) {
        if (this.alpha <= 0.003) return;
        const u = this.u;

        if (this.kind === "puff" || this.kind === "wisp") {
          const s = this.kind === "puff" ? k * (16 + 44 * u) * this.size : k * (7 + 16 * u) * this.size;
          ctx.globalAlpha = Math.min(1, this.alpha);
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rot);
          ctx.drawImage(getNoiseSprite(this.hue, this.variant), -s, -s, s * 2, s * 2);
          ctx.restore();
        } else if (this.kind === "spark") {
          const s = this.size * 3.0;
          ctx.globalAlpha = Math.min(1, this.alpha);
          ctx.drawImage(getSparkSprite(this.hue), this.x - s, this.y - s, s * 2, s * 2);
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

    /* ---------- Start Animation ---------- */
    (function init() {
      const canvas = document.getElementById("smokeCanvas");
      const parent = canvas.parentElement;
      const ctx = canvas.getContext("2d");

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const MAX = reduced ? 300 : 2400;
      const rate = reduced ? 0.3 : 1;
      const reach = Math.max(0.3, CONFIG.drift);
      const sgn = CONFIG.direction === "left" ? -1 : 1;
      const ctrl = CONFIG.spiral === "down" ? CTRL_DOWN : CONFIG.spiral === "under" ? CTRL_UNDER : CTRL_OVER;

      const ext = {
        up: -Math.min(...ctrl.map((c) => c[1])),
        down: Math.max(0, ...ctrl.map((c) => c[1])),
        fwd: Math.max(...ctrl.map((c) => c[0])),
        back: Math.max(0, -Math.min(...ctrl.map((c) => c[0])))
      };

      let w = 0, h = 0, k = 1;
      let path = buildPath(0, 0, 1, sgn, reach, ctrl);
      let particles = [];
      let t = 0;
      let last = performance.now();
      const acc = { puff: 0, wisp: 0, glyph: 0, spark: 0 };
      const wind = { x: 0, y: 0, px: -999, py: -999, power: 0 };

      for (const hue of SMOKE_HUES) for (let v = 0; v < 3; v++) getNoiseSprite(hue, v);
      for (const dh of DOT_HUES) getSparkSprite(dh);

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = parent.clientWidth;
        h = parent.clientHeight || 450;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const ox = w * CONFIG.originX;
        const oy = h * CONFIG.originY;
        const fwdAvail = CONFIG.direction === "left" ? ox : w - ox;
        const backAvail = CONFIG.direction === "left" ? w - ox : ox;
        const limits = [h / 478, (fwdAvail * 0.96) / (ext.fwd * reach), (oy * 0.97) / ext.up];
        if (ext.back > 0) limits.push((backAvail * 0.96) / (ext.back * reach));
        if (ext.down > 0) limits.push(((h - oy) * 0.97) / ext.down);
        k = Math.max(0.35, Math.min(...limits));
        path = buildPath(ox, oy, k, sgn, reach, ctrl);
      };
      resize();
      window.addEventListener("resize", resize);

      const onMove = (cx, cy) => {
        const r = canvas.getBoundingClientRect();
        const x = cx - r.left;
        const y = cy - r.top;
        wind.x = x - wind.px;
        wind.y = y - wind.py;
        wind.px = x;
        wind.py = y;
        wind.power = Math.min(1, Math.hypot(wind.x, wind.y) / 25);
      };
      window.addEventListener("mousemove", (e) => onMove(e.clientX, e.clientY));
      window.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });

      const emit = (kind) => {
        if (particles.length < MAX) particles.push(new Particle(kind, DEFAULT_GLYPHS));
      };

      const frame = (now) => {
        const dt = Math.min((now - last) / 16.667, 3) * CONFIG.speed;
        last = now;
        t += dt / 60;

        ctx.clearRect(0, 0, w, h);

        acc.puff += dt * 1.3 * rate;
        acc.wisp += dt * 1.6 * rate;
        if (CONFIG.showGlyphs) acc.glyph += dt * 0.16 * rate;
        acc.spark += dt * 1.15 * rate;

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

        if (CONFIG.debug) {
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
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    })();
  </script>
</body>
</html>

            
