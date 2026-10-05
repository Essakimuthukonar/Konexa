'use client'

import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type TiltCardProps = {
  children: ReactNode
  className?: string
  max?: number
  style?: React.CSSProperties
}

export function TiltCard({
  children,
  className,
  max = 6,
  style,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      const rx = (0.5 - py) * max * 2
      const ry = (px - 0.5) * max * 2
      el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`
      el.style.setProperty('--mx', `${px * 100}%`)
      el.style.setProperty('--my', `${py * 100}%`)
    })
  }

  const reset = () => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(frame.current)
    el.style.transform =
      'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)'
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={cn(
        'group relative transition-transform duration-300 ease-out will-change-transform [transform-style:preserve-3d]',
        className,
      )}
      style={style}
    >
      {/* pointer-follow sheen */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(0,255,213,0.10), transparent 45%)',
        }}
      />
      {children}
    </div>
  )
}
