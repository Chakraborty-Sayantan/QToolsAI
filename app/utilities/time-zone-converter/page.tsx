import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TimeZoneConverter } from "@/components/utilities/time-zone-converter"

export const metadata = {
  title: "Time Zone Converter | AI Toolkit",
  description: "Check and compare the time in different parts of the world",
}

export default function TimeZoneConverterPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Time Zone Converter" text="Check and compare the time in different parts of the world" />
      <div className="mt-6">
        <TimeZoneConverter />
      </div>
    </DashboardShell>
  )
}
