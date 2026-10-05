'use client'

import { useId, useState } from 'react'

type LineChartProps = {
  data: number[]
  color: string
  height?: number
  unit?: string
  max?: number
  min?: number
  labels?: string[]
}

export function LineChart({
  data,
  color,
  height = 200,
  unit = '',
  max,
  min,
  labels,
}: LineChartProps) {
  const id = useId().replace(/:/g, '')
  const width = 100
  const [hover, setHover] = useState<number | null>(null)

  const dataMax = max ?? Math.max(...data, 1)
  const dataMin = min ?? Math.min(...data, 0)
  const range = dataMax - dataMin || 1
  const padTop = 10
  const padBottom = 14
  const usable = height - padTop - padBottom

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width
    const y = padTop + usable - ((d - dataMin) / range) * usable
    return [x, y] as const
  })

  const line = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ')
  const area = `${line} L${width},${height - padBottom} L0,${height - padBottom} Z`

  const handleMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * width
    const idx = Math.round((px / width) * (data.length - 1))
    setHover(Math.max(0, Math.min(data.length - 1, idx)))
  }

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
        onPointerMove={handleMove}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={`lc-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1="0"
            x2={width}
            y1={padTop + usable * g}
            y2={padTop + usable * g}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.3"
          />
        ))}

        <path d={area} fill={`url(#lc-${id})`} />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />

        {hover !== null && (
          <line
            x1={points[hover][0]}
            x2={points[hover][0]}
            y1={padTop}
            y2={height - padBottom}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.3"
            strokeDasharray="1 1"
          />
        )}
        {hover !== null && (
          <circle
            cx={points[hover][0]}
            cy={points[hover][1]}
            r="1.4"
            fill={color}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        )}

        {labels && (
          <>
            <text x="0" y={height - 3} fontSize="3" fill="rgba(255,255,255,0.4)" className="font-mono">
              {labels[0]}
            </text>
            <text x={width} y={height - 3} fontSize="3" fill="rgba(255,255,255,0.4)" textAnchor="end" className="font-mono">
              {labels[labels.length - 1]}
            </text>
          </>
        )}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-popover/95 px-2.5 py-1.5 backdrop-blur"
          style={{
            left: `${(points[hover][0] / width) * 100}%`,
            top: `${(points[hover][1] / height) * 100}%`,
            marginTop: '-8px',
          }}
        >
          <p className="font-mono text-xs font-semibold tabular-nums" style={{ color }}>
            {data[hover]}{unit}
          </p>
          {labels && (
            <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              {labels[hover] ?? ''}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
