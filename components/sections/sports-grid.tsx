"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

type SportsGridProps = {
  theme: any
}

export function SportsGrid({ theme }: SportsGridProps) {
  const [hoveredSport, setHoveredSport] = useState<number | null>(null)

  const sports = [
    {
      id: 1,
      name: "Basketball",
      icon: "🏀",
      color: theme.colors.primary,
      challenges: ["Slam Dunks", "Trick Shots", "Dribbling Skills"],
    },
    {
      id: 2,
      name: "Soccer",
      icon: "⚽",
      color: theme.colors.secondary,
      challenges: ["Free Kicks", "Juggling", "Trick Shots"],
    },
    {
      id: 3,
      name: "Fitness",
      icon: "💪",
      color: theme.colors.primary,
      challenges: ["Crazy Workouts", "Dance Challenges", "Strength Tests"],
    },
    {
      id: 4,
      name: "Coming Soon",
      icon: "🔜",
      color: theme.colors.secondary,
      challenges: ["Vote for the next sport!"],
    },
  ]

  return (
    <section className="py-16 bg-dark relative overflow-hidden" id="sports">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/10 via-[#8667ff]/10 to-primary/10 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-center mb-4"
        >
          PICK YOUR PLAYGROUND
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-white/70 text-center max-w-2xl mx-auto mb-12"
        >
          Choose your sport and discover challenges tailored to your skills
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sports.map((sport, index) => (
            <motion.div
              key={sport.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="relative group"
              onMouseEnter={() => setHoveredSport(sport.id)}
              onMouseLeave={() => setHoveredSport(null)}
            >
              <div
                className="absolute -inset-0.5 rounded-lg opacity-50 blur group-hover:opacity-100 transition duration-300"
                style={{ background: `linear-gradient(45deg, ${sport.color}, transparent)` }}
              ></div>
              <div className="relative bg-dark rounded-lg p-6 border border-gray-800 h-full">
                <div className="text-center">
                  <div className="text-5xl mb-4">{sport.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-white">{sport.name}</h3>

                  {/* Challenges (visible on hover) */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      hoveredSport === sport.id ? "max-h-32 opacity-100 mt-4" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="text-sm text-white/70 mb-2">Popular Challenges:</div>
                    <ul className="text-sm">
                      {sport.challenges.map((challenge, i) => (
                        <li key={i} className="mb-1">
                          <a
                            href="#"
                            className="flex items-center justify-center text-white hover:text-primary transition-colors"
                          >
                            {challenge} <ChevronRight className="h-3 w-3 ml-1" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
