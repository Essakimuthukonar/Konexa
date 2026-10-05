'use client'

import { useEffect, useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface QueryState<T> {
  data: T | null
  status: Status
  error: string | null
}

export function useQuery<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    status: 'loading',
    error: null,
  })

  useEffect(() => {
    let active = true
    setState((s) => ({ ...s, status: 'loading', error: null }))
    fetcher()
      .then((data) => {
        if (active) setState({ data, status: 'success', error: null })
      })
      .catch((err: unknown) => {
        if (active) {
          setState({ data: null, status: 'error', error: String(err) })
        }
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const update = () => setMatches(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [query])
  return matches
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
