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
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background image with grayscale */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/landing-page/image.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(100%) brightness(0.4)",
          zIndex: 0,
        }}
      />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-sm" style={{ padding: "0 1rem" }}>
        <div
          style={{
            backgroundColor: "#000000a8",
            border: "1px solid #ffffff1a",
            borderRadius: "var(--radius-lg)",
            padding: "2rem",
            backdropFilter: "blur(8px)",
          }}
        >
          <h1 className="text-2xl mb-1 text-center" style={{ color: "#fff" }}>Welcome back</h1>
          <p className="mb-6 text" style={{ color: "#ffffff80", fontSize: "var(--text-sm)" }}>
            Sign in to your account
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1" style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "#ffffffb3" }}>Email</label>
              <input name="email" type="email" required className="input" placeholder="you@example.com"
                style={{ backgroundColor: "#ffffff14", border: "1px solid #ffffff26", color: "#fff" }}
              />
            </div>
            <div>
              <label className="block mb-1" style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "#ffffffb3" }}>Password</label>
              <input name="password" type="password" required className="input" placeholder="••••••••"
                style={{ backgroundColor: "#ffffff14", border: "1px solid #ffffff26", color: "#fff" }}
              />
            </div>
            <button type="submit" disabled={pending} className="btn btn-primary btn-lg w-full" style={{ marginTop: "0.5rem" }}>
              {pending ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
