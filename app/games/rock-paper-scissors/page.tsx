import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RockPaperScissors } from "@/components/games/rock-paper-scissors"

export const metadata = {
  title: "Rock Paper Scissors | AI Toolkit",
  description: "Play the classic game against the computer",
}

export default function RockPaperScissorsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Rock Paper Scissors" text="Play the classic game against the computer" />
      <div className="mt-6">
        <RockPaperScissors />
      </div>
    </DashboardShell>
  )
}

