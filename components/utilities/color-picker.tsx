"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ColorPicker() {
  const [color, setColor] = useState("#000000")

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : ""
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Picker & Converter</CardTitle>
        <CardDescription>Pick a color and convert it between HEX and RGB</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="h-32 w-32 rounded-full border" style={{ backgroundColor: color }} />
          <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-32" />
          <div className="w-full space-y-2">
            <div>
              <Label>HEX</Label>
              <Input value={color} onChange={(e) => setColor(e.target.value)} />
            </div>
            <div>
              <Label>RGB</Label>
              <Input value={hexToRgb(color)} readOnly />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}