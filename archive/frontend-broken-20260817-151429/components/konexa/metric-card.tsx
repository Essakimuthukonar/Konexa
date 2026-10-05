'use client';

import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number | ReactNode;
  unit?: string;
  icon?: ReactNode;
  status?: 'healthy' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  sparkline?: number[];
}

export function MetricCard({
  label,
  value,
  unit,
  icon,
  status,
  trend,
  sparkline,
}: MetricCardProps) {
  const statusClasses = {
    healthy: 'text-green-400',
    warning: 'text-yellow-400',
    critical: 'text-red-400',
  };

  return (
    <div className="telemetry-panel">
      <div className="flex items-start justify-between">
        <div>
          <div className="metric-label">{label}</div>
          <div className="flex items-baseline gap-2 mt-2">
            <div className={`metric-value ${status ? statusClasses[status] : 'text-white'}`}>
              {value}
            </div>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>
        {icon && <div className="text-gold-400">{icon}</div>}
      </div>

      {sparkline && (
        <div className="mt-4 h-12 flex items-end gap-1">
          {sparkline.map((val, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-gold-400/50 to-gold-400/10 rounded-t"
              style={{ height: `${(val / Math.max(...sparkline)) * 100}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
