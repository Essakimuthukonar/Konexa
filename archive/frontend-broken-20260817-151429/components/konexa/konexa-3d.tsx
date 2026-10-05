"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Stars, Line } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Core() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.18;
      group.current.rotation.x = Math.sin(Date.now() * 0.00025) * 0.12;
    }
  });

  const nodes = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return [Math.cos(a) * 2.8, Math.sin(a) * 1.5, Math.sin(a * 2) * 1.2] as [
      number,
      number,
      number
    ];
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.15, 3]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#8a6917"
          emissiveIntensity={2}
          metalness={1}
          roughness={0.2}
          wireframe
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.72, 32, 32]} />
        <meshStandardMaterial
          color="#fff1a8"
          emissive="#d4af37"
          emissiveIntensity={3}
          metalness={1}
          roughness={0.1}
        />
      </mesh>

      {nodes.map((position, i) => (
        <group key={i}>
          <mesh position={position}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color="#e8c85a"
              emissive="#d4af37"
              emissiveIntensity={5}
            />
          </mesh>

          <Line
            points={[[0, 0, 0], position]}
            color="#d4af37"
            transparent
            opacity={0.28}
            lineWidth={0.7}
          />
        </group>
      ))}

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.15, 0.018, 16, 128]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh rotation={[0.4, 0.3, 0.8]}>
        <torusGeometry args={[2.7, 0.012, 12, 128]} />
        <meshStandardMaterial
          color="#8a6917"
          emissive="#d4af37"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
}

export default function Konexa3D() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
      <color attach="background" args={["#030303"]} />

      <ambientLight intensity={0.25} />
      <pointLight position={[3, 3, 5]} color="#d4af37" intensity={20} />
      <pointLight position={[-4, -2, 2]} color="#fff1a8" intensity={7} />

      <Stars
        radius={40}
        depth={20}
        count={900}
        factor={1.5}
        saturation={0}
        fade
        speed={0.3}
      />

      <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.3}>
        <Core />
      </Float>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.25}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}
