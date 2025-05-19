"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useInView } from "react-intersection-observer"

export function TestimonialsSection() {
  const [activeSlide, setActiveSlide] = useState(0)
  const slideRef = useRef<HTMLDivElement>(null)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const testimonials = [
    {
      name: "Rahul Sharma",
      age: 19,
      sport: "Basketball",
      before: "63%",
      after: "84%",
      metric: "Free throw accuracy",
      quote: "SportSkill helped me identify flaws in my shooting form that I never noticed before.",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Priya Patel",
      age: 17,
      sport: "Soccer",
      before: "28%",
      after: "47%",
      metric: "Shot conversion rate",
      quote: "The skill tree made it easy to focus on exactly what I needed to improve.",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Arjun Singh",
      age: 22,
      sport: "Fitness",
      before: "65kg",
      after: "78kg",
      metric: "Deadlift max",
      quote: "The form analysis helped me correct my technique and avoid injury while getting stronger.",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Handle touch events for mobile swiping
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swipe left
      nextSlide()
    } else if (touchEndX.current - touchStartX.current > 50) {
      // Swipe right
      prevSlide()
    }
  }

  return (
    <section className="py-20 bg-[#252525]">
      <div className="container mx-auto px-4">
        <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl text-center mb-16 tracking-wide">
          ATHLETES WHO <span className="text-[#f23c21]">LEVELED UP</span>
        </h2>

        <div
          ref={ref}
          className={`max-w-4xl mx-auto relative transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div
            ref={slideRef}
            className="overflow-hidden rounded-sm"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="bg-[#1c1c1c] p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-24 h-24 rounded-full overflow-hidden">
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 text-center md:text-left">
                        <h3 className="font-['Bebas_Neue'] text-2xl tracking-wide">{testimonial.name}</h3>
                        <p className="text-gray-400">
                          {testimonial.age} • {testimonial.sport}
                        </p>

                        <div className="mt-4 flex flex-col md:flex-row items-center gap-4">
                          <div className="bg-[#252525] px-4 py-2 rounded-sm">
                            <p className="text-sm text-gray-400">{testimonial.metric}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">{testimonial.before}</span>
                              <span className="text-gray-400">→</span>
                              <span className="text-[#f23c21] font-medium">{testimonial.after}</span>
                            </div>
                          </div>

                          <div className="flex-1">
                            <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                          </div>
                        </div>
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
            {testimonials.map((_, index) => (
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

        <div className="mt-12 text-center">
          <Button className="bg-[#f23c21] hover:bg-[#d32c15] text-white font-medium px-8 py-6 text-lg rounded-sm">
            JOIN THEM <span className="ml-1">→</span>
          </Button>
        </div>
      </div>
    </section>
  )
}
