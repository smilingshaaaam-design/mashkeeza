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
    let particles: any[] = [];

    // Roohani Jafri Calligraphy & Talismatic Glyphs Target Text Nodes
    const SPELLS = ['الله', 'ح', 'ط', 'ی', 'ق', 'ش', 'د', 'ج', 'ا', '۞', '✦', '✧', '☽'];

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 450;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Vector drawing for structural ancient talismat نقوش
    const drawTalismanNode = (ctx: CanvasRenderingContext2D, type: number, size: number) => {
      ctx.beginPath();
      ctx.lineWidth = 1.2;
      if (type === 0) {
        ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);
        ctx.moveTo(-size * 0.5, 0); ctx.lineTo(size * 0.5, 0);
        ctx.moveTo(0, -size * 0.5); ctx.lineTo(0, size * 0.5);
      } else if (type === 1) {
        for (let i = 0; i < 3; i++) {
          ctx.moveTo(-size * 0.7, 0); ctx.lineTo(size * 0.7, 0);
          ctx.beginPath(); ctx.arc(size * 0.7, 0, 2, 0, Math.PI * 2); ctx.fill();
          ctx.rotate(Math.PI / 3);
        }
      } else {
        ctx.moveTo(-size * 0.5, -size * 0.3); ctx.lineTo(size * 0.5, -size * 0.3);
        ctx.lineTo(0, size * 0.5); ctx.closePath();
      }
      ctx.stroke();
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

      constructor() {
        // Locked tightly onto the preview lamp's physical nozzle position
        this.x = canvas.width * 0.76;
        this.y = canvas.height * 0.64;
        
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

      draw() {
        if (this.alpha <= 0) return;
        ctx!.save();
        ctx!.globalCompositeOperation = 'lighter';

        if (this.type === 'runic') {
          ctx!.translate(this.x, this.y);
          ctx!.rotate(this.angle);
          ctx!.font = `bold ${this.size}px "Times New Roman", Amiri, serif`;
          ctx!.fillStyle = `hsla(${this.hue}, 100%, 78%, ${this.alpha * 0.95})`;
          ctx!.shadowColor = `hsla(${this.hue}, 100%, 60%, 0.8)`;
          ctx!.shadowBlur = 12;
          ctx!.textAlign = 'center';
          ctx!.textBaseline = 'middle';
          ctx!.fillText(this.char, 0, 0);
        } else if (this.type === 'sigil') {
          ctx!.translate(this.x, this.y);
          ctx!.rotate(this.angle);
          ctx!.strokeStyle = `hsla(${this.hue}, 100%, 75%, ${this.alpha})`;
          ctx!.fillStyle = `hsla(${this.hue}, 100%, 75%, ${this.alpha * 0.25})`;
          ctx!.shadowColor = `hsla(${this.hue}, 100%, 60%, 0.85)`;
          ctx!.shadowBlur = 14;
          drawTalismanNode(ctx!, this.sigilId, this.size);
        } else {
          const isStarDot = this.size < 4;
          const radius = isStarDot ? this.size * 1.3 : this.size;
          const gradient = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
          
          if (isStarDot) {
            const starBrightness = 75 + Math.sin(this.life * 0.5) * 25; // Continuous twinkle sequence
            gradient.addColorStop(0, `hsla(${this.hue}, 100%, ${starBrightness}%, ${this.alpha})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
          } else {
            gradient.addColorStop(0, `hsla(${this.hue}, 90%, 58%, ${this.alpha * 0.30})`);
            gradient.addColorStop(0.4, `hsla(${this.hue}, 80%, 48%, ${this.alpha * 0.08})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 50%, 35%, 0)`);
          }

          ctx!.fillStyle = gradient;
          ctx!.beginPath();
          ctx!.arc(this.x, this.y, radius, 0, Math.PI * 2);
          ctx!.fill();
        }

        ctx!.restore();
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (particles.length < 380 && Math.random() < 0.55) {
        particles.push(new PremiumCinematicParticle());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
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
