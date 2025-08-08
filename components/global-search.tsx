"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useSearchStore } from "@/hooks/use-search-store"
import { sidebarItems } from "@/lib/sidebar-data"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function GlobalSearch() {
  const router = useRouter()
  const { isOpen, close } = useSearchStore()
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)


  useEffect(() => {
    if (isOpen) {
      setSearch("")
      setCategoryFilter(null)
    }
  }, [isOpen])

  const allTools = sidebarItems.flatMap(item => item.items ? item.items.map(sub => ({ ...sub, category: item.title })) : [{ ...item, category: "General" }])

  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || tool.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const onSelect = (href: string) => {
    router.push(href)
    close()
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search for a tool</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Type to search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ToggleGroup
          type="single"
          value={categoryFilter ?? ""}
          onValueChange={v => {
            if (typeof v === 'string') {
              setCategoryFilter(v || null)
            }
          }}
          className="justify-start gap-2"
        >
          <ToggleGroupItem value="AI Tools">AI Tools</ToggleGroupItem>
          <ToggleGroupItem value="Utilities">Utilities</ToggleGroupItem>
          <ToggleGroupItem value="Games">Games</ToggleGroupItem>
        </ToggleGroup>
        <div className="mt-4 max-h-96 overflow-y-auto">
          {filteredTools.map(tool => tool.href && (
            <div
              key={tool.href}
              onClick={() => onSelect(tool.href)}
              className="p-2 hover:bg-accent rounded-md cursor-pointer flex justify-between items-center"
            >
              <span>{tool.title}</span>
              <span className="text-xs text-muted-foreground">{tool.category}</span>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd> or <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">Ctrl</span>K
          </kbd> to open this search.
        </div>
      </DialogContent>
    </Dialog>
  )
}