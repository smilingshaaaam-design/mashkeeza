"use client";

import React, { useEffect, useRef } from 'react';

export function PaintedSmoke() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: PremiumCinematicParticle[] = [];

    // Pure Talismatic & Calligraphic Spell Nodes
    const SPELLS = ['الله', 'ح', 'ط', 'ی', 'ق', 'ش', 'د', 'ج', 'ا', '۞', '✦', '✧', '☽', '🔮', '✨'];

    const resizeCanvas = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight || 450;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Vector geometry for fantasy talismat نقوش
    const drawTalismanNode = (context: CanvasRenderingContext2D, type: number, size: number) => {
      context.beginPath();
      context.lineWidth = 1.5; // Thicker lines for more visibility
      if (type === 0) {
        context.arc(0, 0, size * 0.75, 0, Math.PI * 2);
        context.moveTo(-size * 0.55, 0); context.lineTo(size * 0.55, 0);
        context.moveTo(0, -size * 0.45); context.lineTo(0, size * 0.45);
      } else if (type === 1) {
        for (let i = 0; i < 3; i++) {
          context.moveTo(-size * 0.75, 0); context.lineTo(size * 0.75, 0);
          context.beginPath(); context.arc(size * 0.75, 0, 3, 0, Math.PI * 2); context.fill();
          context.rotate(Math.PI / 3);
        }
      } else {
        context.moveTo(-size * 0.55, -size * 0.35); context.lineTo(size * 0.55, -size * 0.35);
        context.lineTo(0, size * 0.55); context.closePath();
      }
      context.stroke();
    };

    class PremiumCinematicParticle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      maxLife: number;
      life: number;
      hue: number;
      type: 'gaseous' | 'runic' | 'sigil';
      char: string;
      sigilId: number;
      spin: number;
      angle: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        // Precise lock on the lamp nozzle focal path
        this.x = canvasWidth * 0.76;
        this.y = canvasHeight * 0.64;
        
        this.char = '';
        this.sigilId = 0;

        const rand = Math.random();
        if (rand < 0.25) {
          this.type = 'runic';
          this.char = SPELLS[Math.floor(Math.random() * SPELLS.length)];
          this.size = Math.random() * 6 + 15;
        } else if (rand < 0.48) {
          this.type = 'sigil';
          this.sigilId = Math.floor(Math.random() * 3);
          this.size = Math.random() * 5 + 13;
        } else {
          this.type = 'gaseous';
          this.size = Math.random() * 32 + 22; // Bigger sizes for volumetric feel
        }

        // Horizontal fantasy fluid vectors
        this.vx = -(Math.random() * 1.5 + 0.9);
        this.vy = -(Math.random() * 0.45 + 0.1);
        this.alpha = Math.random() * 0.6 + 0.4; // Brighter opacity
        this.maxLife = Math.random() * 170 + 120;
        this.life = 0;
        
        // 🔮 COLOR PALETTE ENGINE: 45% Purple-Violet (275), 35% Cyan (188), 20% Wizard Gold (44)
        const colorRand = Math.random();
        if (colorRand < 0.45) {
          this.hue = 275; // Magical Fantasy Purple / Neon Violet
        } else if (colorRand < 0.80) {
          this.hue = 188; // Mystic Cyan Blue
        } else {
          this.hue = 44;  // Cosmic Talisman Gold
        }

        this.spin = (Math.random() - 0.5) * 0.06;
        this.angle = Math.random() * Math.PI;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;

        // High fidelity wavy organic oscillation
        this.vy += Math.sin(this.life * 0.022) * 0.045;
        this.vx += Math.cos(this.life * 0.012) * 0.012;

        const progress = this.life / this.maxLife;

        // ✨ MAGICAL TEHLEEL TRANSFORMATION
        if (this.type !== 'gaseous' && progress > 0.48) {
          this.type = 'gaseous';
          this.size = Math.random() * 1.8 + 1.4; // Morphs down smoothly into sharp vector dot star
          this.vx *= 0.91; // Slow down drift velocities to create a shimmery twinkle effect
        } else if (this.type === 'gaseous' && this.size >= 4) {
          if (progress <= 0.48) this.size += 0.32; // Thick volumetric expansion loop
        }

        if (progress > 0.68) {
          this.alpha -= 0.012;
        }
      }

      draw(renderCtx: CanvasRenderingContext2D) {
        if (this.alpha <= 0) return;
        renderCtx.save();
        renderCtx.globalCompositeOperation = 'lighter';

        if (this.type === 'runic') {
          renderCtx.translate(this.x, this.y);
          renderCtx.rotate(this.angle);
          renderCtx.font = `bold ${this.size}px "Times New Roman", Amiri, serif`;
          renderCtx.fillStyle = `hsla(${this.hue}, 100%, 78%, ${this.alpha * 0.95})`;
          renderCtx.shadowColor = `hsla(${this.hue}, 100%, 65%, 0.85)`;
          renderCtx.shadowBlur = 16; // Vibrant outer glow
          renderCtx.textAlign = 'center';
          renderCtx.textBaseline = 'middle';
          renderCtx.fillText(this.char, 0, 0);
        } else if (this.type === 'sigil') {
          renderCtx.translate(this.x, this.y);
          renderCtx.rotate(this.angle);
          renderCtx.strokeStyle = `hsla(${this.hue}, 100%, 75%, ${this.alpha})`;
          renderCtx.fillStyle = `hsla(${this.hue}, 100%, 75%, ${this.alpha * 0.28})`;
          renderCtx.shadowColor = `hsla(${this.hue}, 100%, 60%, 0.9)`;
          renderCtx.shadowBlur = 18;
          drawTalismanNode(renderCtx, this.sigilId, this.size);
        } else {
          const isStarDot = this.size < 4;
          const radius = isStarDot ? this.size * 1.4 : this.size;
          const gradient = renderCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
          
          if (isStarDot) {
            // High frequency organic rapid star twinkling sequence
            const starBrightness = 78 + Math.sin(this.life * 0.55) * 22;
            renderCtx.shadowBlur = 10;
            renderCtx.shadowColor = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;
            gradient.addColorStop(0, `hsla(${this.hue}, 100%, ${starBrightness}%, ${this.alpha})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
          } else {
            // Gaseous volumetric clouds strings
            gradient.addColorStop(0, `hsla(${this.hue}, 95%, 55%, ${this.alpha * 0.38})`);
            gradient.addColorStop(0.4, `hsla(${this.hue}, 85%, 45%, ${this.alpha * 0.12})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 50%, 30%, 0)`);
          }

          renderCtx.fillStyle = gradient;
          renderCtx.beginPath();
          renderCtx.arc(this.x, this.y, radius, 0, Math.PI * 2);
          renderCtx.fill();
        }

        renderCtx.restore();
      }
    }

    const render = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Higher generation threshold for dense fluid look (0.75 frequency)
      if (particles.length < 550 && Math.random() < 0.75) {
        particles.push(new PremiumCinematicParticle(canvas.width, canvas.height));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].alpha <= 0 || particles[i].x < 15 || particles[i].y < 15) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      <canvas ref={canvasRef} className="w-full h-full mix-blend-screen opacity-95" />
    </div>
  );
}
