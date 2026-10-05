"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Core() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.18;
      group.current.rotation.x = Math.sin(Date.now() * 0.00035) * 0.08;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.15, 4]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#8c6a24"
          emissiveIntensity={2.5}
          metalness={1}
          roughness={0.18}
          wireframe
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.62, 48, 48]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#d4af37"
          emissiveIntensity={4}
          metalness={0.9}
          roughness={0.12}
        />
      </mesh>

      {[1.55, 1.9, 2.25].map((radius, i) => (
        <mesh key={radius} rotation={[Math.PI / (3 + i), i * 0.7, 0]}>
          <torusGeometry args={[radius, 0.018, 16, 160]} />
          <meshStandardMaterial
            color={i === 1 ? "#ffd700" : "#d4af37"}
            emissive="#d4af37"
            emissiveIntensity={3}
            metalness={1}
          />
        </mesh>
      ))}

      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 2.5;

        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 2) * 0.35,
              Math.sin(angle) * radius,
            ]}
          >
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial
              color="#ffd700"
              emissive="#d4af37"
              emissiveIntensity={5}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function KonexaCore3D() {
  return (
    <div className="core-3d">
      <Canvas camera={{ position: [0, 0, 7], fov: 42 }}>
        <ambientLight intensity={0.15} />
        <pointLight position={[3, 3, 4]} color="#ffd700" intensity={20} />
        <pointLight position={[-4, -2, 2]} color="#8c6a24" intensity={12} />
        <Stars radius={35} depth={30} count={900} factor={1.3} fade />
        <Core />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.45}
        />
      </Canvas>

      <div className="core-label">
        <span>KONEXA</span>
        <strong>CORE</strong>
        <small>OPERATIONS INTELLIGENCE</small>
      </div>
    </div>
  );
}
