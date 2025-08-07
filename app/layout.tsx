"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { GlobalSearch } from "@/components/global-search"
import { useSearchStore } from "@/hooks/use-search-store"
import { useEffect } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { open } = useSearchStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault()
        open()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/LOGO1.png" type="image/png" sizes="256x256" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative z-10">
            {children}
          </div>
          <Toaster />
          <GlobalSearch />
        </ThemeProvider>
      </body>
    </html>
  )
}
