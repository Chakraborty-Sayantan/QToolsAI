"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export function WordCounter() {
  const [text, setText] = useState("")

  const wordCount = text.split(/\s+/).filter(Boolean).length
  const charCount = text.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Word & Character Counter</CardTitle>
        <CardDescription>Count words and characters in your text</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Start typing or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-48"
        />
        <div className="mt-4 flex justify-around rounded-md bg-muted p-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{wordCount}</p>
            <p className="text-sm text-muted-foreground">Words</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{charCount}</p>
            <p className="text-sm text-muted-foreground">Characters</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}