"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Camera, Clock, Info, Play, Video } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme-context"

interface Equipment {
  id: string
  name: string
  checked: boolean
  required: boolean
}

export function ChallengePrepScreen() {
  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: "basketball", name: "Basketball", checked: false, required: true },
    { id: "court", name: "Basketball court with 3-point line", checked: false, required: true },
    { id: "phone", name: "Smartphone with camera", checked: false, required: true },
    { id: "water", name: "Water bottle", checked: false, required: false },
    { id: "towel", name: "Towel", checked: false, required: false },
  ])

  const [showTutorial, setShowTutorial] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const theme = useTheme()

  const toggleEquipment = (id: string) => {
    setEquipment(equipment.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  const allRequiredChecked = equipment.filter((item) => item.required).every((item) => item.checked)

  const startCountdown = () => {
    setCountdown(3)
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval)
          // Navigate to challenge recording screen
          return null
        }
        return prev ? prev - 1 : null
      })
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f13]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#1a1a22] p-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Link href="/challenge-details">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-[#0f0f13]/50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-poppins text-xl font-bold">Challenge Prep</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Challenge Info */}
          <Card className="bg-[#1a1a22] border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-poppins text-xl font-bold">3-Point Precision</h2>
                  <p className="text-gray-300">Master the art of 3-point shooting</p>
                </div>
                <Badge className={`bg-[${theme.colors.primary}]`}>Basketball</Badge>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">15 minutes</span>
                </div>
                <div className="h-4 w-px bg-[#0f0f13]"></div>
                <Badge
                  variant="outline"
                  className={`border-[${theme.colors.secondary}] text-[${theme.colors.secondary}]`}
                >
                  Intermediate
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Equipment Checklist */}
          <Card className="bg-[#1a1a22] border-0">
            <CardHeader>
              <CardTitle className="text-lg">Equipment Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {equipment.map((item) => (
                  <div key={item.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={item.checked}
                      onCheckedChange={() => toggleEquipment(item.id)}
                      className={`border-[${theme.colors.primary}] data-[state=checked]:bg-[${theme.colors.primary}] data-[state=checked]:border-[${theme.colors.primary}]`}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={item.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item.name}
                        {item.required && <span className={`ml-1 text-xs text-[${theme.colors.primary}]`}>*</span>}
                      </label>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-gray-400">* Required items</p>
              </div>
            </CardContent>
          </Card>

          {/* Space Requirements */}
          <Card className="bg-[#1a1a22] border-0">
            <CardHeader>
              <CardTitle className="text-lg">Space Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-[#0f0f13] p-4">
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-[#1a1a22]">
                  <div className="relative h-full w-full">
                    <div
                      className={`absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-[${theme.colors.primary}]`}
                    ></div>
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-[${theme.colors.primary}]`}></div>
                    <div
                      className={`absolute bottom-0 left-1/2 h-16 w-1 -translate-x-1/2 bg-[${theme.colors.primary}]`}
                    ></div>
                    <div
                      className={`absolute bottom-16 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full border-2 border-[${theme.colors.primary}]`}
                    ></div>
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-2">
                  <Info className={`h-5 w-5 shrink-0 text-[${theme.colors.secondary}]`} />
                  <p className="text-sm text-gray-300">
                    You'll need a basketball court with a clear view of the 3-point line. Position your camera 10-15
                    feet away to capture your full body and shooting form.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Camera Positioning */}
          <Card className="bg-[#1a1a22] border-0">
            <CardHeader>
              <CardTitle className="text-lg">Camera Positioning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-[#0f0f13] p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-lg bg-[#1a1a22]">
                      <div
                        className={`absolute left-1/2 top-1/2 h-16 w-8 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-[${theme.colors.primary}]`}
                      ></div>
                      <div className="absolute bottom-4 left-1/2 h-4 w-16 -translate-x-1/2 rounded-sm bg-gray-700"></div>
                      <div
                        className={`absolute bottom-1/4 right-1/4 flex h-8 w-8 items-center justify-center rounded-full bg-[${theme.colors.primary}]`}
                      >
                        <Camera className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`border-[${theme.colors.primary}] text-[${theme.colors.primary}]`}
                    >
                      Incorrect
                    </Badge>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-lg bg-[#1a1a22]">
                      <div
                        className={`absolute left-1/2 top-1/2 h-16 w-8 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-[${theme.colors.secondary}]`}
                      ></div>
                      <div className="absolute bottom-4 left-1/2 h-4 w-16 -translate-x-1/2 rounded-sm bg-gray-700"></div>
                      <div
                        className={`absolute bottom-1/2 right-1/4 flex h-8 w-8 items-center justify-center rounded-full bg-[${theme.colors.secondary}]`}
                      >
                        <Camera className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <Badge className={`bg-[${theme.colors.secondary}]`}>Correct</Badge>
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-2">
                  <Info className={`h-5 w-5 shrink-0 text-[${theme.colors.secondary}]`} />
                  <p className="text-sm text-gray-300">
                    Position your camera at chest height, with a clear view of both you and the basket. Make sure your
                    entire body is visible when shooting.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tutorial Video */}
          <Card className="bg-[#1a1a22] border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span>Tutorial Video</span>
                <Badge variant="outline" className="font-normal border-gray-600 text-gray-400">
                  Optional
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className={`flex w-full items-center justify-center gap-2 py-6 border-[#0f0f13] bg-[#0f0f13] text-[${theme.colors.secondary}] hover:bg-[#0f0f13]/80`}
                onClick={() => setShowTutorial(true)}
              >
                <Video className={`h-6 w-6 text-[${theme.colors.secondary}]`} />
                <span>Watch Tutorial (2:15)</span>
              </Button>
              {showTutorial && (
                <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg bg-[#0f0f13]">
                  <div className="flex h-full items-center justify-center">
                    <Play className="h-12 w-12 text-white opacity-70" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="bg-[#1a1a22] border-0">
            <CardHeader>
              <CardTitle className="text-lg">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[${theme.colors.primary}] text-white`}
                  >
                    1
                  </div>
                  <span>Focus on your form rather than making every shot</span>
                </li>
                <li className="flex items-start gap-2">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[${theme.colors.primary}] text-white`}
                  >
                    2
                  </div>
                  <span>Keep your elbow in and follow through with your shot</span>
                </li>
                <li className="flex items-start gap-2">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[${theme.colors.primary}] text-white`}
                  >
                    3
                  </div>
                  <span>Use your legs to generate power, not just your arms</span>
                </li>
                <li className="flex items-start gap-2">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[${theme.colors.primary}] text-white`}
                  >
                    4
                  </div>
                  <span>Maintain a consistent release point for better accuracy</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 border-t border-[#1a1a22] bg-[#1a1a22] p-4 shadow-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Button variant="outline" className="border-[#0f0f13] bg-[#0f0f13] text-white hover:bg-[#0f0f13]/80">
            Cancel
          </Button>
          <Button
            className={`bg-[${theme.colors.primary}] px-8`}
            disabled={!allRequiredChecked}
            onClick={startCountdown}
          >
            Begin Challenge
          </Button>
        </div>
      </div>

      {/* Countdown Overlay */}
      {countdown !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div
            className={`flex h-32 w-32 items-center justify-center rounded-full bg-[${theme.colors.primary}] text-6xl font-bold text-white`}
          >
            {countdown}
          </div>
        </div>
      )}
    </div>
  )
}
