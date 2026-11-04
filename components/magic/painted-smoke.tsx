import React from 'react';

/**
 * Genuine Fluid-Dynamic Wave Smoke Component.
 * Specifically engineered for mashkeeza-e-roohaniat.pages.dev.
 * Warps the absolute borders of the printed image to make the static smoke lines 
 * physically rise and lift upwards, blending seamlessly into the night sky.
 */
const BOX = { left: 68.5, top: 21, width: 24, height: 50 };

const crop = {
  width: `${(100 / BOX.width) * 100}%`,
  height: `${(100 / BOX.height) * 100}%`,
  left: `${-(BOX.left / BOX.width) * 100}%`,
  top: `${-(BOX.top / BOX.height) * 100}%`,
};

function SmokeLayer({ filter, className }: { filter: string; className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`painted-smoke absolute overflow-hidden ${className}`}
      style={{
        left: `${BOX.left}%`,
        top: `${BOX.top}%`,
        width: `${BOX.width}%`,
        height: `${BOX.height}%`,
        filter: `url(#${filter})`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/desert-scene.png"
        alt=""
        draggable={false}
        className="absolute max-w-none select-none"
        style={crop}
      />
    </div>
  );
}

export function PaintedSmoke() {
  return (
    <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          {/* Main Wave Filter: Bends and pushes the whole printed image shape upward */}
          <filter id="natural-smoke-flow" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.010" numOctaves="4" seed="85" result="noise" />
            
            {/* Creates an ongoing upward current loop for the static smoke pixels */}
            <feOffset dx="0" dy="0" in="noise" result="flowingNoise">
              <animate attributeName="dy" dur="18s" values="0; -280" repeatCount="indefinite" />
              <animate attributeName="dx" dur="22s" values="0; 35; -35; 0" repeatCount="indefinite" />
            </feOffset>

            {/* Powerful scale that aggressively warps the fixed boundaries into living waves */}
            <feDisplacementMap in="SourceGraphic" in2="flowingNoise" xChannelSelector="R" yChannelSelector="G" scale="55">
              <animate attributeName="scale" dur="12s" values="40;65;50;40" repeatCount="indefinite" />
            </feDisplacementMap>
            
            <feGaussianBlur stdDeviation="3.8" />
          </filter>

          {/* Micro-Swirl Filter: Blends soft gas physics inside the core moving flow */}
          <filter id="natural-smoke-curl" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="turbulence" baseFrequency="0.010 0.022" numOctaves="3" seed="44" result="noise2" />
            <feOffset dx="0" dy="0" in="noise2" result="swirlingNoise">
              <animate attributeName="dy" dur="14s" values="0; -200" repeatCount="indefinite" />
              <animate attributeName="dx" dur="16s" values="0; -25; 25; 0" repeatCount="indefinite" />
            </feOffset>
            <feDisplacementMap in="SourceGraphic" in2="swirlingNoise" xChannelSelector="G" yChannelSelector="R" scale="40" />
            <feGaussianBlur stdDeviation="4.8" />
          </filter>
        </defs>
      </svg>

      <SmokeLayer filter="natural-smoke-flow" className="painted-smoke-base mix-blend-screen opacity-95" />
      <SmokeLayer filter="natural-smoke-curl" className="painted-smoke-glow mix-blend-color-dodge opacity-65" />

      {/* Balanced glow on the lamp spout */}
      <div
        aria-hidden="true"
        className="lamp-spout-glow absolute rounded-full blur-[2px] z-10"
        style={{ 
          left: '73.2%', 
          top: '60.5%', 
          width: '6.5%', 
          height: '14.5%',
          background: 'radial-gradient(circle at center, rgba(255,225,140,0.85) 0%, rgba(139,92,246,0.3) 50%, transparent 85%)',
          boxShadow: '0 0 35px 5px rgba(245,158,11,0.5)',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}
