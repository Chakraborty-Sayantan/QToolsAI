"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Loader2, Copy, History } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface SummaryHistory {
  text: string
  summary: string
  timestamp: number
}

export function TextSummarizer() {
  const [text, setText] = useState("")
  const [length, setLength] = useState("medium")
  const [style, setStyle] = useState("concise")
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [summary, setSummary] = useState("")
  const { toast } = useToast()
  const [summaryHistory, setSummaryHistory] = useState<SummaryHistory[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("summaryHistory")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [showHistory, setShowHistory] = useState(false)
  const [selectedSummary, setSelectedSummary] = useState<SummaryHistory | null>(null)

  const saveHistory = (history: SummaryHistory[]) => {
    setSummaryHistory(history)
    if (typeof window !== "undefined") {
      localStorage.setItem("summaryHistory", JSON.stringify(history))
    }
  }

  const checkRateLimit = () => {
    if (typeof window !== "undefined") {
      const usage = JSON.parse(localStorage.getItem("summarizerUsage") || "{}")
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
      const usage = JSON.parse(localStorage.getItem("summarizerUsage") || "{}")
      const now = new Date().getTime()
      if (usage.timestamp && now - usage.timestamp < 24 * 60 * 60 * 1000) {
        usage.count++
      } else {
        usage.count = 1
        usage.timestamp = now
      }
      localStorage.setItem("summarizerUsage", JSON.stringify(usage))
    }
  }

  async function handleSummarize(e: React.FormEvent) {
    e.preventDefault()
    if (!text) return

    if (!checkRateLimit()) {
      toast({
        title: "Rate Limit Exceeded",
        description: "You can only generate summaries twice per day.",
        variant: "destructive",
      })
      return
    }

    setIsSummarizing(true)
    setSummary("")

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          length,
          style,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to summarize text")
      }

      const data = await response.json()
      setSummary(data.summary)
      updateRateLimit()
      const newEntry: SummaryHistory = {
        text,
        summary: data.summary,
        timestamp: Date.now(),
      }
      saveHistory([newEntry, ...summaryHistory.slice(0, 4)])
    } catch (error) {
      console.error("Error summarizing text:", error)
      toast({
        title: "Error Summarizing Text",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSummarizing(false)
    }
  }

  function copyToClipboard(content: string) {
    navigator.clipboard.writeText(content)
    toast({
      description: "Summary copied to clipboard!",
    })
  }

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedSummary(null)}>
      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Text Summarizer</CardTitle>
              <CardDescription>Paste your text below to generate a summary</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={() => setShowHistory(!showHistory)}>
              <History className="h-4 w-4" />
              <span className="sr-only">Toggle History</span>
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSummarize} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">Text to Summarize</Label>
                <Textarea
                  id="text"
                  placeholder="Paste your article, document, or long text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-32"
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="length">Summary Length</Label>
                  <Select value={length} onValueChange={setLength}>
                    <SelectTrigger id="length">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                      <SelectItem value="medium">Medium (3-5 sentences)</SelectItem>
                      <SelectItem value="long">Long (6-8 sentences)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="style">Summary Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger id="style">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">Concise</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="bullet-points">Bullet Points</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSummarizing || !text}>
                {isSummarizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Summarizing...
                  </>
                ) : (
                  "Summarize Text"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {summary && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Summary</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(summary)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => setSelectedSummary({ text, summary, timestamp: Date.now() })}>
                    Open
                  </Button>
                </DialogTrigger>
              </div>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap rounded-md bg-muted p-4">{summary}</div>
            </CardContent>
          </Card>
        )}

        <AnimatePresence>
          {showHistory && summaryHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {summaryHistory.map((item, index) => (
                      <div key={index} className="rounded-md border p-3">
                        <p className="text-sm font-medium line-clamp-2">{item.text}</p>
                        <p className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</p>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.summary}</p>
                        <div className="flex justify-end mt-2">
                          <DialogTrigger asChild>
                            <Button variant="secondary" size="sm" onClick={() => setSelectedSummary(item)}>
                              View
                            </Button>
                          </DialogTrigger>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Summary</DialogTitle>
          <DialogDescription>
            {selectedSummary && new Date(selectedSummary.timestamp).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="prose max-h-[60vh] overflow-y-auto pr-4">
          <p className="whitespace-pre-wrap">{selectedSummary?.summary}</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={() => copyToClipboard(selectedSummary?.summary || "")}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}