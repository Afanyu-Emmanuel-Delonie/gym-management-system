import { CreditCard, Users, ShoppingBag, AlertTriangle } from "lucide-react"
import React from "react"

export type CardKey = "members" | "subscriptions" | "revenue" | "orders"

export const STAT_CARDS = [
  { key: "members"       as CardKey, label: "Active Members",       value: "248",  trend: "+12%", trendUp: true  },
  { key: "subscriptions" as CardKey, label: "Active Subscriptions", value: "184",  trend: "+8%",  trendUp: true  },
  { key: "revenue"       as CardKey, label: "Monthly Revenue",      value: "2.4M", trend: "+15%", trendUp: true  },
  { key: "orders"        as CardKey, label: "Pending Orders",       value: "12",   trend: "+3",   trendUp: false },
]

export const LINE_DATA: Record<CardKey, { label: string; value: number }[]> = {
  members:       [180,195,200,210,220,215,225,230,235,240,245,248].map((v,i)=>({label:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],value:v})),
  subscriptions: [120,130,125,140,150,145,155,160,165,170,178,184].map((v,i)=>({label:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],value:v})),
  revenue:       [1.2,1.4,1.35,1.6,1.75,1.7,1.9,2.0,2.1,2.2,2.3,2.4].map((v,i)=>({label:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],value:v})),
  orders:        [5,8,6,10,9,7,11,13,10,14,12,12].map((v,i)=>({label:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],value:v})),
}

export const SUBSCRIPTION_DONUT = [
  { name: "Monthly", value: 98, color: "#c60b0b" },
  { name: "Yearly",  value: 52, color: "#6366f1" },
  { name: "Weekly",  value: 24, color: "#f59e0b" },
  { name: "Daily",   value: 10, color: "#22c55e" },
]

export const PRODUCT_DONUT = [
  { name: "Supplements", value: 42, color: "#c60b0b" },
  { name: "Apparel",     value: 28, color: "#6366f1" },
  { name: "Equipment",   value: 18, color: "#f59e0b" },
  { name: "Accessories", value: 12, color: "#22c55e" },
]

export const EXPIRING_SUBS = [
  { name: "Eva Mutoni",      type: "MONTHLY", daysLeft: 2 },
  { name: "James Habimana",  type: "WEEKLY",  daysLeft: 3 },
  { name: "Sarah Ingabire",  type: "YEARLY",  daysLeft: 5 },
  { name: "Peter Nzeyimana", type: "MONTHLY", daysLeft: 7 },
  { name: "Grace Uwimana",   type: "WEEKLY",  daysLeft: 9 },
]

export const RECENT_ACTIVITY = [
  { icon: React.createElement(CreditCard, { size: 14 }),    color: "#22c55e", text: "Alice Martin subscribed",    detail: "Monthly plan",        time: "2 min ago",  type: "Subscription" },
  { icon: React.createElement(ShoppingBag, { size: 14 }),   color: "#6366f1", text: "Order #1042 placed",         detail: "Bob Kariuki",         time: "15 min ago", type: "Order" },
  { icon: React.createElement(Users, { size: 14 }),         color: "#c60b0b", text: "New member registered",      detail: "Claire Uwase",        time: "1 hr ago",   type: "Member" },
  { icon: React.createElement(CreditCard, { size: 14 }),    color: "#f59e0b", text: "Subscription confirmed",     detail: "David — Weekly",      time: "2 hrs ago",  type: "Subscription" },
  { icon: React.createElement(ShoppingBag, { size: 14 }),   color: "#6366f1", text: "Order #1041 delivered",      detail: "3 items",             time: "3 hrs ago",  type: "Order" },
  { icon: React.createElement(AlertTriangle, { size: 14 }), color: "#f59e0b", text: "Subscription expiring soon", detail: "Eva Mutoni — 2 days", time: "5 hrs ago",  type: "Alert" },
  { icon: React.createElement(CreditCard, { size: 14 }),    color: "#22c55e", text: "Yearly plan activated",      detail: "Frank Mugisha",       time: "6 hrs ago",  type: "Subscription" },
  { icon: React.createElement(ShoppingBag, { size: 14 }),   color: "#6366f1", text: "Order #1040 paid",           detail: "Grace Uwimana",       time: "8 hrs ago",  type: "Order" },
]

export const ACTIVITY_TYPE_STYLES: Record<string, { bg: string; color: string }> = {
  Subscription: { bg: "var(--color-success-subtle)", color: "var(--color-success)" },
  Order:        { bg: "var(--color-primary-subtle)", color: "var(--color-primary)" },
  Member:       { bg: "#ede9fe",                     color: "#6366f1" },
  Alert:        { bg: "var(--color-warning-subtle)", color: "var(--color-warning)" },
}
