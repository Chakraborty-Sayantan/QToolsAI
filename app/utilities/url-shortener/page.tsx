import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { URLShortener } from "@/components/utilities/url-shortener"

export const metadata = {
  title: "URL Shortener | AI Toolkit",
  description: "Shorten long URLs for easier sharing",
}

export default function URLShortenerPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="URL Shortener" text="Shorten long URLs for easier sharing" />
      <div className="mt-6">
        <URLShortener />
      </div>
    </DashboardShell>
  )
}

