// src/lib/supabase-server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function supabaseServer(): SupabaseClient {
  if (!url || !anon) {
    throw new Error('Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  const store = cookies()

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return store.get(name)?.value
      },
      set(name: string, value: string, options?: any) {
        try {
          store.set({ name, value, ...options })
        } catch {}
      },
      remove(name: string, options?: any) {
        try {
          store.set({ name, value: '', ...options, maxAge: 0 })
          store.delete(name)
        } catch {}
      },
    },
  })
}

// Optional alias, but keep the non-null return type
export const getSupabaseClient = supabaseServer
