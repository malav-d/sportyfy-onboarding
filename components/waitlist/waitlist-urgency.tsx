"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Users, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type WaitlistUrgencyProps = {
  theme: any
}

export function WaitlistUrgency({ theme }: WaitlistUrgencyProps) {
  const [days, setDays] = useState(21)
  const [hours, setHours] = useState(8)
  const [minutes, setMinutes] = useState(43)
  const [seconds, setSeconds] = useState(12)
  const totalSpots = 500
  const [spotsRemaining, setSpotsRemaining] = useState<number | null>(null)

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      } else {
        setSeconds(59)
        if (minutes > 0) {
          setMinutes(minutes - 1)
        } else {
          setMinutes(59)
          if (hours > 0) {
            setHours(hours - 1)
          } else {
            setHours(23)
            if (days > 0) {
              setDays(days - 1)
            }
          }
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [days, hours, minutes, seconds])

  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
    fetch(`${API_BASE_URL}/waitlist/count`)
      .then((res) => res.json())
      .then((data) => setSpotsRemaining(totalSpots - data.total_prospects))
      .catch((err) => setSpotsRemaining(totalSpots))
  }, [])

  return (
    <section className="py-16 bg-dark relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Countdown timer */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-lg font-bold">OFFICIAL LAUNCH IN:</h3>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="bg-black/50 rounded-lg p-3 text-center">
                  <div className="text-2xl md:text-3xl font-bold">{days.toString().padStart(2, "0")}</div>
                  <div className="text-xs text-white/60">DAYS</div>
                </div>
                <div className="bg-black/50 rounded-lg p-3 text-center">
                  <div className="text-2xl md:text-3xl font-bold">{hours.toString().padStart(2, "0")}</div>
                  <div className="text-xs text-white/60">HOURS</div>
                </div>
                <div className="bg-black/50 rounded-lg p-3 text-center">
                  <div className="text-2xl md:text-3xl font-bold">{minutes.toString().padStart(2, "0")}</div>
                  <div className="text-xs text-white/60">MINS</div>
                </div>
                <div className="bg-black/50 rounded-lg p-3 text-center">
                  <div className="text-2xl md:text-3xl font-bold">{seconds.toString().padStart(2, "0")}</div>
                  <div className="text-xs text-white/60">SECS</div>
                </div>
              </div>

              <div className="text-center text-white/70 text-sm">
                Early access will be granted to waitlist members before the official launch
              </div>
            </motion.div>

            {/* Spots remaining */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center mb-4">
                <Users className="h-5 w-5 text-[#8667ff] mr-2" />
                <h3 className="text-lg font-bold">FOUNDING SPOTS:</h3>
              </div>

              <div className="mb-4">
                <div className="text-3xl md:text-4xl font-bold text-center mb-2">
                  ONLY <span className="text-[#8667ff]">{spotsRemaining !== null ? spotsRemaining : '...'}</span> REMAINING
                </div>
                <div className="w-full bg-black/50 rounded-full h-2.5 mb-2">
                  <div
                    className="bg-gradient-to-r from-[#ff073a] to-[#8667ff] h-2.5 rounded-full"
                    style={{ width: `${100 - ((spotsRemaining !== null ? spotsRemaining : totalSpots) / totalSpots) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-white/60">
                  <span>0</span>
                  <span>500 spots</span>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <Share2 className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm text-white/70">Share and move up 50 spots in line</span>
              </div>

              <div className="mt-4 flex justify-center">
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  Share to Skip the Line
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
