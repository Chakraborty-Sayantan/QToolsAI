"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type DiceType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100"

interface DiceResult {
  type: DiceType
  value: number
  id: string
}

export function DiceRoller() {
  const [diceType, setDiceType] = useState<DiceType>("d6")
  const [numberOfDice, setNumberOfDice] = useState(1)
  const [results, setResults] = useState<DiceResult[]>([])
  const [isRolling, setIsRolling] = useState(false)
  const [history, setHistory] = useState<{ total: number; dice: DiceResult[] }[]>([])

  const diceValues: Record<DiceType, number> = {
    d4: 4,
    d6: 6,
    d8: 8,
    d10: 10,
    d12: 12,
    d20: 20,
    d100: 100,
  }

  function rollDice() {
    setIsRolling(true)

    // Clear previous results
    setResults([])

    // Generate new results after a short delay for animation effect
    setTimeout(() => {
      const newResults: DiceResult[] = []

      for (let i = 0; i < numberOfDice; i++) {
        const value = Math.floor(Math.random() * diceValues[diceType]) + 1
        newResults.push({
          type: diceType,
          value,
          id: `${Date.now()}-${i}`,
        })
      }

      setResults(newResults)
      setHistory((prev) => [
        { total: newResults.reduce((sum, die) => sum + die.value, 0), dice: newResults },
        ...prev.slice(0, 9), // Keep only the last 10 rolls
      ])
      setIsRolling(false)
    }, 500)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Dice Roller</CardTitle>
          <CardDescription>Roll virtual dice for your games</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dice-type">Dice Type</Label>
                <Select value={diceType} onValueChange={(value) => setDiceType(value as DiceType)}>
                  <SelectTrigger id="dice-type">
                    <SelectValue placeholder="Select dice type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="d4">D4</SelectItem>
                    <SelectItem value="d6">D6</SelectItem>
                    <SelectItem value="d8">D8</SelectItem>
                    <SelectItem value="d10">D10</SelectItem>
                    <SelectItem value="d12">D12</SelectItem>
                    <SelectItem value="d20">D20</SelectItem>
                    <SelectItem value="d100">D100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="number-of-dice">Number of Dice</Label>
                <Input
                  id="number-of-dice"
                  type="number"
                  min={1}
                  max={10}
                  value={numberOfDice}
                  onChange={(e) => setNumberOfDice(Number.parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            <Button onClick={rollDice} className="w-full" disabled={isRolling}>
              {isRolling ? "Rolling..." : "Roll Dice"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <div className="w-full">
            <h3 className="mb-2 font-semibold">Current Roll</h3>
            {results.length > 0 ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {results.map((die) => (
                    <div
                      key={die.id}
                      className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-lg font-bold text-primary-foreground"
                    >
                      {die.value}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  Total: <span className="font-bold">{results.reduce((sum, die) => sum + die.value, 0)}</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No dice rolled yet</div>
            )}
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roll History</CardTitle>
          <CardDescription>Your previous dice rolls</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((roll, index) => (
                <div key={index} className="rounded-md border p-3">
                  <div className="mb-2 font-medium">Roll #{history.length - index}</div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {roll.dice.map((die, dieIndex) => (
                      <div
                        key={dieIndex}
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-sm font-medium"
                      >
                        {die.value}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    {roll.dice.length} × {roll.dice[0]?.type.toUpperCase()} | Total:{" "}
                    <span className="font-bold">{roll.total}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No roll history yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

