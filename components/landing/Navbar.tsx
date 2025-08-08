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
       {/* ---------- DESKTOP BAR (unchanged) ---------- */}
    <div className="hidden md:flex items-center justify-between px-4 h-16 rounded-full border border-transparent dark:border-white/[0.2] bg-[#d9c8c5]/80 dark:bg-[#1e1f24]/80 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] backdrop-blur-sm">
    <div className="flex items-center gap-4">
      <Link href="/" className="flex items-center">
        <Image
          src="/LOGO1.png"
          alt="QToolsAI Logo"
          width={52}
          height={48}
          className="rounded-full"
        />
      </Link>

            <nav className="flex items-center gap-6 text-sm">
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
              <div className="ml-4">
                <SearchBar />
              </div>
              {mounted && <ThemeToggle />}
            </div>
          </div>
  {/* ---------- MOBILE BAR (new) ---------- */}
            <div className="md:hidden w-96 mx-0 flex items-center justify-between px-4 h-14 rounded-full mt-4 bg-[#d9c8c5]/80 dark:bg-[#1e1f24]/80 shadow-lg backdrop-blur-md">
              {/* Left: logo */}
                <Link href="/" className="flex items-center gap-4">
                  <Image
                    src="/LOGO1.png"
                    alt="QToolsAI Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="text-lg font-bold font-michroma">QToolsAI</span>
                </Link>

      {/* Middle: intentionally empty */}

      {/* Right: hamburger */}
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-full text-neutral-700 dark:text-neutral-200"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          </motion.header>

      {/* ---------- DRAWER (opens from RIGHT) ---------- */}
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
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 right-0 z-50 w-72 bg-[#d9c8c5]/90 dark:bg-[#1e1f24]/90 flex flex-col p-6"
      >
          <div className="flex flex-col gap-4 px-4 py-4">
              {/* X button top right */}
              <div className="flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  aria-label="Close menu"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              {/* Search bar with theme toggle */}
              <div className="flex items-center gap-2">
                <SearchBar />
                {mounted && <ThemeToggle />}
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col gap-5 mt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

      </motion.div>
    </>
  )}
</AnimatePresence>
    </>
  )
}