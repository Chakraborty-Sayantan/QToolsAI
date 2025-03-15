"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Copy, Check } from "lucide-react"

export function TextSummarizer() {
  const [text, setText] = useState("")
  const [length, setLength] = useState("medium")
  const [style, setStyle] = useState("concise")
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [summary, setSummary] = useState("")
  const [copied, setCopied] = useState(false)

  async function handleSummarize(e: React.FormEvent) {
    e.preventDefault()
    if (!text) return

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
    } catch (error) {
      console.error("Error summarizing text:", error)
    } finally {
      setIsSummarizing(false)
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Text Summarizer</CardTitle>
          <CardDescription>Paste your text below to generate a summary</CardDescription>
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
            <Button variant="outline" size="icon" onClick={copyToClipboard} disabled={copied}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy to clipboard</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap rounded-md bg-muted p-4">{summary}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

