"use client";

import React from 'react';

export function PaintedSmoke() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      
      {/* 🔮 LAYER 1: VIBRANT AURA GLOW OVERLAY */}
      {/* Yeh layer image ke static purple smoke ke pure area par halki chamak peda karegi */}
      <div 
        className="absolute bottom-[35%] right-[6%] w-[25%] h-[40%] mix-blend-screen opacity-70 blur-xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom, rgba(168, 85, 247, 0.45) 0%, rgba(236, 72, 153, 0.15) 50%, transparent 80%)',
          animation: 'smokeAtmospherePulse 6s infinite ease-in-out'
        }}
      />

      {/* 💨 LAYER 2: PREMIUM SMOOTH VIDEO SMOKE FLOW (Exact Curve Target) */}
      {/* Yeh image ke static dhuwan ke upar video jaisa floating movement effect overlay karega */}
      <div 
        className="absolute bottom-[38%] right-[8%] w-[18%] h-[38%] mix-blend-screen opacity-0 blur-2xl rounded-full"
        style={{
          background: 'linear-gradient(0deg, rgba(147, 51, 234, 0.5) 0%, rgba(219, 39, 119, 0.2) 60%, transparent 100%)',
          animation: 'trueFluidFlow1 8s infinite ease-in-out',
          transformOrigin: 'bottom right'
        }}
      />

      {/* 💨 LAYER 3: CROSS CONTOUR STREAM (For depth) */}
      <div 
        className="absolute bottom-[40%] right-[12%] w-[15%] h-[35%] mix-blend-screen opacity-0 blur-3xl rounded-full"
        style={{
          background: 'linear-gradient(0deg, rgba(192, 132, 252, 0.4) 0%, rgba(79, 70, 229, 0.1) 50%, transparent 100%)',
          animation: 'trueFluidFlow2 11s infinite ease-in-out 2s',
          transformOrigin: 'bottom right'
        }}
      />

      {/* ✨ LAYER 4: MAGICAL GOLDEN & PURPLE SPARKS */}
      {/* Chirag ke munh se nikal kar dhuwan ke sath upar ki taraf tairte hue sitare */}
      <div className="absolute bottom-[36%] right-[11%] w-20 h-64">
        <div className="absolute bottom-2 left-1/2 w-1.5 h-1.5 bg-amber-300 rounded-full opacity-0" style={{ animation: 'sparkleFloatingRise 4s infinite linear' }} />
        <div className="absolute bottom-14 left-1/4 w-1 h-1 bg-white rounded-full opacity-0" style={{ animation: 'sparkleFloatingRise 5s infinite linear 0.9s' }} />
        <div className="absolute bottom-8 left-[70%] w-1.5 h-1.5 bg-fuchsia-300 rounded-full opacity-0" style={{ animation: 'sparkleFloatingRise 4.5s infinite linear 1.8s' }} />
      </div>

      {/* High-End Cinematic Web Animations Engine */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes smokeAtmospherePulse {
          0%, 100% { opacity: 0.5; transform: scale(0.98); filter: blur(14px); }
          50% { opacity: 0.8; transform: scale(1.02); filter: blur(20px); }
        }
        @keyframes trueFluidFlow1 {
          0% { transform: translateY(40px) scale(0.7) rotate(0deg); opacity: 0; }
          20% { opacity: 0.7; }
          50% { transform: translateY(-80px) scale(1.4) translateX(-40px) rotate(-18deg); opacity: 0.4; }
          100% { transform: translateY(-210px) scale(2.0) translateX(-90px) rotate(-35deg); opacity: 0; }
        }
        @keyframes trueFluidFlow2 {
          0% { transform: translateY(50px) scale(0.6) rotate(0deg); opacity: 0; }
          25% { opacity: 0.6; }
          65% { transform: translateY(-110px) scale(1.5) translateX(30px) rotate(15deg); opacity: 0.3; }
          100% { transform: translateY(-240px) scale(2.2) translateX(60px) rotate(40deg); opacity: 0; }
        }
        @keyframes sparkleFloatingRise {
          0% { transform: translateY(20px) translateX(0) scale(0.3); opacity: 0; filter: drop-shadow(0 0 2px rgba(253,224,71,0.6)); }
          30% { opacity: 1; }
          100% { transform: translateY(-170px) translateX(-60px) scale(0); opacity: 0; }
        }
      `}} />

    </div>
  );
}
