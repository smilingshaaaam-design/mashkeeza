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

    // Elegant, authentic calligraphic and clean talismanic shapes (No messy layout symbols)
    const SPELLS = ['الله', 'نور', 'حق', '۞', '✦', '✧', '◈', '☼', '☽'];

    const resizeCanvas = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight || 450;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Ultra-clean vector lines for authentic talismans
    const drawCleanTalisman = (context: CanvasRenderingContext2D, type: number, size: number) => {
      context.beginPath();
      context.lineWidth = 1.3;
      if (type === 0) {
        // Linear alignment grid seal
        context.arc(0, 0, size * 0.65, 0, Math.PI * 2);
        context.moveTo(-size * 0.65, 0); context.lineTo(size * 0.65, 0);
      } else if (type === 1) {
        // Pure symmetrical constellation focus node
        for (let i = 0; i < 4; i++) {
          context.moveTo(-size * 0.7, 0); context.lineTo(size * 0.7, 0);
          context.rotate(Math.PI / 4);
        }
      } else {
        // Concentric geometric balance ring
        context.arc(0, 0, size * 0.6, 0, Math.PI * 2);
        context.stroke();
        context.beginPath();
        context.arc(0, 0, size * 0.2, 0, Math.PI * 2);
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
      waveOffset: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        // Exact nozzle target lock
        this.x = canvasWidth * 0.76;
        this.y = canvasHeight * 0.64;
        
        this.char = '';
        this.sigilId = 0;
        this.waveOffset = Math.random() * Math.PI * 2;

        const rand = Math.random();
        if (rand < 0.20) {
          this.type = 'runic';
          this.char = SPELLS[Math.floor(Math.random() * SPELLS.length)];
          this.size = Math.random() * 4 + 13;
        } else if (rand < 0.40) {
          this.type = 'sigil';
          this.sigilId = Math.floor(Math.random() * 3);
          this.size = Math.random() * 3 + 11;
        } else {
          this.type = 'gaseous';
          // 💨 Incense stick effect: Initial size is kept small to make a tight long string
          this.size = Math.random() * 12 + 8; 
        }

        // Fast horizontal drift to pull the smoke into a long line across the screen
        this.vx = -(Math.random() * 2.2 + 1.6); 
        this.vy = -(Math.random() * 0.2 + 0.05);
        this.alpha = Math.random() * 0.6 + 0.4;
        
        // ⏳ LONGER LIFETIME: Particles stay alive much longer to reach the far left of the screen
        this.maxLife = Math.random() * 240 + 180; 
        this.life = 0;
        
        // Color mix engine: 50% Deep Fantasy Purple (275), 35% Mystic Cyan (188), 15% Soft Gold (44)
        const colorRand = Math.random();
        if (colorRand < 0.50) {
          this.hue = 275; 
        } else if (colorRand < 0.85) {
          this.hue = 188; 
        } else {
          this.hue = 44;  
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;

        // Tight ribbon-like sine wave mapping to simulate a beautiful waving incense trail
        this.vy += Math.sin(this.life * 0.04 + this.waveOffset) * 0.035;

        const progress = this.life / this.maxLife;

        // ✨ SMOOTH TEHLEEL TRANSFORMATION
        if (this.type !== 'gaseous' && progress > 0.45) {
          this.type = 'gaseous';
          this.size = Math.random() * 1.5 + 1.1; // Morph down cleanly into dot star sparks
          this.vx *= 0.95; 
        } else if (this.type === 'gaseous' && this.size >= 4) {
          // Slow geometric expansion so the line doesn't blow up too fast into big clouds
          if (progress <= 0.6) this.size += 0.08; 
        }

        if (progress > 0.75) {
          this.alpha -= 0.008;
        }
      }

      draw(renderCtx: CanvasRenderingContext2D) {
        if (this.alpha <= 0) return;
        renderCtx.save();
        renderCtx.globalCompositeOperation = 'lighter';

        if (this.type === 'runic') {
          renderCtx.translate(this.x, this.y);
          renderCtx.font = `bold ${this.size}px "Times New Roman", Amiri, serif`;
          renderCtx.fillStyle = `hsla(${this.hue}, 100%, 80%, ${this.alpha})`;
          renderCtx.shadowColor = `hsla(${this.hue}, 100%, 65%, 0.8)`;
          renderCtx.shadowBlur = 12;
          renderCtx.textAlign = 'center';
          renderCtx.textBaseline = 'middle';
          renderCtx.fillText(this.char, 0, 0);
        } else if (this.type === 'sigil') {
          renderCtx.translate(this.x, this.y);
          renderCtx.strokeStyle = `hsla(${this.hue}, 100%, 75%, ${this.alpha})`;
          renderCtx.fillStyle = `hsla(${this.hue}, 100%, 75%, ${this.alpha * 0.2})`;
          renderCtx.shadowColor = `hsla(${this.hue}, 100%, 65%, 0.8)`;
          renderCtx.shadowBlur = 14;
          drawCleanTalisman(renderCtx, this.sigilId, this.size);
        } else {
          const isStarDot = this.size < 4;
          const radius = isStarDot ? this.size * 1.4 : this.size;
          const gradient = renderCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
          
          if (isStarDot) {
            const starBrightness = 78 + Math.sin(this.life * 0.5) * 22;
            renderCtx.shadowBlur = 8;
            renderCtx.shadowColor = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;
            gradient.addColorStop(0, `hsla(${this.hue}, 100%, ${starBrightness}%, ${this.alpha})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
          } else {
            // Tight and focused glowing trail colors
            gradient.addColorStop(0, `hsla(${this.hue}, 95%, 58%, ${this.alpha * 0.40})`);
            gradient.addColorStop(0.5, `hsla(${this.hue}, 85%, 45%, ${this.alpha * 0.12})`);
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

      // Higher max count to allow the long ribbon trail to populate fully without breaking
      if (particles.length < 650 && Math.random() < 0.85) {
        particles.push(new PremiumCinematicParticle(canvas.width, canvas.height));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].alpha <= 0 || particles[i].x < 10 || particles[i].y < 10) {
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
