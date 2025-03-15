import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PomodoroTimer } from "@/components/utilities/pomodoro-timer"

export const metadata = {
  title: "Pomodoro Timer | AI Toolkit",
  description: "Boost productivity with the Pomodoro technique",
}

export default function PomodoroTimerPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Pomodoro Timer" text="Boost productivity with the Pomodoro technique" />
      <div className="mt-6">
        <PomodoroTimer />
      </div>
    </DashboardShell>
  )
}

