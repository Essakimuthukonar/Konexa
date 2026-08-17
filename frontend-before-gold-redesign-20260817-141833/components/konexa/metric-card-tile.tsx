'use client'

import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from 'lucide-react'
import { useNav } from '@/hooks/use-nav'
import { TiltCard } from './tilt-card'
import { AnimatedNumber } from './animated-number'
import { SparkArea } from './spark-area'
import { cn } from '@/lib/utils'
import type { MetricCard } from '@/lib/types'

export function MetricCardTile({
  metric,
  icon: Icon,
}: {
  metric: MetricCard
  icon: LucideIcon
}) {
  const { setView } = useNav()
  const TrendIcon =
    metric.trend.direction === 'up'
      ? ArrowUpRight
      : metric.trend.direction === 'down'
        ? ArrowDownRight
        : Minus

  const trendColor =
    metric.trend.direction === 'down'
      ? 'text-neon-green'
      : metric.trend.direction === 'up'
        ? 'text-neon-orange'
        : 'text-muted-foreground'

  return (
    <TiltCard className="animate-rise" max={5}>
      <button
        type="button"
        onClick={() => setView(metric.targetView)}
        className="glass glass-hover group flex w-full flex-col rounded-3xl p-5 text-left"
        aria-label={`${metric.label} — ${metric.trendLabel}. Open details.`}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: `${metric.color}1a`, border: `1px solid ${metric.color}40` }}
            >
              <Icon className="h-4 w-4" style={{ color: metric.color }} />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {metric.label}
            </span>
          </div>
          <span
            className="rounded-full px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest"
            style={{ background: `${metric.color}14`, color: metric.color }}
          >
            {metric.state === 'OPERATIONAL' ? 'NORMAL' : metric.state}
          </span>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <AnimatedNumber
                value={metric.value}
                className="font-heading text-3xl font-bold"
                decimals={metric.unit === '%' && metric.value < 100 && !Number.isInteger(metric.value) ? 1 : 0}
                suffix={metric.unit === '%' ? '%' : ''}
              />
              {metric.unit && metric.unit !== '%' && (
                <span className="text-sm font-medium text-muted-foreground">
                  {metric.unit}
                </span>
              )}
            </div>
            <div className={cn('mt-1 flex items-center gap-1 text-xs', trendColor)}>
              <TrendIcon className="h-3 w-3" />
              <span className="font-mono tabular-nums">
                {metric.trend.direction === 'flat'
                  ? '0.0%'
                  : `${metric.trend.percent.toFixed(1)}%`}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {metric.trendLabel}
              </span>
            </div>
          </div>
          <div className="h-12 w-24 shrink-0">
            <SparkArea data={metric.series} color={metric.color} height={48} />
          </div>
        </div>
      </button>
    </TiltCard>
  )
}
