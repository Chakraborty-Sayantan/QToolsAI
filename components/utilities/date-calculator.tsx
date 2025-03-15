"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Calculator } from "lucide-react"
import { format, differenceInDays, differenceInMonths, differenceInYears, addDays, addMonths, addYears } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function DateCalculator() {
  const [activeTab, setActiveTab] = useState("difference")

  // Date Difference Calculator
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [dateDifference, setDateDifference] = useState<{
    days: number
    months: number
    years: number
  } | null>(null)

  // Date Addition Calculator
  const [baseDate, setBaseDate] = useState<Date | undefined>(new Date())
  const [daysToAdd, setDaysToAdd] = useState(0)
  const [monthsToAdd, setMonthsToAdd] = useState(0)
  const [yearsToAdd, setYearsToAdd] = useState(0)
  const [resultDate, setResultDate] = useState<Date | null>(null)

  function calculateDateDifference() {
    if (!startDate || !endDate) return

    const days = differenceInDays(endDate, startDate)
    const months = differenceInMonths(endDate, startDate)
    const years = differenceInYears(endDate, startDate)

    setDateDifference({ days, months, years })
  }

  function calculateDateAddition() {
    if (!baseDate) return

    let result = new Date(baseDate)
    result = addDays(result, daysToAdd)
    result = addMonths(result, monthsToAdd)
    result = addYears(result, yearsToAdd)

    setResultDate(result)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Date Calculator</CardTitle>
          <CardDescription>Calculate date differences or add time to a date</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="difference">Date Difference</TabsTrigger>
              <TabsTrigger value="addition">Date Addition</TabsTrigger>
            </TabsList>

            <TabsContent value="difference" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button onClick={calculateDateDifference} className="w-full" disabled={!startDate || !endDate}>
                  Calculate Difference
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="addition" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="base-date">Base Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !baseDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {baseDate ? format(baseDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={baseDate} onSelect={setBaseDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="days-to-add">Days</Label>
                    <Input
                      id="days-to-add"
                      type="number"
                      value={daysToAdd}
                      onChange={(e) => setDaysToAdd(Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="months-to-add">Months</Label>
                    <Input
                      id="months-to-add"
                      type="number"
                      value={monthsToAdd}
                      onChange={(e) => setMonthsToAdd(Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="years-to-add">Years</Label>
                    <Input
                      id="years-to-add"
                      type="number"
                      value={yearsToAdd}
                      onChange={(e) => setYearsToAdd(Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <Button onClick={calculateDateAddition} className="w-full" disabled={!baseDate}>
                  Calculate New Date
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>Your calculation results</CardDescription>
        </CardHeader>
        <CardContent>
          {activeTab === "difference" ? (
            dateDifference ? (
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-medium">{format(startDate!, "PPP")}</p>
                    <p className="text-sm text-muted-foreground mt-2">To</p>
                    <p className="font-medium">{format(endDate!, "PPP")}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-md bg-primary/10 p-4">
                    <p className="text-2xl font-bold">{dateDifference.days}</p>
                    <p className="text-sm text-muted-foreground">Days</p>
                  </div>
                  <div className="rounded-md bg-primary/10 p-4">
                    <p className="text-2xl font-bold">{dateDifference.months}</p>
                    <p className="text-sm text-muted-foreground">Months</p>
                  </div>
                  <div className="rounded-md bg-primary/10 p-4">
                    <p className="text-2xl font-bold">{dateDifference.years}</p>
                    <p className="text-sm text-muted-foreground">Years</p>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground text-center">
                  <p>Total difference: {dateDifference.days} days</p>
                </div>
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center">
                <div className="text-center">
                  <Calculator className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Select dates and calculate to see the difference</p>
                </div>
              </div>
            )
          ) : resultDate ? (
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Original Date</p>
                  <p className="font-medium">{format(baseDate!, "PPP")}</p>

                  <div className="flex items-center justify-center my-4">
                    <div className="flex items-center space-x-2">
                      <span>+</span>
                      <div className="text-center">
                        <p className="font-medium">{daysToAdd}</p>
                        <p className="text-xs text-muted-foreground">days</p>
                      </div>
                      <span>+</span>
                      <div className="text-center">
                        <p className="font-medium">{monthsToAdd}</p>
                        <p className="text-xs text-muted-foreground">months</p>
                      </div>
                      <span>+</span>
                      <div className="text-center">
                        <p className="font-medium">{yearsToAdd}</p>
                        <p className="text-xs text-muted-foreground">years</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">New Date</p>
                  <p className="text-xl font-bold">{format(resultDate, "PPP")}</p>
                </div>
              </div>

              <div className="text-sm text-muted-foreground text-center">
                <p>Day of the week: {format(resultDate, "EEEE")}</p>
              </div>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center">
              <div className="text-center">
                <Calculator className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Select a date and add time to see the result</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

