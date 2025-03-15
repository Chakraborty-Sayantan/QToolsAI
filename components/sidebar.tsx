"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Braces,
  Cloud,
  Gamepad2,
  Home,
  Settings,
  Sparkles,
  Zap,
  Calendar,
  Clock,
  Plane,
  DollarSign,
  Activity,
  Newspaper,
  KeyRound,
  Link2,
  Timer,
  Image,
  Code,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "AI Tools",
    items: [
      {
        title: "Content Generator",
        href: "/ai-tools/content-generator",
        icon: Sparkles,
      },
      {
        title: "Text Summarizer",
        href: "/ai-tools/text-summarizer",
        icon: Braces,
      },
      
      {
        title: "Language Translator",
        href: "/ai-tools/translator",
        icon: Zap,
      },
      {
        title: "Image Prompt Generator",
        href: "/ai-tools/image-prompt-generator",
        icon: Image,
      },
      {
        title: "Code Explainer",
        href: "/ai-tools/code-explainer",
        icon: Code,
      },
    ],
  },
  {
    title: "Utilities",
    items: [
      {
        title: "Weather",
        href: "/utilities/weather",
        icon: Cloud,
      },
      {
        title: "QR Code Generator",
        href: "/utilities/qr-code",
        icon: Zap,
      },
      {
        title: "Date Calculator",
        href: "/utilities/date-calculator",
        icon: Calendar,
      },
      {
        title: "Age Calculator",
        href: "/utilities/age-calculator",
        icon: Clock,
      },
      {
        title: "Flight Tracker",
        href: "/utilities/flight-tracker",
        icon: Plane,
      },
      {
        title: "Currency Converter",
        href: "/utilities/currency-converter",
        icon: DollarSign,
      },
      {
        title: "BMI Calculator",
        href: "/utilities/bmi-calculator",
        icon: Activity,
      },
      {
        title: "Daily News",
        href: "/utilities/daily-news",
        icon: Newspaper,
      },
      {
        title: "Password Generator",
        href: "/utilities/password-generator",
        icon: KeyRound,
      },
      {
        title: "URL Shortener",
        href: "/utilities/url-shortener",
        icon: Link2,
      },
      {
        title: "Pomodoro Timer",
        href: "/utilities/pomodoro-timer",
        icon: Timer,
      },
    ],
  },
  {
    title: "Games",
    items: [
      {
        title: "Dice Roller",
        href: "/games/dice-roller",
        icon: Gamepad2,
      },
      {
        title: "Rock Paper Scissors",
        href: "/games/rock-paper-scissors",
        icon: Gamepad2,
      },
      {
        title: "2048",
        href: "/games/2048",
        icon: Gamepad2,
      },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-background md:block md:w-64">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-14 items-center justify-between border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-6 w-6" />
            <span>QToolsAI</span>
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {sidebarItems.map((item, index) => {
              return item.items ? (
                <div key={index} className="px-3 py-2">
                  <h2 className="mb-2 text-lg font-semibold tracking-tight">{item.title}</h2>
                  <div className="space-y-1">
                    {item.items.map((subItem, subIndex) => (
                      <Button
                        key={subIndex}
                        variant={pathname === subItem.href ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          pathname === subItem.href ? "bg-secondary" : "hover:bg-transparent hover:underline",
                        )}
                        asChild
                      >
                        <Link href={subItem.href}>
                          {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                          {subItem.title}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <Button
                  key={index}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href ? "bg-secondary" : "hover:bg-transparent hover:underline",
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.title}
                  </Link>
                </Button>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

