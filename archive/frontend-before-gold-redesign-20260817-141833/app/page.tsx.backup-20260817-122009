import { CinematicBackground } from '@/components/konexa/cinematic-background'
import { Sidebar } from '@/components/konexa/sidebar'
import { TopHeader } from '@/components/konexa/top-header'
import { Hero } from '@/components/konexa/hero'
import { Dashboard } from '@/components/konexa/dashboard'

export default function Page() {
  return (
    <>
      <CinematicBackground />
      <main className="relative mx-auto min-h-screen w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <TopHeader />
            <Hero />
            <Dashboard />
            <footer className="flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
              <span className="font-mono uppercase tracking-widest">
                KONEXA · v1.0 Foundation
              </span>
              <span>
                Built for Essakimuthu Konar · Founder &amp; Project Owner
              </span>
            </footer>
          </div>
        </div>
      </main>
    </>
  )
}
