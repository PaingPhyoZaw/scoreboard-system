import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export interface User {
  id: string
  email: string
  role_id: number
}

export interface Credentials {
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const supabase = getSupabaseBrowserClient()

// Function to authenticate user
const authenticateUser = async (email: string, password: string) => {
  try {
    console.log('Authenticating user:', email)
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    console.log('Database query result:', users)

    if (error) {
      console.error('Error fetching user:', error)
      return { error }
    }

    if (!users) {
      console.error('User not found')
      return { error: new Error('Invalid login credentials') }
    }

    // Ensure all required fields are present
    if (!users.id || !users.email || typeof users.role_id !== 'number') {
      console.error('Invalid user data:', users)
      return { error: new Error('Invalid user data') }
    }

    const userData: User = {
      id: users.id,
      email: users.email,
      role_id: users.role_id
    }

    console.log('User authenticated:', userData)
    return { data: userData }
  } catch (error) {
    console.error('Error during authentication:', error)
    return { error }
  }
}

export const useAuth = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      isLoading: true,
      signIn: async (email: string, password: string) => {
        try {
          console.log('Starting sign in...')
          const { data: userData, error } = await authenticateUser(email, password)
          
          if (error) {
            console.log('Authentication failed:', error)
            set({ user: null, isLoading: false })
            return { user: null, error }
          }

          if (!userData) {
            console.log('No user data returned')
            set({ user: null, isLoading: false })
            return { user: null, error: new Error('No user data') }
          }

          console.log('Login successful, setting user state:', userData)
          set({ user: userData, isLoading: false })
          return { user: userData, error: null }
        } catch (error) {
          console.error("Login failed:", error)
          set({ user: null, isLoading: false })
          return { user: null, error }
        }
      },
      signUp: async (email: string, password: string, fullName: string) => {
        try {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                role_id: 5 // Default role for new signups
              }
            }
          })
          return { error }
        } catch (error) {
          console.error("Signup failed:", error)
          return { error }
        }
      },
      signOut: async () => {
        try {
          await supabase.auth.signOut()
          set({ user: null, isLoading: false })
        } catch (error) {
          console.error("Error signing out:", error)
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Called after hydration is finished
        if (state) {
          state.isLoading = false
        }
      }
    }
  )
)
