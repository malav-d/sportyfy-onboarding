"use client"

import { motion } from "framer-motion"
import { Award, Zap, Users, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AchievementSystem() {
  const achievements = [
    {
      icon: <Flame className="h-8 w-8 text-[#ff073a]" />,
      title: "Streak Master",
      description: "Complete challenges 7 days in a row",
      progress: 70,
      color: "#ff073a",
    },
    {
      icon: <Zap className="h-8 w-8 text-[#00d9ff]" />,
      title: "Viral Sensation",
      description: "Get 10,000+ views on a challenge",
      progress: 45,
      color: "#00d9ff",
    },
    {
      icon: <Users className="h-8 w-8 text-[#39ff14]" />,
      title: "Challenge Creator",
      description: "Create a challenge with 100+ participants",
      progress: 20,
      color: "#39ff14",
    },
    {
      icon: <Award className="h-8 w-8 text-[#ff073a]" />,
      title: "Sports Legend",
      description: "Reach the top of a leaderboard",
      progress: 10,
      color: "#ff073a",
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
          UNLOCK LEGENDARY STATUS
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-white/70 text-center max-w-2xl mx-auto mb-12"
        >
          Earn badges, level up, and show off your achievements
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="relative group"
            >
              <div
                className="absolute -inset-0.5 rounded-lg opacity-50 blur group-hover:opacity-100 transition duration-300"
                style={{ background: `linear-gradient(45deg, ${achievement.color}, transparent)` }}
              ></div>
              <div className="relative bg-black rounded-lg p-6 border border-gray-800 h-full">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${achievement.color}20` }}
                >
                  {achievement.icon}
                </div>

                <h3 className="text-xl font-bold mb-2 text-white text-center">{achievement.title}</h3>
                <p className="text-white/70 text-center mb-4">{achievement.description}</p>

                {/* Progress bar */}
                <div className="w-full bg-gray-800 rounded-full h-2.5 mb-2">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: achievement.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${achievement.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  ></motion.div>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Progress</span>
                  <span className="text-white/80">{achievement.progress}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Button
            className="bg-gradient-to-r from-[#ff073a] to-[#00d9ff] text-white hover:opacity-90 transition-opacity"
            size="lg"
          >
            START EARNING
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
