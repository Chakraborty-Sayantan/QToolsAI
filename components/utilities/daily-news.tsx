"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Newspaper, Search, ExternalLink, Loader2 } from "lucide-react"

interface NewsAPIArticle {
  source: {
    id: string | null
    name: string
  }
  title: string
  description: string
  author: string
  url: string
  urlToImage: string
  publishedAt: string
}

interface NewsArticle {
  id: string
  title: string
  description: string
  source: { name: string }
  author: string
  url: string
  urlToImage: string
  publishedAt: string
  category: string
}

const categories = [
  { value: "general", label: "General" },
  { value: "business", label: "Business" },
  { value: "technology", label: "Technology" },
  { value: "entertainment", label: "Entertainment" },
  { value: "sports", label: "Sports" },
  { value: "science", label: "Science" },
  { value: "health", label: "Health" },
]

export function DailyNews() {
  const [activeTab, setActiveTab] = useState("top-headlines")
  const [selectedCategory, setSelectedCategory] = useState("general")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [error, setError] = useState<string>("")
  const [apiKey, setApiKey] = useState<string | null>(null)

  // Initialize API key
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_NEWS_API_KEY
    setApiKey(key || null)
    if (!key) {
      setError("API key not found. Please check your environment configuration.")
    }
  }, [])

  const fetchTopHeadlines = useCallback(async (category: string) => {
    if (!apiKey) {
      setError("API key not found. Please check your environment configuration.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`
      )
      const data = await response.json()

      if (data.status === "ok") {
        const formattedArticles = data.articles.map((article: NewsAPIArticle, index: number) => ({
          id: `${article.source.id || 'news'}-${index}-${Date.now()}`,
          title: article.title,
          description: article.description,
          source: article.source,
          author: article.author,
          url: article.url,
          urlToImage: article.urlToImage || '/placeholder.svg?height=200&width=300&text=News+Image',
          publishedAt: article.publishedAt,
          category: category
        }))
        setArticles(formattedArticles)
      } else {
        throw new Error(data.message || "Failed to fetch news")
      }
    } catch (err) {
      console.error("Error fetching news:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch news. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }, [apiKey])

  useEffect(() => {
    if (activeTab === "top-headlines" && apiKey) {
      fetchTopHeadlines(selectedCategory)
    }
  }, [selectedCategory, activeTab, apiKey, fetchTopHeadlines])

  async function searchNews(e: React.FormEvent) {
    e.preventDefault()
    if (!searchQuery || !apiKey) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&sortBy=publishedAt&apiKey=${apiKey}`
      )
      const data = await response.json()

      if (data.status === "ok") {
        const formattedArticles = data.articles.map((article: NewsAPIArticle, index: number) => ({
          id: `${article.source.id || 'news'}-${index}-${Date.now()}`,
          title: article.title,
          description: article.description,
          source: article.source,
          author: article.author,
          url: article.url,
          urlToImage: article.urlToImage || '/placeholder.svg?height=200&width=300&text=News+Image',
          publishedAt: article.publishedAt,
          category: "search"
        }))
        setArticles(formattedArticles)
      } else {
        throw new Error(data.message || "Failed to fetch news")
      }
    } catch (err) {
      console.error("Error searching news:", err)
      setError(err instanceof Error ? err.message : "Failed to search news. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  function formatPublishedDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Less than an hour ago"
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily News</CardTitle>
          <CardDescription>Stay updated with the latest news from around the world</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="top-headlines">Top Headlines</TabsTrigger>
              <TabsTrigger value="search">Search News</TabsTrigger>
            </TabsList>

            <TabsContent value="top-headlines" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="search" className="space-y-4 mt-4">
              <form onSubmit={searchNews} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search-query">Search News</Label>
                  <div className="flex gap-2">
                    <Input
                      id="search-query"
                      placeholder="Enter keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !searchQuery}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
          {error && (
            <div className="mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Loading news articles...</p>
            </div>
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Card key={article.id} className="flex flex-col overflow-hidden">
                  <div className="relative h-48 w-full">
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2 right-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                      {categories.find((c) => c.value === article.category)?.label || article.category}
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-2 text-lg">{article.title}</CardTitle>
                    <CardDescription className="flex items-center justify-between">
                      <span>{article.source.name}</span>
                      <span>{formatPublishedDate(article.publishedAt)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 p-4 pt-0">
                    <p className="line-clamp-3 text-sm text-muted-foreground">{article.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="outline" className="w-full" asChild>
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        Read More <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Button variant="outline">Load More</Button>
            </div>
          </>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <Newspaper className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No news articles found. Try a different search or category.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

