import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Snake } from "@/components/games/snake"

export const metadata = {
  title: "Snake | AI Toolkit",
  description: "A simple implementation of the classic Snake game",
}

export default function SnakePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Snake" text="A simple implementation of the classic Snake game" />
      <div className="mt-6">
        <Snake />
      </div>
    </DashboardShell>
  )
}
