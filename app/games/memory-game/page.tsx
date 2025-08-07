import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { MemoryGame } from "@/components/games/memory-game"

export const metadata = {
  title: "Memory Game | AI Toolkit",
  description: "A card-matching game to test your memory",
}

export default function MemoryGamePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Memory Game" text="A card-matching game to test your memory" />
      <div className="mt-6">
        <MemoryGame />
      </div>
    </DashboardShell>
  )
}
