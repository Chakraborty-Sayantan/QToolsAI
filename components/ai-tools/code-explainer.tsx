"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Code, Copy, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type ProgrammingLanguage =
  | "javascript"
  | "python"
  | "java"
  | "csharp"
  | "cpp"
  | "php"
  | "ruby"
  | "go"
  | "swift"
  | "rust"
  | "typescript"
  | "html"
  | "css"
  | "sql"
  | "other"

type ExplanationLevel = "beginner" | "intermediate" | "advanced"

export function CodeExplainer() {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState<ProgrammingLanguage>("javascript")
  const [level, setLevel] = useState<ExplanationLevel>("intermediate")
  const [isExplaining, setIsExplaining] = useState(false)
  const [explanation, setExplanation] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const checkRateLimit = () => {
    if (typeof window !== "undefined") {
      const usage = JSON.parse(localStorage.getItem("codeExplainerUsage") || "{}")
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
      const usage = JSON.parse(localStorage.getItem("codeExplainerUsage") || "{}")
      const now = new Date().getTime()
      if (usage.timestamp && now - usage.timestamp < 24 * 60 * 60 * 1000) {
        usage.count++
      } else {
        usage.count = 1
        usage.timestamp = now
      }
      localStorage.setItem("codeExplainerUsage", JSON.stringify(usage))
    }
  }

  const explainCode = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate input
    if (!code || code.trim().length < 10) {
      toast({
        title: "Input Error",
        description: "Please provide at least 10 characters of code to explain",
        variant: "destructive",
      })
      return
    }

    if (!checkRateLimit()) {
      toast({
        title: "Rate Limit Exceeded",
        description: "You can only generate explanations twice per day.",
        variant: "destructive",
      })
      return
    }

    setIsExplaining(true)
    setExplanation("")

    try {
      const response = await fetch("/api/explain-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "your_super_secret_api_key",
        },
        body: JSON.stringify({
          code,
          language,
          level,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to explain code")
      }

      setExplanation(data.explanation)
      updateRateLimit()
    } catch (error) {
      console.error("Error explaining code:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to explain code",
        variant: "destructive",
      })
    } finally {
      setIsExplaining(false)
    }
  }

  const copyToClipboard = () => {
    if (!explanation) return

    navigator.clipboard.writeText(explanation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      description: "Explanation copied to clipboard!",
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Code Explainer</CardTitle>
          <CardDescription>Paste code to get a clear explanation in plain English</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={explainCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code Snippet</Label>
              <Textarea
                id="code"
                placeholder="Paste your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono min-h-32"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="language">Programming Language</Label>
                <Select value={language} onValueChange={(value) => setLanguage(value as ProgrammingLanguage)}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                    <SelectItem value="ruby">Ruby</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="swift">Swift</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="sql">SQL</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Explanation Level</Label>
                <Select value={level} onValueChange={(value) => setLevel(value as ExplanationLevel)}>
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isExplaining || !code}>
              {isExplaining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Code...
                </>
              ) : (
                <>
                  <Code className="mr-2 h-4 w-4" />
                  Explain Code
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Explanation</CardTitle>
          <CardDescription>Understanding your code in plain English</CardDescription>
        </CardHeader>
        <CardContent>
          {explanation ? (
            <div className="space-y-2">
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={copied}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
                </Button>
              </div>
              <div className="rounded-md bg-muted p-4">
              <div className="whitespace-pre-wrap text-sm"
                  dangerouslySetInnerHTML={{ __html: explanation }}
                />
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <Code className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {isExplaining ? "Analyzing your code..." : "Paste your code and click 'Explain Code' to get started"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <p>Tip: For better explanations, provide complete code snippets rather than fragments.</p>
        </CardFooter>
      </Card>
    </div>
  )
}