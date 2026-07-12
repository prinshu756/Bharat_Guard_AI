import { ContentPageSkeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <main className="page-container py-10 sm:py-16">
      <ContentPageSkeleton />
    </main>
  )
}
