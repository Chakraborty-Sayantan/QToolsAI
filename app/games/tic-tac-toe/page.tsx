import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TicTacToe } from "@/components/games/tic-tac-toe"

export const metadata = {
  title: "Tic-Tac-Toe | AI Toolkit",
  description: "The classic game, playable against a friend or an AI",
}

export default function TicTacToePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Tic-Tac-Toe" text="The classic game, playable against a friend or an AI" />
      <div className="mt-6">
        <TicTacToe />
      </div>
    </DashboardShell>
  )
}
