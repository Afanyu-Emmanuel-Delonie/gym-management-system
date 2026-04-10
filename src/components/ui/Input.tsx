"use client"

import { InputHTMLAttributes, useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  dark?: boolean
}

export default function Input({ label, error, dark = false, className = "", type, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword ? (showPassword ? "text" : "password") : type

  const darkStyles = dark ? {
    backgroundColor: "var(--color-overlay-input-bg)",
    border: `1px solid ${error ? "var(--color-danger)" : "var(--color-overlay-input-border)"}`,
    color: "var(--color-overlay-text)",
  } : {
    border: `1px solid ${error ? "var(--color-danger)" : "var(--color-border)"}`,
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      {label && (
        <label style={{
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          color: dark ? "var(--color-overlay-label)" : "var(--color-text-primary)",
        }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <input
          className={`input ${className}`}
          style={{ ...darkStyles, paddingRight: isPassword ? "2.5rem" : undefined }}
          type={inputType}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: dark ? "var(--color-overlay-muted)" : "var(--color-text-muted)",
              display: "flex",
              alignItems: "center",
              padding: 0,
            }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-danger)" }}>
          {error}
        </span>
      )}
    </div>
  )
}
