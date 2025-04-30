"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any; data: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
        }

        setSession(session)
        setUser(session?.user ?? null)
      } catch (err) {
        console.error("Unexpected error getting session:", err)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
        router.refresh()
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (err) {
      console.error("Error setting up auth state change listener:", err)
      setIsLoading(false)
      return () => {}
    }
  }, [router, supabase.auth])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        return { user: null, error }
      }

      // Get role from user metadata
      const userWithRole = {
        ...data.user,
        role: data.user?.user_metadata?.role || 'engineer'
      }

      return { user: userWithRole, error: null }
    } catch (err) {
      console.error("Error signing in:", err)
      return { user: null, error: { message: "An unexpected error occurred during sign in." } }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (!error && data.user) {
        // Create a user record in our users table
        try {
          await supabase.from("users").insert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            role_id: null, // Admin will need to assign a role
          })
        } catch (insertError) {
          console.error("Error creating user record:", insertError)
        }
      }

      return { data, error }
    } catch (err) {
      console.error("Error signing up:", err)
      return {
        data: null,
        error: { message: "An unexpected error occurred during sign up." },
      }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (err) {
      console.error("Error signing out:", err)
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
