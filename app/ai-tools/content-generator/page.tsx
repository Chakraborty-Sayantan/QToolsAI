import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ContentGeneratorForm } from "@/components/ai-tools/content-generator-form"

export const metadata = {
  title: "Content Generator | AI Toolkit",
  description: "Generate high-quality content for blogs, social media, and more",
}

export default function ContentGeneratorPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Content Generator"
        text="Generate high-quality content for blogs, social media, and more"
      />
      <div className="mt-6">
        <ContentGeneratorForm />
      </div>
    </DashboardShell>
  )
}

