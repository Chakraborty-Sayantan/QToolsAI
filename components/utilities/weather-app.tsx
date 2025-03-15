"use client"

import { useState, useEffect } from "react"
import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cloud, CloudDrizzle, CloudRain, CloudSnow, Search, Sun, Loader2, CloudFog, CloudLightning, CloudSun } from "lucide-react"

interface WeatherData {
  location: string
  current: {
    temp: number
    condition: string
    icon: string
    humidity: number
    windSpeed: number
    feelsLike: number
  }
  forecast: Array<{
    date: string
    maxTemp: number
    minTemp: number
    condition: string
    icon: string
  }>
}

interface OpenWeatherForecastItem {
  dt: number
  main: {
    temp_max: number
    temp_min: number
  }
  weather: Array<{
    main: string
    icon: string
  }>
}

export function WeatherApp() {
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("today")
  const [recentLocations, setRecentLocations] = useState<string[]>([])

  // Load recent locations from localStorage on component mount
  useEffect(() => {
    const savedLocations = localStorage.getItem("recentWeatherLocations")
    if (savedLocations) {
      setRecentLocations(JSON.parse(savedLocations))
    }
  }, [])

  async function getWeatherData(searchLocation: string) {
    setIsLoading(true)
    setError(null)

    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
      const baseUrl = process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5'

      // Get current weather
      const currentResponse = await fetch(
        `${baseUrl}/weather?q=${encodeURIComponent(searchLocation)}&appid=${apiKey}&units=metric`
      )

      if (!currentResponse.ok) {
        throw new Error(currentResponse.status === 404 ? "Location not found" : "Failed to fetch weather data")
      }

      const currentData = await currentResponse.json()

      // Get 5-day forecast
      const forecastResponse = await fetch(
        `${baseUrl}/forecast?q=${encodeURIComponent(searchLocation)}&appid=${apiKey}&units=metric`
      )

      if (!forecastResponse.ok) {
        throw new Error("Failed to fetch forecast data")
      }

      const forecastData = await forecastResponse.json()

      // Process forecast data to get daily forecasts
      const dailyForecasts = forecastData.list.reduce((acc: WeatherData['forecast'], item: OpenWeatherForecastItem) => {
        const date = new Date(item.dt * 1000).toLocaleDateString()
        if (!acc.find((forecast) => new Date(forecast.date).toLocaleDateString() === date)) {
          acc.push({
            date: date,
            maxTemp: Math.round(item.main.temp_max),
            minTemp: Math.round(item.main.temp_min),
            condition: item.weather[0].main,
            icon: item.weather[0].icon
          })
        }
        return acc
      }, []).slice(0, 5)

      const weatherData = {
        location: `${currentData.name}, ${currentData.sys.country}`,
        current: {
          temp: Math.round(currentData.main.temp),
          condition: currentData.weather[0].main,
          icon: currentData.weather[0].icon,
          humidity: currentData.main.humidity,
          windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
          feelsLike: Math.round(currentData.main.feels_like)
        },
        forecast: dailyForecasts
      }

      setWeatherData(weatherData)

      // Add to recent locations if not already present
      if (!recentLocations.includes(searchLocation)) {
        const updatedLocations = [searchLocation, ...recentLocations.slice(0, 4)]
        setRecentLocations(updatedLocations)
        localStorage.setItem("recentWeatherLocations", JSON.stringify(updatedLocations))
      }
    } catch (error) {
      console.error("Error fetching weather data:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch weather data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!location) return
    getWeatherData(location)
  }

  function getWeatherIcon(iconCode: string) {
    // Map OpenWeatherMap icon codes to Lucide icons
    const iconMap: Record<string, React.ReactNode> = {
      "01d": <Sun className="h-10 w-10 text-yellow-500" />, // clear sky day
      "01n": <Sun className="h-10 w-10 text-gray-400" />, // clear sky night
      "02d": <CloudSun className="h-10 w-10 text-gray-400" />, // few clouds day
      "02n": <Cloud className="h-10 w-10 text-gray-400" />, // few clouds night
      "03d": <Cloud className="h-10 w-10 text-gray-400" />, // scattered clouds
      "03n": <Cloud className="h-10 w-10 text-gray-400" />,
      "04d": <Cloud className="h-10 w-10 text-gray-500" />, // broken clouds
      "04n": <Cloud className="h-10 w-10 text-gray-500" />,
      "09d": <CloudDrizzle className="h-10 w-10 text-blue-400" />, // shower rain
      "09n": <CloudDrizzle className="h-10 w-10 text-blue-400" />,
      "10d": <CloudRain className="h-10 w-10 text-blue-500" />, // rain
      "10n": <CloudRain className="h-10 w-10 text-blue-500" />,
      "11d": <CloudLightning className="h-10 w-10 text-purple-500" />, // thunderstorm
      "11n": <CloudLightning className="h-10 w-10 text-purple-500" />,
      "13d": <CloudSnow className="h-10 w-10 text-blue-200" />, // snow
      "13n": <CloudSnow className="h-10 w-10 text-blue-200" />,
      "50d": <CloudFog className="h-10 w-10 text-gray-300" />, // mist
      "50n": <CloudFog className="h-10 w-10 text-gray-300" />
    }

    return iconMap[iconCode] || <Cloud className="h-10 w-10 text-gray-400" />
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Weather Search</CardTitle>
          <CardDescription>Enter a location to check the weather</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Enter city name (e.g. London, GB)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !location}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </form>

          {recentLocations.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Recent Searches</p>
              <div className="flex flex-wrap gap-2">
                {recentLocations.map((loc, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLocation(loc)
                      getWeatherData(loc)
                    }}
                  >
                    {loc}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="flex h-64 items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Fetching weather data...</p>
            </div>
          </CardContent>
        </Card>
      ) : weatherData ? (
        <Card>
          <CardHeader>
            <CardTitle>{weatherData.location}</CardTitle>
            <CardDescription>Current weather and forecast</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="forecast">5-Day Forecast</TabsTrigger>
              </TabsList>
              <TabsContent value="today" className="space-y-4">
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getWeatherIcon(weatherData.current.icon)}
                    <div>
                      <div className="text-3xl font-bold">{weatherData.current.temp}°C</div>
                      <div className="text-muted-foreground">{weatherData.current.condition}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm">
                      Feels like: <span className="font-medium">{weatherData.current.feelsLike}°C</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 rounded-md border p-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Humidity</div>
                    <div className="text-xl font-medium">{weatherData.current.humidity}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Wind</div>
                    <div className="text-xl font-medium">{weatherData.current.windSpeed} km/h</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Feels Like</div>
                    <div className="text-xl font-medium">{weatherData.current.feelsLike}°C</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="forecast">
                <div className="mt-4 space-y-2">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center gap-3">
                        {getWeatherIcon(day.icon)}
                        <div>
                          <div className="font-medium">{day.date}</div>
                          <div className="text-sm text-muted-foreground">{day.condition}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{day.maxTemp}°C</div>
                        <div className="text-sm text-muted-foreground">{day.minTemp}°C</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Weather Information</CardTitle>
            <CardDescription>Search for a location to see weather details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 w-full items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <Cloud className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Weather information will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

