import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { QRCodeGenerator } from "@/components/utilities/qr-code-generator"

export const metadata = {
  title: "QR Code Generator | AI Toolkit",
  description: "Generate QR codes for websites, text, and more",
}

export default function QRCodePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="QR Code Generator" text="Generate QR codes for websites, text, and more" />
      <div className="mt-6">
        <QRCodeGenerator />
      </div>
    </DashboardShell>
  )
}

