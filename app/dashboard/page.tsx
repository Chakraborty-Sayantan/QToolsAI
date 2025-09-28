"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Suspense, useState, useEffect } from "react"
import { Loader2, ArrowLeft, Menu, X, ChevronDown } from "lucide-react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { sidebarItems } from "@/lib/sidebar-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname } from 'next/navigation'

const ToolsOverviewWithAnimation = dynamic(
  () => import("@/components/dashboard/tools-overview").then((mod) => mod.ToolsOverview),
  {
    loading: () => <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>,
    ssr: false,
  }
)

export default function DashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openSections, setOpenSections] = useState<string[]>([])
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev)
  }

  const toggleSection = (title: string) => {
    setOpenSections(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    )
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, []);

  const drawerVariants = {
    hidden: {
      x: "-100%",
    },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
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

  return (
    <main className="relative">
      {/* ── Mobile Header with Hamburger ── */}
      <div className="md:hidden sticky top-4 left-4 z-40 mb-4 flex items-center justify-between px-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-background/80 dark:bg-slate-900/80 backdrop-blur-sm px-3 py-2 text-sm font-medium shadow-md border border-border/40 transition hover:bg-background/100 dark:hover:bg-slate-800/90"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-full text-neutral-700 dark:text-neutral-200"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* ── Page content with entrance animation ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <DashboardShell>
          <DashboardHeader
            heading="Dashboard"
            text="Welcome to QToolsAI - explore our tools, utilities, and games."/>
          <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <ToolsOverviewWithAnimation />
          </Suspense>
        </DashboardShell>
      </motion.section>

      {/* ---------- MOBILE DRAWER (Left Side) ---------- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={toggleMobileMenu}
            />
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={drawerVariants}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-card-gradient-light dark:bg-card-gradient-dark flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex flex-col gap-4">
                {/* Close button top right */}
                <div className="flex justify-end">
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="Close menu"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>

                {/* Search bar and Theme toggle */}
                <div className="flex items-center gap-2 mb-4">
                  <SearchBar />
                  {mounted && <ThemeToggle variant="ghost" />}
                </div>

                {/* Navigation Links and Categories */}
                <nav className="grid items-start px-2 text-sm font-medium">
                  {sidebarItems.map((item, index) => {
                    const isOpen = openSections.includes(item.title)
                    
                    if (item.title === "Dashboard") {
                      return null;
                    }

                    return item.items ? (
                      <div key={index} className="py-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-between"
                          onClick={() => toggleSection(item.title)}
                        >
                          <div className="flex items-center">
                            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                            {item.title}
                          </div>
                          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                        </Button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-1 pt-2">
                                {item.items.map((subItem, subIndex) => (
                                  <Button
                                    key={subIndex}
                                    variant="ghost"
                                    className={cn(
                                      "w-full justify-start",
                                      pathname === subItem.href && "bg-primary/20"
                                    )}
                                    asChild
                                  >
                                    <Link href={subItem.href} onClick={toggleMobileMenu}>
                                      {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                                      {subItem.title}
                                    </Link>
                                  </Button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : null;
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}