import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { GlobalSearch } from "@/components/global-search"
import { KbdShortcut } from "@/components/kbd-shortcut"

export const metadata: Metadata = {
  title: "QTools AI",
  description: "All-in-one AI and utility toolkit",
  keywords: ["AI", "tools", "utilities", "productivity"],
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="512*512" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <KbdShortcut />
          <div className="relative z-10">{children}</div>
          <Toaster />
          <GlobalSearch />
        </ThemeProvider>
      </body>
    </html>
  )
}