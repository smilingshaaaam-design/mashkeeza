import React, { useEffect, useRef } from 'react';

const BOX = { left: 68.5, top: 21, width: 24, height: 50 };

type Particle = {
  x: number;
  y: number;
  vx: number; // Velocity X
  vy: number; // Velocity Y
  size: number;
  life: number;
  maxLife: number;
  angle: number;
  spin: number;
};

export function ElitePaintedSmoke() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Resize handling
    const updateSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // 1. ELITE TRICK: Pre-render a realistic smoke puff texture on an offscreen canvas
    // Ye performance ko boost karta hai aur real smoke gradient deta hai
    const textureSize = 128;
    const smokeTexture = document.createElement('canvas');
    smokeTexture.width = textureSize;
    smokeTexture.height = textureSize;
    const tCtx = smokeTexture.getContext('2d')!;
    const gradient = tCtx.createRadialGradient(
      textureSize / 2, textureSize / 2, 0,
      textureSize / 2, textureSize / 2, textureSize / 2
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)'); // Bright core
    gradient.addColorStop(0.3, 'rgba(220, 225, 235, 0.2)'); // Mid tone
    gradient.addColorStop(1, 'rgba(180, 190, 200, 0)'); // Faded edge
    tCtx.fillStyle = gradient;
    tCtx.fillRect(0, 0, textureSize, textureSize);

    // Spawning logic (relative to the lamp's spout)
    const getSpawnPos = () => ({
      x: canvas.width * 0.19, // Adjusted for the BOX layout
      y: canvas.height * 0.85,
    });

    const createParticle = () => {
      const pos = getSpawnPos();
      particles.push({
        x: pos.x + (Math.random() * 15 - 7.5),
        y: pos.y + (Math.random() * 10 - 5),
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(Math.random() * 1.2 + 0.8), // Moves UP
        size: Math.random() * 20 + 30, // Starts small
        life: 0,
        maxLife: Math.random() * 150 + 150,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Elite Compositing for volumetric feel
      ctx.globalCompositeOperation = 'screen'; 

      // Spawn new particles continuously
      if (Math.random() < 0.6) createParticle(); // Higher density
      if (Math.random() < 0.2) createParticle(); 

      particles.forEach((p, index) => {
        p.life++;

        // Remove dead particles
        if (p.life >= p.maxLife) {
          particles.splice(index, 1);
          return;
        }

        // 2. ELITE PHYSICS: Fluid turbulence and wind drag
        const progress = p.life / p.maxLife;
        p.vy *= 0.995; // Air resistance
        p.x += p.vx + Math.sin(p.life * 0.02 + p.y * 0.01) * 0.6; // Organic wind drift
        p.y += p.vy;
        p.size += 0.4; // Smoke expands as it rises
        p.angle += p.spin;

        // Smooth Fade-in and Fade-out (Bell curve opacity)
        let opacity = 1;
        if (progress < 0.1) opacity = progress * 10; // Fast fade in
        else opacity = 1 - Math.pow(progress, 2); // Slow, natural fade out
        
        ctx.globalAlpha = Math.max(0, opacity);

        // Draw pre-rendered texture with rotation
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.drawImage(
          smokeTexture,
          -p.size / 2,
          -p.size / 2,
          p.size,
          p.size
        );
        ctx.rotate(-p.angle);
        ctx.translate(-p.x, -p.y);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        aria-hidden="true"
        className="absolute overflow-hidden"
        style={{
          left: `${BOX.left}%`,
          top: `${BOX.top}%`,
          width: `${BOX.width}%`,
          height: `${BOX.height}%`,
          // 3. ELITE CSS TRICK: Metaball fluid merging
          // Ye blur aur contrast particles ko aapas mein completely blend kar dega
          filter: 'blur(3px) contrast(1.1) brightness(1.2)',
        }}
      >
        {/* Background Painted Image (Base) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/desert-scene.png"
          alt=""
          draggable={false}
          className="absolute max-w-none select-none opacity-20 mix-blend-overlay"
          style={{
            width: `${(100 / BOX.width) * 100}%`,
            height: `${(100 / BOX.height) * 100}%`,
            left: `${-(BOX.left / BOX.width) * 100}%`,
            top: `${-(BOX.top / BOX.height) * 100}%`,
          }}
        />

        {/* Dynamic Volumetric Canvas Smoke Layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-90"
        />
      </div>

      {/* Lamp Spout Glow */}
      <div
        aria-hidden="true"
        className="lamp-spout-glow absolute rounded-full"
        style={{ 
          left: '73.2%', top: '61%', width: '6%', height: '14%',
          boxShadow: '0 0 15px 5px rgba(255, 230, 180, 0.4)' // Added realistic warm glow
        }}
      />
    </div>
  );
}
