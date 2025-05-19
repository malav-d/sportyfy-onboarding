"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useInView } from "react-intersection-observer"

export function SportsSection() {
  const [activeSport, setActiveSport] = useState("basketball")
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const sports = [
    {
      id: "basketball",
      name: "Basketball",
      icon: "🏀",
      available: true,
      challenges: ["Free Throw Mastery", "3-Point Precision", "Dribbling Skills"],
    },
    {
      id: "soccer",
      name: "Soccer",
      icon: "⚽",
      available: true,
      challenges: ["Penalty Kick Accuracy", "Ball Control", "Passing Precision"],
    },
    {
      id: "fitness",
      name: "Fitness",
      icon: "💪",
      available: true,
      challenges: ["Perfect Squat Form", "Deadlift Analysis", "HIIT Performance"],
    },
    {
      id: "tennis",
      name: "Tennis",
      icon: "🎾",
      available: false,
      challenges: ["Serve Accuracy", "Forehand Power", "Backhand Technique"],
    },
    {
      id: "volleyball",
      name: "Volleyball",
      icon: "🏐",
      available: false,
      challenges: ["Spike Power", "Setting Accuracy", "Serve Placement"],
    },
    {
      id: "running",
      name: "Running",
      icon: "🏃",
      available: false,
      challenges: ["Sprint Form", "Endurance Analysis", "Pace Optimization"],
    },
  ]

  const activeSportData = sports.find((sport) => sport.id === activeSport)

  return (
    <section className="py-20 bg-[#252525]">
      <div className="container mx-auto px-4">
        <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl text-center mb-16 tracking-wide">
          YOUR SPORT, <span className="text-[#f23c21]">YOUR WAY</span>
        </h2>

        <div
          ref={ref}
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-4">
              {sports.map((sport) => (
                <div
                  key={sport.id}
                  className={`flex-shrink-0 cursor-pointer transition-all ${
                    activeSport === sport.id ? "scale-110" : "opacity-70"
                  }`}
                  onClick={() => sport.available && setActiveSport(sport.id)}
                >
                  <div
                    className={`w-20 h-20 flex flex-col items-center justify-center rounded-full ${
                      activeSport === sport.id ? "bg-[#f23c21]" : "bg-[#1c1c1c]"
                    } ${!sport.available && "opacity-50"}`}
                  >
                    <span className="text-3xl">{sport.icon}</span>
                  </div>
                  <p className="text-center mt-2 text-sm">
                    {sport.name}
                    {!sport.available && <span className="block text-xs text-gray-400">Coming Soon</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {activeSportData && (
            <div className="mt-8 bg-[#1c1c1c] p-6 rounded-sm">
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-[#f23c21] mr-4`}>
                  <span className="text-2xl">{activeSportData.icon}</span>
                </div>
                <h3 className="font-['Bebas_Neue'] text-2xl tracking-wide">{activeSportData.name} CHALLENGES</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeSportData.challenges.map((challenge, index) => (
                  <div key={index} className="bg-[#252525] p-4 rounded-sm">
                    <h4 className="font-medium mb-2">{challenge}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Difficulty</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#f23c21]"></div>
                        <div className="w-2 h-2 rounded-full bg-[#f23c21]"></div>
                        <div
                          className={`w-2 h-2 rounded-full ${index % 3 === 2 ? "bg-[#f23c21]" : "bg-gray-600"}`}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <Button className="bg-[#f23c21] hover:bg-[#d32c15] text-white font-medium px-6 py-2 rounded-sm">
                  EXPLORE {activeSportData.name.toUpperCase()} CHALLENGES
                </Button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Button variant="outline" className="border-gray-600 text-white hover:bg-[#252525]">
              Request a Sport
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
