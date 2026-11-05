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
    let globalTick = 0; // Ye smoke ko continuous ribbon wave banayega

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

    // Vector geometry for fantasy talismat
    const drawTalismanNode = (context: CanvasRenderingContext2D, type: number, size: number) => {
      context.beginPath();
      context.lineWidth = 1.5; 
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
      streamPhase: number; // Ribbon-like synchronized movement ke liye
      baseVy: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        // Naye lamp ki position lagbhag 72% right aur 52% top par hai
        this.x = canvasWidth * 0.72;
        this.y = canvasHeight * 0.52;
        
        this.char = '';
        this.sigilId = 0;
        this.streamPhase = globalTick * 0.015; // Ek sath paida hone wale particles ek jaisi wave banayenge

        const rand = Math.random();
        if (rand < 0.15) {
          this.type = 'runic';
          this.char = SPELLS[Math.floor(Math.random() * SPELLS.length)];
          this.size = Math.random() * 6 + 18;
        } else if (rand < 0.30) {
          this.type = 'sigil';
          this.sigilId = Math.floor(Math.random() * 3);
          this.size = Math.random() * 5 + 15;
        } else {
          this.type = 'gaseous';
          // Gaseous clouds ko bada rakha gaya hai volumetric smoke ke liye
          this.size = Math.random() * 45 + 30; 
        }

        // Left ki taraf strong cinematic flow
        this.vx = -(Math.random() * 1.8 + 1.2); 
        this.baseVy = (Math.random() - 0.5) * 0.8;
        this.vy = this.baseVy;
        
        this.alpha = this.type === 'gaseous' ? Math.random() * 0.15 + 0.05 : Math.random() * 0.7 + 0.3; 
        this.maxLife = Math.random() * 250 + 150;
        this.life = 0;
        
        // 🔮 EXACT IMAGE COLOR ENGINE: 60% Cyan/Teal (185), 40% Cosmic Gold (45)
        const colorRand = Math.random();
        if (colorRand < 0.60) {
          this.hue = Math.floor(Math.random() * 15) + 180; // Mystic Cyan Blue
        } else {
          this.hue = Math.floor(Math.random() * 15) + 35;  // Cosmic Talisman Gold
        }

        this.spin = (Math.random() - 0.5) * 0.04;
        this.angle = Math.random() * Math.PI;
      }

      update() {
        this.x += this.vx;
        
        // Synced Sine Wave: isse particles bikhrenge nahi, balki ribbons (lehron) mein chalenge
        const wave = Math.sin(this.life * 0.015 + this.streamPhase) * 1.2;
        this.y += this.baseVy + wave;
        
        this.life++;
        const progress = this.life / this.maxLife;

        // ✨ MAGICAL TEHLEEL TRANSFORMATION
        if (this.type !== 'gaseous' && progress > 0.55) {
          this.type = 'gaseous';
          this.size = Math.random() * 1.8 + 1.4; // Star dots mein badalna
          this.vx *= 0.95;
        } else if (this.type === 'gaseous') {
          if (this.size >= 4 && progress <= 0.6) {
            this.size += 0.25; // Smoke ka dhire-dhire phailna
          }
        }

        if (progress > 0.65) {
          this.alpha -= (this.type === 'gaseous' && this.size > 4) ? 0.003 : 0.015;
        }
      }

      draw(renderCtx: CanvasRenderingContext2D) {
        if (this.alpha <= 0) return;
        renderCtx.save();
        renderCtx.globalCompositeOperation = 'screen'; // Lighter/Screen for glowing magic

        if (this.type === 'runic') {
          renderCtx.translate(this.x, this.y);
          renderCtx.rotate(this.angle);
          renderCtx.font = `bold ${this.size}px "Times New Roman", Amiri, serif`;
          renderCtx.fillStyle = `hsla(${this.hue}, 100%, 85%, ${this.alpha})`;
          renderCtx.shadowColor = `hsla(${this.hue}, 100%, 65%, 1)`;
          renderCtx.shadowBlur = 20; 
          renderCtx.textAlign = 'center';
          renderCtx.textBaseline = 'middle';
          renderCtx.fillText(this.char, 0, 0);
        } else if (this.type === 'sigil') {
          renderCtx.translate(this.x, this.y);
          renderCtx.rotate(this.angle);
          renderCtx.strokeStyle = `hsla(${this.hue}, 100%, 80%, ${this.alpha})`;
          renderCtx.shadowColor = `hsla(${this.hue}, 100%, 60%, 1)`;
          renderCtx.shadowBlur = 15;
          drawTalismanNode(renderCtx, this.sigilId, this.size);
        } else {
          const isStarDot = this.size < 4;
          const radius = isStarDot ? this.size * 1.5 : this.size;
          const gradient = renderCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
          
          if (isStarDot) {
            const starBrightness = 80 + Math.sin(this.life * 0.6) * 20;
            renderCtx.shadowBlur = 12;
            renderCtx.shadowColor = `hsla(${this.hue}, 100%, 75%, ${this.alpha})`;
            gradient.addColorStop(0, `hsla(${this.hue}, 100%, ${starBrightness}%, ${this.alpha})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
          } else {
            // Intense volumetric gas gradient matching the image
            gradient.addColorStop(0, `hsla(${this.hue}, 90%, 65%, ${this.alpha})`);
            gradient.addColorStop(0.3, `hsla(${this.hue}, 80%, 50%, ${this.alpha * 0.4})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 50%, 20%, 0)`);
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
      globalTick++;

      // Spawning density badha di gayi hai taaki smoke "ribbons" gaps ke bina thick lagein
      if (particles.length < 800) {
        particles.push(new PremiumCinematicParticle(canvas.width, canvas.height));
        particles.push(new PremiumCinematicParticle(canvas.width, canvas.height)); // Double spawn for dense flow
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].alpha <= 0 || particles[i].x < -50) {
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
      <canvas ref={canvasRef} className="w-full h-full opacity-90" />
    </div>
  );
}
