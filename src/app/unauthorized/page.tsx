import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--color-background)" }}>
      <div className="card text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
          You don't have permission to view this page.
        </p>
        <Link href="/" className="btn btn-primary">Go back home</Link>
      </div>
    </div>
  )
}
