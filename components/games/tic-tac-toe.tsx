"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const initialBoard = Array(9).fill(null)

export function TicTacToe() {
  const [board, setBoard] = useState(initialBoard)
  const [isXNext, setIsXNext] = useState(true)
  const winner = calculateWinner(board)

  const handleClick = (i: number) => {
    if (winner || board[i]) return
    const newBoard = [...board]
    newBoard[i] = isXNext ? "X" : "O"
    setBoard(newBoard)
    setIsXNext(!isXNext)
  }

  const renderSquare = (i: number) => (
    <motion.button
      className="flex items-center justify-center h-24 w-24 border-2 text-5xl font-bold rounded-lg shadow-md transition-colors duration-200
                 bg-slate-100 dark:bg-slate-800 
                 hover:bg-slate-200 dark:hover:bg-slate-700"
      onClick={() => handleClick(i)}
      whileTap={{ scale: 0.9 }}
    >
      {board[i] === 'X' && <span className="text-blue-500">X</span>}
      {board[i] === 'O' && <span className="text-red-500">O</span>}
    </motion.button>
  )

  const resetGame = () => {
    setBoard(initialBoard)
    setIsXNext(true)
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-900 dark:to-purple-900">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold text-blue-700 dark:text-blue-300">Tic-Tac-Toe</CardTitle>
        <CardDescription className="text-center text-lg h-6">
          {winner ? (winner === 'Draw' ? "It's a Draw!" : `Winner: ${winner}!`) : `Next Player: ${isXNext ? "X" : "O"}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="grid grid-cols-3 gap-2 bg-slate-300 dark:bg-slate-600 p-2 rounded-lg">
          {Array(9).fill(null).map((_, i) => renderSquare(i))}
        </div>
        <Button onClick={resetGame} className="mt-6 w-full bg-blue-600 hover:bg-blue-700">
          Reset Game
        </Button>
      </CardContent>
    </Card>
  )
}

function calculateWinner(squares: any[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  if (squares.every(square => square !== null)) return 'Draw';
  return null
}
