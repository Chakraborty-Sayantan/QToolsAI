import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AgeCalculator } from "@/components/utilities/age-calculator"

export const metadata = {
  title: "Age Calculator | AI Toolkit",
  description: "Calculate age from birthdate",
}

export default function AgeCalculatorPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Age Calculator" text="Calculate age from birthdate" />
      <div className="mt-6">
        <AgeCalculator />
      </div>
    </DashboardShell>
  )
}

