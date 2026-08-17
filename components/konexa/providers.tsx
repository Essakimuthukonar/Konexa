'use client'

import type { ReactNode } from 'react'
import { NavProvider } from '@/hooks/use-nav'

export function KonexaProviders({ children }: { children: ReactNode }) {
  return <NavProvider>{children}</NavProvider>
}
