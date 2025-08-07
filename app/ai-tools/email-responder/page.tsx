import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { EmailResponder } from "@/components/ai-tools/email-responder"

export const metadata = {
  title: "Email Responder | AI Toolkit",
  description: "Generate professional or casual email replies",
}

export default function EmailResponderPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Email Responder" text="Generate professional or casual email replies" />
      <div className="mt-6">
        <EmailResponder />
      </div>
    </DashboardShell>
  )
}