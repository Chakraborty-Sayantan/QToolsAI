import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ImagePromptGenerator } from "@/components/ai-tools/image-prompt-generator"

export const metadata = {
  title: "Image Prompt Generator | AI Toolkit",
  description: "Generate detailed prompts for AI image generation tools",
}

export default function ImagePromptGeneratorPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Image Prompt Generator"
        text="Generate detailed prompts for AI image generation tools"
      />
      <div className="mt-6">
        <ImagePromptGenerator />
      </div>
    </DashboardShell>
  )
}

