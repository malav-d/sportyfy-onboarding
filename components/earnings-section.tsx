"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export function EarningsSection() {
  const [viewers, setViewers] = useState(500)
  const [hours, setHours] = useState(2)
  const [frequency, setFrequency] = useState(3)

  // Calculate potential earnings
  const viewerEarnings = viewers * 0.5 // ₹0.5 per viewer on average
  const hourlyBonus = hours * 100 // ₹100 per hour bonus
  const frequencyBonus = frequency * 50 // ₹50 per stream frequency bonus
  const totalEarnings = viewerEarnings + hourlyBonus + frequencyBonus

  return (
    <section className="py-20 bg-gradient-to-b from-[#252525] to-[#1c1c1c]">
      <div className="container mx-auto px-4">
        <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl text-center mb-4 tracking-wide">
          EARN WHILE YOU <span className="text-[#f23c21]">PLAY</span>
        </h2>
        <p className="text-center text-gray-300 max-w-2xl mx-auto mb-16">
          Turn your passion into income. Calculate your potential earnings based on viewers, stream length, and
          frequency.
        </p>

        <div className="max-w-4xl mx-auto bg-[#252525] p-8 rounded-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-['Bebas_Neue'] text-2xl mb-6 tracking-wide">EARNINGS CALCULATOR</h3>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-300">Average Viewers</label>
                    <span className="text-[#f23c21] font-medium">{viewers}</span>
                  </div>
                  <Slider
                    value={[viewers]}
                    min={100}
                    max={2000}
                    step={100}
                    onValueChange={(value) => setViewers(value[0])}
                    className="[&>span]:bg-[#f23c21]"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-300">Stream Length (hours)</label>
                    <span className="text-[#f23c21] font-medium">{hours}</span>
                  </div>
                  <Slider
                    value={[hours]}
                    min={1}
                    max={5}
                    step={0.5}
                    onValueChange={(value) => setHours(value[0])}
                    className="[&>span]:bg-[#f23c21]"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-300">Streams Per Week</label>
                    <span className="text-[#f23c21] font-medium">{frequency}</span>
                  </div>
                  <Slider
                    value={[frequency]}
                    min={1}
                    max={7}
                    step={1}
                    onValueChange={(value) => setFrequency(value[0])}
                    className="[&>span]:bg-[#f23c21]"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="bg-[#1c1c1c] p-6 rounded-sm border-l-2 border-[#f23c21]">
                <h4 className="text-gray-300 mb-2">Potential Weekly Earnings</h4>
                <div className="font-['Bebas_Neue'] text-5xl text-[#f23c21] mb-4">
                  ₹{totalEarnings.toLocaleString()}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Viewer Revenue</span>
                    <span className="text-white">₹{viewerEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stream Length Bonus</span>
                    <span className="text-white">₹{hourlyBonus.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Frequency Bonus</span>
                    <span className="text-white">₹{frequencyBonus.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs text-gray-400">
                    *Earnings are estimates based on average platform performance. Actual results may vary.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="font-['Bebas_Neue'] text-2xl text-center mb-8 tracking-wide">TOP EARNERS THIS MONTH</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Rahul Sharma",
                sport: "Cricket",
                earnings: 42500,
                location: "Mumbai",
                quote: "Started streaming local matches, now I have sponsors reaching out weekly.",
                image: "/placeholder.svg?height=100&width=100",
              },
              {
                name: "Priya Patel",
                sport: "Basketball",
                earnings: 38750,
                location: "Delhi",
                quote: "Sportyfy helped me turn my weekend games into a real source of income.",
                image: "/placeholder.svg?height=100&width=100",
              },
              {
                name: "Arjun Singh",
                sport: "Football",
                earnings: 35200,
                location: "Bangalore",
                quote: "From streaming neighborhood matches to being scouted by a pro team.",
                image: "/placeholder.svg?height=100&width=100",
              },
            ].map((earner, index) => (
              <div key={index} className="bg-[#252525] p-6 rounded-sm">
                <div className="flex items-center mb-4">
                  <img
                    src={earner.image || "/placeholder.svg"}
                    alt={earner.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-medium">{earner.name}</h4>
                    <p className="text-sm text-gray-400">
                      {earner.sport} • {earner.location}
                    </p>
                  </div>
                </div>

                <div className="font-['Bebas_Neue'] text-2xl text-[#f23c21] mb-2">
                  ₹{earner.earnings.toLocaleString()}
                </div>

                <p className="text-sm text-gray-300 italic">"{earner.quote}"</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button className="bg-[#f23c21] hover:bg-[#d32c15] text-white font-medium px-8 py-6 text-lg rounded-sm">
            JOIN TOP EARNERS <span className="ml-1">→</span>
          </Button>
        </div>
      </div>
    </section>
  )
}
