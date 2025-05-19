"use client"

import { motion } from "framer-motion"
import { Calendar, Zap, Users, Lightbulb, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type ChallengeTypesProps = {
  theme: any
}

export function ChallengeTypes({ theme }: ChallengeTypesProps) {
  const challengeTypes = [
    {
      icon: <Calendar className={`h-8 w-8 text-primary`} />,
      title: "DAILY CHALLENGES",
      description: "New challenges every 24h with special rewards",
      color: theme.colors.primary,
    },
    {
      icon: <Zap className={`h-8 w-8 text-[#8667ff]`} />,
      title: "VIRAL TRICKS",
      description: "Master the trending trick shots taking over social media",
      color: theme.colors.secondary,
    },
    {
      icon: <Users className={`h-8 w-8 text-primary`} />,
      title: "VERSUS MODE",
      description: "Challenge your friends to head-to-head competitions",
      color: theme.colors.primary,
    },
    {
      icon: <Lightbulb className={`h-8 w-8 text-[#8667ff]`} />,
      title: "COMMUNITY PICKS",
      description: "Try the best user-created challenges from our community",
      color: theme.colors.secondary,
    },
  ]

  return (
    <section className="py-16 bg-dark relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#8667ff]/20 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-center mb-12"
        >
          CHOOSE YOUR CHALLENGE
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {challengeTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div
                className="absolute -inset-0.5 rounded-lg opacity-50 blur group-hover:opacity-100 transition duration-300"
                style={{ background: `linear-gradient(45deg, ${type.color}, transparent)` }}
              ></div>
              <div className="relative bg-dark rounded-lg p-6 border border-gray-800 h-full">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: `${type.color}20` }}
                >
                  {type.icon}
                </div>

                <h3 className="text-xl font-bold mb-2 text-white">{type.title}</h3>
                <p className="text-white/70 mb-4">{type.description}</p>

                <button
                  className="flex items-center text-sm font-medium transition-colors"
                  style={{ color: type.color }}
                >
                  Explore <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center mt-12"
        >
          <Button className="bg-primary text-white hover:opacity-90 transition-opacity" size="lg">
            EXPLORE ALL CHALLENGES
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
