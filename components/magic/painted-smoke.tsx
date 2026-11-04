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
        filter: filter ? `url(#${filter})` : 'none',
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
          <filter id="smoke-flow" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.011 0.026" numOctaves="2" seed="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" xChannelSelector="R" yChannelSelector="G" scale="4" />
          </filter>
        </defs>
      </svg>

      {/* The base layer is kept completely static with no filter to ensure the lamp and background pixels never shake */}
      <SmokeLayer filter="" className="painted-smoke-base" />
      
      {/* A very subtle overlay with a near-zero scale to add a minor shimmer without breaking the asset shapes */}
      <SmokeLayer filter="smoke-flow" className="painted-smoke-glow mix-blend-screen opacity-30" />

      <div
        aria-hidden="true"
        className="lamp-spout-glow absolute rounded-full"
        style={{ left: '73.2%', top: '61%', width: '6%', height: '14%', background: 'transparent' }}
      />
    </div>
  )
}
