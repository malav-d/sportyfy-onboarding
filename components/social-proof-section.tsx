"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { LiveIndicator } from "@/components/live-indicator"

export function SocialProofSection() {
  const [streamCount, setStreamCount] = useState(0)
  const [earningsCount, setEarningsCount] = useState(0)
  const [discoveredCount, setDiscoveredCount] = useState(0)
  const [growthRate, setGrowthRate] = useState(0)

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      const streamInterval = setInterval(() => {
        setStreamCount((prev) => {
          if (prev < 25000) return prev + 500
          clearInterval(streamInterval)
          return 25000
        })
      }, 50)

      const earningsInterval = setInterval(() => {
        setEarningsCount((prev) => {
          if (prev < 5000000) return prev + 100000
          clearInterval(earningsInterval)
          return 5000000
        })
      }, 30)

      const discoveredInterval = setInterval(() => {
        setDiscoveredCount((prev) => {
          if (prev < 350) return prev + 10
          clearInterval(discoveredInterval)
          return 350
        })
      }, 100)

      const growthInterval = setInterval(() => {
        setGrowthRate((prev) => {
          if (prev < 28) return prev + 1
          clearInterval(growthInterval)
          return 28
        })
      }, 100)

      return () => {
        clearInterval(streamInterval)
        clearInterval(earningsInterval)
        clearInterval(discoveredInterval)
        clearInterval(growthInterval)
      }
    }
  }, [inView])

  const liveStreams = [
    "Mumbai Cricket Finals • 1,243 viewers",
    "Delhi Basketball Tournament • 876 viewers",
    "Bangalore Football Match • 654 viewers",
    "Chennai Tennis Championship • 542 viewers",
    "Kolkata Hockey League • 489 viewers",
    "Pune Street Cricket • 432 viewers",
    "Hyderabad Badminton Finals • 387 viewers",
    "Ahmedabad Kabaddi Match • 356 viewers",
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-[#252525] to-[#1c1c1c]">
      <div className="container mx-auto px-4">
        <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl text-center mb-16 tracking-wide">
          INDIA IS <span className="text-[#f23c21]">STREAMING</span>
        </h2>

        <div ref={ref} className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-[#1c1c1c] p-6 rounded-sm text-center">
            <p className="font-['Bebas_Neue'] text-3xl md:text-4xl text-[#f23c21]">{streamCount.toLocaleString()}</p>
            <p className="text-sm text-gray-300 mt-2">TOTAL STREAMS</p>
          </div>

          <div className="bg-[#1c1c1c] p-6 rounded-sm text-center">
            <p className="font-['Bebas_Neue'] text-3xl md:text-4xl text-[#f23c21]">
              ₹{(earningsCount / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-gray-300 mt-2">TOTAL EARNINGS</p>
          </div>

          <div className="bg-[#1c1c1c] p-6 rounded-sm text-center">
            <p className="font-['Bebas_Neue'] text-3xl md:text-4xl text-[#f23c21]">{discoveredCount}</p>
            <p className="text-sm text-gray-300 mt-2">ATHLETES DISCOVERED</p>
          </div>

          <div className="bg-[#1c1c1c] p-6 rounded-sm text-center">
            <p className="font-['Bebas_Neue'] text-3xl md:text-4xl text-[#f23c21]">{growthRate}%</p>
            <p className="text-sm text-gray-300 mt-2">MONTHLY GROWTH</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-[#1c1c1c] p-6 rounded-sm">
            <div className="flex items-center mb-4">
              <LiveIndicator />
              <h3 className="ml-2 font-['Bebas_Neue'] text-xl tracking-wide">HAPPENING NOW</h3>
            </div>

            <div className="relative overflow-hidden h-12">
              <div className="absolute whitespace-nowrap animate-marquee">
                {liveStreams.map((stream, index) => (
                  <span key={index} className="inline-block mx-4 text-gray-300">
                    {stream}
                  </span>
                ))}
                {liveStreams.map((stream, index) => (
                  <span key={`repeat-${index}`} className="inline-block mx-4 text-gray-300">
                    {stream}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h3 className="font-['Bebas_Neue'] text-2xl text-center mb-8 tracking-wide">FEATURED IN</h3>

          <div className="flex flex-wrap justify-center gap-8">
            {["Times of India", "Economic Times", "YourStory", "TechCrunch", "SportStar"].map((media, index) => (
              <div key={index} className="bg-[#252525] px-6 py-3 rounded-sm">
                <p className="font-medium text-gray-300">{media}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
