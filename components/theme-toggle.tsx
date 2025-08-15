"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button, ButtonProps } from "@/components/ui/button" // Import ButtonProps
interface ThemeToggleProps extends ButtonProps {} // Define interface to accept button props

export function ThemeToggle({ ...props }: ThemeToggleProps) { // Accept all props
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} {...props}> {/* Pass props to Button */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}