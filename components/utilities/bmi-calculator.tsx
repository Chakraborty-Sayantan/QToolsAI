"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Activity } from "lucide-react"

export function BMICalculator() {
  const [activeTab, setActiveTab] = useState("metric")

  // Metric units
  const [heightCm, setHeightCm] = useState("")
  const [weightKg, setWeightKg] = useState("")

  // Imperial units
  const [heightFt, setHeightFt] = useState("")
  const [heightIn, setHeightIn] = useState("")
  const [weightLbs, setWeightLbs] = useState("")

  // Results
  const [bmi, setBmi] = useState<number | null>(null)
  const [bmiCategory, setBmiCategory] = useState<string>("")
  const [healthyWeightRange, setHealthyWeightRange] = useState<{ min: number; max: number } | null>(null)

  // Gender (for additional calculations)
  const [gender, setGender] = useState<"male" | "female">("male")

  function calculateBMI() {
    let calculatedBMI: number
    let heightM: number
    let weight: number

    if (activeTab === "metric") {
      if (!heightCm || !weightKg) return

      heightM = Number.parseFloat(heightCm) / 100
      weight = Number.parseFloat(weightKg)
      calculatedBMI = weight / (heightM * heightM)
    } else {
      if (!heightFt || !weightLbs) return

      const inches = Number.parseFloat(heightFt) * 12 + (Number.parseFloat(heightIn) || 0)
      heightM = inches * 0.0254
      weight = Number.parseFloat(weightLbs) * 0.453592
      calculatedBMI = weight / (heightM * heightM)
    }

    setBmi(calculatedBMI)

    // Determine BMI category
    if (calculatedBMI < 18.5) {
      setBmiCategory("Underweight")
    } else if (calculatedBMI < 25) {
      setBmiCategory("Normal weight")
    } else if (calculatedBMI < 30) {
      setBmiCategory("Overweight")
    } else if (calculatedBMI < 35) {
      setBmiCategory("Obesity (Class 1)")
    } else if (calculatedBMI < 40) {
      setBmiCategory("Obesity (Class 2)")
    } else {
      setBmiCategory("Obesity (Class 3)")
    }

    // Calculate healthy weight range
    const minWeight = 18.5 * (heightM * heightM)
    const maxWeight = 24.9 * (heightM * heightM)

    if (activeTab === "metric") {
      setHealthyWeightRange({
        min: Number.parseFloat(minWeight.toFixed(1)),
        max: Number.parseFloat(maxWeight.toFixed(1)),
      })
    } else {
      setHealthyWeightRange({
        min: Number.parseFloat((minWeight / 0.453592).toFixed(1)),
        max: Number.parseFloat((maxWeight / 0.453592).toFixed(1)),
      })
    }
  }

  function getBMICategoryColor(category: string) {
    switch (category) {
      case "Underweight":
        return "text-blue-500"
      case "Normal weight":
        return "text-green-500"
      case "Overweight":
        return "text-yellow-500"
      case "Obesity (Class 1)":
      case "Obesity (Class 2)":
      case "Obesity (Class 3)":
        return "text-red-500"
      default:
        return ""
    }
  }

  function resetForm() {
    if (activeTab === "metric") {
      setHeightCm("")
      setWeightKg("")
    } else {
      setHeightFt("")
      setHeightIn("")
      setWeightLbs("")
    }

    setBmi(null)
    setBmiCategory("")
    setHealthyWeightRange(null)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>BMI Calculator</CardTitle>
          <CardDescription>Calculate your Body Mass Index (BMI)</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value)
              resetForm()
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="metric">Metric</TabsTrigger>
              <TabsTrigger value="imperial">Imperial</TabsTrigger>
            </TabsList>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup
                  value={gender}
                  onValueChange={(value) => setGender(value as "male" | "female")}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>

              <TabsContent value="metric" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="height-cm">Height (cm)</Label>
                  <Input
                    id="height-cm"
                    type="number"
                    placeholder="e.g. 175"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight-kg">Weight (kg)</Label>
                  <Input
                    id="weight-kg"
                    type="number"
                    placeholder="e.g. 70"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="imperial" className="space-y-4">
                <div className="space-y-2">
                  <Label>Height</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        id="height-ft"
                        type="number"
                        placeholder="Feet"
                        value={heightFt}
                        onChange={(e) => setHeightFt(e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        id="height-in"
                        type="number"
                        placeholder="Inches"
                        value={heightIn}
                        onChange={(e) => setHeightIn(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight-lbs">Weight (lbs)</Label>
                  <Input
                    id="weight-lbs"
                    type="number"
                    placeholder="e.g. 154"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value)}
                  />
                </div>
              </TabsContent>

              <div className="flex gap-2">
                <Button
                  onClick={calculateBMI}
                  className="flex-1"
                  disabled={
                    (activeTab === "metric" && (!heightCm || !weightKg)) ||
                    (activeTab === "imperial" && (!heightFt || !weightLbs))
                  }
                >
                  Calculate BMI
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>BMI Results</CardTitle>
          <CardDescription>Your Body Mass Index and health information</CardDescription>
        </CardHeader>
        <CardContent>
          {bmi ? (
            <div className="space-y-6">
              <div className="rounded-md bg-muted p-6 text-center">
                <p className="text-sm text-muted-foreground">Your BMI</p>
                <p className="text-4xl font-bold">{bmi.toFixed(1)}</p>
                <p className={`text-lg font-medium ${getBMICategoryColor(bmiCategory)}`}>{bmiCategory}</p>
              </div>

              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <p className="text-sm font-medium">Healthy Weight Range</p>
                  <p className="text-lg">
                    {activeTab === "metric"
                      ? `${healthyWeightRange?.min} - ${healthyWeightRange?.max} kg`
                      : `${healthyWeightRange?.min} - ${healthyWeightRange?.max} lbs`}
                  </p>
                </div>

                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="font-medium">BMI Categories:</p>
                  <ul className="space-y-1">
                    <li>• Underweight: BMI less than 18.5</li>
                    <li>• Normal weight: BMI 18.5 to 24.9</li>
                    <li>• Overweight: BMI 25 to 29.9</li>
                    <li>• Obesity (Class 1): BMI 30 to 34.9</li>
                    <li>• Obesity (Class 2): BMI 35 to 39.9</li>
                    <li>• Obesity (Class 3): BMI 40 or higher</li>
                  </ul>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="italic">
                    Note: BMI is a screening tool but does not diagnose body fatness or health. Factors like muscle
                    mass, age, and ethnicity can affect BMI interpretation.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <Activity className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Enter your height and weight to calculate your BMI</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

