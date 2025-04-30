"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ScoresLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return; // Wait for hydration
    
    if (!user) {
      router.replace("/login")
    } else if (user.role_id === 1) {
      router.replace("/admin/dashboard")
    }
  }, [isLoading, user, router])

  // Show loading state during initial auth check
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Don't render anything if not authenticated or if user is admin
  if (!user || user.role_id === 1) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <header className="border-b bg-background">
        <div className="container h-16 flex items-center">
          <div className="font-semibold">ScoreBoard</div>
        </div>
      </header> */}
      {children}
    </div>
  )
}
