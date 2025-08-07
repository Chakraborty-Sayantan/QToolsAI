import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Hangman } from "@/components/games/hangman"

export const metadata = {
  title: "Hangman | AI Toolkit",
  description: "The popular word-guessing game",
}

export default function HangmanPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Hangman" text="The popular word-guessing game" />
      <div className="mt-6">
        <Hangman />
      </div>
    </DashboardShell>
  )
}
