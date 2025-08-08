"use client"

import { createContext, useContext, forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

type ToggleGroupContext = {
  type: "single" | "multiple"
  value: string | string[] | null
  onValueChange: (value: string) => void
}
const ToggleGroupContext = createContext<ToggleGroupContext | null>(null)

export const ToggleGroup = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof toggleGroupVariants> & {
      type?: "single" | "multiple"
      value?: string | string[] | null
      onValueChange?: (value: string) => void
    }
>(({ className, type = "single", value = null, onValueChange = () => {}, ...props }, ref) => (
  <ToggleGroupContext.Provider value={{ type, value, onValueChange }}>
    <div ref={ref} className={cn(toggleGroupVariants({ className }))} {...props} />
  </ToggleGroupContext.Provider>
))
ToggleGroup.displayName = "ToggleGroup"

export const ToggleGroupItem = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const ctx = useContext(ToggleGroupContext)
  if (!ctx) throw new Error("ToggleGroupItem must be inside ToggleGroup")

  const selected =
    ctx.type === "single"
      ? ctx.value === value
      : Array.isArray(ctx.value) && ctx.value.includes(value)

  return (
    <button
      ref={ref}
      type="button"
      data-state={selected ? "on" : "off"}
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "bg-primary text-primary-foreground"
          : "bg-transparent hover:bg-muted hover:text-muted-foreground",
        "px-3 py-1.5",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
ToggleGroupItem.displayName = "ToggleGroupItem"

const toggleGroupVariants = cva("inline-flex items-center gap-1 rounded-md bg-muted/50 p-1")