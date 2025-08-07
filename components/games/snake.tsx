"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const GRID_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_FOOD = { x: 15, y: 15 }

export function Snake() {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [food, setFood] = useState(INITIAL_FOOD)
  const [direction, setDirection] = useState({ x: 0, y: -1 })
  const [gameOver, setGameOver] = useState(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp": setDirection({ x: 0, y: -1 }); break
      case "ArrowDown": setDirection({ x: 0, y: 1 }); break
      case "ArrowLeft": setDirection({ x: -1, y: 0 }); break
      case "ArrowRight": setDirection({ x: 1, y: 0 }); break
    }
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (gameOver) return
    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake]
        const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y }

        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE || newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true)
          return prevSnake
        }

        newSnake.unshift(head)
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
    }, 200)
    return () => clearInterval(gameLoop)
  }, [snake, food, direction, gameOver])

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(INITIAL_FOOD)
    setDirection({ x: 0, y: -1 })
    setGameOver(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Snake</CardTitle>
        <CardDescription>Use arrow keys to move the snake</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid border" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE
            const y = Math.floor(i / GRID_SIZE)
            const isSnake = snake.some(seg => seg.x === x && seg.y === y)
            const isFood = food.x === x && food.y === y
            return (
              <div
                key={i}
                className={`h-5 w-5 ${isSnake ? "bg-primary" : isFood ? "bg-destructive" : "bg-muted"}`}
              />
            )
          })}
        </div>
        {gameOver && (
          <div className="mt-4 text-center">
            <p className="text-red-500">Game Over!</p>
            <Button onClick={resetGame} className="mt-2">Play Again</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}