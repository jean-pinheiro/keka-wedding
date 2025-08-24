import { createServerClient as createSupabaseClient } from "@supabase/ssr"

export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase environment variables not configured. Some features may not work.")
    return null
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    cookies: {},
  })
}
