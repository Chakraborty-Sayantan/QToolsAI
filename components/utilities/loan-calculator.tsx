"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoanCalculator() {
  const [amount, setAmount] = useState("100000")
  const [interest, setInterest] = useState("5")
  const [years, setYears] = useState("30")
  const [monthlyPayment, setMonthlyPayment] = useState<string | null>(null)

  const calculatePayment = () => {
    const principal = parseFloat(amount)
    const monthlyInterest = parseFloat(interest) / 100 / 12
    const numberOfPayments = parseFloat(years) * 12

    if (principal > 0 && monthlyInterest > 0 && numberOfPayments > 0) {
      const x = Math.pow(1 + monthlyInterest, numberOfPayments)
      const monthly = (principal * x * monthlyInterest) / (x - 1)
      setMonthlyPayment(monthly.toFixed(2))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Calculator</CardTitle>
        <CardDescription>Calculate your monthly loan payments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Loan Amount</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="interest">Interest Rate (%)</Label>
            <Input id="interest" type="number" value={interest} onChange={(e) => setInterest(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="years">Loan Term (Years)</Label>
            <Input id="years" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
          </div>
          <Button onClick={calculatePayment} className="w-full">Calculate</Button>
          {monthlyPayment && (
            <div className="mt-4 rounded-md bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">Monthly Payment</p>
              <p className="text-2xl font-bold">₹{monthlyPayment}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}