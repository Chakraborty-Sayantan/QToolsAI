"use client"

import { Button } from "@/components/ui/button"
import { useSearchStore } from "@/hooks/use-search-store"

export function SearchBar() {
  const { open } = useSearchStore()

  return (
    <Button
  variant="outline"
  onClick={open}
  className="relative flex h-9 w-full border-2 border-black dark:border-white items-center justify-between rounded-md  px-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-0 sm:w-64"
>
  <span>Search tools</span>

    <div className="hidden items-center gap-1 sm:flex">
    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted/50 px-1.5 font-mono text-[10px] font-medium">
      <span>⌘</span>K
    </kbd>
  </div>
</Button>
  )
}
