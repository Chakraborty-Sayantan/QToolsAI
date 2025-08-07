"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const timeZones = [
  { value: "UTC", label: "UTC" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "America/New_York", label: "New York (EST)" },
  { value: "America/Chicago", label: "Chicago (CST)" },
  { value: "America/Denver", label: "Denver (MST)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
  { value: "Pacific/Auckland", label: "Auckland" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Africa/Johannesburg", label: "Johannesburg (SAST)" },
]

export function TimeZoneConverter() {
  const [fromTimeZone, setFromTimeZone] = useState("Asia/Kolkata")
  const [toTimeZone, setToTimeZone] = useState("America/New_York")
  const [time, setTime] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      const fromTime = new Date().toLocaleTimeString("en-US", { timeZone: fromTimeZone, hour12: true, hour: '2-digit', minute:'2-digit' })
      const toTime = new Date().toLocaleTimeString("en-US", { timeZone: toTimeZone, hour12: true, hour: '2-digit', minute:'2-digit' })
      setTime(`From: ${fromTime} | To: ${toTime}`)
    }, 1000)
    return () => clearInterval(timer)
  }, [fromTimeZone, toTimeZone])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Zone Converter</CardTitle>
        <CardDescription>Compare the time in different parts of the world</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>From</Label>
            <Select value={fromTimeZone} onValueChange={setFromTimeZone}>
              <SelectTrigger>
                <SelectValue placeholder="Select Time Zone" />
              </SelectTrigger>
              <SelectContent>
                {timeZones.map(tz => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>To</Label>
            <Select value={toTimeZone} onValueChange={setToTimeZone}>
              <SelectTrigger>
                <SelectValue placeholder="Select Time Zone" />
              </SelectTrigger>
              <SelectContent>
                {timeZones.map(tz => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 rounded-md bg-muted p-4 text-center">
          <p className="text-lg font-semibold">{time}</p>
        </div>
      </CardContent>
    </Card>
  )
}
