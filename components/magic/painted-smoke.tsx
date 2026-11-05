"use client";

import React from 'react';

export function PaintedSmoke() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      
      {/* 💨 LIQUID MASK LAYER 1: Yeh original image ke dhuwan ko select karke use wave motion deta hai */}
      <div 
        className="absolute bottom-[28%] right-[5%] w-[32%] h-[50%] mix-blend-screen opacity-90"
        style={{
          backgroundImage: "url('/images/desert-scene.png')",
          backgroundPosition: "92% 64%", // Exact position of purple smoke stream in the image
          backgroundSize: "330%",        // Zoom on the smoke area without cropping the original component
          animation: 'magicSmokeWave1 8s infinite ease-in-out',
          maskImage: 'radial-gradient(circle at bottom right, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at bottom right, black 20%, transparent 80%)',
        }}
      />

      {/* 💨 LIQUID MASK LAYER 2: Double depth wave jo static look ko poori tarah khatam kar degi */}
      <div 
        className="absolute bottom-[30%] right-[7%] w-[30%] h-[48%] mix-blend-screen opacity-75 blur-[2px]"
        style={{
          backgroundImage: "url('/images/desert-scene.png')",
          backgroundPosition: "91% 63%",
          backgroundSize: "330%",
          animation: 'magicSmokeWave2 11s infinite ease-in-out 1.5s',
          maskImage: 'radial-gradient(circle at bottom right, black 10%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(circle at bottom right, black 10%, transparent 90%)',
        }}
      />

      {/* ✨ CINEMATIC SPARKS (Chirag ke muh se nikalne wale magical particles) */}
      <div className="absolute bottom-[36%] right-[11%] w-20 h-64">
        <div className="absolute bottom-2 left-1/2 w-1.5 h-1.5 bg-amber-300 rounded-full opacity-0" style={{ animation: 'sparkleRise 4s infinite linear' }} />
        <div className="absolute bottom-14 left-1/4 w-1 h-1 bg-white rounded-full opacity-0" style={{ animation: 'sparkleRise 5s infinite linear 0.8s' }} />
        <div className="absolute bottom-8 left-[70%] w-1.5 h-1.5 bg-fuchsia-300 rounded-full opacity-0" style={{ animation: 'sparkleRise 4.5s infinite linear 1.8s' }} />
      </div>

      {/* Pure Inline CSS Animation Engine without Server Errors */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes magicSmokeWave1 {
          0%, 100% { transform: translateY(0px) scaleX(1) skewX(0deg); filter: blur(2px) hue-rotate(0deg); }
          50% { transform: translateY(-15px) scaleX(1.08) skewX(-4deg); filter: blur(4px) hue-rotate(15deg); }
        }
        @keyframes magicSmokeWave2 {
          0%, 100% { transform: translateY(5px) scaleX(0.95) skewX(0deg); filter: blur(3px); }
          50% { transform: translateY(-25px) scaleX(1.05) skewX(3deg); filter: blur(6px); }
        }
        @keyframes sparkleRise {
          0% { transform: translateY(20px) translateX(0) scale(0.3); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(-180px) translateX(-50px) scale(0); opacity: 0; }
        }
      `}} />

    </div>
  );
}
