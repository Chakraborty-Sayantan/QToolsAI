import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { KeywordExtractor } from "@/components/ai-tools/keyword-extractor"

export const metadata = {
  title: "Keyword Extractor | AI Toolkit",
  description: "Extract relevant keywords from a block of text",
}

export default function KeywordExtractorPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Keyword Extractor" text="Extract relevant keywords from a block of text" />
      <div className="mt-6">
        <KeywordExtractor />
      </div>
    </DashboardShell>
  )
}