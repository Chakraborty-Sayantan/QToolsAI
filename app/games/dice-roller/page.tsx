import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DiceRoller } from "@/components/games/dice-roller"

export const metadata = {
  title: "Dice Roller | AI Toolkit",
  description: "Roll virtual dice for board games and RPGs",
}

export default function DiceRollerPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dice Roller" text="Roll virtual dice for board games and RPGs" />
      <div className="mt-6">
        <DiceRoller />
      </div>
    </DashboardShell>
  )
}

