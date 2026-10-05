'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error ?? 'Login failed')
        setLoading(false)
        return
      }
      router.push(searchParams.get('next') ?? '/overview')
      router.refresh()
    } catch {
      setError('Server error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-8">
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-[0.2em] text-foreground">
          KONE<span className="text-neon-teal">XA</span>
        </h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Sign in to the command center</p>
        <div className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-xs">
            <span className="font-mono uppercase tracking-widest text-muted-foreground">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="glass h-11 rounded-2xl px-4 text-sm outline-none" />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span className="font-mono uppercase tracking-widest text-muted-foreground">Password</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="glass h-11 rounded-2xl px-4 text-sm outline-none" />
          </label>
        </div>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="glass glass-hover mt-6 h-11 w-full rounded-2xl text-sm font-semibold uppercase tracking-widest disabled:opacity-50">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </main>
  )
}
