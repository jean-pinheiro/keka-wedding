import { createBrowserClient } from "@supabase/ssr"

export const supabaseBrowser = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// Legacy function name for backward compatibility
export function createClient() {
  return supabaseBrowser
}
