import { getSession, isPremiumUser, registerConnectedApp } from '@/lib/session'
import IconBuilder from '@/components/IconBuilder'
import HeartbeatTracker from '@/components/HeartbeatTracker'

export const dynamic = 'force-dynamic'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? 'https://auth.rabbit-loop.com'
const APP_URL  = process.env.NEXT_PUBLIC_APP_URL  ?? 'https://icons.rabbit-loop.com'

export default async function Page() {
  const user    = await getSession()
  const premium = user ? await isPremiumUser(user.id) : false
  if (user) registerConnectedApp(user.id)

  return (
    <div className="min-h-screen flex flex-col">
      <HeartbeatTracker />

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

      {/* Landing / SEO section */}
      <section className="border-t border-white/[0.06] px-4 sm:px-8 py-16 max-w-6xl mx-auto w-full">
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
            Free app icon maker — no download, no account required
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-10">
            Icon Builder is a free, browser-based tool for creating app icons for iOS and Android.
            Add emojis, Unicode symbols, or custom text to a 1024×1024 canvas, then export a
            production-ready PNG in seconds. Everything runs in your browser — nothing is uploaded
            to any server.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: 'Drag, resize and rotate',
                body:  'Place any emoji or symbol on the canvas and freely position it. Resize and rotate with simple handles — snap guides keep everything aligned.',
              },
              {
                title: 'Exports at 1024×1024',
                body:  'Export your icon at the full resolution required by the App Store and Google Play. Download standard, dark mode, and tinted variants in one click.',
              },
              {
                title: 'Works in any browser',
                body:  'No app to install, no account needed. Open the tool, build your icon, and export — it works on Mac, Windows, iPad, or any modern browser.',
              },
            ].map(f => (
              <div key={f.title} className="space-y-2">
                <h3 className="text-white text-sm font-semibold">{f.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/[0.04] pt-10">
            <h3 className="text-white text-sm font-semibold mb-4">How it works</h3>
            <ol className="space-y-2 text-gray-600 text-xs leading-relaxed list-decimal list-inside">
              <li>Pick an emoji or symbol from the picker, or type your own text</li>
              <li>Drag it into position on the canvas — snap guides help with alignment</li>
              <li>Adjust the size, rotation, and colour using the toolbar</li>
              <li>Preview your icon in an iPhone and Android home screen mock-up</li>
              <li>Export as PNG at 1024×1024 — ready to upload to App Store Connect or Google Play</li>
            </ol>
          </div>

          <div className="border-t border-white/[0.04] pt-10 mt-10">
            <h3 className="text-white text-sm font-semibold mb-3">Free vs Premium</h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              Icon Builder is free to use with no account required. Free exports include a small
              watermark in the corner.{' '}
              <a
                href={`${APP_URL?.replace('icons.', '')}/premium`}
                className="text-gray-400 hover:text-white underline underline-offset-4 transition-colors"
              >
                Rabbit Loop Premium
              </a>{' '}
              removes the watermark and unlocks watermark-free exports for all three variants
              (standard, dark, and tinted).
            </p>
          </div>
        </div>
      </section>

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
