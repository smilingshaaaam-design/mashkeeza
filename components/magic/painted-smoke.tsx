import React from 'react'

/**
 * Advanced Dynamic Magical Smoke Filter.
 * Strictly relies on SVG vector displacement (feTurbulence + feOffset).
 * Zero CSS viewport transforms to ensure 100% pixel-safe bounding.
 */
const BOX = { left: 68.5, top: 21, width: 24, height: 50 }

const crop = {
  width: `${(100 / BOX.width) * 100}%`,
  height: `${(100 / BOX.height) * 100}%`,
  left: `${-(BOX.left / BOX.width) * 100}%`,
  top: `${-(BOX.top / BOX.height) * 100}%`,
}

function SmokeLayer({ filter, className, opacity = 1 }: { filter: string; className: string; opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute overflow-hidden ${className}`}
      style={{
        left: `${BOX.left}%`,
        top: `${BOX.top}%`,
        width: `${BOX.width}%`,
        height: `${BOX.height}%`,
        filter: `url(#${filter})`,
        opacity: opacity,
        // CSS Masking ensures the smoke dissolves softly into the air at the bounds, preventing hard clipping.
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 65%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 80%)',
        maskImage: 'radial-gradient(ellipse at 50% 65%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 80%)',
      }}
    >
      <img
        src="/images/desert-scene.png"
        alt=""
        draggable={false}
        className="absolute max-w-none select-none"
        style={crop}
      />
    </div>
  )
}

export function PaintedSmoke() {
  return (
    <div className="pointer-events-none absolute inset-0 select-none">
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          {/* 
            LAYER 1: Active Flow Motion 
            Deep, slow billows pulling the pixels upward and swirling horizontally.
          */}
          <filter id="magical-fluid-flow" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves="5" seed="42" result="noise" />
            
            {/* Drives the noise texture mathematically to simulate intense internal flow */}
            <feOffset dx="0" dy="0" in="noise" result="movingNoise">
              <animate attributeName="dx" dur="24s" values="0; 65; -45; 0" repeatCount="indefinite" />
              <animate attributeName="dy" dur="20s" values="0; -90; 35; 0" repeatCount="indefinite" />
            </feOffset>

            <feDisplacementMap in="SourceGraphic" in2="movingNoise" xChannelSelector="R" yChannelSelector="G" scale="35">
              <animate attributeName="scale" dur="18s" values="25; 48; 32; 25" repeatCount="indefinite" />
            </feDisplacementMap>
            
            {/* Deep blur required for ethereal atmosphere blending */}
            <feGaussianBlur stdDeviation="3.8" />
          </filter>

          {/* 
            LAYER 2: Downward Curl & Mystical Density
            Finer frequencies mapping inverse channels to force the visual weight downwards.
          */}
          <filter id="magical-fluid-curl" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.024" numOctaves="5" seed="88" result="noise" />
            
            <feOffset dx="0" dy="0" in="noise" result="driftingNoise">
              <animate attributeName="dx" dur="18s" values="0; -55; 35; 0" repeatCount="indefinite" />
              {/* Positive dy values pull the displacement mapping downward in a looping loop */}
              <animate attributeName="dy" dur="22s" values="0; 85; -25; 0" repeatCount="indefinite" />
            </feOffset>

            {/* Inversing R and G channels creates a vastly different, chaotic swirling contour */}
            <feDisplacementMap in="SourceGraphic" in2="driftingNoise" xChannelSelector="G" yChannelSelector="R" scale="42">
              <animate attributeName="scale" dur="16s" values="30; 55; 38; 30" repeatCount="indefinite" />
            </feDisplacementMap>
            
            {/* Harsher blur on the micro-curls to blend seamlessly into the base layer */}
            <feGaussianBlur stdDeviation="4.5" />
          </filter>
        </defs>
      </svg>

      {/* Layer 1: Base Flow - Captures the primary light */}
      <SmokeLayer 
        filter="magical-fluid-flow" 
        className="mix-blend-screen" 
        opacity={0.9} 
      />
      
      {/* Layer 2: Heavy Curl - Pushes glowing color dodges through the downward loop */}
      <SmokeLayer 
        filter="magical-fluid-curl" 
        className="mix-blend-color-dodge" 
        opacity={0.65} 
      />

      {/* Origin Light/Lamp Spout Glow matching night sky palette */}
      <div
        aria-hidden="true"
        className="lamp-spout-glow absolute rounded-full blur-[2px]"
        style={{ 
          left: '73.2%', 
          top: '60.5%', 
          width: '6.5%', 
          height: '14.5%',
          background: 'radial-gradient(circle at center, rgba(255,230,150,0.9) 0%, rgba(139,92,246,0.35) 50%, transparent 85%)',
          boxShadow: '0 0 35px 5px rgba(245,158,11,0.4)',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  )
}
