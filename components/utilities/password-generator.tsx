"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Copy, Check, RefreshCw, Shield } from "lucide-react"

export function PasswordGenerator() {
  const [passwordLength, setPasswordLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | "very-strong" | "">("")
  const [copied, setCopied] = useState(false)
  const [passwordHistory, setPasswordHistory] = useState<string[]>([])

  // Generate a random password
  const generatePassword = () => {
    let charset = ""
    const uppercaseChars = "ABCDEFGHJKLMNPQRSTUVWXYZ"
    const lowercaseChars = "abcdefghijkmnopqrstuvwxyz"
    const numberChars = "23456789"
    const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-="

    // Characters to exclude if excludeSimilar is true
    const similarChars = "Il1O0"

    if (includeUppercase) charset += uppercaseChars
    if (includeLowercase) charset += lowercaseChars
    if (includeNumbers) charset += numberChars
    if (includeSymbols) charset += symbolChars

    // Remove similar characters if option is selected
    if (excludeSimilar) {
      for (const char of similarChars) {
        charset = charset.replace(char, "")
      }
    }

    // Ensure at least one character set is selected
    if (charset === "") {
      charset = lowercaseChars
      setIncludeLowercase(true)
    }

    let newPassword = ""
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      newPassword += charset[randomIndex]
    }

    setPassword(newPassword)
    calculatePasswordStrength(newPassword)

    // Add to history
    if (newPassword) {
      setPasswordHistory((prev) => [newPassword, ...prev.slice(0, 4)])
    }

    setCopied(false)
  }

  // Calculate password strength
  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0

    // Length check
    if (pwd.length >= 8) strength += 1
    if (pwd.length >= 12) strength += 1
    if (pwd.length >= 16) strength += 1

    // Character variety check
    if (/[A-Z]/.test(pwd)) strength += 1
    if (/[a-z]/.test(pwd)) strength += 1
    if (/[0-9]/.test(pwd)) strength += 1
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1

    // Set strength category
    if (strength <= 3) {
      setPasswordStrength("weak")
    } else if (strength <= 5) {
      setPasswordStrength("medium")
    } else if (strength <= 7) {
      setPasswordStrength("strong")
    } else {
      setPasswordStrength("very-strong")
    }
  }

  // Copy password to clipboard
  const copyToClipboard = () => {
    if (!password) return

    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Get color based on password strength
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "strong":
        return "text-green-500"
      case "very-strong":
        return "text-blue-500"
      default:
        return ""
    }
  }

  // Get strength bars
  const getStrengthBars = () => {
    const bars = []
    const total = 4
    let filled = 0

    switch (passwordStrength) {
      case "weak":
        filled = 1
        break
      case "medium":
        filled = 2
        break
      case "strong":
        filled = 3
        break
      case "very-strong":
        filled = 4
        break
      default:
        filled = 0
    }

    for (let i = 0; i < total; i++) {
      bars.push(
        <div
          key={i}
          className={`h-2 w-full rounded-full ${
            i < filled
              ? passwordStrength === "weak"
                ? "bg-red-500"
                : passwordStrength === "medium"
                  ? "bg-yellow-500"
                  : passwordStrength === "strong"
                    ? "bg-green-500"
                    : "bg-blue-500"
              : "bg-gray-200"
          }`}
        />,
      )
    }

    return bars
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Password Generator</CardTitle>
          <CardDescription>Create strong, secure passwords</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Generated Password</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={generatePassword}
                title="Generate new password"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                id="password"
                value={password}
                readOnly
                className="font-mono"
                placeholder="Click Generate to create a password"
              />
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={copyToClipboard}
                disabled={!password || copied}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy password</span>
              </Button>
            </div>

            {passwordStrength && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Strength:</span>
                  <span className={`text-xs font-medium ${getStrengthColor()}`}>
                    {passwordStrength.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase())}
                  </span>
                </div>
                <div className="flex gap-1">{getStrengthBars()}</div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password-length">Password Length: {passwordLength}</Label>
              </div>
              <Slider
                id="password-length"
                min={8}
                max={32}
                step={1}
                value={[passwordLength]}
                onValueChange={(value) => setPasswordLength(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>8</span>
                <span>16</span>
                <span>24</span>
                <span>32</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Character Types</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                  <Label htmlFor="uppercase" className="text-sm">
                    Uppercase (A-Z)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
                  <Label htmlFor="lowercase" className="text-sm">
                    Lowercase (a-z)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                  <Label htmlFor="numbers" className="text-sm">
                    Numbers (0-9)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                  <Label htmlFor="symbols" className="text-sm">
                    Symbols (!@#$)
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="exclude-similar" checked={excludeSimilar} onCheckedChange={setExcludeSimilar} />
              <Label htmlFor="exclude-similar" className="text-sm">
                Exclude similar characters (I, l, 1, O, 0)
              </Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={generatePassword} className="w-full">
            Generate Password
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password History</CardTitle>
          <CardDescription>Recently generated passwords</CardDescription>
        </CardHeader>
        <CardContent>
          {passwordHistory.length > 0 ? (
            <div className="space-y-3">
              {passwordHistory.map((pwd, index) => (
                <div key={index} className="flex items-center justify-between rounded-md border p-3">
                  <code className="font-mono text-sm">{pwd}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      navigator.clipboard.writeText(pwd)
                    }}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy password</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center">
              <div className="text-center">
                <Shield className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Generate passwords to see your history</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <p>Tip: Use a password manager to securely store your generated passwords.</p>
        </CardFooter>
      </Card>
    </div>
  )
}

