"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowRightLeft, Copy, Check, Loader2, Volume2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
]

export function Translator() {
  const [sourceText, setSourceText] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("en")
  const [targetLanguage, setTargetLanguage] = useState("es")
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  async function handleTranslate(e: React.FormEvent) {
    e.preventDefault()
    
    // Validate input
    if (!sourceText || sourceText.trim().length < 2) {
      toast({
        title: "Input Error",
        description: "Please enter at least 2 characters to translate",
        variant: "destructive",
      })
      return
    }

    setIsTranslating(true)
    setTranslatedText("")

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: sourceText,
          sourceLanguage,
          targetLanguage,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to translate text")
      }

      setTranslatedText(data.translatedText)
    } catch (error) {
      console.error("Error translating text:", error)
      
      toast({
        title: "Translation Error",
        description: error instanceof Error ? error.message : "Failed to translate text",
        variant: "destructive",
      })

      // If the error indicates we can retry, show a retry button
      if (error instanceof Error && error.message.includes("retry")) {
        toast({
          title: "Try Again?",
          action: (
            <Button variant="outline" onClick={handleTranslate}>
              Retry
            </Button>
          ),
        })
      }
    } finally {
      setIsTranslating(false)
    }
  }

  function swapLanguages() {
    const temp = sourceLanguage
    setSourceLanguage(targetLanguage)
    setTargetLanguage(temp)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(translatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      description: "Text copied to clipboard!",
    })
  }

  function speakText(text: string, lang: string) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      window.speechSynthesis.speak(utterance)
    } else {
      toast({
        title: "Speech Not Supported",
        description: "Your browser does not support text-to-speech functionality",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Language Translator</CardTitle>
          <CardDescription>Translate text between multiple languages</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTranslate} className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-5/12">
                  <Label htmlFor="source-language">From</Label>
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger id="source-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" variant="outline" size="icon" className="mt-6" onClick={swapLanguages}>
                  <ArrowRightLeft className="h-4 w-4" />
                  <span className="sr-only">Swap languages</span>
                </Button>
                <div className="w-5/12">
                  <Label htmlFor="target-language">To</Label>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger id="target-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="source-text">Source Text</Label>
                    {sourceText && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => speakText(sourceText, sourceLanguage)}
                      >
                        <Volume2 className="h-4 w-4" />
                        <span className="sr-only">Speak source text</span>
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id="source-text"
                    placeholder="Enter text to translate..."
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    className="min-h-32"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="translated-text">Translated Text</Label>
                    <div className="flex gap-1">
                      {translatedText && (
                        <>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => speakText(translatedText, targetLanguage)}
                          >
                            <Volume2 className="h-4 w-4" />
                            <span className="sr-only">Speak translated text</span>
                          </Button>
                          <Button type="button" variant="ghost" size="sm" onClick={copyToClipboard} disabled={copied}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            <span className="sr-only">Copy to clipboard</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <Textarea
                    id="translated-text"
                    placeholder="Translation will appear here..."
                    value={translatedText}
                    readOnly
                    className="min-h-32"
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isTranslating || !sourceText}>
              {isTranslating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                "Translate"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}