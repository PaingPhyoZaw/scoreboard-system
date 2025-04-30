import { cn } from "@/lib/utils"

interface LoadingDotsProps {
  className?: string
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn("loading-dots", className)}>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  )
}

interface LoadingProps {
  className?: string
  text?: string
}

export function Loading({ className, text }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 min-h-[200px]", className)}>
      <LoadingDots />
      {text && (
        <p className="mt-4 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  )
}
