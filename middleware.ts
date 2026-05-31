import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SKIP_EXACT    = new Set(['/favicon.ico', '/robots.txt', '/sitemap.xml'])
const SKIP_PREFIXES = ['/_next/', '/maintenance']

function shouldSkip(pathname: string): boolean {
  if (SKIP_EXACT.has(pathname)) return true
  return SKIP_PREFIXES.some(p => pathname.startsWith(p))
}

let _cache: { maintenance: boolean; expires: number } | null = null

async function isMaintenanceMode(): Promise<boolean> {
  if (_cache && Date.now() < _cache.expires) return _cache.maintenance

  try {
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data } = await db
      .from('system_config')
      .select('maintenance_mode')
      .eq('id', 'singleton')
      .single()

    const maintenance = data?.maintenance_mode ?? false
    _cache = { maintenance, expires: Date.now() + 15_000 }
    return maintenance
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (shouldSkip(pathname)) return NextResponse.next()

  if (await isMaintenanceMode()) {
    return NextResponse.redirect(new URL('/maintenance', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
