import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { UnitConverter } from "@/components/utilities/unit-converter"

export const metadata = {
  title: "Unit Converter | AI Toolkit",
  description: "Convert various units of measurement",
}

export default function UnitConverterPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Unit Converter" text="Convert various units of measurement" />
      <div className="mt-6">
        <UnitConverter />
      </div>
    </DashboardShell>
  )
}
