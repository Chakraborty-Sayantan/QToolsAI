"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function PNRStatusChecker() {
  const [pnr, setPnr] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [pnrStatus, setPnrStatus] = useState<any>(null)
  const { toast } = useToast()

  const checkPnrStatus = async () => {
    if (pnr.length !== 10) {
      toast({
        title: "Invalid PNR",
        description: "Please enter a valid 10-digit PNR number.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setPnrStatus(null)

    try {
      const response = await fetch('/api/pnr-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pnr }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch PNR status");
      }
      
      setPnrStatus(data)
    } catch (error) {
      console.error("Error fetching PNR status:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch PNR status. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>PNR Status Checker</CardTitle>
          <CardDescription>Check the status of your Indian Railways PNR</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pnr">Enter 10-Digit PNR</Label>
              <div className="flex gap-2">
                <Input
                  id="pnr"
                  placeholder="e.g., 1234567890"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value)}
                  maxLength={10}
                />
                <Button onClick={checkPnrStatus} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {pnrStatus && (
        <Card>
          <CardHeader>
            <CardTitle>PNR Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">PNR</p>
                  <p className="font-medium">{pnrStatus.Pnr}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Train</p>
                  <p className="font-medium">{pnrStatus.TrainName} ({pnrStatus.TrainNumber})</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-medium">{pnrStatus.From}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">To</p>
                  <p className="font-medium">{pnrStatus.To}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Boarding Date</p>
                  <p className="font-medium">{pnrStatus.JourneyDate}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium">Passenger Details</p>
                <div className="mt-2 space-y-2">
                  {pnrStatus.PassengerStatus.map((passenger: any, index: number) => (
                    <div key={index} className="flex justify-between rounded-md border p-3">
                      <p>Passenger {passenger.Passenger}</p>
                      <p>
                        {passenger.BookingStatus} / {passenger.CurrentStatus}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
