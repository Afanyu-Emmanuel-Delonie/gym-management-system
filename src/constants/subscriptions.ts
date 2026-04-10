export const SUBSCRIPTION_MOCK = [
  { id: "1", name: "Alice Martin",     email: "alice@email.com",  phone: "+250 700 001", type: "MONTHLY", status: "ACTIVE",    accessCode: "411308", startDate: "2025-06-01", endDate: "2025-07-01" },
  { id: "2", name: "Bob Kariuki",      email: "bob@email.com",    phone: "+250 700 002", type: "WEEKLY",  status: "PENDING",   accessCode: null,     startDate: null,         endDate: null },
  { id: "3", name: "Claire Uwase",     email: "claire@email.com", phone: "+250 700 003", type: "YEARLY",  status: "ACTIVE",    accessCode: "882341", startDate: "2025-01-01", endDate: "2026-01-01" },
  { id: "4", name: "David Nkurunziza", email: "david@email.com",  phone: "+250 700 004", type: "DAILY",   status: "EXPIRED",   accessCode: "123456", startDate: "2025-05-01", endDate: "2025-05-02" },
  { id: "5", name: "Eva Mutoni",       email: "eva@email.com",    phone: "+250 700 005", type: "MONTHLY", status: "CANCELLED", accessCode: null,     startDate: "2025-04-01", endDate: "2025-05-01" },
  { id: "6", name: "Frank Mugisha",    email: "frank@email.com",  phone: "+250 700 006", type: "YEARLY",  status: "PENDING",   accessCode: null,     startDate: null,         endDate: null },
]

export const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  ACTIVE:    { bg: "var(--color-success-subtle)", color: "var(--color-success)" },
  PENDING:   { bg: "var(--color-warning-subtle)", color: "var(--color-warning)" },
  EXPIRED:   { bg: "var(--color-surface-raised)", color: "var(--color-text-muted)" },
  CANCELLED: { bg: "var(--color-danger-subtle)",  color: "var(--color-danger)" },
}

export const TYPE_STYLES: Record<string, { bg: string; color: string }> = {
  DAILY:   { bg: "#f0fdf4", color: "#16a34a" },
  WEEKLY:  { bg: "#eff6ff", color: "#2563eb" },
  MONTHLY: { bg: "#fdf2f2", color: "#c60b0b" },
  YEARLY:  { bg: "#faf5ff", color: "#7c3aed" },
}
