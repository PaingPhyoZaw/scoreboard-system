import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a single supabase client for the browser
const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables are missing", { supabaseUrl, supabaseAnonKey })
    // Return a dummy client that won't cause runtime errors
    return createClient("https://placeholder.supabase.co", "placeholder-key")
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Create a single supabase client for server components
const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase server environment variables are missing", { supabaseUrl })
    // Return a dummy client that won't cause runtime errors
    return createClient("https://placeholder.supabase.co", "placeholder-key")
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}

// For client components (singleton pattern)
let browserClient: ReturnType<typeof createBrowserClient> | null = null

export const getSupabaseBrowserClient = () => {
  if (!browserClient) {
    browserClient = createBrowserClient()
  }
  return browserClient
}

// For server components and server actions
export const getSupabaseServerClient = () => {
  return createServerClient()
}
