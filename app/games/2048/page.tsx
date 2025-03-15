import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Game2048 } from "@/components/games/game-2048"

export const metadata = {
  title: "2048 | AI Toolkit",
  description: "Play the addictive 2048 puzzle game",
}

export default function Game2048Page() {
  return (
    <DashboardShell>
      <DashboardHeader heading="2048" text="Play the addictive 2048 puzzle game" />
      <div className="mt-6">
        <Game2048 />
      </div>
    </DashboardShell>
  )
}

