"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function DiscoverySection() {
  const [activeSlide, setActiveSlide] = useState(0)
  const slideRef = useRef<HTMLDivElement>(null)

  const successStories = [
    {
      name: "Vikram Mehta",
      sport: "Cricket",
      before: "Local club player streaming weekend matches",
      after: "Signed by regional team after scout discovered his bowling",
      earnings: 125000,
      viewers: 15000,
      quote:
        "One stream changed my entire career trajectory. A scout watching my live match contacted me the same day.",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "Ananya Desai",
      sport: "Basketball",
      before: "College player streaming practice sessions",
      after: "Received sponsorship from sports brand and coaching offers",
      earnings: 85000,
      viewers: 12000,
      quote: "The exposure from Sportyfy helped me get noticed by brands I could only dream of before.",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "Rajiv Kumar",
      sport: "Football",
      before: "Amateur player streaming neighborhood matches",
      after: "Selected for state-level team and signed equipment deal",
      earnings: 95000,
      viewers: 13500,
      quote: "From playing in empty fields to representing my state - all because I decided to stream my matches.",
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === successStories.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? successStories.length - 1 : prev - 1))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 bg-[#252525]">
      <div className="container mx-auto px-4">
        <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl text-center mb-4 tracking-wide">
          GET <span className="text-[#f23c21]">DISCOVERED</span>
        </h2>
        <p className="text-center text-gray-300 max-w-2xl mx-auto mb-16">
          Real athletes are getting real opportunities through Sportyfy.live every day. Your next big break could be
          just one stream away.
        </p>

        <div className="max-w-4xl mx-auto relative">
          <div ref={slideRef} className="overflow-hidden rounded-sm">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {successStories.map((story, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="bg-[#1c1c1c] p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <img
                          src={story.image || "/placeholder.svg"}
                          alt={story.name}
                          className="w-full h-64 object-cover rounded-sm"
                        />
                      </div>

                      <div>
                        <div className="flex items-center mb-4">
                          <div className="w-2 h-12 bg-[#f23c21] mr-4"></div>
                          <div>
                            <h3 className="font-['Bebas_Neue'] text-2xl tracking-wide">{story.name}</h3>
                            <p className="text-[#f23c21]">{story.sport}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                            <p className="text-sm text-gray-400">BEFORE</p>
                          </div>
                          <p className="text-gray-300 ml-5">{story.before}</p>
                        </div>

                        <div className="mb-6">
                          <div className="flex items-center mb-2">
                            <div className="w-3 h-3 rounded-full bg-[#f23c21] mr-2"></div>
                            <p className="text-sm text-[#f23c21]">AFTER</p>
                          </div>
                          <p className="text-white ml-5">{story.after}</p>
                        </div>

                        <div className="flex justify-between mb-4">
                          <div>
                            <p className="text-sm text-gray-400">EARNINGS</p>
                            <p className="font-['Bebas_Neue'] text-xl text-[#f23c21]">
                              ₹{story.earnings.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">VIEWERS</p>
                            <p className="font-['Bebas_Neue'] text-xl">{story.viewers.toLocaleString()}</p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-300 italic">"{story.quote}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="absolute top-1/2 left-2 transform -translate-y-1/2 w-10 h-10 bg-[#1c1c1c]/80 rounded-full flex items-center justify-center text-white hover:bg-[#f23c21] transition-colors"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/2 w-10 h-10 bg-[#1c1c1c]/80 rounded-full flex items-center justify-center text-white hover:bg-[#f23c21] transition-colors"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="flex justify-center mt-6 gap-2">
            {successStories.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activeSlide === index ? "bg-[#f23c21]" : "bg-gray-600"
                }`}
                onClick={() => setActiveSlide(index)}
              ></button>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h3 className="font-['Bebas_Neue'] text-2xl text-center mb-8 tracking-wide">PARTNERS & SCOUTS</h3>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              "Team Alpha",
              "Velocity Sports",
              "Premier League",
              "Talent Scouts",
              "Sports Academy",
              "Pro Recruiters",
            ].map((partner, index) => (
              <div key={index} className="bg-[#1c1c1c] px-6 py-3 rounded-sm">
                <p className="font-medium">{partner}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button className="bg-[#f23c21] hover:bg-[#d32c15] text-white font-medium px-8 py-6 text-lg rounded-sm">
            START YOUR JOURNEY <span className="ml-1">→</span>
          </Button>
        </div>
      </div>
    </section>
  )
}
