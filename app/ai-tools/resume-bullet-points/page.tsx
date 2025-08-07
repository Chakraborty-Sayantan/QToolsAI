import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ResumeBulletPoints } from "@/components/ai-tools/resume-bullet-points"

export const metadata = {
  title: "Resume Bullet Points | AI Toolkit",
  description: "Generate impactful resume bullet points",
}

export default function ResumeBulletPointsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Resume Bullet Points" text="Generate impactful resume bullet points" />
      <div className="mt-6">
        <ResumeBulletPoints />
      </div>
    </DashboardShell>
  )
}