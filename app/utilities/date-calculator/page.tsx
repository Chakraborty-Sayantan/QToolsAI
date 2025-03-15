import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DateCalculator } from "@/components/utilities/date-calculator"

export const metadata = {
  title: "Date Calculator | AI Toolkit",
  description: "Calculate the difference between dates",
}

export default function DateCalculatorPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Date Calculator" text="Calculate the difference between dates" />
      <div className="mt-6">
        <DateCalculator />
      </div>
    </DashboardShell>
  )
}

