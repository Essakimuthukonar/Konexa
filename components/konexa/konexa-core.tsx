'use client'

import { useRef, useState } from 'react'
import {
  Server,
  HardDrive,
  GitBranch,
  Activity,
  FileText,
  Network,
  Cpu,
  type LucideIcon,
} from 'lucide-react'
import { useNav } from '@/hooks/use-nav'
import type { CoreLink } from '@/lib/types'

const ICONS: Record<string, LucideIcon> = {
  Server,
  HardDrive,
  GitBranch,
  Activity,
  FileText,
  Network,
  Cpu,
}

export function KonexaCore({ links }: { links: CoreLink[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)
  const [hovered, setHovered] = useState<string | null>(null)
  const { setView } = useNav()

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transform = `perspective(1200px) rotateX(${(-py * 10).toFixed(2)}deg) rotateY(${(px * 14).toFixed(2)}deg)`
    })
  }

  const reset = () => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(frame.current)
    el.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)'
  }

  const radius = 38
  const cx = 50
  const cy = 50

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className="relative mx-auto aspect-square w-full max-w-[460px] [transform-style:preserve-3d] transition-transform duration-300 ease-out will-change-transform"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(0,255,213,0.12)" strokeWidth="0.18" />
        <circle cx={cx} cy={cy} r={radius * 0.72} fill="none" stroke="rgba(139,92,246,0.14)" strokeWidth="0.14" />
        <circle cx={cx} cy={cy} r={radius * 0.5} fill="none" stroke="rgba(0,255,213,0.18)" strokeWidth="0.12" />

        {links.map((link) => {
          const rad = (link.angle * Math.PI) / 180
          const x = cx + Math.cos(rad) * radius
          const y = cy + Math.sin(rad) * radius
          const isHover = hovered === link.id
          return (
            <g key={`link-${link.id}`}>
              <line
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke={link.color}
                strokeOpacity={isHover ? 0.55 : 0.22}
                strokeWidth={isHover ? 0.4 : 0.22}
              />
              <circle r="0.9" fill={link.color}>
                <animateMotion
                  dur={`${isHover ? 1.6 : 3}s`}
                  repeatCount="indefinite"
                  path={`M${cx},${cy} L${x},${y}`}
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur={`${isHover ? 1.6 : 3}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          )
        })}
      </svg>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full sm:h-32 sm:w-32">
          <div className="absolute inset-0 animate-pulse-ring rounded-full bg-neon-teal/10" style={{ boxShadow: '0 0 60px -10px rgba(0,255,213,0.55)' }} />
          <div
            className="absolute inset-2 rounded-full border border-neon-teal/40"
            style={{ animation: 'core-spin 14s linear infinite', borderTopColor: 'transparent', borderRightColor: 'transparent' }}
          />
          <div
            className="absolute inset-5 rounded-full border border-neon-purple/40"
            style={{ animation: 'core-spin 9s linear infinite reverse', borderBottomColor: 'transparent', borderLeftColor: 'transparent' }}
          />
          <div className="glass relative flex h-16 w-16 items-center justify-center rounded-2xl sm:h-20 sm:w-20">
            <Cpu className="h-7 w-7 text-neon-teal drop-shadow-[0_0_12px_#00ffd5] sm:h-8 sm:w-8" />
          </div>
        </div>
        <p className="mt-3 text-center font-heading text-[10px] font-bold uppercase tracking-[0.3em] text-neon-teal text-glow-teal">
          Konexa Core
        </p>
      </div>

      {links.map((link) => {
        const rad = (link.angle * Math.PI) / 180
        const x = cx + Math.cos(rad) * radius
        const y = cy + Math.sin(rad) * radius
        const Icon = ICONS[link.icon] ?? Server
        const isHover = hovered === link.id
        return (
          <button
            key={link.id}
            type="button"
            onMouseEnter={() => setHovered(link.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setView(link.view)}
            className="group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 outline-none"
            style={{ left: `${x}%`, top: `${y}%` }}
            aria-label={`${link.label} — ${link.sublabel}`}
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl border bg-background/80 backdrop-blur transition-all duration-300 sm:h-12 sm:w-12"
              style={{
                borderColor: isHover ? link.color : `${link.color}40`,
                boxShadow: isHover ? `0 0 24px -4px ${link.color}` : 'none',
                transform: isHover ? 'scale(1.12)' : 'scale(1)',
              }}
            >
              <Icon className="h-5 w-5" style={{ color: link.color }} />
            </span>
            <span
              className="font-mono text-[9px] uppercase tracking-widest transition-colors duration-300 sm:text-[10px]"
              style={{ color: isHover ? link.color : 'rgba(255,255,255,0.55)' }}
            >
              {link.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
