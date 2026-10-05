'use client';

import { useMemo } from 'react';

interface ChartDataPoint {
  time: string;
  value?: number;
  [key: string]: string | number | undefined;
}

interface LineChartProps {
  data: ChartDataPoint[];
  dataKey: string;
  height?: number;
  color?: string;
  showGrid?: boolean;
}

export function LineChart({
  data,
  dataKey,
  height = 240,
  color = '#D4AF37',
  showGrid = true,
}: LineChartProps) {
  const { points, maxValue } = useMemo(() => {
    const values = data.map(d => (d[dataKey] as number) || 0);
    const max = Math.max(...values, 1);
    const points = data.map((d, i) => ({
      x: (i / Math.max(data.length - 1, 1)) * 100,
      y: ((max - ((d[dataKey] as number) || 0)) / max) * 100,
    }));
    return { points, maxValue: max };
  }, [data, dataKey]);

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const fillPathData = `${pathData} L 100 100 L 0 100 Z`;

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {showGrid && (
          <>
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={`grid-${y}`}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="rgba(212, 175, 55, 0.1)"
                strokeWidth="0.5"
              />
            ))}
          </>
        )}
        <defs>
          <linearGradient id="fillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fillPathData} fill="url(#fillGradient)" />
        <polyline
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        {points.map((p, i) => (
          <circle
            key={`point-${i}`}
            cx={p.x}
            cy={p.y}
            r="1.5"
            fill={color}
            opacity={i === points.length - 1 ? 1 : 0.3}
          />
        ))}
      </svg>
    </div>
  );
}
