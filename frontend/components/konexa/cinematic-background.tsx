'use client'

import { useEffect, useRef, useState } from 'react'

type Particle = {
  left: number
  top: number
  size: number
  duration: number
  delay: number
  color: string
}

const PARTICLE_COLORS = [
  'rgba(0,255,213,0.9)',
  'rgba(139,92,246,0.85)',
  'rgba(255,62,129,0.8)',
  'rgba(255,184,0,0.85)',
  'rgba(0,255,157,0.85)',
]

export function CinematicBackground() {
  const [particles, setParticles] = useState<Particle[]>([])
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const next: Particle[] = Array.from({ length: 34 }).map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 14 + 10,
      delay: Math.random() * -20,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    }))
    setParticles(next)
  }, [])

  // Subtle parallax driven by pointer movement
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2
        const y = (e.clientY / window.innerHeight - 0.5) * 2
        el.style.setProperty('--px', String(x))
        el.style.setProperty('--py', String(y))
      })
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ ['--px' as string]: '0', ['--py' as string]: '0' }}
    >
      {/* Base radial ambient glow */}
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% -10%, rgba(0,255,213,0.10), transparent 55%), radial-gradient(90% 70% at 100% 100%, rgba(139,92,246,0.10), transparent 60%), radial-gradient(80% 60% at 0% 90%, rgba(255,62,129,0.08), transparent 55%)',
        }}
      />

      {/* Animated perspective grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          transform:
            'translate3d(calc(var(--px) * 14px), calc(var(--py) * 14px), 0)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,255,213,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,213,0.08) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            animation: 'grid-pan 12s linear infinite',
            maskImage:
              'radial-gradient(ellipse 80% 80% at 50% 40%, black 30%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 80% at 50% 40%, black 30%, transparent 80%)',
          }}
        />
      </div>

      {/* Drifting blurred glowing orbs */}
      <div
        className="absolute -left-32 top-10 h-[36rem] w-[36rem] rounded-full blur-3xl animate-drift"
        style={{
          background:
            'radial-gradient(circle, rgba(0,255,213,0.22), transparent 70%)',
          transform: 'translate3d(calc(var(--px) * -30px), 0, 0)',
        }}
      />
      <div
        className="absolute -right-40 top-1/3 h-[40rem] w-[40rem] rounded-full blur-3xl animate-drift"
        style={{
          background:
            'radial-gradient(circle, rgba(139,92,246,0.20), transparent 70%)',
          animationDelay: '-6s',
          transform: 'translate3d(calc(var(--px) * 34px), 0, 0)',
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[32rem] w-[32rem] rounded-full blur-3xl animate-drift"
        style={{
          background:
            'radial-gradient(circle, rgba(255,62,129,0.16), transparent 70%)',
          animationDelay: '-11s',
        }}
      />

      {/* Diagonal light rays */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background:
            'repeating-linear-gradient(115deg, transparent 0 90px, rgba(0,255,213,0.03) 90px 91px)',
        }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            animation: `float-slow ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Top vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(150% 100% at 50% 0%, transparent 60%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  )
}
