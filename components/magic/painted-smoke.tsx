import React from 'react';

const BOX = { left: 68.5, top: 21, width: 24, height: 50 };

const crop = {
  width: `${(100 / BOX.width) * 100}%`,
  height: `${(100 / BOX.height) * 100}%`,
  left: `${-(BOX.left / BOX.width) * 100}%`,
  top: `${-(BOX.top / BOX.height) * 100}%`,
};

function SmokeLayer({ filter, className, children }: { filter: string; className: string; children?: React.ReactNode }) {
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
      }}
    >
      {children || (
        <img
          src="/images/desert-scene.png"
          alt=""
          draggable={false}
          className="absolute max-w-none select-none opacity-40"
          style={crop}
        />
      )}
    </div>
  );
}

export function PaintedSmoke() {
  return (
    <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
      {/* CSS Animations injected for the exact organic, swirling, and twinkling effects */}
      <style>{`
        @keyframes driftLeftAndDissolve {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0; }
          20% { opacity: 0.85; }
          60% { transform: translate(-25vw, -5vh) scale(1.6) rotate(-15deg); opacity: 0.6; }
          80% { transform: translate(-40vw, -15vh) scale(2.2) rotate(-25deg); opacity: 0; }
          100% { transform: translate(-50vw, -20vh) scale(2.5) rotate(-30deg); opacity: 0; }
        }
        
        @keyframes starTwinkle {
          0% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.5); }
          100% { opacity: 0; transform: scale(0.5); }
        }

        @keyframes floatStars {
          0% { transform: translate(0, 0); opacity: 0; }
          60% { opacity: 0; }
          80% { transform: translate(-40vw, -15vh); opacity: 1; }
          100% { transform: translate(-55vw, -25vh); opacity: 0; }
        }

        .magical-drift {
          animation: driftLeftAndDissolve 12s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
        }

        .magical-drift-delayed {
          animation: driftLeftAndDissolve 12s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
          animation-delay: 6s;
        }

        .stardust-layer {
          animation: floatStars 12s linear infinite;
        }
        
        .stardust-layer-delayed {
          animation: floatStars 12s linear infinite;
          animation-delay: 6s;
        }
      `}</style>

      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          {/* Active Flow Filter: Organic, chaotic movement for realistic smoke */}
          <filter id="magical-fluid-smoke" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.015" numOctaves="5" seed="42" result="noise" />
            <feOffset dx="0" dy="0" in="noise" result="movingNoise">
              <animate attributeName="dx" dur="20s" values="0; -150; -300" repeatCount="indefinite" />
              <animate attributeName="dy" dur="15s" values="0; -80; 0" repeatCount="indefinite" />
            </feOffset>
            <feDisplacementMap in="SourceGraphic" in2="movingNoise" xChannelSelector="R" yChannelSelector="G" scale="70">
              <animate attributeName="scale" dur="10s" values="50;90;60;50" repeatCount="indefinite" />
            </feDisplacementMap>
            <feGaussianBlur stdDeviation="6" result="blur" />
          </filter>

          {/* Stardust Filter: Converts graphics into tiny twinkling stars */}
          <filter id="stardust-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="2" seed="12" result="stars" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -20" in="stars" result="starMask" />
            <feComposite operator="in" in="SourceGraphic" in2="starMask" />
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
        </defs>
      </svg>

      {/* --- Smoke Stream 1 --- */}
      <div className="magical-drift absolute inset-0 origin-bottom-right">
        {/* Base distorted environment */}
        <SmokeLayer filter="magical-fluid-smoke" className="mix-blend-screen" />
        {/* Colored Magical Aura that moves left */}
        <SmokeLayer filter="magical-fluid-smoke" className="mix-blend-color-dodge opacity-80">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.6)_0%,rgba(56,189,248,0.3)_40%,transparent_70%)]" />
        </SmokeLayer>
      </div>

      {/* --- Smoke Stream 2 (Delayed for continuous flow) --- */}
      <div className="magical-drift-delayed absolute inset-0 origin-bottom-right">
        <SmokeLayer filter="magical-fluid-smoke" className="mix-blend-color-dodge opacity-60">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.5)_0%,rgba(236,72,153,0.3)_40%,transparent_70%)]" />
        </SmokeLayer>
      </div>

      {/* --- Stardust / Twinkling Stars Layer (Appears as smoke dissolves) --- */}
      <div className="stardust-layer absolute inset-0 pointer-events-none">
        <SmokeLayer filter="stardust-effect" className="mix-blend-screen">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,rgba(253,224,71,0.8)_30%,transparent_60%)] animate-[starTwinkle_2s_ease-in-out_infinite]" />
        </SmokeLayer>
      </div>
      <div className="stardust-layer-delayed absolute inset-0 pointer-events-none">
        <SmokeLayer filter="stardust-effect" className="mix-blend-screen">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,rgba(167,139,250,0.8)_30%,transparent_60%)] animate-[starTwinkle_3s_ease-in-out_infinite_reverse]" />
        </SmokeLayer>
      </div>

      {/* Spout Glow (Origin point) */}
      <div
        aria-hidden="true"
        className="absolute rounded-full blur-[2px] z-10"
        style={{ 
          left: '73.2%', 
          top: '60.5%', 
          width: '6.5%', 
          height: '14.5%',
          background: 'radial-gradient(circle at center, rgba(255,230,150,0.95) 0%, rgba(139,92,246,0.6) 50%, transparent 85%)',
          boxShadow: '0 0 50px 10px rgba(245,158,11,0.5), inset 0 0 20px rgba(255,255,255,0.8)',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}
