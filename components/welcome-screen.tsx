"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SportSelectionScreen } from "@/components/sport-selection-screen"
import { Trophy, Users, Zap } from "lucide-react"

export function WelcomeScreen() {
  const [showSportSelection, setShowSportSelection] = useState(false)

  if (showSportSelection) {
    return <SportSelectionScreen />
  }

  return (
    <Card className="w-full max-w-md overflow-hidden bg-white/95 shadow-xl">
      <CardContent className="p-0">
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-r from-[#5c3bfe] to-[#8667ff]">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-poppins text-3xl font-bold tracking-tight">Sportyfy</h1>
            <p className="text-lg font-medium text-white/90">Transform Your Game</p>
          </div>
          <div className="absolute -bottom-6 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        <div className="space-y-6 p-6 pt-8">
          <p className="text-center text-sm text-gray-600">
            Develop your athletic skills through structured challenges, track your progress, and compete with others
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5c3bfe]/10">
                <Trophy className="h-5 w-5 text-[#5c3bfe]" />
              </div>
              <span className="text-xs font-medium">Skill Tracking</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5c3bfe]/10">
                <Users className="h-5 w-5 text-[#5c3bfe]" />
              </div>
              <span className="text-xs font-medium">Community</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5c3bfe]/10">
                <Zap className="h-5 w-5 text-[#5c3bfe]" />
              </div>
              <span className="text-xs font-medium">Challenges</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              className="w-full bg-[#5c3bfe] hover:bg-[#4c2fe0] transition-all duration-300 transform hover:scale-[1.02]"
              onClick={() => setShowSportSelection(true)}
            >
              Sign Up
            </Button>
            <Button variant="outline" className="w-full border-[#5c3bfe] text-[#5c3bfe] hover:bg-[#5c3bfe]/5">
              Login
            </Button>
            <Button variant="ghost" className="w-full text-gray-500 hover:text-[#5c3bfe] hover:bg-[#5c3bfe]/5">
              Browse as Guest
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500">
            <span className="cursor-pointer text-[#5c3bfe] hover:underline">Learn more</span> about Sportyfy
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
