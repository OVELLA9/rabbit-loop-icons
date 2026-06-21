# Commit messages are public

Every commit pushed to `main` is automatically published to the public changelog at rabbit-loop.com/updates (via `.github/workflows/changelog.yml`). Write commit messages as if a customer will read them: plain language, one line, what changed and why it matters to them. No file paths, ticket numbers, internal jargon, or implementation detail.

# New repos need this too

Every new Rabbit Loop repo must get a copy of `.github/workflows/changelog.yml` and have `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` added as GitHub Actions secrets (Settings → Secrets and variables → Actions) before its first push to main — otherwise commits won't show up at rabbit-loop.com/updates.
