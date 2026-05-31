import { getSession, isPremiumUser, registerConnectedApp } from '@/lib/session'
import IconBuilder from '@/components/IconBuilder'

export const dynamic = 'force-dynamic'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? 'https://auth.rabbit-loop.com'
const APP_URL  = process.env.NEXT_PUBLIC_APP_URL  ?? 'https://icons.rabbit-loop.com'

export default async function Page() {
  const user    = await getSession()
  const premium = user ? await isPremiumUser(user.id) : false
  if (user) registerConnectedApp(user.id)

  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <header className="border-b border-white/[0.06] px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="https://auth.rabbit-loop.com/logo.png" alt="Rabbit Loop" className="w-7 h-7 rounded-lg" />
          <div>
            <span className="text-white font-semibold text-sm">Icon Builder</span>
            <span className="text-gray-600 text-xs ml-2">by Rabbit Loop</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {!premium && (
                <a
                  href={`${APP_URL?.replace('icons.', '')}/premium`}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-gray-300 transition-colors"
                >
                  Upgrade to remove watermark
                </a>
              )}
              {premium && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-medium">
                  Premium
                </span>
              )}
              <a
                href={`${AUTH_URL}/account`}
                className="text-xs text-gray-500 hover:text-white transition-colors"
              >
                {user.email}
              </a>
            </>
          ) : (
            <a
              href={`${AUTH_URL}/login?redirect_to=${encodeURIComponent(APP_URL)}`}
              className="text-xs px-3 py-1.5 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
            >
              Sign in to remove watermark
            </a>
          )}
        </div>
      </header>

      {/* Builder */}
      <main className="flex-1 px-4 sm:px-8 py-8 max-w-6xl mx-auto w-full">
        {!premium && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-gray-500 flex items-center justify-between gap-4">
            <span>Free exports include a small Rabbit Loop watermark.</span>
            <a
              href={user ? `${APP_URL?.replace('icons.', '')}/premium` : `${AUTH_URL}/login?redirect_to=${encodeURIComponent(APP_URL)}`}
              className="text-white underline underline-offset-4 shrink-0"
            >
              {user ? 'Upgrade to Premium' : 'Sign in to upgrade'}
            </a>
          </div>
        )}

        <IconBuilder isPremium={premium} />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-4 sm:px-8 py-4 text-center">
        <p className="text-xs text-gray-700">
          Built by{' '}
          <a href="https://rabbit-loop.com" className="text-gray-500 hover:text-white transition-colors">
            Rabbit Loop
          </a>
        </p>
      </footer>

    </div>
  )
}
