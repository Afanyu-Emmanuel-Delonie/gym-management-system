"use client"

import { useTransition } from "react"
import { login } from "@/actions/auth"

export default function LoginPage() {
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => { await login(formData) })
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--color-background)" }}>
      <div className="card w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="mb-6" style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
          Sign in to your account
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1" style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>Email</label>
            <input name="email" type="email" required className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block mb-1" style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>Password</label>
            <input name="password" type="password" required className="input" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={pending} className="btn btn-primary btn-lg w-full">
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}
