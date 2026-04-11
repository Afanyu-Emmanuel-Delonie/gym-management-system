"use client"

import { useTransition } from "react"
import { login } from "@/actions/auth"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Toast from "@/components/ui/Toast"
import { useToast } from "@/hooks/useToast"
import Link from "next/link"

export default function LoginPage() {
  const [pending, startTransition] = useTransition()
  const { toast, showToast, hideToast } = useToast()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await login(formData)
      // Sanitize error message — strip newlines/HTML before displaying to prevent log injection / XSS
      if (result?.error) showToast(String(result.error).replace(/[\r\n<>]/g, " ").slice(0, 200), "error")
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      {/* Background */}
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
            backgroundColor: "var(--color-overlay-bg)",
            border: "1px solid var(--color-overlay-border)",
            borderRadius: "var(--radius-lg)",
            padding: "2rem",
            backdropFilter: "blur(8px)",
          }}
        >
          <h1 className="text-2xl mb-1 text-center" style={{ color: "var(--color-overlay-text)" }}>
            Welcome back
          </h1>
          <p className="mb-6 text-center" style={{ color: "var(--color-overlay-muted)", fontSize: "var(--text-sm)" }}>
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-2">
            <Input name="email" type="email" required label="Email" placeholder="you@example.com" dark />
            <Input name="password" type="password" required label="Password" placeholder="••••••••" dark />
            <Link href="/forgot-password" className="link-primary block text-right px-1">Forgot Password?</Link>
            <Button type="submit" size="lg" loading={pending} className="w-full" style={{ marginTop: "0.5rem" }}>
              Sign in
            </Button>
          </form>

          <div className="flex gap-2 mt-4 justify-center" style={{ fontSize: "var(--text-sm)" }}>
            <p>Don&apos;t Have an Account?</p>
            <Link href="/register" className="link-primary">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
