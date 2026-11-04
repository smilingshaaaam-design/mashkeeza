/**
 * Brings the smoke that is painted into desert-scene.png to life with a natural magical effect.
 * Uses optimized fractal noise and multi-layered motion for a realistic mystical glow.
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
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
    <div className="pointer-events-none absolute inset-0">
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          {/* Main rising flow of the natural smoke */}
          <filter id="smoke-flow" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.018" numOctaves="3" seed="5" result="noise">
              <animate
                attributeName="baseFrequency"
                dur="18s"
                values="0.008 0.018;0.012 0.024;0.006 0.014;0.008 0.018"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" xChannelSelector="R" yChannelSelector="G" scale="28">
              <animate attributeName="scale" dur="9s" values="20;38;25;20" repeatCount="indefinite" />
            </feDisplacementMap>
            <feGaussianBlur stdDeviation="2.5" />
          </filter>

          {/* Ethereal micro-curls for the magical aura */}
          <filter id="smoke-curl" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.015 0.035" numOctaves="3" seed="12" result="noise">
              <animate
                attributeName="baseFrequency"
                dur="12s"
                values="0.015 0.035;0.022 0.028;0.012 0.042;0.015 0.035"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" xChannelSelector="G" yChannelSelector="R" scale="40">
              <animate attributeName="scale" dur="6s" values="30;55;38;30" repeatCount="indefinite" />
            </feDisplacementMap>
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>
      </svg>

      {/* Layers blended dynamically for a deep, smoky look */}
      <SmokeLayer filter="smoke-flow" className="painted-smoke-base mix-blend-screen opacity-90" />
      <SmokeLayer filter="smoke-curl" className="painted-smoke-glow mix-blend-color-dodge opacity-60" />

      {/* Mystical glowing spout filter effect */}
      <div
        aria-hidden="true"
        className="lamp-spout-glow absolute rounded-full shadow-[0_0_30px_rgba(255,190,120,0.6)]"
        style={{ 
          left: '73.2%', 
          top: '61%', 
          width: '6%', 
          height: '14%',
          background: 'radial-gradient(circle, rgba(255,220,160,0.8) 0%, rgba(180,100,255,0.3) 50%, transparent 80%)'
        }}
      />
    </div>
  )
}
