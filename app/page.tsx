"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, Timer, TimerIcon as Stopwatch, Play, Pause, RotateCcw } from "lucide-react"

export default function TimerWebsite() {
  // Timer state
  const [timerHours, setTimerHours] = useState(0)
  const [timerMinutes, setTimerMinutes] = useState(5)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerTime, setTimerTime] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [stopwatchRunning, setStopwatchRunning] = useState(false)
  const stopwatchIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Clock state
  const [currentTime, setCurrentTime] = useState(new Date())
  const clockIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Active tab state
  const [activeTab, setActiveTab] = useState("clock")

  // Format time helper
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Format time for display (with milliseconds for stopwatch)
  const formatStopwatchTime = (totalMs: number) => {
    const totalSeconds = Math.floor(totalMs / 1000)
    const ms = Math.floor((totalMs % 1000) / 10)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`
  }

  // Update document title based on active tab
  useEffect(() => {
    let title = "Timer Website"

    if (activeTab === "timer") {
      if (timerTime > 0) {
        title = `⏱️ ${formatTime(timerTime)} - Timer${timerRunning ? " (Running)" : " (Paused)"}`
      } else {
        title = `⏱️ ${formatTime(timerHours * 3600 + timerMinutes * 60 + timerSeconds)} - Timer (Set)`
      }
    } else if (activeTab === "stopwatch") {
      title = `⏰ ${formatStopwatchTime(stopwatchTime)} - Stopwatch${stopwatchRunning ? " (Running)" : ""}`
    } else if (activeTab === "clock") {
      title = `🕐 ${currentTime.toLocaleTimeString()} - Live Clock`
    }

    document.title = title
  }, [
    activeTab,
    timerTime,
    timerRunning,
    stopwatchTime,
    stopwatchRunning,
    currentTime,
    timerHours,
    timerMinutes,
    timerSeconds,
  ])

  // Timer functions
  const startTimer = () => {
    if (timerTime === 0) {
      const totalSeconds = timerHours * 3600 + timerMinutes * 60 + timerSeconds
      setTimerTime(totalSeconds)
    }

    setTimerRunning(true)
    timerIntervalRef.current = setInterval(() => {
      setTimerTime((prev) => {
        if (prev <= 1) {
          setTimerRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const pauseTimer = () => {
    setTimerRunning(false)
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
  }

  const resetTimer = () => {
    setTimerRunning(false)
    setTimerTime(0)
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
  }

  // Stopwatch functions
  const startStopwatch = () => {
    setStopwatchRunning(true)
    stopwatchIntervalRef.current = setInterval(() => {
      setStopwatchTime((prev) => prev + 10)
    }, 10)
  }

  const pauseStopwatch = () => {
    setStopwatchRunning(false)
    if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current)
    }
  }

  const resetStopwatch = () => {
    setStopwatchRunning(false)
    setStopwatchTime(0)
    if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current)
    }
  }

  // Clock effect
  useEffect(() => {
    clockIntervalRef.current = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => {
      if (clockIntervalRef.current) {
        clearInterval(clockIntervalRef.current)
      }
    }
  }, [])

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current)
      if (clockIntervalRef.current) clearInterval(clockIntervalRef.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Timer Hub</h1>
          <p className="text-gray-600">Your all-in-one timing solution</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Timer
            </TabsTrigger>
            <TabsTrigger value="stopwatch" className="flex items-center gap-2">
              <Stopwatch className="w-4 h-4" />
              Stopwatch
            </TabsTrigger>
            <TabsTrigger value="clock" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Clock
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer">
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  Countdown Timer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-mono font-bold text-blue-600 mb-4">{formatTime(timerTime)}</div>
                  {timerTime === 0 && !timerRunning && <Badge variant="secondary">Timer finished!</Badge>}
                  {timerRunning && <Badge variant="default">Running</Badge>}
                </div>

                {!timerRunning && timerTime === 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Hours</label>
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={timerHours}
                        onChange={(e) => setTimerHours(Math.max(0, Number.parseInt(e.target.value) || 0))}
                        className="text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Minutes</label>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={timerMinutes}
                        onChange={(e) => setTimerMinutes(Math.max(0, Number.parseInt(e.target.value) || 0))}
                        className="text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Seconds</label>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={timerSeconds}
                        onChange={(e) => setTimerSeconds(Math.max(0, Number.parseInt(e.target.value) || 0))}
                        className="text-center"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  {!timerRunning ? (
                    <Button onClick={startTimer} size="lg" className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Start
                    </Button>
                  ) : (
                    <Button onClick={pauseTimer} size="lg" variant="secondary" className="flex items-center gap-2">
                      <Pause className="w-4 h-4" />
                      Pause
                    </Button>
                  )}
                  <Button
                    onClick={resetTimer}
                    size="lg"
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stopwatch">
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stopwatch className="w-5 h-5" />
                  Stopwatch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-mono font-bold text-green-600 mb-4">
                    {formatStopwatchTime(stopwatchTime)}
                  </div>
                  {stopwatchRunning && <Badge variant="default">Running</Badge>}
                </div>

                <div className="flex justify-center gap-4">
                  {!stopwatchRunning ? (
                    <Button onClick={startStopwatch} size="lg" className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Start
                    </Button>
                  ) : (
                    <Button onClick={pauseStopwatch} size="lg" variant="secondary" className="flex items-center gap-2">
                      <Pause className="w-4 h-4" />
                      Pause
                    </Button>
                  )}
                  <Button
                    onClick={resetStopwatch}
                    size="lg"
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clock">
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Real-time Clock
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-mono font-bold text-purple-600 mb-2">
                    {currentTime.toLocaleTimeString()}
                  </div>
                  <div className="text-xl text-gray-600 mb-4">
                    {currentTime.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <Badge variant="secondary">{Intl.DateTimeFormat().resolvedOptions().timeZone}</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
