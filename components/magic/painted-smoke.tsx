/**
 * Advanced Dynamic Magical Smoke Filter.
 * Animates both the texture distortion AND the directional flow so the smoke 
 * actively rises, loops downwards towards cards, and naturally dissolves into the air.
 */
const BOX = { left: 68.5, top: 21, width: 24, height: 50 }

const crop = {
  width: `${(100 / BOX.width) * 100}%`,
  height: `${(100 / BOX.height) * 100}%`,
  left: `${-(BOX.left / BOX.width) * 100}%`,
  top: `${-(BOX.top / BOX.height) * 100}%`,
}

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
          {/* Active Flow Filter: Animates noise position to make smoke move actively */}
          <filter id="magical-fluid-smoke" x="-40%" y="-40%" width="180%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.022" numOctaves="4" seed="42" result="noise" />
            
            {/* Moves the noise texture over time to create a flowing animation */}
            <feOffset dx="0" dy="0" in="noise" result="movingNoise">
              <animate attributeName="dx" dur="14s" values="0; 80; -40; 0" repeatCount="indefinite" />
              <animate attributeName="dy" dur="12s" values="0; -120; -60; 0" repeatCount="indefinite" />
            </feOffset>

            <feDisplacementMap in="SourceGraphic" in2="movingNoise" xChannelSelector="R" yChannelSelector="G" scale="42">
              <animate attributeName="scale" dur="8s" values="30;55;40;30" repeatCount="indefinite" />
            </feDisplacementMap>
            <feGaussianBlur stdDeviation="3.8" />
          </filter>

          {/* Heavy Curl Filter: Directs smoke to bend and sway downwards */}
          <filter id="smoke-downward-curl" x="-40%" y="-40%" width="180%" height="180%">
            <feTurbulence type="turbulence" baseFrequency="0.018 0.04" numOctaves="3" seed="88" result="noise" />
            <feOffset dx="0" dy="0" in="noise" result="driftingNoise">
              <animate attributeName="dx" dur="10s" values="0; -60; 30; 0" repeatCount="indefinite" />
              <animate attributeName="dy" dur="16s" values="0; 90; 40; 0" repeatCount="indefinite" />
            </feOffset>
            <feDisplacementMap in="SourceGraphic" in2="driftingNoise" xChannelSelector="G" yChannelSelector="R" scale="55">
              <animate attributeName="scale" dur="7s" values="40;65;48;40" repeatCount="indefinite" />
            </feDisplacementMap>
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
      </svg>

      {/* Layer 1: Base active flow */}
      <SmokeLayer filter="magical-fluid-smoke" className="painted-smoke-base mix-blend-screen opacity-90 transition-all duration-1000" />
      
      {/* Layer 2: Heavy curls mapping that pulls the visual weight downwards */}
      <SmokeLayer filter="smoke-downward-curl" className="painted-smoke-glow mix-blend-color-dodge opacity-75" />

      {/* Spout Glow with deep spiritual center */}
      <div
        aria-hidden="true"
        className="lamp-spout-glow absolute rounded-full blur-[1px]"
        style={{ 
          left: '73.2%', 
          top: '60.5%', 
          width: '6.5%', 
          height: '14.5%',
          background: 'radial-gradient(circle at center, rgba(255,230,150,0.95) 0%, rgba(139,92,246,0.5) 40%, rgba(7,10,31,0) 85%)',
          boxShadow: '0 0 40px 8px rgba(245,158,11,0.6), inset 0 0 20px rgba(255,255,255,0.5)',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  )
}
