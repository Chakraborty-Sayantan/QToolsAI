"use client"

import { useEffect } from "react"
import { useSearchStore } from "@/hooks/use-search-store"

export function KbdShortcut() {
  const { open } = useSearchStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault()
        open()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  return null
}