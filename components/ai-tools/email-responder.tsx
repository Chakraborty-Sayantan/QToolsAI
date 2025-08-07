"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Copy,  History } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"

interface EmailHistory {
  emailContent: string
  response: string
  timestamp: number
}

export function EmailResponder() {
  const [emailContent, setEmailContent] = useState("")
  const [responseType, setResponseType] = useState("professional")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResponse, setGeneratedResponse] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<EmailHistory | null>(null)
  const { toast } = useToast()
  const [emailHistory, setEmailHistory] = useState<EmailHistory[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("emailHistory")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const saveHistory = (history: EmailHistory[]) => {
    setEmailHistory(history)
    if (typeof window !== "undefined") {
      localStorage.setItem("emailHistory", JSON.stringify(history))
    }
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!emailContent) return

    setIsGenerating(true)
    setGeneratedResponse("")

    try {
      const response = await fetch("/api/email-responder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailContent, responseType }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate response")
      }

      setGeneratedResponse(data.response)
      const newEntry: EmailHistory = {
        emailContent,
        response: data.response,
        timestamp: Date.now(),
      }
      saveHistory([newEntry, ...emailHistory.slice(0, 4)])
    } catch (error) {
      console.error("Error generating response:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  function copyToClipboard(content: string) {
    navigator.clipboard.writeText(content)
    toast({
      description: "Response copied to clipboard!",
    })
  }

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedEmail(null)}>
      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Email Responder</CardTitle>
              <CardDescription>Generate professional or casual email replies</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={() => setShowHistory(!showHistory)}>
              <History className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <Textarea
                placeholder="Paste the email you want to respond to..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-32"
                required
              />
              <Select value={responseType} onValueChange={setResponseType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select response type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full" disabled={isGenerating || !emailContent}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Generate Response"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {generatedResponse && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap rounded-md bg-muted p-4 line-clamp-3">{generatedResponse}</div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => copyToClipboard(generatedResponse)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {showHistory && emailHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailHistory.map((item, index) => (
                  <div key={index} className="rounded-md border p-3">
                    <p className="text-sm font-medium line-clamp-2">{item.emailContent}</p>
                    <div className="flex justify-end mt-2">
                      <DialogTrigger asChild>
                        <Button variant="secondary" size="sm" onClick={() => setSelectedEmail(item)}>
                          View
                        </Button>
                      </DialogTrigger>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Generated Response</DialogTitle>
        </DialogHeader>
        <div className="prose max-h-[60vh] overflow-y-auto pr-4">
          <p className="whitespace-pre-wrap">{selectedEmail?.response}</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={() => copyToClipboard(selectedEmail?.response || "")}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}