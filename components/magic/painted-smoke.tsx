"use client"; // Next.js ke Canvas components ke liye yeh line sab se upar hona zaroori hai

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const PARTICLE_COUNT = 1500;

function SmokeParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const noise3D = useMemo(() => createNoise3D(), []);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    const colorSource = new THREE.Color('#ffaa00'); 
    const colorEnd = new THREE.Color('#00bbff');    

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.1;
      pos[i * 3 + 1] = Math.random() * 0.2; 
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      const ratio = i / PARTICLE_COUNT;
      const mixedColor = colorSource.clone().lerp(colorEnd, ratio);
      
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const geometry = pointsRef.current.geometry;
    const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let x = positionAttribute.getX(i);
      let y = positionAttribute.getY(i);
      let z = positionAttribute.getZ(i);

      y += 0.02; 

      const noiseX = noise3D(x * 2, y * 0.5, time * 0.5);
      const noiseZ = noise3D(z * 2, y * 0.5, time * 0.5);

      x += noiseX * 0.015;
      z += noiseZ * 0.015;

      if (y > 4) {
        x = (Math.random() - 0.5) * 0.1;
        y = 0; 
        z = (Math.random() - 0.5) * 0.1;
      }

      positionAttribute.setXYZ(i, x, y, z);
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default function MagicSmokeScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0a0a16' }}>
      {/* Yahan camera position set karke syntax fix kar diya hai */}
      <Canvas camera={{ position:, fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <SmokeParticles />
      </Canvas>
    </div>
  );
}
