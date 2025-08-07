import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { WordCounter } from "@/components/utilities/word-counter"

export const metadata = {
  title: "Word Counter | AI Toolkit",
  description: "Count words and characters in a piece of text",
}

export default function WordCounterPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Word Counter" text="Count words and characters in a piece of text" />
      <div className="mt-6">
        <WordCounter />
      </div>
    </DashboardShell>
  )
}
