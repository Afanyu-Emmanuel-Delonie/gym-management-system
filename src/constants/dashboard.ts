import {
  LayoutDashboard,
  Users,
  CreditCard,
  ShoppingBag,
  MessageSquare,
  QrCode,
} from "lucide-react"
import React from "react"

export const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard":     "Dashboard",
  "/admin/staff":         "Staff Management",
  "/admin/subscriptions": "Subscriptions",
  "/admin/store":         "Store",
  "/admin/content":       "Content",
  "/profile":             "My Profile",
  "/agent/dashboard":     "Dashboard",
  "/agent/subscriptions": "Subscriptions",
  "/agent/access":        "Access Verification",
  "/coach/dashboard":     "Dashboard",
  "/coach/schedule":      "Schedule",
}

export const NAV_ITEMS: Record<string, { label: string; href: string; icon: React.ReactNode }[]> = {
  ADMIN: [
    { label: "Dashboard",     href: "/admin/dashboard",     icon: React.createElement(LayoutDashboard, { size: 20 }) },
    { label: "Staff",         href: "/admin/staff",         icon: React.createElement(Users, { size: 20 }) },
    { label: "Subscriptions", href: "/admin/subscriptions", icon: React.createElement(CreditCard, { size: 20 }) },
    { label: "Store",         href: "/admin/store",         icon: React.createElement(ShoppingBag, { size: 20 }) },
    { label: "Content",       href: "/admin/content",       icon: React.createElement(MessageSquare, { size: 20 }) },
  ],
  SALES_AGENT: [
    { label: "Dashboard",     href: "/agent/dashboard",     icon: React.createElement(LayoutDashboard, { size: 20 }) },
    { label: "Subscriptions", href: "/agent/subscriptions", icon: React.createElement(CreditCard, { size: 20 }) },
    { label: "Access",        href: "/agent/access",        icon: React.createElement(QrCode, { size: 20 }) },
  ],
}

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "info" | "success" | "warning"
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", title: "New subscription",  message: "Alice Martin just subscribed to the Pro plan.", time: "2 min ago", read: false, type: "success" },
  { id: "2", title: "Staff update",      message: "Coach schedule updated for next week.",          time: "1 hr ago",  read: false, type: "info" },
  { id: "3", title: "Payment pending",   message: "Invoice #1042 is awaiting approval.",            time: "3 hrs ago", read: true,  type: "warning" },
]

export const NOTIF_TYPE_COLORS: Record<string, string> = {
  info:    "var(--color-primary)",
  success: "#22c55e",
  warning: "#f59e0b",
}
