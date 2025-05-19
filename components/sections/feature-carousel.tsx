"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Brain, GitBranch, Users, Award } from "lucide-react"
import { useInView } from "framer-motion"

export function FeatureCarousel() {
  const [activeFeature, setActiveFeature] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(carouselRef, { once: false, amount: 0.3 })

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-[#ff073a]" />,
      title: "AI ANALYSIS",
      description:
        "Our proprietary technology analyzes your form in real-time, providing instant feedback and corrections.",
      color: "#ff073a",
    },
    {
      icon: <GitBranch className="h-8 w-8 text-[#00d9ff]" />,
      title: "SKILL TREE",
      description:
        "Follow structured paths to develop sport-specific abilities with clear progression and achievements.",
      color: "#00d9ff",
    },
    {
      icon: <Users className="h-8 w-8 text-[#ff073a]" />,
      title: "SOCIAL CHALLENGES",
      description: "Compete with friends, join teams, and climb the leaderboards to prove your skills.",
      color: "#ff073a",
    },
    {
      icon: <Award className="h-8 w-8 text-[#00d9ff]" />,
      title: "DIGITAL RESUME",
      description: "Showcase verified achievements to coaches and recruiters with your digital sports portfolio.",
      color: "#00d9ff",
    },
  ]

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev === features.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [features.length])

  return (
    <section ref={carouselRef} className="py-20 relative overflow-hidden animate-section">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#ff073a]/5 to-[#00d9ff]/5 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#ff073a] to-[#00d9ff]"
        >
          FEATURE HIGHLIGHTS
        </motion.h2>

        <div className="max-w-6xl mx-auto">
          {/* 3D Carousel */}
          <div className="relative h-[400px] md:h-[500px] perspective">
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              {features.map((feature, index) => {
                const isActive = index === activeFeature
                const offset = (((index - activeFeature) % features.length) + features.length) % features.length
                const zIndex = features.length - offset

                // Calculate rotation and position
                const rotation = offset * (360 / features.length)
                const translateZ = isActive ? 150 : 0

                return (
                  <motion.div
                    key={index}
                    className="absolute w-full max-w-md"
                    initial={false}
                    animate={{
                      rotateY: rotation,
                      z: translateZ,
                      opacity: isActive ? 1 : 0.7,
                      scale: isActive ? 1 : 0.8,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                    style={{
                      zIndex,
                      transformStyle: "preserve-3d",
                    }}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="relative group cursor-pointer">
                      <div
                        className="absolute -inset-0.5 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000"
                        style={{
                          background: `linear-gradient(90deg, ${feature.color}, ${feature.color === "#ff073a" ? "#00d9ff" : "#ff073a"})`,
                        }}
                      ></div>
                      <div className="relative bg-black/60 backdrop-blur-sm p-8 rounded-xl border border-white/10 h-full">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                          style={{ backgroundColor: `${feature.color}20` }}
                        >
                          {feature.icon}
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                        <p className="text-white/80">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeFeature === index ? "bg-gradient-to-r from-[#ff073a] to-[#00d9ff] w-8" : "bg-white/30"
                }`}
                onClick={() => setActiveFeature(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
