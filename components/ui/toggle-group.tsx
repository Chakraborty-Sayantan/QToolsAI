"use client"

import React, { createContext, useContext, forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ---------- ToggleGroup Context ---------- */
type ToggleGroupContextValue = {
  type: "single" | "multiple"
  value: string | string[] | null
  onValueChange: (value: string) => void
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null)

/* ---------- Root Component ---------- */
export const ToggleGroup = forwardRef
  <HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof toggleGroupVariants> & {
      type?: "single" | "multiple"
      value?: string | string[] | null
      onValueChange?: (value: string | string[]) => void 
    }
>(({ className, type = "single", value = null, onValueChange = () => {}, ...props }, ref) => {
  const handleValueChange = (itemValue: string) => {
    if (type === "single") {
      onValueChange(value === itemValue ? "" : itemValue)
    } else {
      const currentValue = (value as string[]) || []
      const newValue = currentValue.includes(itemValue)
        ? currentValue.filter((v) => v !== itemValue)
        : [...currentValue, itemValue]
      onValueChange(newValue)
    }
  }

  return (
    <ToggleGroupContext.Provider value={{ type, value, onValueChange: handleValueChange }}>
      <div ref={ref} className={cn(toggleGroupVariants({ className }))} {...props} />
    </ToggleGroupContext.Provider>
  )
})
ToggleGroup.displayName = "ToggleGroup"

/* ---------- Item Component ---------- */
export const ToggleGroupItem = forwardRef
  <HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    value: string 
  }
>(({ className, children, value, onClick, ...props }, ref) => {
  const ctx = useContext(ToggleGroupContext)
  if (!ctx) throw new Error("ToggleGroupItem must be used within a ToggleGroup")

  const selected =
    ctx.type === "single"
      ? ctx.value === value
      : Array.isArray(ctx.value) && ctx.value.includes(value)

  return (
    <button
      ref={ref}
      type="button"
      data-state={selected ? "on" : "off"}
      onClick={(e) => {
        ctx.onValueChange(value)
        if (onClick) onClick(e)
      }}
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

/* ---------- Variants ---------- */
const toggleGroupVariants = cva("inline-flex items-center gap-1 rounded-md bg-muted/50 p-1")