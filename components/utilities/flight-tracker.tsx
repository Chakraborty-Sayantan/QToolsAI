"use client"

import { type FormEvent } from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plane, Search, Loader2, AlertCircle } from "lucide-react"
import { parseISO } from "date-fns"

interface FlightData {
  ident: string
  operator: string
  flight_number: string
  registration: string
  type: string
  status: string
  origin: {
    code: string
    city: string
    name: string
    terminal?: string
    gate?: string
  }
  destination: {
    code: string
    city: string
    name: string
    terminal?: string
    gate?: string
  }
  scheduled_out: string
  scheduled_in: string
  estimated_out: string
  estimated_in: string
  actual_out: string
  actual_in: string
  progress_percent: number
  actual_altitude: number
  actual_groundspeed: number
}

interface AviationstackFlight {
  flight: {
    iata: string
    number: string
  }
  airline: {
    name: string
  }
  aircraft?: {
    registration?: string
    icao?: string
  }
  flight_status: string
  departure: {
    iata: string
    airport: string
    timezone: string
    terminal?: string
    gate?: string
    scheduled?: string
    estimated?: string
    actual?: string
  }
  arrival: {
    iata: string
    airport: string
    timezone: string
    terminal?: string
    gate?: string
    scheduled?: string
    estimated?: string
    actual?: string
  }
  live?: {
    altitude?: number
    speed_horizontal?: number
  }
}

