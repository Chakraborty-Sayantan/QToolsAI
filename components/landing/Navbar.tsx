"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"
import { SearchBar } from "@/components/search-bar"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close menu on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }, [open])

  // Close menu on 'Escape' key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Features", href: "#features" },
    { label: "Contact", href: "#footer" },
  ]

  const menuVariants = {
    initial: {
      x: "-100%",
    },
    animate: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  const linkVariants = {
    initial: {
      x: -20,
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  }

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-4 inset-x-0 max-w-6xl mx-auto z-50"
      >
        <div className="flex items-center justify-between px-4 h-16 rounded-full border border-transparent dark:border-white/[0.2] bg-[#d9c8c5]/80 dark:bg-[#1e1f24]/80 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/LOGO1.png"
                alt="QToolsAI Logo"
                width={52}
                height={48}
                className="rounded-full"
              />
             {/*  <span className="items-center text-lg font-bold hidden sm:block">
                QToolsAI
              </span> */}
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-lg font-bold text-neutral-700 dark:text-muted-foreground transition-colors hover:text-foreground dark:hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:block ml-4">
              <SearchBar />
            </div>
            <div className="hidden md:block">
              {mounted && <ThemeToggle />}
            </div>

            <button
              className="md:hidden p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile side-drawer and overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              variants={menuVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-y-0 left-0 z-50 w-72 border-r md:hidden bg-#d9c8c5/80 dark:bg-#1e1f24/80 backdrop-blur-lg flex flex-col p-6"
            >
              <div className="flex justify-between items-center mb-10">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/LOGO1.png"
                    alt="QToolsAI Logo"
                    width={48}
                    height={44}
                    className="rounded-full"
                  />
                  <span className="text-lg font-bold">QToolsAI</span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <SearchBar />

                <nav className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <motion.div key={link.label} variants={linkVariants}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="text-xl font-bold text-neutral-200 dark:text-muted-foreground transition-colors hover:text-neutral-800 dark:hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              <div className="mt-auto flex justify-center">{mounted && <ThemeToggle />}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}