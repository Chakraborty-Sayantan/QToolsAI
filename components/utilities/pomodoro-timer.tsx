"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Play, Pause, SkipForward, RotateCcw, Bell, Volume2, VolumeX } from "lucide-react"

type TimerMode = "pomodoro" | "shortBreak" | "longBreak"

interface TimerSettings {
  pomodoro: number
  shortBreak: number
  longBreak: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  longBreakInterval: number
  alarmSound: boolean
  alarmVolume: number
}

export function PomodoroTimer() {
  // Default settings
  const defaultSettings: TimerSettings = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: true,
    autoStartPomodoros: true,
    longBreakInterval: 4,
    alarmSound: true,
    alarmVolume: 50,
  }

  // State
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings)
  const [mode, setMode] = useState<TimerMode>("pomodoro")
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60)
  const [isActive, setIsActive] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio
  useEffect(() => {
    // Load a free alarm sound from a public domain source
    audioRef.current = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3")
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Update timer when settings or mode changes
  useEffect(() => {
    resetTimer()
  }, [settings, mode])

  // Timer logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!)
            handleTimerComplete()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isActive])

  // Handle timer completion
  const handleTimerComplete = () => {
    // Play alarm sound if enabled
    if (settings.alarmSound && audioRef.current) {
      audioRef.current.volume = settings.alarmVolume / 100
      audioRef.current.play().catch((e) => console.error("Error playing sound:", e))
    }

    // Update completed pomodoros count
    if (mode === "pomodoro") {
      const newCount = completedPomodoros + 1
      setCompletedPomodoros(newCount)

      // Determine next mode
      if (newCount % settings.longBreakInterval === 0) {
        setMode("longBreak")
        if (settings.autoStartBreaks) {
          setTimeout(() => setIsActive(true), 500)
        }
      } else {
        setMode("shortBreak")
        if (settings.autoStartBreaks) {
          setTimeout(() => setIsActive(true), 500)
        }
      }
    } else {
      // After a break, go back to pomodoro
      setMode("pomodoro")
      if (settings.autoStartPomodoros) {
        setTimeout(() => setIsActive(true), 500)
      }
    }
  }

  // Reset timer
  const resetTimer = () => {
    setIsActive(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    switch (mode) {
      case "pomodoro":
        setTimeLeft(settings.pomodoro * 60)
        break
      case "shortBreak":
        setTimeLeft(settings.shortBreak * 60)
        break
      case "longBreak":
        setTimeLeft(settings.longBreak * 60)
        break
    }
  }

  // Skip to next timer
  const skipTimer = () => {
    if (mode === "pomodoro") {
      if (completedPomodoros % settings.longBreakInterval === settings.longBreakInterval - 1) {
        setMode("longBreak")
      } else {
        setMode("shortBreak")
      }
    } else {
      setMode("pomodoro")
    }
    setIsActive(false)
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Get progress percentage
  const getProgress = () => {
    let total
    switch (mode) {
      case "pomodoro":
        total = settings.pomodoro * 60
        break
      case "shortBreak":
        total = settings.shortBreak * 60
        break
      case "longBreak":
        total = settings.longBreak * 60
        break
    }
    return ((total - timeLeft) / total) * 100
  }

  // Update a setting
  const updateSetting = <K extends keyof TimerSettings>(key: K, value: TimerSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Pomodoro Timer</CardTitle>
          <CardDescription>Focus and break timer based on the Pomodoro Technique</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(value) => setMode(value as TimerMode)} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
              <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
              <TabsTrigger value="longBreak">Long Break</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col items-center justify-center">
            <div className="relative mb-6 flex h-48 w-48 items-center justify-center rounded-full border-4 border-primary">
              {/* Progress circle */}
              <svg className="absolute inset-0 h-full w-full rotate-[-90deg]">
                <circle
                  cx="50%"
                  cy="50%"
                  r="calc(50% - 4px)"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-primary opacity-20"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="calc(50% - 4px)"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * (48 - 4)}`}
                  strokeDashoffset={`${((100 - getProgress()) / 100) * 2 * Math.PI * (48 - 4)}`}
                  className="text-primary"
                />
              </svg>

              <div className="z-10 text-4xl font-bold">{formatTime(timeLeft)}</div>
            </div>

            <div className="mb-4 flex gap-2">
              <Button variant={isActive ? "outline" : "default"} size="lg" onClick={() => setIsActive(!isActive)}>
                {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isActive ? "Pause" : "Start"}
              </Button>

              <Button variant="outline" size="icon" onClick={resetTimer} title="Reset Timer">
                <RotateCcw className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="icon" onClick={skipTimer} title="Skip to Next">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              {mode === "pomodoro" ? <p>Focus on your task until the timer ends</p> : <p>Take a break and relax</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm">
            Completed: <span className="font-medium">{completedPomodoros}</span> pomodoros
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
            {showSettings ? "Hide Settings" : "Show Settings"}
          </Button>
        </CardFooter>
      </Card>

      {/* Settings Card */}
      <Card className={showSettings ? "" : "hidden"}>
        <CardHeader>
          <CardTitle>Timer Settings</CardTitle>
          <CardDescription>Customize your Pomodoro experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pomodoro-length">Pomodoro Length (minutes): {settings.pomodoro}</Label>
              <Slider
                id="pomodoro-length"
                min={1}
                max={60}
                step={1}
                value={[settings.pomodoro]}
                onValueChange={(value) => updateSetting("pomodoro", value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="short-break-length">Short Break Length (minutes): {settings.shortBreak}</Label>
              <Slider
                id="short-break-length"
                min={1}
                max={30}
                step={1}
                value={[settings.shortBreak]}
                onValueChange={(value) => updateSetting("shortBreak", value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="long-break-length">Long Break Length (minutes): {settings.longBreak}</Label>
              <Slider
                id="long-break-length"
                min={1}
                max={45}
                step={1}
                value={[settings.longBreak]}
                onValueChange={(value) => updateSetting("longBreak", value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="long-break-interval">Long Break Interval (pomodoros): {settings.longBreakInterval}</Label>
              <Slider
                id="long-break-interval"
                min={1}
                max={8}
                step={1}
                value={[settings.longBreakInterval]}
                onValueChange={(value) => updateSetting("longBreakInterval", value[0])}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-start-breaks" className="cursor-pointer">
                Auto-start Breaks
              </Label>
              <Switch
                id="auto-start-breaks"
                checked={settings.autoStartBreaks}
                onCheckedChange={(checked) => updateSetting("autoStartBreaks", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-start-pomodoros" className="cursor-pointer">
                Auto-start Pomodoros
              </Label>
              <Switch
                id="auto-start-pomodoros"
                checked={settings.autoStartPomodoros}
                onCheckedChange={(checked) => updateSetting("autoStartPomodoros", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="alarm-sound" className="cursor-pointer">
                Alarm Sound
              </Label>
              <Switch
                id="alarm-sound"
                checked={settings.alarmSound}
                onCheckedChange={(checked) => updateSetting("alarmSound", checked)}
              />
            </div>

            {settings.alarmSound && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="alarm-volume">Alarm Volume: {settings.alarmVolume}%</Label>
                  <div className="flex items-center gap-2">
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      id="alarm-volume"
                      className="w-24"
                      min={0}
                      max={100}
                      step={5}
                      value={[settings.alarmVolume]}
                      onValueChange={(value) => updateSetting("alarmVolume", value[0])}
                    />
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.volume = settings.alarmVolume / 100
                      audioRef.current.play().catch((e) => console.error("Error playing sound:", e))
                    }
                  }}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Test Sound
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}