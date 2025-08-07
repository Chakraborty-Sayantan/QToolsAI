"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from 'next/image'
import { SearchBar } from "@/components/search-bar"

export function Navbar() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-4 inset-x-0 max-w-6xl mx-auto z-50"
    >
      <div className="flex items-center justify-between px-4 rounded-full border border-transparent dark:border-white/[0.2] bg-background/80 dark:bg-slate-900/80 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <Image src="/LOGO1.png" alt="QToolsAI Logo" width={52} height={48} className="rounded-full" />
            <span className="items-center text-lg font-bold hidden sm:block">QToolsAI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            
            <Link href="/dashboard" className="text-lg font-bold text-muted-foreground transition-colors hover:text-foreground">
              Dashboard
            </Link>
            
            <Link href="#features" className="text-lg font-bold text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            
            <Link href="#footer" className="text-lg font-bold text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </Link>

          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="ml-4">
          <SearchBar/>
          </div>
          {mounted && <ThemeToggle />}
        </div>
      </div>
    </motion.header>
  )
}
