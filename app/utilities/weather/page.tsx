import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { WeatherApp } from "@/components/utilities/weather-app"

export const metadata = {
  title: "Weather | AI Toolkit",
  description: "Check the weather forecast for any location",
}

export default function WeatherPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Weather" text="Check the weather forecast for any location" />
      <div className="mt-6">
        <WeatherApp />
      </div>
    </DashboardShell>
  )
}

