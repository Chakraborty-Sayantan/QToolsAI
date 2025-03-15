import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CodeExplainer } from "@/components/ai-tools/code-explainer"

export const metadata = {
  title: "Code Explainer | AI Toolkit",
  description: "Get explanations for code snippets in plain English",
}

export default function CodeExplainerPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Code Explainer" text="Get explanations for code snippets in plain English" />
      <div className="mt-6">
        <CodeExplainer />
      </div>
    </DashboardShell>
  )
}

