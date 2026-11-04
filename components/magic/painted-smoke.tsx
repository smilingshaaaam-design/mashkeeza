/**
 * Real Fluid-Dynamic Smoke Component.
 * Transforms the static/fixed printed smoke into a single, cohesive flowing wave.
 * Instead of vibrating inside the lines, it warps the actual boundaries of the plume
 * to make the entire original smoke look like it is actively rising and curling.
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
          {/* Main Wave Filter: Warps the entire shape of the static smoke */}
          <filter id="natural-smoke-flow" x="-30%" y="-30%" width="160%" height="160%">
            {/* Lower base frequency creates giant, smooth wind waves instead of tiny fractal vibrations */}
            <feTurbulence type="fractalNoise" baseFrequency="0.005 0.012" numOctaves="3" seed="85" result="noise" />
            
            {/* Continuous vertical looping vector that pulls the entire smoke texture upwards */}
            <feOffset dx="0" dy="0" in="noise" result="flowingNoise">
              <animate attributeName="dy" dur="20s" values="0; -250" repeatCount="indefinite" />
              <animate attributeName="dx" dur="25s" values="0; 40; -40; 0" repeatCount="indefinite" />
            </feOffset>

            {/* High scale forces the fixed edges of the image to bend and curl realistically */}
            <feDisplacementMap in="SourceGraphic" in2="flowingNoise" xChannelSelector="R" yChannelSelector="G" scale="48">
              <animate attributeName="scale" dur="14s" values="35;60;45;35" repeatCount="indefinite" />
            </feDisplacementMap>
            
            {/* Heavily blurs the dissolving top edge so it blends into the night sky */}
            <feGaussianBlur stdDeviation="3.5" />
          </filter>

          {/* Micro-Swirl Filter: Blended overlay to add gas physics to the core wave */}
          <filter id="natural-smoke-curl" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="turbulence" baseFrequency="0.012 0.025" numOctaves="3" seed="44" result="noise2" />
            <feOffset dx="0" dy="0" in="noise2" result="swirlingNoise">
              <animate attributeName="dy" dur="15s" values="0; -180" repeatCount="indefinite" />
              <animate attributeName="dx" dur="18s" values="0; -30; 30; 0" repeatCount="indefinite" />
            </feOffset>
            <feDisplacementMap in="SourceGraphic" in2="swirlingNoise" xChannelSelector="G" yChannelSelector="R" scale="35" />
            <feGaussianBlur stdDeviation="4.5" />
          </filter>
        </defs>
      </svg>

      {/* Layer 1: Core heavy wave distortion that deforms the fixed image shapes */}
      <SmokeLayer filter="natural-smoke-flow" className="painted-smoke-base mix-blend-screen opacity-95" />
      
      {/* Layer 2: Soft micro-fluid details that make the internal texture look like real gas */}
      <SmokeLayer filter="natural-smoke-curl" className="painted-smoke-glow mix-blend-color-dodge opacity-60" />

      {/* Spout Glow matching the overall spiritual night sky tone */}
      <div
        aria-hidden="true"
        className="lamp-spout-glow absolute rounded-full blur-[2px] z-10"
        style={{ 
          left: '73.2%', 
          top: '60.5%', 
          width: '6.5%', 
          height: '14.5%',
          background: 'radial-gradient(circle at center, rgba(255,220,140,0.85) 0%, rgba(139,92,246,0.3) 50%, transparent 85%)',
          boxShadow: '0 0 35px 5px rgba(245,158,11,0.5)',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}
