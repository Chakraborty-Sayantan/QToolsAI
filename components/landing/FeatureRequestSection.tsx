"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FeatureRequestSection() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [request, setRequest] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/feature-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, request }),
      })

      if (!response.ok) {
        throw new Error("Something went wrong")
      }

      toast({
        title: "Success!",
        description: "Thank you for your feature request. We'll look into it!",
      })
      setEmail("")
      setRequest("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not submit your request. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="feature-request" className="py-20 sm:py-32 flex justify-center px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Have an Idea?
          </CardTitle>
          <CardDescription className="mt-4 text-lg">
            Request a new tool or feature. We're always looking for new ideas to make QToolsAI better!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            <Input
              type="email"
              placeholder="Your email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Textarea
              placeholder="Describe the feature you'd like to see..."
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              required
              rows={4}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}