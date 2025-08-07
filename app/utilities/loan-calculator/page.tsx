import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { LoanCalculator } from "@/components/utilities/loan-calculator"

export const metadata = {
  title: "Loan Calculator | AI Toolkit",
  description: "Calculate monthly payments for loans or mortgages",
}

export default function LoanCalculatorPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Loan Calculator" text="Calculate monthly payments for loans or mortgages" />
      <div className="mt-6">
        <LoanCalculator />
      </div>
    </DashboardShell>
  )
}
