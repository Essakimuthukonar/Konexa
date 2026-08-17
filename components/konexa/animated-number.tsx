'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type AnimatedNumberProps = {
  value: number
  duration?: number
  className?: string
  decimals?: number
  suffix?: string
}

export function AnimatedNumber({
  value,
  duration = 900,
  className,
  decimals = 0,
  suffix = '',
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0)
  const fromRef = useRef(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    fromRef.current = display
    startRef.current = null
    let frame = 0

    const tick = (ts: number) => {
      if (startRef.current === null) startRef.current = ts
      const elapsed = ts - startRef.current
      const t = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = fromRef.current + (value - fromRef.current) * eased
      setDisplay(next)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration])

  return (
    <span className={cn('tabular-nums', className)}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}
