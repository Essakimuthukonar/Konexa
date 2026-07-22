'use client'

import { useEffect, useState } from 'react'

type MetricRingProps = {
  value: number
  size?: number
  stroke?: number
  color: string
  label: string
  display?: string
  sublabel?: string
}

export function MetricRing({
  value,
  size = 132,
  stroke = 9,
  color,
  label,
  display,
  sublabel,
}: MetricRingProps) {
  const [progress, setProgress] = useState(0)
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  useEffect(() => {
    const id = requestAnimationFrame(() => setProgress(value))
    return () => cancelAnimationFrame(id)
  }, [value])

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)',
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className="font-heading text-2xl font-bold tabular-nums"
          style={{ color }}
        >
          {display ?? `${value}%`}
        </span>
        <span className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        {sublabel && (
          <span className="mt-0.5 text-[10px] text-muted-foreground/70">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  )
}
