import type React from "react"
interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">{heading}</h1>
        {text && <p className="text-sm text-muted-foreground mt-1">{text}</p>}
      </div>
      {children}
    </div>
  )
}
