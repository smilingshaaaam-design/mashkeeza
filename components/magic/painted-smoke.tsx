import React from 'react';

/**
 * High-End Generative Magical Smoke Engine.
 * Completely hides the static printed JPEG smoke lines and replaces them with an
 * independent, organically swirling smoke simulation that rolls gracefully downwards 
 * towards the content cards and naturally dissolves into the atmosphere.
 */
const BOX = { left: 68.5, top: 21, width: 24, height: 50 };

export function PaintedSmoke() {
  return (
    <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
      {/* Custom Keyframes for independent organic floating fluid behavior */}
      <style>{`
        @keyframes spiritualSmokeFlow {
          0% {
            transform: translate(0, 0) scale(0.4) rotate(0deg);
            filter: blur(8px);
            opacity: 0;
          }
          15% {
            opacity: 0.75;
            filter: blur(12px);
          }
          45% {
            /* Pulls the smoke downwards and left towards the cards area */
            transform: translate(-12vw, 8vh) scale(1.4) rotate(-20deg);
            opacity: 0.65;
            filter: blur(20px);
          }
          75% {
            /* Drifts it gracefully upwards and fades out naturally */
            transform: translate(-28vw, -12vh) scale(2.2) rotate(-45deg);
            opacity: 0.25;
            filter: blur(32px);
          }
          100% {
            transform: translate(-40vw, -25vh) scale(2.8) rotate(-60deg);
            opacity: 0;
            filter: blur(45px);
          }
        }

        .mystical-plume-1 {
          animation: spiritualSmokeFlow 16s cubic-bezier(0.35, 0.1, 0.3, 1) infinite;
        }

        .mystical-plume-2 {
          animation: spiritualSmokeFlow 20s cubic-bezier(0.4, 0.15, 0.35, 1) infinite;
          animation-delay: 4s;
        }

        .mystical-plume-3 {
          animation: spiritualSmokeFlow 24s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
          animation-delay: 9s;
        }
      `}</style>

      {/* SVG Filters to give procedural cloud/smoke noise texture to the vectors */}
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          <filter id="smoke-texture-heavy" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.03" numOctaves="5" seed="66" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" xChannelSelector="R" yChannelSelector="G" scale="40" />
          </filter>
        </defs>
      </svg>

      {/* Bounding Box wrapper over the lamp spout */}
      <div 
        className="absolute"
        style={{
          left: `${BOX.left}%`,
          top: `${BOX.top}%`,
          width: `${BOX.width}%`,
          height: `${BOX.height}%`,
        }}
      >
        {/* Stream 1: Soft Golden Spiritual Core */}
        <div 
          className="mystical-plume-1 absolute bottom-[25%] right-[15%] w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(245,158,11,0.4) 0%, rgba(139,92,246,0.15) 50%, transparent 75%)',
            filter: 'url(#smoke-texture-heavy)',
            mixBlendMode: 'screen'
          }}
        />

        {/* Stream 2: Deep Mystical Violet Aura */}
        <div 
          className="mystical-plume-2 absolute bottom-[25%] right-[15%] w-40 h-40 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(167,139,250,0.35) 0%, rgba(56,189,248,0.1) 55%, transparent 80%)',
            filter: 'url(#smoke-texture-heavy)',
            mixBlendMode: 'color-dodge'
          }}
        />

        {/* Stream 3: Ethereal Vapor Wisps */}
        <div 
          className="mystical-plume-3 absolute bottom-[25%] right-[15%] w-28 h-28 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(124,58,237,0.1) 45%, transparent 70%)',
            filter: 'url(#smoke-texture-heavy)',
            mixBlendMode: 'screen'
          }}
        />
      </div>

      {/* Spout Glow (The magic origin point) */}
      <div
        aria-hidden="true"
        className="lamp-spout-glow absolute rounded-full blur-[2px] z-10"
        style={{ 
          left: '73.2%', 
          top: '60.5%', 
          width: '6.5%', 
          height: '14.5%',
          background: 'radial-gradient(circle at center, rgba(255,230,150,0.95) 0%, rgba(139,92,246,0.4) 45%, transparent 85%)',
          boxShadow: '0 0 35px 6px rgba(245,158,11,0.55), inset 0 0 12px rgba(255,255,255,0.5)',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}
