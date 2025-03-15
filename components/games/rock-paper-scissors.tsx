"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Scissors, Hand, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

type Choice = "rock" | "paper" | "scissors" | null
type Result = "win" | "lose" | "draw" | null

export function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null)
  const [computerChoice, setComputerChoice] = useState<Choice>(null)
  const [result, setResult] = useState<Result>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [score, setScore] = useState({ player: 0, computer: 0, draws: 0 })
  const [gameHistory, setGameHistory] = useState<Array<{ player: Choice; computer: Choice; result: Result }>>([])

  const choices: Choice[] = ["rock", "paper", "scissors"]

  function getRandomChoice(): Choice {
    const randomIndex = Math.floor(Math.random() * choices.length)
    return choices[randomIndex]
  }

  function determineWinner(player: Choice, computer: Choice): Result {
    if (player === computer) return "draw"
    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      return "win"
    }
    return "lose"
  }

  function handlePlayerChoice(choice: Choice) {
    setPlayerChoice(choice)
    setCountdown(3)
  }

  function resetGame() {
    setPlayerChoice(null)
    setComputerChoice(null)
    setResult(null)
    setCountdown(null)
  }

  function getChoiceIcon(choice: Choice, size = 6) {
    switch (choice) {
      case "rock":
        return <Hand className={`h-${size} w-${size}`} />
      case "paper":
        return <FileText className={`h-${size} w-${size}`} />
      case "scissors":
        return <Scissors className={`h-${size} w-${size}`} />
      default:
        return null
    }
  }

  function getResultText(result: Result) {
    switch (result) {
      case "win":
        return "You Win!"
      case "lose":
        return "You Lose!"
      case "draw":
        return "It's a Draw!"
      default:
        return ""
    }
  }

  function getResultClass(result: Result) {
    switch (result) {
      case "win":
        return "text-green-500"
      case "lose":
        return "text-red-500"
      case "draw":
        return "text-yellow-500"
      default:
        return ""
    }
  }

  useEffect(() => {
    if (countdown === null) return

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      const computer = getRandomChoice()
      setComputerChoice(computer)
      const gameResult = determineWinner(playerChoice!, computer)
      setResult(gameResult)

      // Update score
      setScore((prev) => {
        const newScore = { ...prev }
        if (gameResult === "win") newScore.player += 1
        else if (gameResult === "lose") newScore.computer += 1
        else newScore.draws += 1
        return newScore
      })

      // Update history
      setGameHistory((prev) => [{ player: playerChoice!, computer, result: gameResult }, ...prev.slice(0, 9)])
    }
  }, [countdown, playerChoice])

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Rock Paper Scissors</CardTitle>
          <CardDescription>Make your choice to play against the computer</CardDescription>
        </CardHeader>
        <CardContent>
          {playerChoice === null ? (
            <div className="grid grid-cols-3 gap-4">
              {choices.map((choice) => (
                <Button
                  key={choice}
                  variant="outline"
                  className="flex h-24 flex-col items-center justify-center gap-2 p-2"
                  onClick={() => handlePlayerChoice(choice)}
                >
                  {getChoiceIcon(choice)}
                  <span className="capitalize">{choice}</span>
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-6 py-4">
              {countdown !== null && countdown > 0 ? (
                <div className="text-center">
                  <div className="text-6xl font-bold">{countdown}</div>
                  <p className="mt-2 text-muted-foreground">Computer is choosing...</p>
                </div>
              ) : (
                <>
                  <div className="grid w-full grid-cols-3 items-center justify-items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="mb-2 text-sm font-medium">You</div>
                      <div
                        className={cn(
                          "flex h-20 w-20 items-center justify-center rounded-full border-2",
                          result === "win" ? "border-green-500" : "border-muted",
                        )}
                      >
                        {getChoiceIcon(playerChoice, 8)}
                      </div>
                      <div className="mt-2 text-sm capitalize">{playerChoice}</div>
                    </div>
                    <div className="text-2xl font-bold">VS</div>
                    <div className="flex flex-col items-center">
                      <div className="mb-2 text-sm font-medium">Computer</div>
                      <div
                        className={cn(
                          "flex h-20 w-20 items-center justify-center rounded-full border-2",
                          result === "lose" ? "border-green-500" : "border-muted",
                        )}
                      >
                        {getChoiceIcon(computerChoice, 8)}
                      </div>
                      <div className="mt-2 text-sm capitalize">{computerChoice}</div>
                    </div>
                  </div>

                  <div className={cn("text-center text-2xl font-bold", getResultClass(result))}>
                    {getResultText(result)}
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm">
            Score: <span className="font-medium">{score.player}</span> -{" "}
            <span className="font-medium">{score.computer}</span> (Draws: {score.draws})
          </div>
          {playerChoice !== null && (
            <Button onClick={resetGame} variant="outline">
              Play Again
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Game History</CardTitle>
          <CardDescription>Your recent games</CardDescription>
        </CardHeader>
        <CardContent>
          {gameHistory.length > 0 ? (
            <div className="space-y-3">
              {gameHistory.map((game, index) => (
                <div key={index} className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      {getChoiceIcon(game.player, 4)}
                    </div>
                    <div className="text-sm">
                      You chose <span className="font-medium capitalize">{game.player}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm">
                      Computer chose <span className="font-medium capitalize">{game.computer}</span>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      {getChoiceIcon(game.computer, 4)}
                    </div>
                  </div>
                  <div className={cn("text-sm font-medium", getResultClass(game.result))}>
                    {getResultText(game.result)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-center text-muted-foreground">
              No game history yet. Play a game to see your history.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

