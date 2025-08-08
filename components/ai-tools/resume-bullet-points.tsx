"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function ResumeBulletPoints() {
  const [jobDescription, setJobDescription] = useState("")
  const [userExperience, setUserExperience] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [bulletPoints, setBulletPoints] = useState("")
  const { toast } = useToast()

  const checkRateLimit = () => {
    if (typeof window !== "undefined") {
      const usage = JSON.parse(localStorage.getItem("resumePointsUsage") || "{}")
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
      const usage = JSON.parse(localStorage.getItem("resumePointsUsage") || "{}")
      const now = new Date().getTime()
      if (usage.timestamp && now - usage.timestamp < 24 * 60 * 60 * 1000) {
        usage.count++
      } else {
        usage.count = 1
        usage.timestamp = now
      }
      localStorage.setItem("resumePointsUsage", JSON.stringify(usage))
    }
  }

  const generatePoints = async () => {
    if (!jobDescription || !userExperience) return
    if (!checkRateLimit()) {
      toast({
        title: "Rate Limit Exceeded",
        description: "You can only generate bullet points twice per day.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    setBulletPoints("")

    try {
      const response = await fetch("/api/resume-bullet-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, userExperience }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to generate points")
      setBulletPoints(data.bulletPoints)
      updateRateLimit()
    } catch (error) {
      console.error("Error generating points:", error)
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
          <CardTitle>Resume Bullet Point Writer</CardTitle>
          <CardDescription>Generate impactful resume bullet points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-32"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-experience">Your Experience</Label>
              <Textarea
                id="user-experience"
                placeholder="Describe your relevant experience here..."
                value={userExperience}
                onChange={(e) => setUserExperience(e.target.value)}
                className="min-h-32"
              />
            </div>
            <Button onClick={generatePoints} disabled={isLoading || !jobDescription || !userExperience} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Generate Points"}
            </Button>
          </div>
        </CardContent>
      </Card>
      {bulletPoints && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Bullet Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap rounded-md bg-muted p-4">{bulletPoints}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}