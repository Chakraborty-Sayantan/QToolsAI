import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PNRStatusChecker } from "@/components/utilities/pnr-status-checker"

export const metadata = {
  title: "PNR Status Checker | AI Toolkit",
  description: "Check the status of your Indian Railways PNR",
}

export default function PNRStatusCheckerPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="PNR Status Checker" text="Check the status of your Indian Railways PNR" />
      <div className="mt-6">
        <PNRStatusChecker />
      </div>
    </DashboardShell>
  )
}
