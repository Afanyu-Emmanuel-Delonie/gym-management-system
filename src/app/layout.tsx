import type { Metadata } from "next"
import { Anton, Roboto } from "next/font/google"
import "./globals.css"

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
})

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "Gym Management System",
  description: "Manage your gym operations",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${roboto.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
