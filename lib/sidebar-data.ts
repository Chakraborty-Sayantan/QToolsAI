import {  Braces,  Cloud,  Gamepad2,  Home,  Settings,  Sparkles,  Zap,  Calendar,  Clock,  Plane,  DollarSign,  Activity,
  Newspaper,  KeyRound,  Link2,  Timer,  Image,  Code,  Mail,  Smile,  Tags,  FileText,  Palette,  /* Train, */  Clock10,
  Ruler,  CaseSensitive,  Paintbrush,  Banknote} from "lucide-react"

export const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "AI Tools",
    icon: Sparkles,
    items: [
      { title: "Content Generator", href: "/ai-tools/content-generator", icon: Sparkles },
      { title: "Text Summarizer", href: "/ai-tools/text-summarizer", icon: Braces },
      { title: "Language Translator", href: "/ai-tools/translator", icon: Zap },
      { title: "Image Prompt Generator", href: "/ai-tools/image-prompt-generator", icon: Image },
      { title: "Code Explainer", href: "/ai-tools/code-explainer", icon: Code },
      { title: "Email Responder", href: "/ai-tools/email-responder", icon: Mail },
      { title: "Sentiment Analysis", href: "/ai-tools/sentiment-analysis", icon: Smile },
      { title: "Keyword Extractor", href: "/ai-tools/keyword-extractor", icon: Tags },
      { title: "Resume Bullet Points", href: "/ai-tools/resume-bullet-points", icon: FileText },
      { title: "Creative Name Generator", href: "/ai-tools/creative-name-generator", icon: Palette },
    ],
  },
  {
    title: "Utilities",
    icon: Zap,
    items: [
      { title: "Weather", href: "/utilities/weather", icon: Cloud },
      { title: "QR Code Generator", href: "/utilities/qr-code", icon: Zap },
      { title: "Date Calculator", href: "/utilities/date-calculator", icon: Calendar },
      { title: "Age Calculator", href: "/utilities/age-calculator", icon: Clock },
      { title: "Flight Tracker", href: "/utilities/flight-tracker", icon: Plane },
      { title: "Currency Converter", href: "/utilities/currency-converter", icon: DollarSign },
      { title: "BMI Calculator", href: "/utilities/bmi-calculator", icon: Activity },
      { title: "Daily News", href: "/utilities/daily-news", icon: Newspaper },
      { title: "Password Generator", href: "/utilities/password-generator", icon: KeyRound },
      { title: "URL Shortener", href: "/utilities/url-shortener", icon: Link2 },
      { title: "Pomodoro Timer", href: "/utilities/pomodoro-timer", icon: Timer },
   /*    { title: "PNR Status Checker", href: "/utilities/pnr-status-checker", icon: Train }, */
      { title: "Time Zone Converter", href: "/utilities/time-zone-converter", icon: Clock10 },
      { title: "Unit Converter", href: "/utilities/unit-converter", icon: Ruler },
      { title: "Word Counter", href: "/utilities/word-counter", icon: CaseSensitive },
      { title: "Color Picker & Converter", href: "/utilities/color-picker", icon: Paintbrush },
      { title: "Loan Calculator", href: "/utilities/loan-calculator", icon: Banknote },
    ],
  },
  {
    title: "Games",
    icon: Gamepad2,
    items: [
      { title: "Dice Roller", href: "/games/dice-roller", icon: Gamepad2 },
      { title: "Rock Paper Scissors", href: "/games/rock-paper-scissors", icon: Gamepad2 },
      { title: "2048", href: "/games/2048", icon: Gamepad2 },
      { title: "Tic-Tac-Toe", href: "/games/tic-tac-toe", icon: Gamepad2 },
      { title: "Memory Game", href: "/games/memory-game", icon: Gamepad2 },
      { title: "Hangman", href: "/games/hangman", icon: Gamepad2 },
      { title: "Snake", href: "/games/snake", icon: Gamepad2 },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    items: [],
  },
]
