"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Link2, ExternalLink } from "lucide-react"

interface ShortenedURL {
  original: string
  shortened: string
  timestamp: number
}

export function URLShortener() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [shortenedURL, setShortenedURL] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [urlHistory, setURLHistory] = useState<ShortenedURL[]>(() => {
    // Load history from localStorage on component mount
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("urlShortenerHistory")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  // Save history to localStorage whenever it changes
  const saveHistory = (history: ShortenedURL[]) => {
    setURLHistory(history)
    if (typeof window !== "undefined") {
      localStorage.setItem("urlShortenerHistory", JSON.stringify(history))
    }
  }

  const isValidURL = (url: string) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  const shortenURL = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset states
    setError(null)
    setShortenedURL("")
    setCopied(false)

    // Validate URL
    if (!url) {
      setError("Please enter a URL")
      return
    }

    // Add http:// prefix if missing
    let processedUrl = url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      processedUrl = "https://" + url
    }

    if (!isValidURL(processedUrl)) {
      setError("Please enter a valid URL")
      return
    }

    setIsLoading(true)

    try {
      const accessToken = process.env.NEXT_PUBLIC_BITLY_ACCESS_TOKEN
      const apiUrl = process.env.NEXT_PUBLIC_BITLY_API_URL

      const response = await fetch(`${apiUrl}/shorten`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          long_url: processedUrl
        })
      })

      if (!response.ok) {
        throw new Error("Failed to shorten URL")
      }

      const data = await response.json()
      const shortened = data.link

      setShortenedURL(shortened)

      // Add to history
      const newEntry: ShortenedURL = {
        original: processedUrl,
        shortened,
        timestamp: Date.now(),
      }

      saveHistory([newEntry, ...urlHistory.slice(0, 9)])
    } catch (error) {
      console.error("Error shortening URL:", error)
      setError("Failed to shorten URL. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!shortenedURL) return

    navigator.clipboard.writeText(shortenedURL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const truncateURL = (url: string, maxLength = 40) => {
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>URL Shortener</CardTitle>
          <CardDescription>Create short links that are easy to share</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={shortenURL} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Enter Long URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  placeholder="https://example.com/very/long/url/that/needs/shortening"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !url}>
                  {isLoading ? "Shortening..." : "Shorten"}
                </Button>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            {shortenedURL && (
              <div className="space-y-2 rounded-md border p-4">
                <Label htmlFor="shortened-url">Shortened URL</Label>
                <div className="flex gap-2">
                  <Input id="shortened-url" value={shortenedURL} readOnly className="flex-1" />
                  <Button type="button" variant="outline" size="icon" onClick={copyToClipboard} disabled={copied}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="sr-only">Copy to clipboard</span>
                  </Button>
                </div>
                <div className="flex justify-end">
                  <Button variant="link" size="sm" className="h-auto p-0" asChild>
                    <a href={shortenedURL} target="_blank" rel="noopener noreferrer">
                      Open Link <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <p>
            Note: In this demo, shortened URLs are not actually functional. In a real application, these would redirect
            to the original URL.
          </p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>URL History</CardTitle>
          <CardDescription>Your recently shortened URLs</CardDescription>
        </CardHeader>
        <CardContent>
          {urlHistory.length > 0 ? (
            <div className="space-y-3">
              {urlHistory.map((item, index) => (
                <div key={index} className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm truncate max-w-[70%]" title={item.original}>
                      {truncateURL(item.original)}
                    </div>
                    <div className="text-xs text-muted-foreground">{formatTimestamp(item.timestamp)}</div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">{item.shortened}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => {
                        navigator.clipboard.writeText(item.shortened)
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span className="sr-only">Copy URL</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center">
              <div className="text-center">
                <Link2 className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Shortened URLs will appear here</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

