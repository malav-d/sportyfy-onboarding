"use client"

import { motion } from "framer-motion"
import { Search, Camera, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HowItWorks({ theme }: { theme: any }) {
  const steps = [
    {
      icon: <Search className="h-8 w-8 text-[#ff073a]" />,
      title: "PICK A CHALLENGE",
      description: "Browse trending challenges or create your own",
      color: "#ff073a",
    },
    {
      icon: <Camera className="h-8 w-8 text-[#00d9ff]" />,
      title: "FILM YOUR ATTEMPT",
      description: "Record your skills with our easy-to-use app",
      color: "#00d9ff",
    },
    {
      icon: <Share2 className="h-8 w-8 text-[#39ff14]" />,
      title: "SHARE & COMPETE",
      description: "Post your video and climb the leaderboards",
      color: "#39ff14",
    },
  ]

  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-center mb-4"
        >
          HOW IT WORKS
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-white/70 text-center max-w-2xl mx-auto mb-12"
        >
          Three simple steps to start your journey to sports stardom
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="relative"
            >
              {/* Step number */}
              <div
                className="absolute -top-4 -left-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: step.color, color: "black" }}
              >
                {index + 1}
              </div>

              {/* Content */}
              <div className="bg-black rounded-lg p-6 border border-gray-800 text-center h-full">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${step.color}20` }}
                >
                  {step.icon}
                </div>

                <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
                <p className="text-white/70">{step.description}</p>

                {/* Connector line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-800">
                    <div
                      className="absolute top-1/2 right-0 w-2 h-2 rounded-full transform -translate-y-1/2"
                      style={{ background: step.color }}
                    ></div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Button
            className="bg-gradient-to-r from-[#ff073a] via-[#00d9ff] to-[#39ff14] text-white hover:opacity-90 transition-opacity"
            size="lg"
          >
            GET STARTED
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
