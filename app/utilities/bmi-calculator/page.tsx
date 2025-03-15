import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { BMICalculator } from "@/components/utilities/bmi-calculator"

export const metadata = {
  title: "BMI Calculator | AI Toolkit",
  description: "Calculate your Body Mass Index",
}

export default function BMICalculatorPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="BMI Calculator" text="Calculate your Body Mass Index" />
      <div className="mt-6">
        <BMICalculator />
      </div>
    </DashboardShell>
  )
}

