"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Loader2, Copy, History } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ContentHistory {
  topic: string
  content: string
  timestamp: number
}

export function ContentGeneratorForm() {
  const [topic, setTopic] = useState("")
  const [contentType, setContentType] = useState("blog-post")
  const [tone, setTone] = useState("professional")
  const [length, setLength] = useState("medium")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [selectedContent, setSelectedContent] = useState<ContentHistory | null>(null)
  const { toast } = useToast()
  const [contentHistory, setContentHistory] = useState<ContentHistory[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("contentGeneratorHistory")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const saveHistory = (history: ContentHistory[]) => {
    setContentHistory(history)
    if (typeof window !== "undefined") {
      localStorage.setItem("contentGeneratorHistory", JSON.stringify(history))
    }
  }

  const checkRateLimit = () => {
    if (typeof window !== "undefined") {
      const usage = JSON.parse(localStorage.getItem("contentGeneratorUsage") || "{}")
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
      const usage = JSON.parse(localStorage.getItem("contentGeneratorUsage") || "{}")
      const now = new Date().getTime()
      if (usage.timestamp && now - usage.timestamp < 24 * 60 * 60 * 1000) {
        usage.count++
      } else {
        usage.count = 1
        usage.timestamp = now
      }
      localStorage.setItem("contentGeneratorUsage", JSON.stringify(usage))
    }
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!topic) return

    if (!checkRateLimit()) {
      toast({
        title: "Rate Limit Exceeded",
        description: "You can only generate content twice per day.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setGeneratedContent("")

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          contentType,
          tone,
          length,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content")
      }

      setGeneratedContent(data.content)
      updateRateLimit()
      const newEntry: ContentHistory = {
        topic,
        content: data.content,
        timestamp: Date.now(),
      }
      saveHistory([newEntry, ...contentHistory.slice(0, 4)])
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Error Generating Content",
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
      description: "Content copied to clipboard!",
    })
  }

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedContent(null)}>
      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Generate Content</CardTitle>
              <CardDescription>Fill in the details below to generate content</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={() => setShowHistory(!showHistory)}>
              <History className="h-4 w-4" />
              <span className="sr-only">Toggle History</span>
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or Prompt</Label>
                <Textarea
                  id="topic"
                  placeholder="Enter your topic or detailed prompt..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="min-h-24"
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="content-type">Content Type</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger id="content-type">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blog-post">Blog Post</SelectItem>
                      <SelectItem value="social-media">Social Media Post</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="product-description">Product Description</SelectItem>
                      <SelectItem value="ad-copy">Ad Copy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger id="tone">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length">Length</Label>
                  <Select value={length} onValueChange={setLength}>
                    <SelectTrigger id="length">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="long">Long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isGenerating || !topic}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Content"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {generatedContent && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Generated Content</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedContent)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => setSelectedContent({ topic, content: generatedContent, timestamp: Date.now() })}>
                    Open
                  </Button>
                </DialogTrigger>
              </div>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap rounded-md bg-muted p-4">{generatedContent}</div>
            </CardContent>
          </Card>
        )}

        <AnimatePresence>
          {showHistory && contentHistory.length > 0 && (
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
                    {contentHistory.map((item, index) => (
                      <div key={index} className="rounded-md border p-3">
                        <p className="text-sm font-medium">{item.topic}</p>
                        <p className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</p>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                        <div className="flex justify-end mt-2">
                          <DialogTrigger asChild>
                            <Button variant="secondary" size="sm" onClick={() => setSelectedContent(item)}>
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
          <DialogTitle>{selectedContent?.topic}</DialogTitle>
          <DialogDescription>
            {selectedContent && new Date(selectedContent.timestamp).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="prose max-h-[60vh] overflow-y-auto pr-4">
          <p className="whitespace-pre-wrap">{selectedContent?.content}</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={() => copyToClipboard(selectedContent?.content || "")}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}