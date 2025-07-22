"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Timer, Clock, Target, Calendar, Play, Pause, RotateCcw, Zap, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

// Tool types
type Tool = "stopwatch" | "timer" | "clock" | "countdown" | "datediff" | "pomodoro"

export default function ChronoChaos() {
  // Global state
  const [activeTab, setActiveTab] = useState<Tool>("clock")
  const [darkMode, setDarkMode] = useState(false)

  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [stopwatchRunning, setStopwatchRunning] = useState(false)
  const [laps, setLaps] = useState<number[]>([])
  const stopwatchIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Timer state
  const [timerTime, setTimerTime] = useState(0)
  const [timerOriginal, setTimerOriginal] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerInput, setTimerInput] = useState({ minutes: 5, seconds: 0 })
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Clock state
  const [currentTime, setCurrentTime] = useState(new Date())
  const [is24Hour, setIs24Hour] = useState(true)
  const [selectedTimezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const clockIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Common timezones list
  const commonTimezones = [
    { value: "America/New_York", label: "New York (EST/EDT)" },
    { value: "America/Chicago", label: "Chicago (CST/CDT)" },
    { value: "America/Denver", label: "Denver (MST/MDT)" },
    { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)" },
    { value: "Europe/London", label: "London (GMT/BST)" },
    { value: "Europe/Paris", label: "Paris (CET/CEST)" },
    { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Asia/Shanghai", label: "Shanghai (CST)" },
    { value: "Asia/Kolkata", label: "Mumbai (IST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
    { value: "Pacific/Auckland", label: "Auckland (NZST/NZDT)" },
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  ]

  // Countdown state
  const [countdownTarget, setCountdownTargetState] = useState<Date | null>(null)
  const [countdownTime, setCountdownTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Date diff state
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [dateDiff, setDateDiff] = useState<string>("")

  // Pomodoro state
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60) // 25 minutes in seconds
  const [pomodoroOriginal, setPomodoroOriginal] = useState(25 * 60)
  const [pomodoroRunning, setPomodoroRunning] = useState(false)
  const [pomodoroMode, setPomodoroMode] = useState<"focus" | "break">("focus")
  const [pomodoroSession, setPomodoroSession] = useState(1)
  const [pomodoroSettings, setPomodoroSettings] = useState({
    focusDuration: 25,
    breakDuration: 5,
    soundEnabled: true,
    notificationsEnabled: true,
  })
  const pomodoroIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Format helpers
  const formatStopwatchTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const centiseconds = Math.floor((ms % 1000) / 10)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`
  }

  const formatTimerTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatClockTime = (date: Date) => {
    return is24Hour
      ? date.toLocaleTimeString("en-US", { hour12: false, timeZone: selectedTimezone })
      : date.toLocaleTimeString("en-US", { hour12: true, timeZone: selectedTimezone })
  }

  const getTimezoneDisplayName = (timezone: string) => {
    const found = commonTimezones.find((tz) => tz.value === timezone)
    return found ? found.label : timezone
  }

  const formatPomodoroTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getPomodoroProgressIcon = (seconds: number, total: number) => {
    const progress = (total - seconds) / total
    if (progress < 0.125) return "○"
    if (progress < 0.25) return "◔"
    if (progress < 0.375) return "◑"
    if (progress < 0.5) return "◕"
    if (progress < 0.625) return "●"
    if (progress < 0.75) return "◕"
    if (progress < 0.875) return "◑"
    if (progress < 1) return "◔"
    return "●"
  }

  // Update document title and favicon based on active tab only
  useEffect(() => {
    let title = "ChronoChaos"
    let favicon = "⚡"

    switch (activeTab) {
      case "stopwatch":
        if (stopwatchRunning) {
          title = `⏱️ ${formatStopwatchTime(stopwatchTime)} - Stopwatch`
          favicon = "⏱️"
        } else {
          title = `⏱️ ${formatStopwatchTime(stopwatchTime)} - Stopwatch (Paused)`
          favicon = "⏱️"
        }
        break
      case "timer":
        if (timerRunning && timerTime > 0) {
          title = `⏳ ${formatTimerTime(timerTime)} left - Timer`
          favicon = "⏳"
        } else {
          title = `⏳ Timer`
          favicon = "⏳"
        }
        break
      case "clock":
        title = `🕒 ${formatClockTime(currentTime)} - Live Clock`
        favicon = "🕒"
        break
      case "countdown":
        if (countdownTarget) {
          title = `🎯 ${countdownTime.days}d ${countdownTime.hours}h ${countdownTime.minutes}m - Countdown`
          favicon = "🎯"
        } else {
          title = `🎯 Countdown`
          favicon = "🎯"
        }
        break
      case "datediff":
        title = `📅 Date Difference`
        favicon = "📅"
        break
      case "pomodoro":
        if (pomodoroRunning) {
          const progressIcon = getPomodoroProgressIcon(pomodoroTime, pomodoroOriginal)
          const modeText = pomodoroMode === "focus" ? "Focus" : "Break"
          title = `${progressIcon} ${modeText} | ${formatPomodoroTime(pomodoroTime)}`
          favicon = pomodoroMode === "focus" ? "🍅" : "☕"
        } else if (pomodoroTime === 0) {
          title = `● Done! - Pomodoro`
          favicon = "✅"
        } else {
          title = `🍅 Pomodoro`
          favicon = "🍅"
        }
        break
    }

    document.title = title

    // Update favicon
    const link = (document.querySelector("link[rel*='icon']") as HTMLLinkElement) || document.createElement("link")
    link.type = "image/svg+xml"
    link.rel = "shortcut icon"
    link.href = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" fontSize="90">${favicon}</text></svg>`
    document.getElementsByTagName("head")[0].appendChild(link)
  }, [
    activeTab,
    stopwatchTime,
    stopwatchRunning,
    timerTime,
    timerRunning,
    currentTime,
    countdownTime,
    countdownTarget,
    selectedTimezone,
    pomodoroTime,
    pomodoroRunning,
    pomodoroMode,
    pomodoroOriginal,
  ])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return

      switch (e.key.toLowerCase()) {
        case "s":
          e.preventDefault()
          if (activeTab === "stopwatch") {
            stopwatchRunning ? pauseStopwatch() : startStopwatch()
          } else if (activeTab === "timer") {
            timerRunning ? pauseTimer() : startTimer()
          }
          break
        case "r":
          e.preventDefault()
          if (activeTab === "stopwatch") resetStopwatch()
          else if (activeTab === "timer") resetTimer()
          break
        case "l":
          e.preventDefault()
          if (activeTab === "stopwatch" && stopwatchRunning) addLap()
          break
        case "arrowleft":
          e.preventDefault()
          navigateTab(-1)
          break
        case "arrowright":
          e.preventDefault()
          navigateTab(1)
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [activeTab, stopwatchRunning, timerRunning])

  const navigateTab = (direction: number) => {
    const tools: Tool[] = ["stopwatch", "timer", "clock", "countdown", "datediff", "pomodoro"]
    const currentIndex = tools.indexOf(activeTab)
    const newIndex = (currentIndex + direction + tools.length) % tools.length
    setActiveTab(tools[newIndex])
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
    setLaps([])
    if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current)
    }
  }

  const addLap = () => {
    if (stopwatchRunning) {
      setLaps((prev) => [...prev, stopwatchTime])
    }
  }

  // Timer functions
  const startTimer = () => {
    if (timerTime === 0) {
      const totalSeconds = timerInput.minutes * 60 + timerInput.seconds
      setTimerTime(totalSeconds)
      setTimerOriginal(totalSeconds)
    }

    setTimerRunning(true)
    timerIntervalRef.current = setInterval(() => {
      setTimerTime((prev) => {
        if (prev <= 1) {
          setTimerRunning(false)
          // Timer finished - could add notification here
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
    setTimerOriginal(0)
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
  }

  const setQuickTimer = (minutes: number) => {
    setTimerInput({ minutes, seconds: 0 })
    setTimerTime(0)
    setTimerOriginal(0)
    setTimerRunning(false)
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
  }

  // Pomodoro functions
  const startPomodoro = () => {
    setPomodoroRunning(true)
    pomodoroIntervalRef.current = setInterval(() => {
      setPomodoroTime((prev) => {
        if (prev <= 1) {
          // Session completed
          setPomodoroRunning(false)
          handlePomodoroComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const pausePomodoro = () => {
    setPomodoroRunning(false)
    if (pomodoroIntervalRef.current) {
      clearInterval(pomodoroIntervalRef.current)
    }
  }

  const resetPomodoro = () => {
    setPomodoroRunning(false)
    setPomodoroMode("focus")
    setPomodoroSession(1)
    const focusTime = pomodoroSettings.focusDuration * 60
    setPomodoroTime(focusTime)
    setPomodoroOriginal(focusTime)
    if (pomodoroIntervalRef.current) {
      clearInterval(pomodoroIntervalRef.current)
    }
  }

  const handlePomodoroComplete = () => {
    // Play sound if enabled
    if (pomodoroSettings.soundEnabled) {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = pomodoroMode === "focus" ? 800 : 600
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 1)
    }

    // Vibrate if supported
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200])
    }

    // Show notification if enabled and permitted
    if (pomodoroSettings.notificationsEnabled && "Notification" in window && Notification.permission === "granted") {
      const modeText = pomodoroMode === "focus" ? "Focus" : "Break"
      new Notification(`${modeText} session completed!`, {
        body: pomodoroMode === "focus" ? "Time for a break!" : "Ready for the next focus session?",
        icon: pomodoroMode === "focus" ? "☕" : "🍅",
      })
    }

    // Auto-switch to next mode
    setTimeout(() => {
      if (pomodoroMode === "focus") {
        // Switch to break
        setPomodoroMode("break")
        const breakTime = pomodoroSettings.breakDuration * 60
        setPomodoroTime(breakTime)
        setPomodoroOriginal(breakTime)
      } else {
        // Switch to focus and increment session
        setPomodoroMode("focus")
        setPomodoroSession((prev) => prev + 1)
        const focusTime = pomodoroSettings.focusDuration * 60
        setPomodoroTime(focusTime)
        setPomodoroOriginal(focusTime)
      }
    }, 1000)
  }

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission()
      setPomodoroSettings((prev) => ({ ...prev, notificationsEnabled: permission === "granted" }))
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
  }, [selectedTimezone])

  // Countdown functions
  const setCountdownTarget = (dateString: string) => {
    const target = new Date(dateString)
    if (!isNaN(target.getTime())) {
      setCountdownTargetState(target)
    }
  }

  useEffect(() => {
    if (countdownTarget) {
      countdownIntervalRef.current = setInterval(() => {
        const now = new Date().getTime()
        const target = countdownTarget.getTime()
        const difference = target - now

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((difference % (1000 * 60)) / 1000)

          setCountdownTime({ days, hours, minutes, seconds })
        } else {
          setCountdownTime({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        }
      }, 1000)
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [countdownTarget])

  // Date difference calculation
  useEffect(() => {
    if (dateFrom && dateTo) {
      const from = new Date(dateFrom)
      const to = new Date(dateTo)

      if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
        const diffTime = Math.abs(to.getTime() - from.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          setDateDiff("1 day")
        } else if (diffDays < 7) {
          setDateDiff(`${diffDays} days`)
        } else if (diffDays < 30) {
          const weeks = Math.floor(diffDays / 7)
          const remainingDays = diffDays % 7
          setDateDiff(
            `${weeks} week${weeks > 1 ? "s" : ""}${remainingDays > 0 ? ` and ${remainingDays} day${remainingDays > 1 ? "s" : ""}` : ""}`,
          )
        } else {
          const months = Math.floor(diffDays / 30)
          const remainingDays = diffDays % 30
          setDateDiff(
            `${months} month${months > 1 ? "s" : ""}${remainingDays > 0 ? ` and ${remainingDays} day${remainingDays > 1 ? "s" : ""}` : ""}`,
          )
        }
      }
    }
  }, [dateFrom, dateTo])

  // Cleanup
  useEffect(() => {
    return () => {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current)
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
      if (clockIntervalRef.current) clearInterval(clockIntervalRef.current)
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
      if (pomodoroIntervalRef.current) clearInterval(pomodoroIntervalRef.current)
    }
  }, [])

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-200",
        darkMode
          ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
          : "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 text-slate-900",
      )}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-purple-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚡</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ChronoChaos
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDarkMode(!darkMode)} className="rounded-full">
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Tool)} className="w-full">
          {/* Desktop Tab Navigation */}
          <TabsList className="hidden lg:grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="stopwatch" className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Stopwatch
            </TabsTrigger>
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Timer
            </TabsTrigger>
            <TabsTrigger value="clock" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Clock
            </TabsTrigger>
            <TabsTrigger value="countdown" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Countdown
            </TabsTrigger>
            <TabsTrigger value="datediff" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Diff
            </TabsTrigger>
            <TabsTrigger value="pomodoro" className="flex items-center gap-2">
              <div className="text-sm">🍅</div>
              Pomodoro
            </TabsTrigger>
          </TabsList>

          {/* Stopwatch Tab */}
          <TabsContent value="stopwatch" className="mt-0">
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-center justify-center">
                  <Timer className="w-6 h-6 text-purple-600" />
                  Stopwatch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-mono font-bold text-purple-600 mb-4">
                    {formatStopwatchTime(stopwatchTime)}
                  </div>
                  {stopwatchRunning && <Badge className="bg-green-500 text-white">Running</Badge>}
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={stopwatchRunning ? pauseStopwatch : startStopwatch}
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700 min-w-[44px] h-[44px]"
                  >
                    {stopwatchRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  {stopwatchRunning && (
                    <Button
                      onClick={addLap}
                      size="lg"
                      variant="outline"
                      className="min-w-[44px] h-[44px] bg-transparent"
                    >
                      <Zap className="w-5 h-5" />
                    </Button>
                  )}
                  <Button
                    onClick={resetStopwatch}
                    size="lg"
                    variant="outline"
                    className="min-w-[44px] h-[44px] bg-transparent"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>

                {laps.length > 0 && (
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    <h3 className="font-semibold text-center">Laps</h3>
                    {laps.map((lap, index) => (
                      <div
                        key={index}
                        className="text-lg font-mono text-center py-2 bg-purple-50 dark:bg-slate-800 rounded"
                      >
                        Lap {index + 1}: {formatStopwatchTime(lap)}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timer Tab */}
          <TabsContent value="timer" className="mt-0">
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-center justify-center">
                  <Timer className="w-6 h-6 text-pink-600" />
                  Timer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-mono font-bold text-pink-600 mb-4">{formatTimerTime(timerTime)}</div>
                  {timerRunning && <Badge className="bg-green-500 text-white">Running</Badge>}
                  {timerTime === 0 && !timerRunning && timerOriginal > 0 && (
                    <Badge variant="secondary" className="text-lg">
                      Finished! 🎉
                    </Badge>
                  )}
                </div>

                {!timerRunning && timerTime === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 5, 15, 30].map((min) => (
                        <Button key={min} onClick={() => setQuickTimer(min)} variant="outline" className="h-12">
                          {min}m
                        </Button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">Minutes</label>
                        <Input
                          type="number"
                          value={timerInput.minutes}
                          onChange={(e) => setTimerInput((prev) => ({ ...prev, minutes: Number(e.target.value) || 0 }))}
                          className="text-center text-lg h-12"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Seconds</label>
                        <Input
                          type="number"
                          value={timerInput.seconds}
                          onChange={(e) => setTimerInput((prev) => ({ ...prev, seconds: Number(e.target.value) || 0 }))}
                          className="text-center text-lg h-12"
                          min="0"
                          max="59"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={timerRunning ? pauseTimer : startTimer}
                    size="lg"
                    className="bg-pink-600 hover:bg-pink-700 min-w-[44px] h-[44px]"
                    disabled={!timerRunning && timerTime === 0 && timerInput.minutes === 0 && timerInput.seconds === 0}
                  >
                    {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <Button
                    onClick={resetTimer}
                    size="lg"
                    variant="outline"
                    className="min-w-[44px] h-[44px] bg-transparent"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>

                {timerOriginal > 0 && (
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-pink-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${((timerOriginal - timerTime) / timerOriginal) * 100}%` }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clock Tab */}
          <TabsContent value="clock" className="mt-0">
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                  Live Clock
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-mono font-bold text-blue-600 mb-2">{formatClockTime(currentTime)}</div>
                  <div className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      timeZone: selectedTimezone,
                    })}
                  </div>
                  <Badge variant="secondary" className="mb-4">
                    {getTimezoneDisplayName(selectedTimezone)}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Timezone</label>
                    <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                      <SelectTrigger className="w-full h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                          {Intl.DateTimeFormat().resolvedOptions().timeZone} (Local)
                        </SelectItem>
                        {commonTimezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={() => setIs24Hour(!is24Hour)} variant="outline" className="w-full h-12 px-8">
                    Switch to {is24Hour ? "12-hour" : "24-hour"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Countdown Tab */}
          <TabsContent value="countdown" className="mt-0">
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                  Countdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {countdownTarget ? (
                  <div className="text-center">
                    <div className="text-4xl font-mono font-bold text-green-600 mb-4">
                      {countdownTime.days > 0 && (
                        <div className="text-2xl">
                          <span className="text-5xl">{countdownTime.days}</span>
                          <span className="text-lg ml-1">days</span>
                        </div>
                      )}
                      <div className="flex justify-center gap-4 mt-2">
                        <div className="text-center">
                          <div className="text-3xl">{countdownTime.hours.toString().padStart(2, "0")}</div>
                          <div className="text-xs text-gray-500">hours</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl">{countdownTime.minutes.toString().padStart(2, "0")}</div>
                          <div className="text-xs text-gray-500">minutes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl">{countdownTime.seconds.toString().padStart(2, "0")}</div>
                          <div className="text-xs text-gray-500">seconds</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Until{" "}
                      {countdownTarget.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center text-gray-500 mb-4">Set your target date & time</div>
                    <Input
                      type="datetime-local"
                      onChange={(e) => setCountdownTarget(e.target.value)}
                      className="text-center h-12 text-lg"
                    />
                  </div>
                )}

                {countdownTarget && (
                  <div className="flex justify-center">
                    <Button onClick={() => setCountdownTargetState(null)} variant="outline" className="h-12 px-8">
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Reset
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Date Difference Tab */}
          <TabsContent value="datediff" className="mt-0">
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                  Date Difference
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">From Date</label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="h-12 text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">To Date</label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="h-12 text-lg"
                    />
                  </div>
                </div>

                {dateDiff && (
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">{dateDiff}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Difference between the selected dates
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pomodoro Tab */}
          <TabsContent value="pomodoro" className="mt-0">
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-center justify-center">
                  <div className="text-xl">🍅</div>
                  Pomodoro Timer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-mono font-bold text-red-600 mb-2">
                    {formatPomodoroTime(pomodoroTime)}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge className={cn("text-white", pomodoroMode === "focus" ? "bg-red-600" : "bg-green-600")}>
                      {pomodoroMode === "focus" ? "🍅 Focus" : "☕ Break"} Session {pomodoroSession}
                    </Badge>
                    {pomodoroRunning && <Badge className="bg-blue-500 text-white">Running</Badge>}
                    {pomodoroTime === 0 && !pomodoroRunning && (
                      <Badge variant="secondary" className="text-lg">
                        Session Complete! 🎉
                      </Badge>
                    )}
                  </div>
                </div>

                {!pomodoroRunning && pomodoroTime > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Focus Duration (min)</label>
                        <Input
                          type="number"
                          value={pomodoroSettings.focusDuration}
                          onChange={(e) => {
                            const value = Number(e.target.value) || 25
                            setPomodoroSettings((prev) => ({ ...prev, focusDuration: value }))
                            if (pomodoroMode === "focus") {
                              const newTime = value * 60
                              setPomodoroTime(newTime)
                              setPomodoroOriginal(newTime)
                            }
                          }}
                          className="text-center h-12"
                          min="1"
                          max="60"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Break Duration (min)</label>
                        <Input
                          type="number"
                          value={pomodoroSettings.breakDuration}
                          onChange={(e) => {
                            const value = Number(e.target.value) || 5
                            setPomodoroSettings((prev) => ({ ...prev, breakDuration: value }))
                            if (pomodoroMode === "break") {
                              const newTime = value * 60
                              setPomodoroTime(newTime)
                              setPomodoroOriginal(newTime)
                            }
                          }}
                          className="text-center h-12"
                          min="1"
                          max="30"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Sound Notifications</label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPomodoroSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                        >
                          {pomodoroSettings.soundEnabled ? "🔊 On" : "🔇 Off"}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Browser Notifications</label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (pomodoroSettings.notificationsEnabled) {
                              setPomodoroSettings((prev) => ({ ...prev, notificationsEnabled: false }))
                            } else {
                              requestNotificationPermission()
                            }
                          }}
                        >
                          {pomodoroSettings.notificationsEnabled ? "🔔 On" : "🔕 Off"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={pomodoroRunning ? pausePomodoro : startPomodoro}
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 min-w-[44px] h-[44px]"
                    disabled={pomodoroTime === 0}
                  >
                    {pomodoroRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <Button
                    onClick={resetPomodoro}
                    size="lg"
                    variant="outline"
                    className="min-w-[44px] h-[44px] bg-transparent"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>

                {pomodoroOriginal > 0 && (
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className={cn(
                        "h-3 rounded-full transition-all duration-1000",
                        pomodoroMode === "focus" ? "bg-red-600" : "bg-green-600",
                      )}
                      style={{ width: `${((pomodoroOriginal - pomodoroTime) / pomodoroOriginal) * 100}%` }}
                    />
                  </div>
                )}

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    Focus for {pomodoroSettings.focusDuration} minutes, then take a {pomodoroSettings.breakDuration}
                    -minute break.
                  </p>
                  <p className="mt-1">Stay productive with the Pomodoro Technique! 🍅</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mobile Bottom Navigation */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-200 dark:border-slate-700">
            <TabsList className="grid w-full grid-cols-6 h-16 bg-transparent">
              <TabsTrigger
                value="stopwatch"
                className="flex-col gap-1 h-full data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/50"
              >
                <Timer className="w-4 h-4" />
                <span className="text-xs">Stopwatch</span>
              </TabsTrigger>
              <TabsTrigger
                value="timer"
                className="flex-col gap-1 h-full data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/50"
              >
                <Timer className="w-4 h-4" />
                <span className="text-xs">Timer</span>
              </TabsTrigger>
              <TabsTrigger
                value="clock"
                className="flex-col gap-1 h-full data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/50"
              >
                <Clock className="w-4 h-4" />
                <span className="text-xs">Clock</span>
              </TabsTrigger>
              <TabsTrigger
                value="countdown"
                className="flex-col gap-1 h-full data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900/50"
              >
                <Target className="w-4 h-4" />
                <span className="text-xs">Countdown</span>
              </TabsTrigger>
              <TabsTrigger
                value="datediff"
                className="flex-col gap-1 h-full data-[state=active]:bg-orange-100 dark:data-[state=active]:bg-orange-900/50"
              >
                <Calendar className="w-4 h-4" />
                <span className="text-xs">Date Diff</span>
              </TabsTrigger>
              <TabsTrigger
                value="pomodoro"
                className="flex-col gap-1 h-full data-[state=active]:bg-red-100 dark:data-[state=active]:bg-red-900/50"
              >
                <div className="text-sm">🍅</div>
                <span className="text-xs">Pomodoro</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>

      {/* Keyboard Shortcuts Help (Desktop) */}
      <div className="hidden lg:block fixed bottom-4 right-4">
        <Card className="p-3 text-xs text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="space-y-1">
            <div>
              <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-xs">S</kbd> Start/Stop
            </div>
            <div>
              <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-xs">R</kbd> Reset
            </div>
            <div>
              <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-xs">L</kbd> Lap
            </div>
            <div>
              <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-xs">←→</kbd> Navigate
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
