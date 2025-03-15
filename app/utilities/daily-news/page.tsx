import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DailyNews } from "@/components/utilities/daily-news"

export const metadata = {
  title: "Daily News | AI Toolkit",
  description: "Stay updated with the latest news",
}

export default function DailyNewsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Daily News" text="Stay updated with the latest news" />
      <div className="mt-6">
        <DailyNews />
      </div>
    </DashboardShell>
  )
}

