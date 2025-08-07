"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")

export function Hangman() {
  const [word, setWord] = useState("")
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchWord = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/random-word');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch word");
      setWord(data.word.toLowerCase());
      setGuessedLetters([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch a new word. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchWord()
  }, [fetchWord])

  const incorrectGuesses = guessedLetters.filter(letter => !word.includes(letter))
  const isWinner = word && word.split("").every(letter => guessedLetters.includes(letter))
  const isLoser = incorrectGuesses.length >= 6

  const handleGuess = (letter: string) => {
    if (!guessedLetters.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter])
    }
  }

  const HangmanDrawing = () => {
    const parts = [
      <circle key="head" cx="120" cy="70" r="20" stroke="currentColor" strokeWidth="4" fill="none" />,
      <line key="body" x1="120" y1="90" x2="120" y2="150" stroke="currentColor" strokeWidth="4" />,
      <line key="left-arm" x1="120" y1="120" x2="90" y2="100" stroke="currentColor" strokeWidth="4" />,
      <line key="right-arm" x1="120" y1="120" x2="150" y2="100" stroke="currentColor" strokeWidth="4" />,
      <line key="left-leg" x1="120" y1="150" x2="90" y2="180" stroke="currentColor" strokeWidth="4" />,
      <line key="right-leg" x1="120" y1="150" x2="150" y2="180" stroke="currentColor" strokeWidth="4" />,
    ];
    return (
      <svg height="250" width="200" className="mx-auto text-slate-700 dark:text-slate-300">
        <line x1="60" y1="230" x2="180" y2="230" stroke="currentColor" strokeWidth="4" />
        <line x1="100" y1="230" x2="100" y2="50" stroke="currentColor" strokeWidth="4" />
        <line x1="100" y1="50" x2="120" y2="50" stroke="currentColor" strokeWidth="4" />
        <line x1="120" y1="50" x2="120" y2="70" stroke="currentColor" strokeWidth="4" />
        {parts.slice(0, incorrectGuesses.length)}
      </svg>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-sky-900 dark:to-indigo-900">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold text-sky-700 dark:text-sky-300">Hangman</CardTitle>
        <CardDescription className="text-center">Guess the word before it's too late!</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <HangmanDrawing />
        <div className="my-4 text-center text-4xl tracking-[0.2em] font-mono h-12">
          {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : word.split("").map((letter, index) => (
            <span key={index} className="mx-2 border-b-2 border-gray-500 pb-1">
              {guessedLetters.includes(letter) ? letter.toUpperCase() : "_"}
            </span>
          ))}
        </div>
        <div className="mb-4 flex flex-wrap justify-center gap-2 max-w-md">
          {alphabet.map(letter => (
            <Button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.includes(letter) || isWinner || isLoser || isLoading}
              variant="outline"
              className="bg-white/50 dark:bg-black/20 hover:bg-sky-200 dark:hover:bg-sky-700"
            >
              {letter.toUpperCase()}
            </Button>
          ))}
        </div>
        {isWinner && <p className="text-center text-2xl font-bold text-green-600 dark:text-green-400">You won! 🎉</p>}
        {isLoser && <p className="text-center text-2xl font-bold text-red-600 dark:text-red-400">You lost! The word was "{word.toUpperCase()}"</p>}
        <Button onClick={fetchWord} className="mt-4 w-full bg-sky-600 hover:bg-sky-700">
          New Game
        </Button>
      </CardContent>
    </Card>
  )
}
