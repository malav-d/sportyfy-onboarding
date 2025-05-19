"use client"

import { useEffect, useState } from "react"
import { Zap, TrendingUp, Award } from "lucide-react"
import { useInView } from "react-intersection-observer"

export function ValuePropsSection() {
  const [streamCount, setStreamCount] = useState(0)
  const [creatorCount, setCreatorCount] = useState(0)
  const [viewerCount, setViewerCount] = useState(0)

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

      const creatorInterval = setInterval(() => {
        setCreatorCount((prev) => {
          if (prev < 8500) return prev + 100
          clearInterval(creatorInterval)
          return 8500
        })
      }, 50)

      const viewerInterval = setInterval(() => {
        setViewerCount((prev) => {
          if (prev < 120000) return prev + 2000
          clearInterval(viewerInterval)
          return 120000
        })
      }, 50)

      return () => {
        clearInterval(streamInterval)
        clearInterval(creatorInterval)
        clearInterval(viewerInterval)
      }
    }
  }, [inView])

  return (
    <section className="py-20 bg-[#252525]" id="vision">
      <div className="container mx-auto px-4">
        <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl text-[#f23c21] text-center mb-16 tracking-wide">
          NO APP. NO SETUP. JUST STREAM.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#1c1c1c] p-6 rounded-sm border-t-2 border-[#f23c21] transform transition-transform hover:translate-y-[-8px]">
            <div className="w-12 h-12 bg-[#f23c21]/20 rounded-full flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-[#f23c21]" />
            </div>
            <h3 className="font-['Bebas_Neue'] text-2xl mb-3 tracking-wide">INSTANT STREAMING</h3>
            <p className="text-gray-300">
              Stream any match directly from your phone browser. No downloads, no waiting - just instant live
              broadcasting.
            </p>
          </div>

          <div className="bg-[#1c1c1c] p-6 rounded-sm border-t-2 border-[#f23c21] transform transition-transform hover:translate-y-[-8px]">
            <div className="w-12 h-12 bg-[#f23c21]/20 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-[#f23c21]" />
            </div>
            <h3 className="font-['Bebas_Neue'] text-2xl mb-3 tracking-wide">REAL EARNINGS</h3>
            <p className="text-gray-300">
              Turn your passion into income. Earn money from viewers, tips, and sponsorships as you build your audience.
            </p>
          </div>

          <div className="bg-[#1c1c1c] p-6 rounded-sm border-t-2 border-[#f23c21] transform transition-transform hover:translate-y-[-8px]">
            <div className="w-12 h-12 bg-[#f23c21]/20 rounded-full flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-[#f23c21]" />
            </div>
            <h3 className="font-['Bebas_Neue'] text-2xl mb-3 tracking-wide">GET DISCOVERED</h3>
            <p className="text-gray-300">
              Top performers get noticed by scouts and teams. Your next big opportunity could be just one stream away.
            </p>
          </div>
        </div>

        <div ref={ref} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-['Bebas_Neue'] text-4xl md:text-5xl text-[#f23c21]">{streamCount.toLocaleString()}+</p>
            <p className="text-gray-300 mt-2">STREAMS COMPLETED</p>
          </div>
          <div>
            <p className="font-['Bebas_Neue'] text-4xl md:text-5xl text-[#f23c21]">{creatorCount.toLocaleString()}+</p>
            <p className="text-gray-300 mt-2">ACTIVE CREATORS</p>
          </div>
          <div>
            <p className="font-['Bebas_Neue'] text-4xl md:text-5xl text-[#f23c21]">{viewerCount.toLocaleString()}+</p>
            <p className="text-gray-300 mt-2">MONTHLY VIEWERS</p>
          </div>
        </div>
      </div>
    </section>
  )
}
