import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SentimentAnalysis } from "@/components/ai-tools/sentiment-analysis"

export const metadata = {
  title: "Sentiment Analysis | AI Toolkit",
  description: "Analyze the sentiment of a piece of text",
}

export default function SentimentAnalysisPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Sentiment Analysis" text="Analyze the sentiment of a piece of text" />
      <div className="mt-6">
        <SentimentAnalysis />
      </div>
    </DashboardShell>
  )
}