import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function createSupabaseServer() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll() // ✅ now this exists
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // In Server Components this can be read-only; middleware/route handlers handle refresh.
          }
        },
      },
    }
  )
}
