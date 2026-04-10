"use client"

import { createContext, useContext, useState, useEffect } from "react"

const SidebarContext = createContext<{
  collapsed: boolean
  toggle: () => void
  isMobile: boolean
}>({ collapsed: false, toggle: () => {}, isMobile: false })

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setCollapsed(true)
      else setCollapsed(false)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <SidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed(v => !v), isMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarContext)
}
