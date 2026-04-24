import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 1000 }) {
  const points = useRef<THREE.Points>(null!);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    const { clock } = state;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      points.current.geometry.attributes.position.array[i3 + 1] += Math.sin(clock.elapsedTime + points.current.geometry.attributes.position.array[i3]) * 0.001;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.rotation.y += 0.0005;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#3b82f6"
        sizeAttenuation={true}
        transparent={true}
        opacity={0.25}
      />
    </points>
  );
}

const FuturisticBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <Particles />
      </Canvas>
    </div>
  );
};

export default FuturisticBackground;
