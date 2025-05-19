"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, Award } from "lucide-react"

export function SocialProofSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 })

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
      achievement: "State Champion",
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
      achievement: "Most Improved Player",
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
      achievement: "Certified Trainer",
    },
  ]

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden animate-section" id="testimonials">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#ff073a]/5 to-[#00d9ff]/5 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#ff073a] to-[#00d9ff]"
        >
          ATHLETES WHO LEVELED UP
        </motion.h2>

        <div className="max-w-4xl mx-auto relative">
          {/* Testimonial cards */}
          <div className="relative h-[400px] md:h-[300px]">
            <AnimatePresence mode="wait">
              {testimonials.map(
                (testimonial, index) =>
                  index === activeTestimonial && (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <div className="relative group h-full">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff073a]/30 to-[#00d9ff]/30 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative bg-black/60 backdrop-blur-sm p-8 rounded-xl border border-white/10 h-full flex flex-col md:flex-row items-center md:items-start gap-6">
                          <div className="flex flex-col items-center">
                            <div className="relative">
                              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20">
                                <img
                                  src={testimonial.image || "/placeholder.svg"}
                                  alt={testimonial.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#ff073a] to-[#00d9ff] rounded-full p-1">
                                <Award className="h-5 w-5 text-white" />
                              </div>
                            </div>

                            <div className="mt-4 text-center">
                              <h3 className="font-bold text-white">{testimonial.name}</h3>
                              <p className="text-sm text-white/70">
                                {testimonial.age} • {testimonial.sport}
                              </p>
                              <div className="mt-2 flex justify-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="h-4 w-4 text-[#ff073a]" fill="#ff073a" />
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="bg-white/5 backdrop-blur-sm px-4 py-3 rounded-lg mb-4">
                              <p className="text-sm text-white/70">{testimonial.metric}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-white/70">{testimonial.before}</span>
                                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-[#ff073a] to-[#00d9ff]"
                                    initial={{ width: "30%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                  ></motion.div>
                                </div>
                                <span className="text-[#00d9ff] font-medium">{testimonial.after}</span>
                              </div>
                            </div>

                            <p className="text-white/90 italic mb-4">"{testimonial.quote}"</p>

                            <div className="flex items-center">
                              <div className="bg-gradient-to-r from-[#ff073a]/20 to-[#00d9ff]/20 px-3 py-1 rounded-full">
                                <span className="text-xs font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#ff073a] to-[#00d9ff]">
                                  {testimonial.achievement}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ),
              )}
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <button
            className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2 md:-translate-x-6 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[#ff073a]/80 transition-colors z-10"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-2 md:translate-x-6 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[#00d9ff]/80 transition-colors z-10"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeTestimonial === index ? "bg-gradient-to-r from-[#ff073a] to-[#00d9ff] w-8" : "bg-white/30"
                }`}
                onClick={() => setActiveTestimonial(index)}
              ></button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { value: "10,000+", label: "Athletes" },
            { value: "50,000+", label: "Challenges Completed" },
            { value: "37%", label: "Average Improvement" },
            { value: "4.9/5", label: "User Rating" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff073a] to-[#00d9ff] mb-2">
                {stat.value}
              </div>
              <p className="text-sm text-white/70">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
