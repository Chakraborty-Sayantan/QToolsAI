import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PasswordGenerator } from "@/components/utilities/password-generator"

export const metadata = {
  title: "Password Generator | AI Toolkit",
  description: "Generate secure, random passwords",
}

export default function PasswordGeneratorPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Password Generator" text="Generate secure, random passwords" />
      <div className="mt-6">
        <PasswordGenerator />
      </div>
    </DashboardShell>
  )
}

