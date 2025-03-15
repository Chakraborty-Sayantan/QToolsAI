import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Braces, Cloud, MessageSquare, QrCode, Sparkles, Zap, Image, Code } from "lucide-react"
import { Calendar, Clock, Plane, DollarSign, Activity, Newspaper, KeyRound, Link2, Timer, Gamepad2 } from "lucide-react"

const tools = [
  {
    title: "Content Generator",
    description: "Generate high-quality content for blogs, social media, and more",
    icon: Sparkles,
    href: "/ai-tools/content-generator",
    category: "AI Tools",
  },
  {
    title: "Text Summarizer",
    description: "Summarize long articles and documents into concise summaries",
    icon: Braces,
    href: "/ai-tools/text-summarizer",
    category: "AI Tools",
  },
  {
    title: "Language Translator",
    description: "Translate text between multiple languages",
    icon: Zap,
    href: "/ai-tools/translator",
    category: "AI Tools",
  },
  {
    title: "Image Prompt Generator",
    description: "Generate detailed prompts for AI image generation tools",
    icon: Image,
    href: "/ai-tools/image-prompt-generator",
    category: "AI Tools",
  },
  {
    title: "Code Explainer",
    description: "Get explanations for code snippets in plain English",
    icon: Code,
    href: "/ai-tools/code-explainer",
    category: "AI Tools",
  },
  {
    title: "Weather",
    description: "Check the weather forecast for any location",
    icon: Cloud,
    href: "/utilities/weather",
    category: "Utilities",
  },
  {
    title: "QR Code Generator",
    description: "Generate QR codes for websites, text, and more",
    icon: QrCode,
    href: "/utilities/qr-code",
    category: "Utilities",
  },
  {
    title: "Date Calculator",
    description: "Calculate the difference between dates",
    icon: Calendar,
    href: "/utilities/date-calculator",
    category: "Utilities",
  },
  {
    title: "Age Calculator",
    description: "Calculate age from birthdate",
    icon: Clock,
    href: "/utilities/age-calculator",
    category: "Utilities",
  },
  {
    title: "Flight Tracker",
    description: "Track flight status and information",
    icon: Plane,
    href: "/utilities/flight-tracker",
    category: "Utilities",
  },
  {
    title: "Currency Converter",
    description: "Convert between different currencies",
    icon: DollarSign,
    href: "/utilities/currency-converter",
    category: "Utilities",
  },
  {
    title: "BMI Calculator",
    description: "Calculate your Body Mass Index",
    icon: Activity,
    href: "/utilities/bmi-calculator",
    category: "Utilities",
  },
  {
    title: "Daily News",
    description: "Stay updated with the latest news",
    icon: Newspaper,
    href: "/utilities/daily-news",
    category: "Utilities",
  },
  {
    title: "Password Generator",
    description: "Generate secure, random passwords",
    icon: KeyRound,
    href: "/utilities/password-generator",
    category: "Utilities",
  },
  {
    title: "URL Shortener",
    description: "Shorten long URLs for easier sharing",
    icon: Link2,
    href: "/utilities/url-shortener",
    category: "Utilities",
  },
  {
    title: "Pomodoro Timer",
    description: "Boost productivity with the Pomodoro technique",
    icon: Timer,
    href: "/utilities/pomodoro-timer",
    category: "Utilities",
  },
  {
    title: "Dice Roller",
    description: "Roll virtual dice for board games and RPGs",
    icon: Gamepad2,
    href: "/games/dice-roller",
    category: "Games",
  },
  {
    title: "Rock Paper Scissors",
    description: "Play the classic game against the computer",
    icon: Gamepad2,
    href: "/games/rock-paper-scissors",
    category: "Games",
  },
  {
    title: "2048",
    description: "Play the addictive 2048 puzzle game",
    icon: Gamepad2,
    href: "/games/2048",
    category: "Games",
  },
  
]

// Group tools by category
const groupedTools = tools.reduce((acc, tool) => {
  if (!acc[tool.category]) {
    acc[tool.category] = []
  }
  acc[tool.category].push(tool)
  return acc
}, {} as Record<string, typeof tools>)

export function ToolsOverview() {
  return (
    <div className="space-y-8 pt-6">
      {Object.entries(groupedTools).map(([category, tools]) => (
        <div key={category}>
          <h2 className="text-2xl font-bold mb-4">{category}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Card key={tool.href} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-primary/10 p-2">
                      <tool.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                  </div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-sm text-muted-foreground">Category: {tool.category}</div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={tool.href}>Open Tool</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}