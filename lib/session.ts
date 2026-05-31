import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export interface SessionUser {
  id:    string
  email: string
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore  = await cookies()
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ')

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/session`,
      { headers: { Cookie: cookieHeader }, cache: 'no-store' }
    )

    if (!res.ok) return null
    const data = await res.json()
    return data.user ?? null
  } catch {
    return null
  }
}

export async function registerConnectedApp(userId: string): Promise<void> {
  try {
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    await db.from('connected_apps').upsert({
      user_id:   userId,
      app_name:  'Icon Builder',
      app_url:   'https://icons.rabbit-loop.com',
      last_seen: new Date().toISOString(),
    }, { onConflict: 'user_id,app_url' })
  } catch {
    // Non-fatal — don't block the page
  }
}

export async function isPremiumUser(userId: string): Promise<boolean> {
  try {
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data } = await db
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing', 'gifted'])
      .maybeSingle()
    return !!data
  } catch {
    return false
  }
}
