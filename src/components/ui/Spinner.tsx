import { cn } from '@/lib/utils'

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-green-600',
        className
      )}
    />
  )
}

export function FullPageSpinner() {
  return (
    <div className="flex h-full min-h-64 items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  )
}
