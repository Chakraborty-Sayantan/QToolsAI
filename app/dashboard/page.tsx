"use client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

/* export const metadata = {
  title: "Dashboard | QToolsAI",
  description: "Your all-in-one platform for AI tools, utilities, and games",
} */

const ToolsOverviewWithAnimation = dynamic(
  () => import("@/components/dashboard/tools-overview").then((mod) => mod.ToolsOverview),
  {
    loading: () => <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>,
    ssr: false,
  }
)

export default function DashboardPage() {
  return (
    <main className="relative">
      {/* ── Mobile back button ── */}
      <div className="md:hidden sticky top-4 left-4 z-40 mb-4">
        <Link
          href="/"
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
            heading="Dashboard"
            text="Welcome to QToolsAI - explore our tools, utilities, and games."/>
          <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <ToolsOverviewWithAnimation />
      </Suspense>
        </DashboardShell>
      </motion.section>
    </main>
  )
}

