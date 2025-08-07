import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ColorPicker } from "@/components/utilities/color-picker"

export const metadata = {
  title: "Color Picker & Converter | AI Toolkit",
  description: "Pick colors and convert them between HEX, RGB, and HSL formats",
}

export default function ColorPickerPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Color Picker & Converter" text="Pick colors and convert them between HEX, RGB, and HSL formats" />
      <div className="mt-6">
        <ColorPicker />
      </div>
    </DashboardShell>
  )
}
