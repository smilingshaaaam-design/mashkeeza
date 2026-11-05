"use client";

import React, { useEffect, useRef } from 'react';

const BOX = { left: 68.5, top: 21, width: 24, height: 50 };

// 1. VERTEX SHADER
const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// 2. FRAGMENT SHADER (Advanced Fluid Math)
const fragmentShaderSource = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;

  // Pseudo-random hash function
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // Smooth Value Noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
  }

  // Fractal Brownian Motion (FBM)
  float fbm(vec2 p) {
    float f = 0.0;
    float amp = 0.5;
    for(int i = 0; i < 6; i++) {
      f += amp * noise(p);
      p *= 2.02; 
      p.y -= u_time * 0.3; // Smoke rises upward
      p.x += sin(u_time * 0.15) * 0.1; // Gentle wind sway
      amp *= 0.5;
    }
    return f;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    // DOMAIN WARPING: Distorts space for organic smoke swirls
    vec2 q = vec2(0.0);
    q.x = fbm(uv + vec2(0.0, u_time * 0.05));
    q.y = fbm(uv + vec2(1.0, u_time * 0.05));

    vec2 r = vec2(0.0);
    r.x = fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.15 * u_time);
    r.y = fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.126 * u_time);

    float f = fbm(uv + r);

    // PLUME SHAPING
    float centerDist = abs(uv.x - 0.25 - (uv.y * 0.1) - sin(u_time * 0.8 + uv.y * 6.0) * 0.03);
    float width = 0.1 + (uv.y * 0.5); 
    
    float plumeMask = smoothstep(width, 0.0, centerDist);
    float verticalMask = smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.3, uv.y);
    float finalMask = plumeMask * verticalMask;

    // COLOR GRADING: Desert warm tones
    vec3 colorA = vec3(0.98, 0.94, 0.88); 
    vec3 colorB = vec3(0.85, 0.78, 0.72); 
    vec3 finalColor = mix(colorB, colorA, f * 1.5);

    // Alpha/Transparency calculation
    float alpha = f * finalMask * 2.0;

    gl_FragColor = vec4(finalColor, min(alpha, 1.0));
  }
`;

export function PaintedSmoke() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let animationId: number;
    const render = (time: number) => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(timeLocation, time * 0.001);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationId = requestAnimationFrame(render);
    };
    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        aria-hidden="true"
        className="absolute overflow-hidden"
        style={{
          left: `${BOX.left}%`,
          top: `${BOX.top}%`,
          width: `${BOX.width}%`,
          height: `${BOX.height}%`,
        }}
      >
        {/* Base Painted Background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/desert-scene.png"
          alt=""
          draggable={false}
          className="absolute max-w-none select-none opacity-40 mix-blend-overlay"
          style={{
            width: `${(100 / BOX.width) * 100}%`,
            height: `${(100 / BOX.height) * 100}%`,
            left: `${-(BOX.left / BOX.width) * 100}%`,
            top: `${-(BOX.top / BOX.height) * 100}%`,
          }}
        />

        {/* Elite WebGL Shader Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ mixBlendMode: 'screen' }} 
        />
      </div>

      {/* Realistic Lamp Spout Glow */}
      <div
        aria-hidden="true"
        className="lamp-spout-glow absolute rounded-full"
        style={{ 
          left: '73.2%', top: '61%', width: '6%', height: '14%',
          background: 'radial-gradient(circle, rgba(255,240,200,0.8) 0%, rgba(255,200,100,0) 70%)',
          boxShadow: '0 -5px 25px 10px rgba(255, 220, 150, 0.3)' 
        }}
      />
    </div>
  );
}
