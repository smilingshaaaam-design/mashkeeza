'use client'

import React from 'react'

export function PaintedSmoke() {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      
      {/* 💨 FIXED PREMIUM GRADIENT SHIMMER OVERLAY (Exact area match) */}
      <div 
        className="absolute bottom-[26%] right-[8%] w-[35%] h-[45%] mix-blend-screen opacity-75 blur-md"
        style={{
          background: 'linear-gradient(0deg, rgba(168,85,247,0.3) 0%, rgba(236,72,153,0.1) 50%, transparent 100%)',
          maskImage: 'linear-gradient(to top, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
          animation: 'smokeShimmerFlow 7s infinite ease-in-out'
        }}
      />

      {/* ✨ CINEMATIC SPARKS (Bina image ya background ko disturb kiye) */}
      <div className="absolute bottom-[34%] right-[14%] w-24 h-48">
        <div className="absolute bottom-2 left-1/2 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-0" style={{ animation: 'sparkleUp 4s infinite linear' }} />
        <div className="absolute bottom-10 left-1/3 w-1 h-1 bg-white rounded-full opacity-0" style={{ animation: 'sparkleUp 5s infinite linear 1.2s' }} />
        <div className="absolute bottom-6 left-[60%] w-2 h-2 bg-purple-300 rounded-full opacity-0" style={{ animation: 'sparkleUp 4.5s infinite linear 2s' }} />
      </div>

      {/* Injection of clean standard CSS without touching image matrices */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes smokeShimmerFlow {
          0%, 100% { transform: translateY(5px) scaleX(0.95); opacity: 0.4; filter: blur(8px); }
          50% { transform: translateY(-15px) scaleX(1.05) skewX(-3deg); opacity: 0.7; filter: blur(14px); }
        }
        @keyframes sparkleUp {
          0% { transform: translateY(15px) translateX(0) scale(0.4); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(-130px) translateX(-40px) scale(0); opacity: 0; }
        }
      `}} />

    </div>
  )
}
