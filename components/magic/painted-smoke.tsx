"use client";

import React from 'react';

export function PaintedSmoke() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      
      {/* 💨 LAYER 1: BASE MAGIC GLOW OVERLAY */}
      {/* Yeh layer background ke static smoke ke upar ek smooth glowing atmosphere banayegi */}
      <div 
        className="absolute bottom-[24%] right-[8%] w-[38%] h-[50%] mix-blend-screen opacity-80 blur-md pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom right, rgba(147, 51, 234, 0.4) 0%, rgba(236, 72, 153, 0.15) 40%, transparent 70%)',
          animation: 'premiumAuraPulse 5s infinite ease-in-out'
        }}
      />

      {/* 💨 LAYER 2: VOLUMETRIC SMOKE STREAM A (Left Curve Fluid Movement) */}
      <div 
        className="absolute bottom-[28%] right-[12%] w-[25%] h-[45%] mix-blend-screen opacity-0 blur-xl rounded-full"
        style={{
          background: 'linear-gradient(0deg, rgba(168, 85, 247, 0.5) 0%, rgba(99, 102, 241, 0.2) 60%, transparent 100%)',
          animation: 'videoFluidSmoke1 8s infinite ease-in-out',
          transformOrigin: 'bottom right'
        }}
      />

      {/* 💨 LAYER 3: VOLUMETRIC SMOKE STREAM B (Cross Wave Pattern) */}
      <div 
        className="absolute bottom-[30%] right-[10%] w-[20%] h-[40%] mix-blend-screen opacity-0 blur-2xl rounded-full"
        style={{
          background: 'linear-gradient(0deg, rgba(236, 72, 153, 0.4) 0%, rgba(147, 51, 234, 0.1) 50%, transparent 100%)',
          animation: 'videoFluidSmoke2 11s infinite ease-in-out 1.5s',
          transformOrigin: 'bottom right'
        }}
      />

      {/* ✨ LAYER 4: CINEMATIC SPARKS (Chirag se nikalne wale barik sitare) */}
      <div className="absolute bottom-[32%] right-[15%] w-24 h-48">
        <div className="absolute bottom-2 left-1/2 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-0" style={{ animation: 'sparkleRiseUp 4s infinite linear' }} />
        <div className="absolute bottom-10 left-1/4 w-1 h-1 bg-white rounded-full opacity-0" style={{ animation: 'sparkleRiseUp 5s infinite linear 0.8s' }} />
        <div className="absolute bottom-6 left-[65%] w-1.5 h-1.5 bg-purple-300 rounded-full opacity-0" style={{ animation: 'sparkleRiseUp 4.5s infinite linear 1.8s' }} />
      </div>

      {/* Pure CSS Engine - Cloudflare standard compilation target */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes premiumAuraPulse {
          0%, 100% { opacity: 0.6; filter: blur(10px); }
          50% { opacity: 0.85; filter: blur(16px); }
        }
        @keyframes videoFluidSmoke1 {
          0% { transform: translateY(30px) scale(0.6) rotate(0deg); opacity: 0; }
          20% { opacity: 0.75; }
          50% { transform: translateY(-70px) scale(1.3) translateX(-30px) rotate(-15deg); opacity: 0.45; }
          100% { transform: translateY(-190px) scale(1.8) translateX(-70px) rotate(-35deg); opacity: 0; }
        }
        @keyframes videoFluidSmoke2 {
          0% { transform: translateY(40px) scale(0.5) rotate(0deg); opacity: 0; }
          25% { opacity: 0.65; }
          60% { transform: translateY(-90px) scale(1.4) translateX(20px) rotate(15deg); opacity: 0.35; }
          100% { transform: translateY(-220px) scale(2.0) translateX(45px) rotate(35deg); opacity: 0; }
        }
        @keyframes sparkleRiseUp {
          0% { transform: translateY(15px) translateX(0) scale(0.3); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(-150px) translateX(-50px) scale(0); opacity: 0; }
        }
      `}} />

    </div>
  );
}
