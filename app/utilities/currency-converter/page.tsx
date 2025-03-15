import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CurrencyConverter } from "@/components/utilities/currency-converter"

export const metadata = {
  title: "Currency Converter | AI Toolkit",
  description: "Convert between different currencies",
}

export default function CurrencyConverterPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Currency Converter" text="Convert between different currencies" />
      <div className="mt-6">
        <CurrencyConverter />
      </div>
    </DashboardShell>
  )
}

