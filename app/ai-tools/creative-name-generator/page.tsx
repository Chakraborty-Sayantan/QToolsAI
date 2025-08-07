import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CreativeNameGenerator } from "@/components/ai-tools/creative-name-generator"

export const metadata = {
  title: "Creative Name Generator | AI Toolkit",
  description: "Generate names for your business, project, or pet",
}

export default function CreativeNameGeneratorPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Creative Name Generator" text="Generate names for your business, project, or pet" />
      <div className="mt-6">
        <CreativeNameGenerator />
      </div>
    </DashboardShell>
  )
}