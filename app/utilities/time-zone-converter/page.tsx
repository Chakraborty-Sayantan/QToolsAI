"use client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TimeZoneConverter } from "@/components/utilities/time-zone-converter"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
/* 
export const metadata = {
  title: "Time Zone Converter | AI Toolkit",
  description: "Check and compare the time in different parts of the world",
} */

export default function TimeZoneConverterPage() {
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
            heading="Time Zone Converter"
            text="Check and compare the time in different parts of the world"
          />
          <div className="mt-6 max-w-full mx-auto px-2 sm:px-0">
            <TimeZoneConverter />
          </div>
        </DashboardShell>
      </motion.section>
    </main>
  )
}
