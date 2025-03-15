import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TextSummarizer } from "@/components/ai-tools/text-summarizer"

export const metadata = {
  title: "Text Summarizer | AI Toolkit",
  description: "Summarize long articles and documents into concise summaries",
}

export default function TextSummarizerPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Text Summarizer" text="Summarize long articles and documents into concise summaries" />
      <div className="mt-6">
        <TextSummarizer />
      </div>
    </DashboardShell>
  )
}

