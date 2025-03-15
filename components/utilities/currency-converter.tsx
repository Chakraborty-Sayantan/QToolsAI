"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightLeft, DollarSign, Loader2 } from "lucide-react"

interface Currency {
  code: string
  name: string
  symbol: string
}

const popularCurrencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
]

export function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(1)
  const [fromCurrency, setFromCurrency] = useState<string>("USD")
  const [toCurrency, setToCurrency] = useState<string>("EUR")
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [recentConversions, setRecentConversions] = useState<
    Array<{
      from: string
      to: string
      rate: number
      amount: number
      result: number
      timestamp: number
    }>
  >([])

  // Initialize API key
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY
    setApiKey(key || null)
    if (!key) {
      setError("API key not found. Please check your environment configuration.")
    }
  }, [])

  const fetchExchangeRate = useCallback(async (from: string, to: string) => {
    try {
      if (!apiKey) {
        throw new Error("API key not found. Please check your environment configuration.")
      }

      const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.result === "success") {
        return data.conversion_rate
      } else {
        throw new Error(data.error || "Failed to fetch exchange rate")
      }
    } catch (err) {
      console.error("Error fetching exchange rate:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch exchange rate. Please try again later.")
      return null
    }
  }, [apiKey])

  const convertCurrency = useCallback(async () => {
    if (!amount || !apiKey) return

    setIsLoading(true)
    setError("")

    try {
      if (fromCurrency === toCurrency) {
        setExchangeRate(1)
        setConvertedAmount(amount)
      } else {
        const rate = await fetchExchangeRate(fromCurrency, toCurrency)
        if (rate) {
          setExchangeRate(rate)
          setConvertedAmount(amount * rate)
          
          const now = new Date()
          setLastUpdated(now.toLocaleTimeString())

          // Add to recent conversions
          const result = amount * rate
          const newConversion = {
            from: fromCurrency,
            to: toCurrency,
            rate,
            amount,
            result,
            timestamp: now.getTime(),
          }

          setRecentConversions((prev) => [newConversion, ...prev.slice(0, 4)])
        }
      }
    } finally {
      setIsLoading(false)
    }
  }, [amount, fromCurrency, toCurrency, apiKey, fetchExchangeRate])

  useEffect(() => {
    convertCurrency()
  }, [convertCurrency])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    setAmount(isNaN(value) ? 0 : value)
  }

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const formatCurrency = (value: number, currencyCode: string) => {
    const currency = popularCurrencies.find((c) => c.code === currencyCode)
    return `${currency?.symbol || ""}${value.toFixed(2)}`
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Currency Converter</CardTitle>
          <CardDescription>Convert between different currencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex">
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={handleAmountChange}
                  className="flex-1"
                />
                <Button type="button" variant="outline" className="ml-2" onClick={convertCurrency} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Convert"}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="from-currency">From</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger id="from-currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {popularCurrencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="button" variant="outline" size="icon" onClick={handleSwapCurrencies} className="mt-6">
                <ArrowRightLeft className="h-4 w-4" />
                <span className="sr-only">Swap currencies</span>
              </Button>

              <div className="flex-1 space-y-2">
                <Label htmlFor="to-currency">To</Label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger id="to-currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {popularCurrencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          {convertedAmount !== null && (
            <div className="w-full space-y-2">
              <div className="rounded-md bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {amount} {fromCurrency} =
                </p>
                <p className="text-3xl font-bold">{formatCurrency(convertedAmount, toCurrency)}</p>
                <p className="text-sm text-muted-foreground">
                  1 {fromCurrency} = {exchangeRate?.toFixed(4)} {toCurrency}
                </p>
              </div>

              <p className="text-xs text-muted-foreground text-right">Last updated: {lastUpdated}</p>
            </div>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Conversions</CardTitle>
          <CardDescription>Your recent currency conversions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentConversions.length > 0 ? (
            <div className="space-y-3">
              {recentConversions.map((conversion, index) => (
                <div key={index} className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {formatCurrency(conversion.amount, conversion.from)} →{" "}
                        {formatCurrency(conversion.result, conversion.to)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Rate: 1 {conversion.from} = {conversion.rate.toFixed(4)} {conversion.to}
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {new Date(conversion.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center">
              <div className="text-center">
                <DollarSign className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">No recent conversions</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

