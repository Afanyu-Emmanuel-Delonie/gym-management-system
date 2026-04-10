"use client"

import { useState, useTransition } from "react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [pending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get("email") as string
    setError("")

    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) setError(error.message)
      else setSent(true)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
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

      <div className="relative z-10 w-full max-w-sm" style={{ padding: "0 1rem" }}>
        <div
          style={{
            backgroundColor: "var(--color-overlay-bg)",
            border: "1px solid var(--color-overlay-border)",
            borderRadius: "var(--radius-lg)",
            padding: "2rem",
            backdropFilter: "blur(8px)",
          }}
        >
          {sent ? (
            <div className="text-center">
              <h1 className="text-2xl mb-3" style={{ color: "var(--color-overlay-text)" }}>Check your email</h1>
              <p style={{ color: "var(--color-overlay-muted)", fontSize: "var(--text-sm)" }}>
                We sent a password reset link to your email address.
              </p>
              <Link href="/login" className="link-primary block mt-6">Back to Sign in</Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl mb-1 text-center" style={{ color: "var(--color-overlay-text)" }}>
                Forgot Password
              </h1>
              <p className="mb-6 text-center" style={{ color: "var(--color-overlay-muted)", fontSize: "var(--text-sm)" }}>
                Enter your email and we'll send you a reset link
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="email" type="email" required label="Email" placeholder="you@example.com" dark error={error} />
                <Button type="submit" size="lg" loading={pending} className="w-full" style={{ marginTop: "0.5rem" }}>
                  Send Reset Link
                </Button>
              </form>

              <p className="text-center mt-4" style={{ fontSize: "var(--text-sm)", color: "var(--color-overlay-muted)" }}>
                Remember your password?{" "}
                <Link href="/login" className="link-primary">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
