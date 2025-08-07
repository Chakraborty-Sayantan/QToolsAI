"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const units = {
  length: {
    meter: 1,
    kilometer: 1000,
    mile: 1609.34,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254,
  },
  weight: {
    gram: 1,
    kilogram: 1000,
    pound: 453.592,
    ounce: 28.3495,
  },
  temperature: {
    celsius: (c: number) => c,
    fahrenheit: (f: number) => (f - 32) * 5 / 9,
    kelvin: (k: number) => k - 273.15,
  },
}

export function UnitConverter() {
  const [category, setCategory] = useState("length")
  const [fromUnit, setFromUnit] = useState("meter")
  const [toUnit, setToUnit] = useState("foot")
  const [input, setInput] = useState("1")
  const [output, setOutput] = useState("")

  const convert = () => {
    const from = units[category as keyof typeof units][fromUnit as keyof typeof units[keyof typeof units]]
    const to = units[category as keyof typeof units][toUnit as keyof typeof units[keyof typeof units]]
    const value = parseFloat(input)
    if (isNaN(value)) return

    let result
    if (category === "temperature") {
      const fromFunc = from as (val: number) => number
      const toFunc = (c: number) => {
        if (toUnit === "celsius") return c
        if (toUnit === "fahrenheit") return c * 9 / 5 + 32
        if (toUnit === "kelvin") return c + 273.15
        return 0
      }
      const celsius = fromFunc(value)
      result = toFunc(celsius)
    } else {
      result = value * (from as number) / (to as number)
    }
    setOutput(result.toFixed(2))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit Converter</CardTitle>
        <CardDescription>Convert various units of measurement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={category} onValueChange={(val) => {
            setCategory(val)
            setFromUnit(Object.keys(units[val as keyof typeof units])[0])
            setToUnit(Object.keys(units[val as keyof typeof units])[1])
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="length">Length</SelectItem>
              <SelectItem value="weight">Weight</SelectItem>
              <SelectItem value="temperature">Temperature</SelectItem>
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onBlur={convert}
            />
            <Input type="text" value={output} readOnly />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(units[category as keyof typeof units]).map(unit => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(units[category as keyof typeof units]).map(unit => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}