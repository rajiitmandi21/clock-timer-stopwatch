"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Timer, Target, Zap, BarChart3, Sparkles } from "lucide-react"

interface LandingPageProps {
  onStartApp: () => void
}

export function LandingPage({ onStartApp }: LandingPageProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const tools = [
    {
      id: "stopwatch",
      icon: Timer,
      title: "Precision Stopwatch",
      description: "Track time with millisecond accuracy. Perfect for workouts, races, and precise timing.",
      features: ["Lap tracking", "Export functionality", "Live tab updates"],
      color: "from-purple-500 to-purple-600",
      emoji: "⏱️",
    },
    {
      id: "timer",
      title: "Smart Timer",
      description: "Countdown timer with presets and visual progress. Great for cooking, workouts, and focus sessions.",
      features: ["Quick presets", "Circular progress", "Auto-restart option"],
      color: "from-pink-500 to-pink-600",
      emoji: "⏳",
    },
    {
      id: "clock",
      title: "World Clock",
      description: "Live time display with timezone support. Keep track of global time zones effortlessly.",
      features: ["Multiple timezones", "Click to copy", "12/24 hour format"],
      color: "from-blue-500 to-blue-600",
      emoji: "🕒",
    },
    {
      id: "countdown",
      title: "Event Countdown",
      description: "Count down to important dates and events. Never miss a deadline or celebration.",
      features: ["Smart formatting", "Sound alerts", "Live tab display"],
      color: "from-green-500 to-green-600",
      emoji: "🎯",
    },
    {
      id: "datediff",
      title: "Date Calculator",
      description: "Calculate differences between dates with smart formatting and quick calculations.",
      features: ["Smart output", "Quick buttons", "Include/exclude options"],
      color: "from-orange-500 to-orange-600",
      emoji: "📅",
    },
    {
      id: "pomodoro",
      title: "Pomodoro Focus",
      description: "Boost productivity with the proven Pomodoro Technique. Focus, break, repeat.",
      features: ["Custom durations", "Progress tracking", "Daily statistics"],
      color: "from-red-500 to-red-600",
      emoji: "🍅",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 dark:from-purple-900/30 dark:to-pink-900/30" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="text-4xl">⚡</div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ChronoChaos
            </h1>
          </div>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            The ultimate productivity suite for time management. Six powerful tools in one beautiful, lightning-fast
            application.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <Button
              onClick={onStartApp}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Launch ChronoChaos
            </Button>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              100% Free • No Signup Required
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">6</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Productivity Tools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">0ms</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Load Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">∞</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Usage Limit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need for Time Management</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From precise timing to productivity tracking, ChronoChaos has every tool you need to master your time and
            boost your productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const IconComponent = tool.icon || (() => <div className="text-2xl">{tool.emoji}</div>)

            return (
              <Card
                key={tool.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                  hoveredCard === tool.id ? "ring-2 ring-purple-500" : ""
                }`}
                onMouseEnter={() => setHoveredCard(tool.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-5`} />
                <CardHeader className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    {tool.icon ? (
                      <IconComponent className="w-6 h-6 text-purple-600" />
                    ) : (
                      <div className="text-2xl">{tool.emoji}</div>
                    )}
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600 dark:text-gray-400">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-2">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why ChronoChaos?</h2>
            <p className="text-gray-600 dark:text-gray-400">Built for productivity enthusiasts who demand the best</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Instant load times and smooth animations for seamless productivity
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold mb-2">Smart Analytics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track your productivity patterns and optimize your workflow
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Precision Timing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Millisecond accuracy for professional timing requirements
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Beautiful Design</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Thoughtfully crafted interface that's both powerful and elegant
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Master Your Time?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Join thousands of productivity enthusiasts who've transformed their workflow with ChronoChaos. Start your
          journey to better time management today.
        </p>

        <Button
          onClick={onStartApp}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg"
        >
          <Timer className="w-5 h-5 mr-2" />
          Start Using ChronoChaos
        </Button>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          No installation required • Works offline • Privacy focused
        </p>
      </div>
    </div>
  )
}
