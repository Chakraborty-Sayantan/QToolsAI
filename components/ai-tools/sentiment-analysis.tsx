"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Smile, Frown, Meh } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function SentimentAnalysis() {
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sentiment, setSentiment] = useState<string | null>(null)
  const { toast } = useToast()

  const checkRateLimit = () => {
    if (typeof window !== "undefined") {
      const usage = JSON.parse(localStorage.getItem("sentimentAnalysisUsage") || "{}")
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
      const usage = JSON.parse(localStorage.getItem("sentimentAnalysisUsage") || "{}")
      const now = new Date().getTime()
      if (usage.timestamp && now - usage.timestamp < 24 * 60 * 60 * 1000) {
        usage.count++
      } else {
        usage.count = 1
        usage.timestamp = now
      }
      localStorage.setItem("sentimentAnalysisUsage", JSON.stringify(usage))
    }
  }

  const analyzeSentiment = async () => {
    if (!text) return
    if (!checkRateLimit()) {
      toast({
        title: "Rate Limit Exceeded",
        description: "You can only analyze sentiment twice per day.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    setSentiment(null)

    try {
      const response = await fetch("/api/sentiment-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to analyze sentiment")
      setSentiment(data.sentiment)
      updateRateLimit()
    } catch (error) {
      console.error("Error analyzing sentiment:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getSentimentIcon = () => {
    if (!sentiment) return null
    if (sentiment.toLowerCase().includes("positive")) return <Smile className="h-10 w-10 text-green-500" />
    if (sentiment.toLowerCase().includes("negative")) return <Frown className="h-10 w-10 text-red-500" />
    return <Meh className="h-10 w-10 text-yellow-500" />
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis</CardTitle>
          <CardDescription>Analyze the sentiment of a piece of text</CardDescription>
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
            <Button onClick={analyzeSentiment} disabled={isLoading || !text} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Analyze"}
            </Button>
          </div>
        </CardContent>
      </Card>
      {sentiment && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            {getSentimentIcon()}
            <p className="text-xl font-bold">{sentiment}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}