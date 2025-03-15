"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Calculator } from "lucide-react"
import { differenceInDays, differenceInMonths, differenceInYears, format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<Date | undefined>()
  const [calculationDate, setCalculationDate] = useState<Date | undefined>(new Date())
  const [age, setAge] = useState<{
    years: number
    months: number
    days: number
    totalDays: number
  } | null>(null)

  function calculateAge() {
    if (!birthDate || !calculationDate) return

    // Ensure birthDate is not in the future
    if (birthDate > calculationDate) {
      alert("Birth date cannot be in the future!")
      return
    }

    const years = differenceInYears(calculationDate, birthDate)

    // Calculate months (accounting for partial years)
    let tempDate = new Date(birthDate)
    tempDate.setFullYear(tempDate.getFullYear() + years)
    const months = differenceInMonths(calculationDate, tempDate)

    // Calculate days (accounting for partial months)
    tempDate = new Date(birthDate)
    tempDate.setFullYear(tempDate.getFullYear() + years)
    tempDate.setMonth(tempDate.getMonth() + months)
    const days = differenceInDays(calculationDate, tempDate)

    // Calculate total days
    const totalDays = differenceInDays(calculationDate, birthDate)

    setAge({ years, months, days, totalDays })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Age Calculator</CardTitle>
          <CardDescription>Calculate age from birthdate to a specific date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="birth-date">Birth Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="birth-date"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !birthDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? format(birthDate, "PPP") : "Select birth date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    initialFocus
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="calculation-date">Calculation Date (Default: Today)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="calculation-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !calculationDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {calculationDate ? format(calculationDate, "PPP") : "Select calculation date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={calculationDate} onSelect={setCalculationDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <Button onClick={calculateAge} className="w-full" disabled={!birthDate || !calculationDate}>
              Calculate Age
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Age Results</CardTitle>
          <CardDescription>Your calculated age</CardDescription>
        </CardHeader>
        <CardContent>
          {age ? (
            <div className="space-y-6">
              <div className="rounded-md bg-muted p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-medium">{format(birthDate!, "PPP")}</p>
                  <p className="text-sm text-muted-foreground mt-2">To</p>
                  <p className="font-medium">{format(calculationDate!, "PPP")}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-md bg-primary/10 p-4">
                  <p className="text-2xl font-bold">{age.years}</p>
                  <p className="text-sm text-muted-foreground">Years</p>
                </div>
                <div className="rounded-md bg-primary/10 p-4">
                  <p className="text-2xl font-bold">{age.months}</p>
                  <p className="text-sm text-muted-foreground">Months</p>
                </div>
                <div className="rounded-md bg-primary/10 p-4">
                  <p className="text-2xl font-bold">{age.days}</p>
                  <p className="text-sm text-muted-foreground">Days</p>
                </div>
              </div>

              <div className="rounded-md bg-primary/5 p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Age in Days</p>
                <p className="text-xl font-bold">{age.totalDays.toLocaleString()} days</p>
              </div>

              <div className="text-sm text-muted-foreground">
                <ul className="space-y-1">
                  <li>
                    • You are {age.years} years, {age.months} months, and {age.days} days old.
                  </li>
                  <li>
                    • You have lived for approximately {Math.floor(age.totalDays / 365.25).toLocaleString()} years.
                  </li>
                  <li>
                    • You have lived for approximately {Math.floor(age.totalDays / 30.44).toLocaleString()} months.
                  </li>
                  <li>• You have lived for approximately {Math.floor(age.totalDays * 24).toLocaleString()} hours.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center">
              <div className="text-center">
                <Calculator className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Select your birth date and calculate to see your age
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

