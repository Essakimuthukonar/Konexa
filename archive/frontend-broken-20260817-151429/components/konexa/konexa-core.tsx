'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import * as THREE from 'three';

interface OrbitalSubsystem {
  name: string;
  angle: number;
  distance: number;
  size: number;
  color: string;
}

export function KonexaCore() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const coreRef = useRef<THREE.Mesh | null>(null);
  const orbitsRef = useRef<THREE.Group[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const subsystems: OrbitalSubsystem[] = useMemo(
    () => [
      { name: 'Infrastructure', angle: 0, distance: 3, size: 0.4, color: '#D4AF37' },
      { name: 'Cloud', angle: Math.PI / 3, distance: 3, size: 0.4, color: '#FFD700' },
      { name: 'CI/CD', angle: (2 * Math.PI) / 3, distance: 3, size: 0.4, color: '#F9E79F' },
      { name: 'Monitoring', angle: Math.PI, distance: 3, size: 0.4, color: '#D4AF37' },
      { name: 'Automation', angle: (4 * Math.PI) / 3, distance: 3, size: 0.4, color: '#FFD700' },
      { name: 'Security', angle: (5 * Math.PI) / 3, distance: 3, size: 0.4, color: '#F5B041' },
    ],
    []
  );

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPrefersReducedMotion(prefersReduced);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(5, 5, 7);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const coreGeometry = new THREE.IcosahedronGeometry(0.8, 4);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0xffb800,
      emissiveIntensity: 0.3,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.castShadow = true;
    scene.add(core);
    coreRef.current = core;

    const glowGeometry = new THREE.IcosahedronGeometry(0.85, 4);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.1,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    orbitsRef.current = [];
    subsystems.forEach((subsystem) => {
      const ringGeometry = new THREE.BufferGeometry();
      const ringPoints = [];
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        ringPoints.push(
          Math.cos(angle) * subsystem.distance,
          0,
          Math.sin(angle) * subsystem.distance
        );
      }
      ringGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ringPoints), 3));
      const ringMaterial = new THREE.LineBasicMaterial({ color: subsystem.color, transparent: true, opacity: 0.2 });
      const ring = new THREE.Line(ringGeometry, ringMaterial);
      scene.add(ring);

      const orbitGroup = new THREE.Group();
      orbitGroup.rotation.y = subsystem.angle;
      orbitsRef.current.push(orbitGroup);

      const sphereGeometry = new THREE.SphereGeometry(subsystem.size, 16, 16);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: subsystem.color,
        metalness: 0.8,
        roughness: 0.2,
        emissive: subsystem.color,
        emissiveIntensity: 0.2,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.x = subsystem.distance;
      sphere.castShadow = true;
      orbitGroup.add(sphere);

      const trailGeometry = new THREE.BufferGeometry();
      const trailPositions = [];
      for (let i = 0; i < 20; i++) {
        const angle = subsystem.angle + (i / 20) * Math.PI * 2;
        trailPositions.push(
          Math.cos(angle) * subsystem.distance * (1 - i / 20),
          0,
          Math.sin(angle) * subsystem.distance * (1 - i / 20)
        );
      }
      trailGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(trailPositions), 3));
      const trailMaterial = new THREE.PointsMaterial({
        color: subsystem.color,
        size: 0.05,
        transparent: true,
        opacity: 0.6,
      });
      const trail = new THREE.Points(trailGeometry, trailMaterial);
      orbitGroup.add(trail);

      scene.add(orbitGroup);
    });

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        if (coreRef.current) {
          coreRef.current.rotation.x += 0.0005;
          coreRef.current.rotation.y += 0.0008;
        }

        if (scene.children[3]) {
          scene.children[3].rotation.z += 0.0003;
        }

        orbitsRef.current.forEach((orbit, i) => {
          orbit.rotation.z += 0.0003 * (i % 2 === 0 ? 1 : -1);
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width;
      const newHeight = containerRef.current?.clientHeight || height;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [subsystems, prefersReducedMotion]);

  return <div ref={containerRef} className="w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden glass" />;
}
