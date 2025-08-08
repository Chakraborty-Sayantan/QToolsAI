"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { MemoryGame } from "@/components/games/memory-game"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

/* export const metadata = {
  title: "Snake | AI Toolkit",
  description: "A simple implementation of the classic Snake game",
  viewport: "width=device-width, initial-scale=1, user-scalable=no",
}
 */
export default function MemoryPage() {
  return (
    <main className="relative">
      {/* ── Mobile back button ── */}
      <div className="md:hidden sticky top-4 left-4 z-40 mb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-background/80 dark:bg-slate-900/80 backdrop-blur-sm px-3 py-2 text-sm font-medium shadow-md border border-border/40 transition hover:bg-background/100 dark:hover:bg-slate-800/90"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* ── Page content with entrance animation ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <DashboardShell>
          <DashboardHeader
            heading="Memory Game"
            text="A simple implementation of the classic Memory game"
          />
          <div className="mt-6 max-w-full mx-auto px-2 sm:px-0">
            <MemoryGame/>
          </div>
        </DashboardShell>
      </motion.section>
    </main>
  )
}