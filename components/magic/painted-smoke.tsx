import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise'; // For turbulent smoke path

const PARTICLE_COUNT = 1500;

function SmokeParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const noise3D = useMemo(() => createNoise3D(), []);

  // Generate initial particle properties
  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const size = new Float32Array(PARTICLE_COUNT);

    const colorSource = new THREE.Color('#ffaa00'); // Orange/Yellow at lamp
    const colorEnd = new THREE.Color('#00bbff');    // Blue at dissipation

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Start all particles near the spout origin (0, 0, 0) with slight random offsets
      pos[i * 3] = (Math.random() - 0.5) * 0.1;
      pos[i * 3 + 1] = Math.random() * 0.2; 
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      // Create a gradient progression based on particle index mapping to age
      const ratio = i / PARTICLE_COUNT;
      const mixedColor = colorSource.clone().lerp(colorEnd, ratio);
      
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;

      size[i] = Math.random() * 0.15 + 0.05;
    }
    return [pos, col, size];
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

      // 1. Move upward
      y += 0.02; 

      // 2. Apply Simplex Noise for the wavy, snaking turbulence seen in the video
      const noiseX = noise3D(x * 2, y * 0.5, time * 0.5);
      const noiseZ = noise3D(z * 2, y * 0.5, time * 0.5);

      x += noiseX * 0.015;
      z += noiseZ * 0.015;

      // 3. Reset particle when it floats too high (Looping mechanism)
      if (y > 4) {
        x = (Math.random() - 0.5) * 0.1;
        y = 0; // Back to lamp spout
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
        blending={THREE.AdditiveBlending} // This creates the "glowing light" overlay effect
        sizeAttenuation={true}
      />
    </points>
  );
}

export default function MagicSmokeScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0a0a16' }}>
      <Canvas camera={{ position:, fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <SmokeParticles />
      </Canvas>
    </div>
  );
}
