import Link from "next/link"

export default function VerifyEmailPage() {
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
            textAlign: "center",
          }}
        >
          <h1 className="text-2xl mb-3" style={{ color: "var(--color-overlay-text)" }}>Check your email</h1>
          <p style={{ color: "var(--color-overlay-muted)", fontSize: "var(--text-sm)", marginBottom: "1.5rem" }}>
            We sent a verification link to your email. Click it to activate your account.
          </p>
          <Link href="/login" className="link-primary">Back to Sign in</Link>
        </div>
      </div>
    </div>
  )
}
