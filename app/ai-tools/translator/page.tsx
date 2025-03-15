import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Translator } from "@/components/ai-tools/translator"

export const metadata = {
  title: "Language Translator | AI Toolkit",
  description: "Translate text between multiple languages",
}

export default function TranslatorPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Language Translator" text="Translate text between multiple languages" />
      <div className="mt-6">
        <Translator />
      </div>
    </DashboardShell>
  )
}

