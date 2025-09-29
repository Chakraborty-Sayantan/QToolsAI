"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Tags } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useHistoryStore } from "@/store/history-store"

export function KeywordExtractor() {
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [keywords, setKeywords] = useState<string[]>([])
  const { toast } = useToast()
  const { addHistoryItem } = useHistoryStore();

  const checkRateLimit = () => {
    if (typeof window !== "undefined") {
      const usage = JSON.parse(localStorage.getItem("keywordExtractorUsage") || "{}")
      const now = new Date().getTime()
      if (usage.timestamp && now - usage.timestamp < 24 * 60 * 60 * 1000) {
        if (usage.count >= 2) {
          return false
        }
      }
    }
    return true
  }

  const updateRateLimit = () => {
    if (typeof window !== "undefined") {
      const usage = JSON.parse(localStorage.getItem("keywordExtractorUsage") || "{}")
      const now = new Date().getTime()
      if (usage.timestamp && now - usage.timestamp < 24 * 60 * 60 * 1000) {
        usage.count++
      } else {
        usage.count = 1
        usage.timestamp = now
      }
      localStorage.setItem("keywordExtractorUsage", JSON.stringify(usage))
    }
  }

  const extractKeywords = async () => {
    if (!text) return
    if (!checkRateLimit()) {
      toast({
        title: "Rate Limit Exceeded",
        description: "You can only extract keywords twice per day.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    setKeywords([])

    try {
      const response = await fetch("/api/keyword-extractor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to extract keywords")
      const extractedKeywords = data.keywords.split(",").map((kw: string) => kw.trim());
      setKeywords(extractedKeywords)
      updateRateLimit()

      addHistoryItem({
        tool: "Keyword Extractor",
        href: "/ai-tools/keyword-extractor",
        input: { text },
        output: extractedKeywords,
      });

    } catch (error) {
      console.error("Error extracting keywords:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Keyword Extractor</CardTitle>
          <CardDescription>Extract relevant keywords from a block of text</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label htmlFor="text-input">Text to Analyze</Label>
            <Textarea
              id="text-input"
              placeholder="Enter text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-32"
            />
            <Button onClick={extractKeywords} disabled={isLoading || !text} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Extract Keywords"}
            </Button>
          </div>
        </CardContent>
      </Card>
      {keywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Keywords</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <div key={index} className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                <Tags className="h-4 w-4" />
                {keyword}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}