"use client"

import { useTransition } from "react"
import { signUp } from "@/actions/auth"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Toast from "@/components/ui/Toast"
import { useToast } from "@/hooks/useToast"
import Link from "next/link"

export default function RegisterPage() {
  const [pending, startTransition] = useTransition()
  const { toast, showToast, hideToast } = useToast()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await signUp(formData)
      if (result?.error) showToast(result.error, "error")
    })
  }

  return (
    <div className="min-h-screen relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      {/* Background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url('/landing-page/image.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(100%) brightness(0.4)",
          zIndex: 0,
        }}
      />

      {/* Scrollable content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-lg">
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
              Create Account
            </h1>
            <p className="mb-6 text-center" style={{ color: "var(--color-overlay-muted)", fontSize: "var(--text-sm)" }}>
              Join us and start your fitness journey
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="fullName" type="text" required label="Full Name" placeholder="John Doe" dark />

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1"><Input name="email" type="email" required label="Email" placeholder="you@example.com" dark /></div>
                <div className="flex-1"><Input name="phoneNumber" type="tel" label="Phone" placeholder="+250 700 000 000" dark /></div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1"><Input name="password" type="password" required label="Password" placeholder="••••••••" dark /></div>
                <div className="flex-1"><Input name="confirmPassword" type="password" required label="Confirm Password" placeholder="••••••••" dark /></div>
              </div>

              <Button type="submit" size="lg" loading={pending} className="w-full" style={{ marginTop: "0.5rem" }}>
                Create Account
              </Button>
            </form>

            <p className="text-center mt-4" style={{ fontSize: "var(--text-sm)", color: "var(--color-overlay-muted)" }}>
              Already have an account?{" "}
              <Link href="/login" className="link-primary">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