export function FlightTracker() {
  const [activeTab, setActiveTab] = useState("flight-number")
  const [flightNumber, setFlightNumber] = useState("")
  const [departureAirport, setDepartureAirport] = useState("")
  const [arrivalAirport, setArrivalAirport] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [flightData, setFlightData] = useState<FlightData | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function searchFlight(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    setFlightData(null)

    const apiKey = process.env.NEXT_PUBLIC_AVIATIONSTACK_API_KEY

    if (!apiKey) {
      setError("API key not configured. Please add your Aviationstack API key to the environment variables.")
      setIsLoading(false)
      return
    }

    try {
      const endpoint = "http://api.aviationstack.com/v1/flights"
      const cleanFlightNumber = flightNumber.replace(/\s+/g, "").toUpperCase()
      
      const queryParams = new URLSearchParams({
        access_key: apiKey,
      })

      if (activeTab === "flight-number" && cleanFlightNumber) {
        queryParams.append("flight_iata", cleanFlightNumber)
      } else if (activeTab === "route" && departureAirport && arrivalAirport) {
        queryParams.append("dep_iata", departureAirport.toUpperCase())
        queryParams.append("arr_iata", arrivalAirport.toUpperCase())
      } else {
        throw new Error("Please enter valid search criteria")
      }

      const response = await fetch(`${endpoint}?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }
      
      const data = await response.json()

      if (!data.data || data.data.length === 0) {
        throw new Error("No flights found matching your criteria")
      }

      // Get the most recent flight
      const flight = data.data[0]
      setFlightData({
        ident: flight.flight.iata,
        operator: flight.airline.name,
        flight_number: flight.flight.number,
        registration: flight.aircraft?.registration || "N/A",
        type: flight.aircraft?.icao || "N/A",
        status: flight.flight_status,
        origin: {
          code: flight.departure.iata,
          city: flight.departure.timezone.split('/')[1].replace('_', ' '),
          name: flight.departure.airport,
          terminal: flight.departure.terminal,
          gate: flight.departure.gate,
        },
        destination: {
          code: flight.arrival.iata,
          city: flight.arrival.timezone.split('/')[1].replace('_', ' '),
          name: flight.arrival.airport,
          terminal: flight.arrival.terminal,
          gate: flight.arrival.gate,
        },
        scheduled_out: flight.departure.scheduled,
        scheduled_in: flight.arrival.scheduled,
        estimated_out: flight.departure.estimated,
        estimated_in: flight.arrival.estimated,
        actual_out: flight.departure.actual,
        actual_in: flight.arrival.actual,
        progress_percent: calculateProgress(flight),
        actual_altitude: flight.live?.altitude || 0,
        actual_groundspeed: flight.live?.speed_horizontal || 0,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching flight data")
      console.error("Flight search error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  function calculateProgress(flight: AviationstackFlight) {
    if (!flight.departure.scheduled || !flight.arrival.scheduled) return 0
    const start = new Date(flight.departure.scheduled).getTime()
    const end = new Date(flight.arrival.scheduled).getTime()
    const now = Date.now()
    
    if (now < start) return 0
    if (now > end) return 100
    
    return Math.round(((now - start) / (end - start)) * 100)
  }

  function formatDateTime(dateTimeStr: string | null) {
    if (!dateTimeStr) return "N/A"
    try {
      const date = parseISO(dateTimeStr)
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(date)
    } catch (e) {
      console.error("Date formatting error:", e)
      return "N/A"
    }
  }

  function getStatusColor(status: string) {
    switch (status?.toLowerCase()) {
      case "en route":
      case "landed":
      case "arrived":
        return "text-green-500"
      case "scheduled":
        return "text-blue-500"
      case "delayed":
        return "text-yellow-500"
      case "cancelled":
      case "diverted":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Flight Tracker</CardTitle>
          <CardDescription>Track real-time flight status by flight number or route</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="flight-number">By Flight Number</TabsTrigger>
              <TabsTrigger value="route">By Route</TabsTrigger>
            </TabsList>

            <TabsContent value="flight-number" className="space-y-4 mt-4">
              <form onSubmit={searchFlight} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="flight-number">Flight Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="flight-number"
                      placeholder="e.g. AA123, UA456"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !flightNumber}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="route" className="space-y-4 mt-4">
              <form onSubmit={searchFlight} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="departure-airport">Departure Airport (IATA Code)</Label>
                  <Input
                    id="departure-airport"
                    placeholder="e.g. JFK, LAX"
                    value={departureAirport}
                    onChange={(e) => setDepartureAirport(e.target.value)}
                    maxLength={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arrival-airport">Arrival Airport (IATA Code)</Label>
                  <Input
                    id="arrival-airport"
                    placeholder="e.g. LHR, SFO"
                    value={arrivalAirport}
                    onChange={(e) => setArrivalAirport(e.target.value)}
                    maxLength={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || !departureAirport || !arrivalAirport}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    "Search Flights"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Flight Information</CardTitle>
          <CardDescription>View detailed flight status and information</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Searching for flight information...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
                <p className="mt-2 text-red-500">{error}</p>
                <p className="mt-2 text-sm text-muted-foreground">Please try another search.</p>
              </div>
            </div>
          ) : flightData ? (
            <div className="space-y-6">
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Flight</p>
                    <p className="text-xl font-bold">{flightData.ident}</p>
                    <p className="text-sm">{flightData.operator}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className={`text-lg font-medium ${getStatusColor(flightData.status)}`}>
                      {flightData.status?.charAt(0).toUpperCase() + flightData.status?.slice(1) || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="text-left">
                    <p className="text-2xl font-bold">
                      {formatDateTime(flightData.actual_out || flightData.estimated_out || flightData.scheduled_out)}
                    </p>
                    <p className="text-lg font-medium">{flightData.origin.code}</p>
                    <p className="text-sm text-muted-foreground">{flightData.origin.city}</p>
                  </div>
                  <div className="flex flex-col items-center px-4">
                    <Plane className="h-5 w-5 rotate-90 text-primary" />
                    <div className="relative h-0.5 w-16 bg-muted my-2">
                      {flightData.status.toLowerCase() === "en route" && (
                        <div
                          className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                          style={{ width: `${flightData.progress_percent}%` }}
                        />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Direct</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {formatDateTime(flightData.actual_in || flightData.estimated_in || flightData.scheduled_in)}
                    </p>
                    <p className="text-lg font-medium">{flightData.destination.code}</p>
                    <p className="text-sm text-muted-foreground">{flightData.destination.city}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-md border p-3">
                  <p className="text-sm text-muted-foreground">Terminal</p>
                  <p className="font-medium">{flightData.origin.terminal || "N/A"}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-sm text-muted-foreground">Gate</p>
                  <p className="font-medium">{flightData.origin.gate || "N/A"}</p>
                </div>
              </div>

              {flightData.status.toLowerCase() === "en route" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md border p-3">
                    <p className="text-sm text-muted-foreground">Altitude</p>
                    <p className="font-medium">{flightData.actual_altitude.toLocaleString()} ft</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-sm text-muted-foreground">Ground Speed</p>
                    <p className="font-medium">{flightData.actual_groundspeed.toLocaleString()} kts</p>
                  </div>
                </div>
              )}

              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Aircraft</p>
                <p className="font-medium">
                  {flightData.registration ? `${flightData.type} (${flightData.registration})` : flightData.type || "N/A"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <Plane className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Search for a flight to see information</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 