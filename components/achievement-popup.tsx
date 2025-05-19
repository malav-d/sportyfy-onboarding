"use client"

import { motion } from "framer-motion"
import { Award, Zap, Users } from "lucide-react"

type AchievementPopupProps = {
  type: string
  theme: any
}

export function AchievementPopup({ type, theme }: AchievementPopupProps) {
  const achievements = {
    explorer: {
      title: "Explorer",
      description: "You've discovered the Sportyfy universe!",
      icon: <Zap className="h-6 w-6 text-secondary" />,
      xp: 50,
      color: theme.colors.secondary,
    },
    social: {
      title: "Social Butterfly",
      description: "You're checking out the community!",
      icon: <Users className="h-6 w-6 text-secondary" />,
      xp: 100,
      color: theme.colors.secondary,
    },
    champion: {
      title: "Challenge Champion",
      description: "You're ready to take on challenges!",
      icon: <Award className="h-6 w-6 text-primary" />,
      xp: 150,
      color: theme.colors.primary,
    },
  }

  const achievement = achievements[type as keyof typeof achievements] || achievements.explorer

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className="fixed top-24 right-4 z-50 max-w-xs"
    >
      <div className="relative">
        <div
          className="absolute -inset-1 rounded-lg opacity-70 blur"
          style={{ background: `linear-gradient(45deg, ${achievement.color}, transparent)` }}
        ></div>
        <div className="relative bg-dark border border-gray-800 rounded-lg p-4 flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: `${achievement.color}40` }}
          >
            {achievement.icon}
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white">Achievement Unlocked!</h3>
                <p className="text-sm text-white/80 font-medium">{achievement.title}</p>
              </div>
              <div className="bg-black/50 px-2 py-1 rounded text-xs font-bold text-white">+{achievement.xp} XP</div>
            </div>
            <p className="text-xs text-white/60 mt-1">{achievement.description}</p>

            <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
              <motion.div
                className="h-full rounded-full"
                style={{ background: achievement.color }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
              ></motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
