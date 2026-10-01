import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg space-y-4 py-10 text-center">
      <p className="font-mono-tech text-sm text-[var(--color-accent)]">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-[var(--color-text-muted)]">
        That route is not part of KYVON Hardware Lab.
      </p>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent-strong)] px-4 text-sm font-medium text-[var(--color-bg)]"
      >
        Back to dashboard
      </Link>
    </div>
  )
}
