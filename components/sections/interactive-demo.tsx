"use client"

import type React from "react"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"

export function InteractiveDemo() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 })
  const [activeScreen, setActiveScreen] = useState(0)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  const screens = [
    {
      title: "Record Performance",
      description: "Capture your sports movements with any smartphone",
      image: "/sports-app-recording.png",
    },
    {
      title: "AI Analysis",
      description: "Get instant feedback on your form and technique",
      image: "/sports-app-analysis.png",
    },
    {
      title: "Track Progress",
      description: "See your improvement over time with detailed metrics",
      image: "/sports-app-progress.png",
    },
  ]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return

    const { clientX, clientY } = e
    const { left, top, width, height } = sectionRef.current.getBoundingClientRect()

    const x = ((clientX - left - width / 2) / (width / 2)) * 10
    const y = ((clientY - top - height / 2) / (height / 2)) * 10

    setRotation({ x: -y, y: x })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
  }

  return (
    <section
      ref={sectionRef}
      className="py-20 relative overflow-hidden animate-section"
      id="demo"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#ff073a]/5 to-[#00d9ff]/5 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#ff073a] to-[#00d9ff]"
        >
          INTERACTIVE DEMO
        </motion.h2>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* 3D Phone Mockup */}
          <motion.div
            className="relative w-full md:w-1/2 flex justify-center perspective"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative w-[280px] h-[580px]"
              animate={{
                rotateY: rotation.y,
                rotateX: rotation.x,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Phone frame */}
              <div
                className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-[#333] to-[#222] p-2 shadow-xl"
                style={{ transform: "translateZ(0px)" }}
              >
                <div className="absolute inset-2 rounded-[36px] bg-black overflow-hidden">
                  {/* Screen content */}
                  <div className="relative w-full h-full">
                    {screens.map((screen, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          activeScreen === index ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <img
                          src={screen.image || "/placeholder.svg"}
                          alt={screen.title}
                          className="w-full h-full object-cover"
                        />

                        {/* Screen overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
                          <h3 className="text-xl font-bold text-white mb-2">{screen.title}</h3>
                          <p className="text-sm text-white/80 mb-4">{screen.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-xl"></div>

                {/* Buttons */}
                <div className="absolute right-0 top-1/4 w-1 h-12 bg-[#333] rounded-l-md"></div>
                <div className="absolute left-0 top-1/3 w-1 h-8 bg-[#333] rounded-r-md"></div>
                <div className="absolute left-0 top-1/2 w-1 h-8 bg-[#333] rounded-r-md"></div>
              </div>

              {/* Glow effect */}
              <div
                className="absolute -inset-4 bg-gradient-to-r from-[#ff073a]/30 to-[#00d9ff]/30 rounded-[50px] blur-xl opacity-50"
                style={{ transform: "translateZ(-10px)" }}
              ></div>
            </motion.div>

            {/* Floating particles */}
            <motion.div
              className="absolute top-1/4 right-1/4 w-6 h-6 rounded-full bg-[#ff073a]/30 blur-sm"
              animate={{
                y: [0, -15, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            ></motion.div>

            <motion.div
              className="absolute bottom-1/4 left-1/4 w-4 h-4 rounded-full bg-[#00d9ff]/30 blur-sm"
              animate={{
                y: [0, 15, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.5,
              }}
            ></motion.div>
          </motion.div>

          {/* Content */}
          <div className="w-full md:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                Experience the Future of <span className="text-[#ff073a]">Sports Training</span>
              </h3>

              <p className="text-white/80 mb-8">
                Our AI-powered platform analyzes your form, tracks your progress, and helps you improve faster than
                traditional training methods. Swipe through the demo to see how Sportyfy transforms your training
                experience.
              </p>

              {/* Screen navigation */}
              <div className="space-y-4 mb-8">
                {screens.map((screen, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-300 flex items-center ${
                      activeScreen === index
                        ? "bg-gradient-to-r from-[#ff073a]/20 to-[#00d9ff]/20 border border-white/10"
                        : "bg-black/20 hover:bg-white/5"
                    }`}
                    onClick={() => setActiveScreen(index)}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                        activeScreen === index
                          ? "bg-gradient-to-r from-[#ff073a] to-[#00d9ff] text-white"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{screen.title}</h4>
                      <p className="text-sm text-white/60">{screen.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              <Button className="relative group overflow-hidden">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white to-white font-medium">
                  TRY THE FULL DEMO
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#ff073a] to-[#00d9ff] group-hover:opacity-80 transition-opacity duration-300"></span>
                <span className="absolute -inset-1 bg-gradient-to-r from-[#ff073a] to-[#00d9ff] opacity-50 group-hover:opacity-100 blur-md transition-opacity duration-300"></span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
