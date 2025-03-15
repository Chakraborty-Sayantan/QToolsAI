"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Loader2, Image, Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type ImageStyle =
  | "photorealistic"
  | "digital-art"
  | "anime"
  | "3d-render"
  | "oil-painting"
  | "watercolor"
  | "pixel-art"
  | "sketch"
  | "comic-book"
  | "fantasy"

type ImageMood =
  | "vibrant"
  | "dark"
  | "serene"
  | "dramatic"
  | "mysterious"
  | "whimsical"
  | "futuristic"
  | "nostalgic"
  | "ethereal"
  | "minimalist"

interface PromptHistory {
  concept: string
  prompt: string
  timestamp: number
}

export function ImagePromptGenerator() {
  const [concept, setConcept] = useState("")
  const [style, setStyle] = useState<ImageStyle>("photorealistic")
  const [mood, setMood] = useState<ImageMood>("vibrant")
  const [additionalDetails, setAdditionalDetails] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("generator")
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>(() => {
    // Load history from localStorage on component mount
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("imagePromptHistory")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const { toast } = useToast()

  // Save history to localStorage whenever it changes
  const saveHistory = (history: PromptHistory[]) => {
    setPromptHistory(history)
    if (typeof window !== "undefined") {
      localStorage.setItem("imagePromptHistory", JSON.stringify(history))
    }
  }

  const generatePrompt = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!concept) return

    setIsGenerating(true)
    setGeneratedPrompt("")

    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          concept,
          style,
          mood,
          additionalDetails,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate prompt")
      }

      setGeneratedPrompt(data.prompt)

      // Add to history
      const newEntry: PromptHistory = {
        concept,
        prompt: data.prompt,
        timestamp: Date.now(),
      }

      saveHistory([newEntry, ...promptHistory.slice(0, 9)])

      toast({
        title: "Prompt Generated",
        description: "Your image prompt has been successfully generated!",
      })
    } catch (error) {
      console.error("Error generating prompt:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate prompt",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (!generatedPrompt) return

    navigator.clipboard.writeText(generatedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      description: "Prompt copied to clipboard!",
    })
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Image Prompt Generator</CardTitle>
          <CardDescription>
            Create detailed prompts for AI image generation tools like DALL-E, Midjourney, or Stable Diffusion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generator">Generator</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="space-y-4 mt-4">
              <form onSubmit={generatePrompt} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="concept">Basic Concept</Label>
                  <Input
                    id="concept"
                    placeholder="e.g. A majestic mountain landscape"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="style">Art Style</Label>
                    <Select value={style} onValueChange={(value) => setStyle(value as ImageStyle)}>
                      <SelectTrigger id="style">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="photorealistic">Photorealistic</SelectItem>
                        <SelectItem value="digital-art">Digital Art</SelectItem>
                        <SelectItem value="anime">Anime</SelectItem>
                        <SelectItem value="3d-render">3D Render</SelectItem>
                        <SelectItem value="oil-painting">Oil Painting</SelectItem>
                        <SelectItem value="watercolor">Watercolor</SelectItem>
                        <SelectItem value="pixel-art">Pixel Art</SelectItem>
                        <SelectItem value="sketch">Sketch</SelectItem>
                        <SelectItem value="comic-book">Comic Book</SelectItem>
                        <SelectItem value="fantasy">Fantasy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mood">Mood/Atmosphere</Label>
                    <Select value={mood} onValueChange={(value) => setMood(value as ImageMood)}>
                      <SelectTrigger id="mood">
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vibrant">Vibrant</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="serene">Serene</SelectItem>
                        <SelectItem value="dramatic">Dramatic</SelectItem>
                        <SelectItem value="mysterious">Mysterious</SelectItem>
                        <SelectItem value="whimsical">Whimsical</SelectItem>
                        <SelectItem value="futuristic">Futuristic</SelectItem>
                        <SelectItem value="nostalgic">Nostalgic</SelectItem>
                        <SelectItem value="ethereal">Ethereal</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional-details">Additional Details (Optional)</Label>
                  <Textarea
                    id="additional-details"
                    placeholder="e.g. sunset lighting, fog, snow-capped peaks, reflections in a lake"
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    className="min-h-20"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isGenerating || !concept}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Prompt
                    </>
                  )}
                </Button>
              </form>

              {generatedPrompt && (
                <div className="space-y-2 rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="generated-prompt">Generated Prompt</Label>
                    <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={copied}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
                    </Button>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <p className="whitespace-pre-wrap text-sm">{generatedPrompt}</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              {promptHistory.length > 0 ? (
                <div className="space-y-3">
                  {promptHistory.map((item, index) => (
                    <div key={index} className="rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{item.concept}</div>
                        <div className="text-xs text-muted-foreground">{formatTimestamp(item.timestamp)}</div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.prompt}</div>
                      <div className="mt-2 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(item.prompt)
                            toast({
                              description: "Prompt copied to clipboard!",
                            })
                          }}
                        >
                          <Copy className="mr-1 h-3.5 w-3.5" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <div className="text-center">
                    <Image className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Generated prompts will appear here</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tips for Great Prompts</CardTitle>
          <CardDescription>How to create effective prompts for AI image generators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Structure Your Prompts</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Start with the subject or main concept</li>
              <li>Specify the style (photorealistic, anime, oil painting, etc.)</li>
              <li>Add details about lighting, mood, and atmosphere</li>
              <li>Include specific details about the environment or setting</li>
              <li>Mention camera details for photorealistic images (lens type, angle, etc.)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Useful Descriptors</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                <strong>Quality:</strong> highly detailed, masterpiece, professional, best quality
              </li>
              <li>
                <strong>Lighting:</strong> golden hour, dramatic lighting, soft lighting, backlit
              </li>
              <li>
                <strong>Camera:</strong> 8K, ultra HD, shallow depth of field, wide angle
              </li>
              <li>
                <strong>Composition:</strong> rule of thirds, symmetrical, cinematic, panoramic
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Example Prompts</h3>
            <div className="space-y-2">
              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="font-medium">Portrait:</p>
                <p>
                  Portrait of a Celtic warrior princess, intricate armor, flowing red hair, dramatic lighting,
                  photorealistic, 8K, highly detailed, professional photography
                </p>
              </div>
              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="font-medium">Landscape:</p>
                <p>
                  Futuristic cityscape at sunset, neon lights, flying cars, cyberpunk style, fog, reflections, dramatic
                  lighting, highly detailed, digital art
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}