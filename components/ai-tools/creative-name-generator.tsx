"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useHistoryStore } from "@/store/history-store";

export function CreativeNameGenerator() {
  const [category, setCategory] = useState("")
  const [keywords, setKeywords] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [names, setNames] = useState("")
  const { toast } = useToast()
  const { addHistoryItem } = useHistoryStore();

  const checkRateLimit = () => {
    if (typeof window !== "undefined") {
      const usage = JSON.parse(localStorage.getItem("nameGeneratorUsage") || "{}")
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
      const usage = JSON.parse(localStorage.getItem("nameGeneratorUsage") || "{}")
      const now = new Date().getTime()
      if (usage.timestamp && now - usage.timestamp < 24 * 60 * 60 * 1000) {
        usage.count++
      } else {
        usage.count = 1
        usage.timestamp = now
      }
      localStorage.setItem("nameGeneratorUsage", JSON.stringify(usage))
    }
  }

  const generateNames = async () => {
    if (!category || !keywords) return
    if (!checkRateLimit()) {
      toast({
        title: "Rate Limit Exceeded",
        description: "You can only generate names twice per day.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    setNames("")

    try {
      const response = await fetch("/api/creative-name-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, keywords }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to generate names")
      setNames(data.names)
      updateRateLimit()

      addHistoryItem({
        tool: "Creative Name Generator",
        href: "/ai-tools/creative-name-generator",
        input: { category, keywords },
        output: data.names,
      });

    } catch (error) {
      console.error("Error generating names:", error)
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
          <CardTitle>Creative Name Generator</CardTitle>
          <CardDescription>Generate names for your business, project, or pet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., a coffee shop, a tech startup"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                placeholder="e.g., fast, modern, friendly"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
            <Button onClick={generateNames} disabled={isLoading || !category || !keywords} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Generate Names"}
            </Button>
          </div>
        </CardContent>
      </Card>
      {names && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Names</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap rounded-md bg-muted p-4">{names}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}