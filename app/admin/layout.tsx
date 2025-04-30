"use client"

import type React from "react"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { MainNav } from "@/components/main-nav"
import { SideNav } from "@/components/side-nav"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      try {
        router.push("/login")
      } catch (error) {
        console.error("Navigation error:", error)
        setAuthError("Authentication required. Please refresh and try again.")
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (authError) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex h-14 items-center px-4 sm:px-6">
          <MainNav />
        </div>
      </header>
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 overflow-auto p-6">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
