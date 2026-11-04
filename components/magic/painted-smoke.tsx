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
          <filter id="smoke-flow" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.014" numOctaves="4" seed="7" result="noise">
              <animate
                attributeName="baseFrequency"
                dur="22s"
                values="0.006 0.014;0.009 0.020;0.005 0.011;0.006 0.014"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" xChannelSelector="R" yChannelSelector="G" scale="26">
              <animate attributeName="scale" dur="11s" values="18;34;24;18" repeatCount="indefinite" />
            </feDisplacementMap>
            <feGaussianBlur stdDeviation="3.2" />
          </filter>

          <filter id="smoke-curl" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="turbulence" baseFrequency="0.014 0.032" numOctaves="3" seed="15" result="noise">
              <animate
                attributeName="baseFrequency"
                dur="15s"
                values="0.014 0.032;0.020 0.025;0.010 0.038;0.014 0.032"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" xChannelSelector="G" yChannelSelector="R" scale="38">
              <animate attributeName="scale" dur="8s" values="26;48;34;26" repeatCount="indefinite" />
            </feDisplacementMap>
            <feGaussianBlur stdDeviation="4.5" />
          </filter>
        </defs>
      </svg>

      <SmokeLayer filter="smoke-flow" className="painted-smoke-base mix-blend-screen opacity-95" />
      <SmokeLayer filter="smoke-curl" className="painted-smoke-glow mix-blend-color-dodge opacity-70" />

      <div
        aria-hidden="true"
        className="lamp-spout-glow absolute rounded-full blur-[2px]"
        style={{ 
          left: '73.2%', 
          top: '60.5%', 
          width: '6.5%', 
          height: '14.5%',
          background: 'radial-gradient(circle at center, rgba(255,215,130,0.9) 0%, rgba(147,51,234,0.4) 45%, rgba(7,10,31,0) 80%)',
          boxShadow: '0 0 35px 5px rgba(251,191,36,0.5), inset 0 0 15px rgba(255,255,255,0.4)',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  )
}
