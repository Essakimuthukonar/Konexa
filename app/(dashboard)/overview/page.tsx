import { Hero } from '@/components/konexa/hero'
import { OverviewView } from '@/components/konexa/views/overview-view'
import { BackendCounts } from '@/components/konexa/views/backend-counts'

export default function OverviewPage() {
  return (
    <>
      <Hero />
      <BackendCounts />
      <OverviewView />
    </>
  )
}
