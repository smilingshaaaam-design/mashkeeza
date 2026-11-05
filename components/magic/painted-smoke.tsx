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

    // Roohani Jafri Calligraphy & Talismatic Glyphs Target Text Nodes
    const SPELLS = ['الله', 'ح', 'ط', 'ی', 'ق', 'ش', 'د', 'ج', 'ا', '۞', '✦', '✧', '☽'];

    const resizeCanvas = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight || 450;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Vector drawing for structural ancient talismat نقوش
    const drawTalismanNode = (context: CanvasRenderingContext2D, type: number, size: number) => {
      context.beginPath();
      context.lineWidth = 1.2;
      if (type === 0) {
        context.arc(0, 0, size * 0.7, 0, Math.PI * 2);
        context.moveTo(-size * 0.5, 0); context.lineTo(size * 0.5, 0);
        context.moveTo(0, -size * 0.4); context.lineTo(0, size * 0.4);
      } else if (type === 1) {
        for (let i = 0; i < 3; i++) {
          context.moveTo(-size * 0.7, 0); context.lineTo(size * 0.7, 0);
          context.beginPath(); context.arc(size * 0.7, 0, 2, 0, Math.PI * 2); context.fill();
          context.rotate(Math.PI / 3);
        }
      } else {
        context.moveTo(-size * 0.5, -size * 0.3); context.lineTo(size * 0.5, -size * 0.3);
        context.lineTo(0, size * 0.5); context.closePath();
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
        // Locked tightly onto the preview lamp's physical nozzle position
        this.x = canvasWidth * 0.76;
        this.y = canvasHeight * 0.64;
        
        this.char = '';
        this.sigilId = 0;

        const rand = Math.random();
        if (rand < 0.22) {
          this.type = 'runic';
          this.char = SPELLS[Math.floor(Math.random() * SPELLS.length)];
          this.size = Math.random() * 5 + 14;
        } else if (rand < 0.42) {
          this.type = 'sigil';
          this.sigilId = Math.floor(Math.random() * 3);
          this.size = Math.random() * 4 + 11;
        } else {
          this.type = 'gaseous';
          this.size = Math.random() * 28 + 18;
        }

        // Exact right-to-left horizontal fluid drift velocity matching the image curves
        this.vx = -(Math.random() * 1.6 + 1.1);
        this.vy = -(Math.random() * 0.45 + 0.1);
        this.alpha = Math.random() * 0.55 + 0.35;
        this.maxLife = Math.random() * 150 + 110;
        this.life = 0;
        
        // Exact color mesh nodes match: Cyan-Blue (188) and Wizard Mystic Gold (44)
        this.hue = Math.random() < 0.55 ? 188 : 44;
        this.spin = (Math.random() - 0.5) * 0.05;
        this.angle = Math.random() * Math.PI;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;

        // Natural wavy oscillation dynamics (Organic wave physics)
        this.vy += Math.sin(this.life * 0.025) * 0.04;
        this.vx += Math.cos(this.life * 0.015) * 0.01;

        const progress = this.life / this.maxLife;

        // ✨ TEHLEEL SYSTEM: Glyphs morph into crisp twinkling starry dots at 50% marker
        if (this.type !== 'gaseous' && progress > 0.50) {
          this.type = 'gaseous';
          this.size = Math.random() * 1.5 + 1.2; 
          this.vx *= 0.92; // Horizontally lock velocities to twinkle seamlessly
        } else if (this.type === 'gaseous' && this.size >= 4) {
          if (progress <= 0.50) this.size += 0.25; // Continuous gas plume volumetric scaling
        }

        if (progress > 0.70) {
          this.alpha -= 0.009;
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
          renderCtx.shadowColor = `hsla(${this.hue}, 100%, 60%, 0.8)`;
          renderCtx.shadowBlur = 12;
          renderCtx.textAlign = 'center';
          renderCtx.textBaseline = 'middle';
          renderCtx.fillText(this.char, 0, 0);
        } else if (this.type === 'sigil') {
          renderCtx.translate(this.x, this.y);
          renderCtx.rotate(this.angle);
          renderCtx.strokeStyle = `hsla(${this.hue}, 100%, 75%, ${this.alpha})`;
          renderCtx.fillStyle = `hsla(${this.hue}, 100%, 75%, ${this.alpha * 0.25})`;
          renderCtx.shadowColor = `hsla(${this.hue}, 100%, 60%, 0.85)`;
          renderCtx.shadowBlur = 14;
          drawTalismanNode(renderCtx, this.sigilId, this.size);
        } else {
          const isStarDot = this.size < 4;
          const radius = isStarDot ? this.size * 1.3 : this.size;
          const gradient = renderCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
          
          if (isStarDot) {
            const starBrightness = 75 + Math.sin(this.life * 0.5) * 25; // Continuous twinkle sequence
            gradient.addColorStop(0, `hsla(${this.hue}, 100%, ${starBrightness}%, ${this.alpha})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
          } else {
            gradient.addColorStop(0, `hsla(${this.hue}, 90%, 58%, ${this.alpha * 0.30})`);
            gradient.addColorStop(0.4, `hsla(${this.hue}, 80%, 48%, ${this.alpha * 0.08})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 50%, 35%, 0)`);
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

      if (particles.length < 380 && Math.random() < 0.55) {
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
