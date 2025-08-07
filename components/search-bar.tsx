"use client"

import { Button } from "@/components/ui/button"
import { useSearchStore } from "@/hooks/use-search-store"

export function SearchBar() {
  const { open } = useSearchStore()

  return (
    <Button
      variant="outline"
      className="flex h-9 w-full items-center justify-between px-3 text-sm text-muted-foreground sm:w-64"
      onClick={open}
    >
      <span>Search tools...</span>
      <div className="hidden items-center gap-1 sm:flex">
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </Button>
  )
}
