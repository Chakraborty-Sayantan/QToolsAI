import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ToolsOverview } from "@/components/dashboard/tools-overview"

export const metadata = {
  title: "Dashboard | QToolsAI",
  description: "Your all-in-one platform for AI tools, utilities, and games",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Welcome to QToolsAI - explore our tools, utilities, and games." />
      <ToolsOverview />
    </DashboardShell>
  )
}

