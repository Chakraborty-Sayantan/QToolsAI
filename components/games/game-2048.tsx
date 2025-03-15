"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"

type Direction = "up" | "down" | "left" | "right"
type Board = number[][]
type GameState = {
  board: Board
  score: number
  bestScore: number
  gameOver: boolean
  won: boolean
}

const GRID_SIZE = 4
const WINNING_TILE = 2048

export function Game2048() {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(GRID_SIZE)
      .fill(0)
      .map(() => Array(GRID_SIZE).fill(0)),
    score: 0,
    bestScore: 0,
    gameOver: false,
    won: false,
  })
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)

  // Initialize game
  useEffect(() => {
    // Load best score from localStorage
    const savedBestScore = localStorage.getItem("game2048BestScore")
    const bestScore = savedBestScore ? Number.parseInt(savedBestScore, 10) : 0

    // Initialize board with two random tiles
    const newBoard = Array(GRID_SIZE)
      .fill(0)
      .map(() => Array(GRID_SIZE).fill(0))
    addRandomTile(newBoard)
    addRandomTile(newBoard)

    setGameState({
      board: newBoard,
      score: 0,
      bestScore,
      gameOver: false,
      won: false,
    })
  }, [])

  // Save best score to localStorage when it changes
  useEffect(() => {
    if (gameState.bestScore > 0) {
      localStorage.setItem("game2048BestScore", gameState.bestScore.toString())
    }
  }, [gameState.bestScore])

  // Add keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver) return

      switch (e.key) {
        case "ArrowUp":
          move("up")
          e.preventDefault()
          break
        case "ArrowDown":
          move("down")
          e.preventDefault()
          break
        case "ArrowLeft":
          move("left")
          e.preventDefault()
          break
        case "ArrowRight":
          move("right")
          e.preventDefault()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameState])

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y

    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 20) {
        move("right")
      } else if (deltaX < -20) {
        move("left")
      }
    } else {
      // Vertical swipe
      if (deltaY > 20) {
        move("down")
      } else if (deltaY < -20) {
        move("up")
      }
    }

    setTouchStart(null)
  }

  // Add a random tile (2 or 4) to an empty cell
  const addRandomTile = (board: Board) => {
    const emptyCells = []

    // Find all empty cells
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (board[i][j] === 0) {
          emptyCells.push({ i, j })
        }
      }
    }

    if (emptyCells.length === 0) return false

    // Choose a random empty cell
    const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)]

    // 90% chance for a 2, 10% chance for a 4
    board[i][j] = Math.random() < 0.9 ? 2 : 4

    return true
  }

  // Check if the game is over
  const isGameOver = (board: Board) => {
    // Check for empty cells
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (board[i][j] === 0) return false
      }
    }

    // Check for possible merges
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const value = board[i][j]

        // Check adjacent cells
        if ((i < GRID_SIZE - 1 && board[i + 1][j] === value) || (j < GRID_SIZE - 1 && board[i][j + 1] === value)) {
          return false
        }
      }
    }

    return true
  }

  // Check if the player has won
  const checkForWin = (board: Board) => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (board[i][j] === WINNING_TILE) return true
      }
    }
    return false
  }

  // Create a deep copy of the board
  const copyBoard = (board: Board): Board => {
    return board.map((row) => [...row])
  }

  // Move tiles in the specified direction
  const move = useCallback(
    (direction: Direction) => {
      if (gameState.gameOver) return

      const newBoard = copyBoard(gameState.board)
      let moved = false
      let newScore = gameState.score

      // Process the board based on direction
      if (direction === "left") {
        // For each row
        for (let i = 0; i < GRID_SIZE; i++) {
          const result = processTiles(newBoard[i])
          newBoard[i] = result.row
          newScore += result.score
          if (result.moved) moved = true
        }
      } else if (direction === "right") {
        // For each row, reverse, process, then reverse back
        for (let i = 0; i < GRID_SIZE; i++) {
          const row = [...newBoard[i]].reverse()
          const result = processTiles(row)
          newBoard[i] = result.row.reverse()
          newScore += result.score
          if (result.moved) moved = true
        }
      } else if (direction === "up") {
        // For each column
        for (let j = 0; j < GRID_SIZE; j++) {
          const column = newBoard.map((row) => row[j])
          const result = processTiles(column)

          // Update the column in the board
          for (let i = 0; i < GRID_SIZE; i++) {
            newBoard[i][j] = result.row[i]
          }

          newScore += result.score
          if (result.moved) moved = true
        }
      } else if (direction === "down") {
        // For each column, reverse, process, then reverse back
        for (let j = 0; j < GRID_SIZE; j++) {
          const column = newBoard.map((row) => row[j]).reverse()
          const result = processTiles(column)

          // Update the column in the board
          const processedColumn = result.row.reverse()
          for (let i = 0; i < GRID_SIZE; i++) {
            newBoard[i][j] = processedColumn[i]
          }

          newScore += result.score
          if (result.moved) moved = true
        }
      }

      // If no tiles moved, do nothing
      if (!moved) return

      // Add a new random tile
      addRandomTile(newBoard)

      // Check for win or game over
      const won = checkForWin(newBoard)
      const gameOver = isGameOver(newBoard)

      // Update best score if needed
      const bestScore = Math.max(gameState.bestScore, newScore)

      // Update game state
      setGameState({
        board: newBoard,
        score: newScore,
        bestScore,
        gameOver,
        won,
      })
    },
    [gameState],
  )

  // Process a row or column of tiles
  const processTiles = (tiles: number[]) => {
    const newTiles = [...tiles]
    let score = 0
    let moved = false

    // First, remove all zeros and compact the tiles
    const filteredTiles = newTiles.filter((tile) => tile !== 0)

    // If the filtered length is different, tiles moved
    if (filteredTiles.length !== newTiles.length) {
      moved = true
    }

    // Merge adjacent identical tiles
    for (let i = 0; i < filteredTiles.length - 1; i++) {
      if (filteredTiles[i] === filteredTiles[i + 1]) {
        filteredTiles[i] *= 2
        score += filteredTiles[i]
        filteredTiles[i + 1] = 0
        moved = true
        i++ // Skip the next tile since it's now zero
      }
    }

    // Remove zeros again after merging
    const mergedTiles = filteredTiles.filter((tile) => tile !== 0)

    // Pad with zeros to maintain the grid size
    while (mergedTiles.length < GRID_SIZE) {
      mergedTiles.push(0)
    }

    return { row: mergedTiles, score, moved }
  }

  // Reset the game
  const resetGame = () => {
    const newBoard = Array(GRID_SIZE)
      .fill(0)
      .map(() => Array(GRID_SIZE).fill(0))
    addRandomTile(newBoard)
    addRandomTile(newBoard)

    setGameState({
      board: newBoard,
      score: 0,
      bestScore: gameState.bestScore,
      gameOver: false,
      won: false,
    })
  }

  // Get the background color for a tile
  const getTileColor = (value: number) => {
    const colors: Record<number, string> = {
      0: "bg-gray-200",
      2: "bg-amber-100 text-gray-800",
      4: "bg-amber-200 text-gray-800",
      8: "bg-amber-300 text-white",
      16: "bg-amber-400 text-white",
      32: "bg-amber-500 text-white",
      64: "bg-amber-600 text-white",
      128: "bg-yellow-400 text-white",
      256: "bg-yellow-500 text-white",
      512: "bg-orange-500 text-white",
      1024: "bg-orange-600 text-white",
      2048: "bg-red-500 text-white",
    }

    return colors[value] || "bg-red-600 text-white"
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>2048</CardTitle>
          <CardDescription>Combine tiles to reach 2048!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="rounded-md bg-muted p-2 text-center w-24">
              <div className="text-xs text-muted-foreground">Score</div>
              <div className="text-xl font-bold">{gameState.score}</div>
            </div>
            <div className="rounded-md bg-muted p-2 text-center w-24">
              <div className="text-xs text-muted-foreground">Best</div>
              <div className="text-xl font-bold">{gameState.bestScore}</div>
            </div>
          </div>

          <div
            className="bg-gray-100 rounded-lg p-2 mb-4 select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="grid grid-cols-4 gap-2">
              {gameState.board.flat().map((value, index) => (
                <div
                  key={index}
                  className={`${getTileColor(value)} h-16 w-full flex items-center justify-center rounded-md font-bold text-xl transition-all duration-100 md:h-20 lg:h-24`}
                >
                  {value !== 0 ? value : ""}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div></div>
            <Button variant="outline" onClick={() => move("up")}>
              <ArrowUp className="h-5 w-5" />
            </Button>
            <div></div>
            <Button variant="outline" onClick={() => move("left")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={() => move("down")}>
              <ArrowDown className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={() => move("right")}>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          <Button onClick={resetGame} className="w-full" variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            New Game
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Play</CardTitle>
          <CardDescription>Instructions and tips</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Game Rules</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Use arrow keys or swipe to move tiles</li>
              <li>Tiles with the same number merge into one when they touch</li>
              <li>Add them up to reach 2048!</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Strategy Tips</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Keep your highest tile in a corner</li>
              <li>Focus on maintaining a clear path to your highest tile</li>
              <li>Try to keep the board organized with larger values on one side</li>
              <li>Plan several moves ahead</li>
            </ul>
          </div>

          {gameState.gameOver && (
            <div className="rounded-md bg-red-50 p-4 text-center">
              <p className="text-red-600 font-medium">Game Over!</p>
              <p className="text-sm text-muted-foreground mt-1">No more moves available</p>
              <Button onClick={resetGame} className="mt-2" variant="outline" size="sm">
                Play Again
              </Button>
            </div>
          )}

          {gameState.won && !gameState.gameOver && (
            <div className="rounded-md bg-green-50 p-4 text-center">
              <p className="text-green-600 font-medium">You Win!</p>
              <p className="text-sm text-muted-foreground mt-1">You reached 2048!</p>
              <p className="text-sm text-muted-foreground">Keep playing to reach higher scores</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

