import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { FlightTracker } from "@/components/utilities/flight-tracker"

export const metadata = {
  title: "Flight Tracker | AI Toolkit",
  description: "Track flight status and information",
}

export default function FlightTrackerPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Flight Tracker" text="Track flight status and information" />
      <div className="mt-6">
        <FlightTracker />
      </div>
    </DashboardShell>
  )
}

