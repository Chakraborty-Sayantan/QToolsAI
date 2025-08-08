"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const GRID_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_FOOD = { x: 15, y: 15 }

export function Snake() {
  /* ------------- State ------------- */
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [food, setFood] = useState(INITIAL_FOOD)
  const [direction, setDirection] = useState({ x: 0, y: -1 })
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false) // NEW

  /* ------------- Keyboard control ------------- */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!started) return // don’t react before start
    switch (e.key) {
      case "ArrowUp":
        setDirection({ x: 0, y: -1 })
        break
      case "ArrowDown":
        setDirection({ x: 0, y: 1 })
        break
      case "ArrowLeft":
        setDirection({ x: -1, y: 0 })
        break
      case "ArrowRight":
        setDirection({ x: 1, y: 0 })
        break
    }
  }, [started])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  /* ------------- Game loop ------------- */
  useEffect(() => {
    if (!started || gameOver) return // don’t run if not started or game over
    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake]
        const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y }

        // Wall collision or self-collision
        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE ||
          newSnake.some(s => s.x === head.x && s.y === head.y)
        ) {
          setGameOver(true)
          return prevSnake
        }

        newSnake.unshift(head)

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          })
        } else {
          newSnake.pop()
        }
        return newSnake
      })
    }, 180)
    return () => clearInterval(gameLoop)
  }, [snake, food, direction, gameOver, started])

  /* ------------- Reset / Start ------------- */
  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(INITIAL_FOOD)
    setDirection({ x: 0, y: -1 })
    setGameOver(false)
    setStarted(true)
  }

  /* ------------- Render ------------- */
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* ---------- Game card ---------- */}
      <Card>
        <CardHeader>
          <CardTitle>Snake</CardTitle>
          <CardDescription>Eat the red dots and grow the longest snake!</CardDescription>
        </CardHeader>
        <CardContent>
          {!started ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">Press “Start Now” to begin.</p>
              <Button onClick={resetGame}>Start Now</Button>
            </div>
          ) : (
            <>
              {/* Grid */}
              <div
                className="grid border"
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
              >
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                  const x = i % GRID_SIZE
                  const y = Math.floor(i / GRID_SIZE)
                  const isSnake = snake.some(s => s.x === x && s.y === y)
                  const isFood = food.x === x && food.y === y
                  return (
                    <div
                      key={i}
                      className={`h-5 w-5 transition-colors ${
                        isSnake
                          ? "bg-primary"
                          : isFood
                          ? "bg-destructive"
                          : "bg-muted"
                      }`}
                    />
                  )
                })}
              </div>

              {gameOver && (
                <div className="mt-4 text-center">
                  <p className="text-red-600 font-medium">Game Over!</p>
                  <Button onClick={resetGame} className="mt-2">
                    Play Again
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ---------- Instructions card ---------- */}
      <Card>
        <CardHeader>
          <CardTitle>How to Play</CardTitle>
          <CardDescription>Instructions and tips</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">Game Rules</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use <kbd className="px-1 rounded bg-muted">↑</kbd> <kbd className="px-1 rounded bg-muted">↓</kbd>{" "}
                <kbd className="px-1 rounded bg-muted">←</kbd> <kbd className="px-1 rounded bg-muted">→</kbd> arrow keys to steer the snake.</li>
              <li>Every red dot eaten makes the snake longer and adds a point.</li>
              <li>Colliding with walls or the snake’s own body ends the game.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Strategy Tips</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Keep the snake close to the edges to avoid trapping yourself.</li>
              <li>Plan at least one move ahead before turning into open space.</li>
              <li>Don’t rush—there’s no timer, so think before you move!</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}