import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Maintenance — Icon Builder' }

async function getMessage(): Promise<string | null> {
  try {
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data } = await db
      .from('system_config')
      .select('maintenance_message')
      .eq('id', 'singleton')
      .single()
    return data?.maintenance_message ?? null
  } catch {
    return null
  }
}

export default async function MaintenancePage() {
  const message = await getMessage()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <img
        src="https://auth.rabbit-loop.com/logo.png"
        alt="Rabbit Loop"
        width={36}
        height={36}
        className="mb-8 opacity-80"
      />

      <div className="max-w-sm space-y-4">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-400 text-xs font-medium tracking-widest uppercase">
            Maintenance
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-white">We&apos;ll be back shortly</h1>

        <p className="text-gray-500 text-sm leading-relaxed">
          {message ?? "We're doing some work behind the scenes to improve your experience. Sit tight — we won't be long."}
        </p>

        <div className="pt-6 border-t border-white/[0.06]">
          <p className="text-gray-700 text-xs">
            Questions?{' '}
            <a
              href="mailto:contact@rabbitloop.com"
              className="text-gray-500 hover:text-white transition-colors underline underline-offset-4"
            >
              contact@rabbitloop.com
            </a>
          </p>
        </div>
      </div>

      <p className="absolute bottom-8 text-gray-800 text-xs">Rabbit Loop</p>
    </div>
  )
}
