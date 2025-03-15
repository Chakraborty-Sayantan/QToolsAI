"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, LinkIcon, Mail, Phone, Smartphone, Text, Loader2 } from "lucide-react"

export function QRCodeGenerator() {
  const [activeTab, setActiveTab] = useState("url")
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")
  const [email, setEmail] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [phone, setPhone] = useState("")
  const [qrSize, setQrSize] = useState("200")
  const [qrColor, setQrColor] = useState("#000000")
  const [qrBgColor, setQrBgColor] = useState("#FFFFFF")
  const [qrData, setQrData] = useState("")
  const [qrImageUrl, setQrImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function generateQRCode() {
    let data = ""

    switch (activeTab) {
      case "url":
        if (!url) {
          setError("Please enter a URL")
          return
        }
        data = url.startsWith("http") ? url : `https://${url}`
        break
      case "text":
        if (!text) {
          setError("Please enter some text")
          return
        }
        data = text
        break
      case "email":
        if (!email) {
          setError("Please enter an email address")
          return
        }
        data = `mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
        break
      case "phone":
        if (!phone) {
          setError("Please enter a phone number")
          return
        }
        data = `tel:${phone}`
        break
      default:
        data = ""
    }

    if (!data) return

    setError(null)
    setIsLoading(true)
    setQrData(data)

    // Use GoQR.me API to generate QR code
    const apiUrl = process.env.NEXT_PUBLIC_GOQR_API_URL || 'https://api.qrserver.com/v1/create-qr-code'
    const qrCodeUrl = `${apiUrl}/?data=${encodeURIComponent(data)}&size=${qrSize}x${qrSize}&color=${qrColor.substring(1)}&bgcolor=${qrBgColor.substring(1)}`
    
    setQrImageUrl(qrCodeUrl)
    setIsLoading(false)
  }

  function downloadQRCode() {
    if (!qrImageUrl) return

    const link = document.createElement("a")
    link.href = qrImageUrl
    link.download = "qrcode.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
          <CardDescription>Create QR codes for various purposes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="url" className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                <span className="hidden sm:inline">URL</span>
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-1">
                <Text className="h-4 w-4" />
                <span className="hidden sm:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Email</span>
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Phone</span>
              </TabsTrigger>
            </TabsList>
            <div className="mt-4 space-y-4">
              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text">Text Content</Label>
                  <Input
                    id="text"
                    placeholder="Enter your text here"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    placeholder="Email subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-body">Body</Label>
                  <Input
                    id="email-body"
                    placeholder="Email body"
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="phone" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </TabsContent>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qr-size">QR Code Size</Label>
                  <Select value={qrSize} onValueChange={setQrSize}>
                    <SelectTrigger id="qr-size">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100×100</SelectItem>
                      <SelectItem value="200">200×200</SelectItem>
                      <SelectItem value="300">300×300</SelectItem>
                      <SelectItem value="400">400×400</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qr-color">QR Code Color</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        id="qr-color"
                        type="color"
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="h-10 w-full"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        id="qr-bg-color"
                        type="color"
                        value={qrBgColor}
                        onChange={(e) => setQrBgColor(e.target.value)}
                        className="h-10 w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={generateQRCode} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate QR Code"
            )}
          </Button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your QR Code</CardTitle>
          <CardDescription>Preview and download your generated QR code</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Generating QR code...</p>
              </div>
            </div>
          ) : qrImageUrl ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-md border p-4">
                <Image 
                  src={qrImageUrl}
                  alt="Generated QR Code" 
                  width={Number(qrSize)}
                  height={Number(qrSize)}
                  className="h-auto w-full"
                  priority
                  unoptimized
                />
              </div>
              <div className="text-sm text-muted-foreground break-all max-w-full">{qrData}</div>
              <Button onClick={downloadQRCode} variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </div>
          ) : (
            <div className="flex h-64 w-full items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <Smartphone className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Your QR code will appear here</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

