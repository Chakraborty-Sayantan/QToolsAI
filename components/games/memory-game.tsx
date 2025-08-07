"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const initialCards = ["A", "B", "C", "D", "E", "F", "G", "H"].flatMap(i => [i, i])
  .sort(() => Math.random() - 0.5)

export function MemoryGame() {
  const [cards, setCards] = useState(initialCards)
  const [flipped, setFlipped] = useState<number[]>([])
  const [solved, setSolved] = useState<string[]>([])

  useEffect(() => {
    if (flipped.length === 2) {
      setTimeout(() => {
        const [first, second] = flipped
        if (cards[first] === cards[second]) {
          setSolved([...solved, cards[first]])
        }
        setFlipped([])
      }, 1000)
    }
  }, [flipped, cards, solved])

  const handleClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || solved.includes(cards[index])) return
    setFlipped([...flipped, index])
  }

  const resetGame = () => {
    setCards(initialCards.sort(() => Math.random() - 0.5))
    setFlipped([])
    setSolved([])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memory Game</CardTitle>
        <CardDescription>Match all the pairs to win!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`flex h-20 w-20 cursor-pointer items-center justify-center rounded-md border text-2xl font-bold ${
                flipped.includes(index) || solved.includes(card) ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
              onClick={() => handleClick(index)}
            >
              {flipped.includes(index) || solved.includes(card) ? card : "?"}
            </div>
          ))}
        </div>
        <Button onClick={resetGame} className="mt-4 w-full">
          Reset Game
        </Button>
      </CardContent>
    </Card>
  )
}