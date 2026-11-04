import React from 'react';

/**
 * High-End Mathematical Fluid Dynamic Smoke Component.
 * Restricts all movements deep inside the native image matrix of the smoke plume.
 * Zero CSS translates ensure absolute pixel safety for the background desert and cards,
 * while multi-octave fractal offsets create an active, looping spiritual curl.
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
          {/* Layer 1: Core Fluid Wave - Simulates rising gaseous smoke loops */}
          <filter id="fluid-smoke-stream" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.016" numOctaves="5" seed="101" result="noise" />
            
            {/* Smooth vector translation loop that stays completely within bounds */}
            <feOffset dx="0" dy="0" in="noise" result="driftingNoise">
              <animate attributeName="dx" dur="24s" values="0; 20; -15; 0" repeatCount="indefinite" />
              <animate attributeName="dy" dur="18s" values="0; -45; -20; 0" repeatCount="indefinite" />
            </feOffset>

            <feDisplacementMap in="SourceGraphic" in2="driftingNoise" xChannelSelector="R" yChannelSelector="G" scale="24">
              <animate attributeName="scale" dur="12s" values="18;32;22;18" repeatCount="indefinite" />
            </feDisplacementMap>
            <feGaussianBlur stdDeviation="3.0" />
          </filter>

          {/* Layer 2: Mystical Curl - Creates the rolling, twisting downward wave effect towards the content */}
          <filter id="mystical-smoke-curl" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.015 0.030" numOctaves="4" seed="202" result="noise2" />
            <feOffset dx="0" dy="0" in="noise2" result="rollingNoise">
              <animate attributeName="dx" dur="16s" values="0; -25; 15; 0" repeatCount="indefinite" />
              <animate attributeName="dy" dur="22s" values="0; 35; 10; 0" repeatCount="indefinite" />
            </feOffset>
            <feDisplacementMap in="SourceGraphic" in2="rollingNoise" xChannelSelector="G" yChannelSelector="R" scale="35">
              <animate attributeName="scale" dur="9s" values="24;42;28;24" repeatCount="indefinite" />
            </feDisplacementMap>
            <feGaussianBlur stdDeviation="4.2" />
          </filter>
        </defs>
      </svg>

      {/* Layer 1: Natural deep rising smoke flow */}
      <SmokeLayer filter="fluid-smoke-stream" className="painted-smoke-base mix-blend-screen opacity-95" />
      
      {/* Layer 2: Bal khaata hua aura wave that bends gracefully downwards */}
      <SmokeLayer filter="mystical-smoke-curl" className="painted-smoke-glow mix-blend-color-dodge opacity-70" />

      {/* Premium balanced spiritual glow tailored perfectly to the dark night desert */}
      <div
        aria-hidden="true"
        className="lamp-spout-glow absolute rounded-full blur-[2px] z-10"
        style={{ 
          left: '73.2%', 
          top: '60.5%', 
          width: '6.5%', 
          height: '14.5%',
          background: 'radial-gradient(circle at center, rgba(255,225,145,0.9) 0%, rgba(139,92,246,0.35) 45%, transparent 80%)',
          boxShadow: '0 0 35px 5px rgba(245,158,11,0.5)',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}
