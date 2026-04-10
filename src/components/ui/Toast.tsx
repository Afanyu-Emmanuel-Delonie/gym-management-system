"use client"

import { useEffect, useState } from "react"

type ToastType = "error" | "success" | "warning"

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

const colors: Record<ToastType, { bg: string; border: string; color: string }> = {
  error:   { bg: "#1a0000", border: "var(--color-danger)",  color: "#ff6b6b" },
  success: { bg: "#001a0a", border: "var(--color-success)", color: "#4ade80" },
  warning: { bg: "#1a1000", border: "var(--color-warning)", color: "#fbbf24" },
}

export default function Toast({ message, type = "error", duration = 4000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // slide in
    const showTimer = setTimeout(() => setVisible(true), 10)
    // slide out then close
    const hideTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => { clearTimeout(showTimer); clearTimeout(hideTimer) }
  }, [duration, onClose])

  const { bg, border, color } = colors[type]

  return (
    <div
      style={{
        position: "fixed",
        top: visible ? "1.5rem" : "-5rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        transition: "top 0.3s ease",
        backgroundColor: bg,
        border: `1px solid ${border}`,
        borderRadius: "var(--radius-md)",
        padding: "0.75rem 1.25rem",
        color,
        fontSize: "var(--text-sm)",
        fontWeight: 500,
        boxShadow: "var(--shadow-lg)",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        minWidth: "260px",
        maxWidth: "90vw",
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300) }}
        style={{ background: "none", border: "none", cursor: "pointer", color, fontSize: "1rem", lineHeight: 1, padding: 0 }}
      >
        ✕
      </button>
    </div>
  )
}
