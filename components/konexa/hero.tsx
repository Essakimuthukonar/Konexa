'use client'

import { Rocket, Server, ArrowUpRight } from 'lucide-react'

const STATS = [
  { label: 'Uptime', value: '99.98%', accent: 'text-neon-green' },
  { label: 'Active Nodes', value: '248', accent: 'text-neon-teal' },
  { label: 'Deploys / 24h', value: '1,204', accent: 'text-neon-orange' },
  { label: 'Incidents', value: '0', accent: 'text-neon-pink' },
]

export function Hero() {
  return (
    <section
      className="animate-rise relative overflow-hidden rounded-3xl"
      style={{ animationDelay: '180ms' }}
    >
      <div className="glass relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10 sm:py-14">
        {/* status pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-neon-teal/30 bg-neon-teal/5 px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-teal opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-teal" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon-teal">
            All Systems Operational
          </span>
        </div>

        <h2 className="mt-6 max-w-3xl text-balance font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
          One Platform.
          <br />
          <span
            className="bg-gradient-to-r from-neon-teal via-neon-green to-neon-teal bg-clip-text text-transparent"
            style={{
              backgroundSize: '200% auto',
              animation: 'gradient-shift 6s ease infinite',
            }}
          >
            Complete DevOps Visibility.
          </span>
        </h2>

        <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Monitor infrastructure. Automate operations. Control cloud resources.
          Simplify DevOps — from a single cinematic command center.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-neon-teal px-6 py-3.5 font-semibold text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
            style={{ boxShadow: '0 0 30px -6px rgba(0,255,213,0.6)' }}
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <Rocket className="h-4 w-4" />
            Launch Dashboard
          </button>
          <button
            type="button"
            className="glass glass-hover inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-semibold text-foreground"
          >
            <Server className="h-4 w-4 text-neon-teal" />
            View Infrastructure
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* inline stat strip */}
        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-popover/60 px-5 py-4 backdrop-blur">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {s.label}
              </p>
              <p
                className={`mt-1 font-heading text-2xl font-bold tabular-nums ${s.accent}`}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* decorative glow arc */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(0,255,213,0.25), transparent 70%)',
          }}
        />
      </div>
    </section>
  )
}
