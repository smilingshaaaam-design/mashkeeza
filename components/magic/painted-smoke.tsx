"use client";

import React from 'react';

// Image ke hisab se exact coordinates jahan smoke hai
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
      className={`absolute overflow-hidden ${className}`}
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
    <div className="pointer-events-none absolute inset-0">
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          {/* Flow Filter - Base movement ko smooth karne ke liye */}
          <filter id="smoke-flow" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.02" numOctaves="3" seed="2" result="noise">
              <animate
                attributeName="baseFrequency"
                dur="20s"
                values="0.01 0.02; 0.015 0.025; 0.01 0.02"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" xChannelSelector="R" yChannelSelector="G" scale="15">
              <animate attributeName="scale" dur="10s" values="15; 25; 15" repeatCount="indefinite" />
            </feDisplacementMap>
          </filter>

          {/* Curl Filter - Hawa ke swirls aur detail ke liye */}
          <filter id="smoke-curl" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.02 0.03" numOctaves="2" seed="5" result="noise">
              <animate
                attributeName="baseFrequency"
                dur="15s"
                values="0.02 0.03; 0.025 0.04; 0.02 0.03"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" xChannelSelector="G" yChannelSelector="B" scale="25">
              <animate attributeName="scale" dur="8s" values="20; 35; 20" repeatCount="indefinite" />
            </feDisplacementMap>
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>
      </svg>

      {/* Ye dono layers mil kar ek bahut rich, glowing aur moving smoke banayengi */}
      <SmokeLayer filter="smoke-flow" className="mix-blend-screen opacity-90" />
      <SmokeLayer filter="smoke-curl" className="mix-blend-screen opacity-70" />

      {/* Lamp Spout Glow - Image mein lamp ke muh ke paas ki chamak */}
      <div
        aria-hidden="true"
        className="lamp-spout-glow absolute rounded-full"
        style={{ 
          left: '79.5%', top: '68%', width: '3%', height: '6%', 
          boxShadow: '0 0 25px 10px rgba(255, 200, 100, 0.4)' 
        }}
      />
    </div>
  );
}
