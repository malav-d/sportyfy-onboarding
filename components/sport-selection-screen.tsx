"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProfileCreationScreen } from "@/components/profile-creation-screen"
import {
  ArrowLeft,
  ShoppingBasketIcon as Basketball,
  Dumbbell,
  MonitorIcon as Running,
  TurtleIcon as Tennis,
  VibrateIcon as Volleyball,
} from "lucide-react"

interface SportOption {
  id: string
  name: string
  icon: React.ReactNode
  selected: boolean
}

export function SportSelectionScreen() {
  const [showProfileCreation, setShowProfileCreation] = useState(false)
  const [sports, setSports] = useState<SportOption[]>([
    { id: "basketball", name: "Basketball", icon: <Basketball className="h-6 w-6" />, selected: false },
    { id: "soccer", name: "Soccer", icon: <Running className="h-6 w-6" />, selected: false },
    { id: "fitness", name: "Fitness", icon: <Dumbbell className="h-6 w-6" />, selected: false },
    { id: "tennis", name: "Tennis", icon: <Tennis className="h-6 w-6" />, selected: false },
    { id: "volleyball", name: "Volleyball", icon: <Volleyball className="h-6 w-6" />, selected: false },
    { id: "running", name: "Running", icon: <Running className="h-6 w-6" />, selected: false },
  ])

  if (showProfileCreation) {
    const selectedSports = sports.filter((sport) => sport.selected).map((sport) => sport.name)
    return <ProfileCreationScreen selectedSports={selectedSports} />
  }

  const toggleSport = (id: string) => {
    const selectedCount = sports.filter((sport) => sport.selected).length
    setSports(
      sports.map((sport) => {
        if (sport.id === id) {
          // If already selected, toggle off
          if (sport.selected) {
            return { ...sport, selected: false }
          }
          // If not selected and less than 3 sports are selected, toggle on
          if (selectedCount < 3) {
            return { ...sport, selected: true }
          }
        }
        return sport
      }),
    )
  }

  const selectedCount = sports.filter((sport) => sport.selected).length
  const canContinue = selectedCount > 0

  return (
    <Card className="w-full max-w-md overflow-hidden bg-white/95 shadow-xl">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-poppins text-xl font-bold">Select Your Sports</h2>
              <div className="text-xs text-gray-500">Step 1 of 3</div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-1/3 bg-[#5c3bfe]"></div>
            </div>
          </div>
        </div>

        <p className="mb-4 text-sm text-gray-600">Choose up to 3 sports to focus on</p>

        <div className="mb-6 grid grid-cols-2 gap-3">
          {sports.map((sport) => (
            <div
              key={sport.id}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-4 transition-all duration-200 ${
                sport.selected ? "border-[#5c3bfe] bg-[#5c3bfe]/5" : "border-gray-200 hover:border-[#5c3bfe]/50"
              }`}
              onClick={() => toggleSport(sport.id)}
            >
              <div
                className={`mb-2 flex h-14 w-14 items-center justify-center rounded-full ${
                  sport.selected ? "bg-[#5c3bfe] text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {sport.icon}
              </div>
              <span className="text-sm font-medium">{sport.name}</span>
              {sport.selected && (
                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#5c3bfe] text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" className="border-gray-200 text-gray-600">
            Back
          </Button>
          <Button
            className="bg-[#5c3bfe] hover:bg-[#4c2fe0]"
            disabled={!canContinue}
            onClick={() => setShowProfileCreation(true)}
          >
            Continue
          </Button>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          <span className="font-medium text-[#5c3bfe]">{selectedCount}/3</span> sports selected
        </div>
      </CardContent>
    </Card>
  )
}
