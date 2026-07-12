import { AuthFormSkeleton } from '@/components/ui/Skeleton'

export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-surface px-4 py-10 sm:py-12 flex items-center justify-center">
      <AuthFormSkeleton />
    </div>
  )
}
