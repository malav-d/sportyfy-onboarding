"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Crown, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

type LiveLeaderboardProps = {
  theme: any
}

export function LiveLeaderboard({ theme }: LiveLeaderboardProps) {
  const [leaders, setLeaders] = useState([
    {
      id: 1,
      username: "b_ball_king",
      challenge: "360 No-Look Shot",
      points: 1250,
      badge: "crown",
      avatar: "/placeholder.svg?height=100&width=100&text=BBK",
      thumbnail: "/placeholder.svg?height=200&width=200&text=360+Shot",
    },
    {
      id: 2,
      username: "soccer_queen",
      challenge: "Crossbar Challenge",
      points: 980,
      badge: "star",
      avatar: "/placeholder.svg?height=100&width=100&text=SQ",
      thumbnail: "/placeholder.svg?height=200&width=200&text=Crossbar",
    },
    {
      id: 3,
      username: "trick_master",
      challenge: "Bottle Flip Dunk",
      points: 875,
      badge: "verified",
      avatar: "/placeholder.svg?height=100&width=100&text=TM",
      thumbnail: "/placeholder.svg?height=200&width=200&text=Bottle+Flip",
    },
    {
      id: 4,
      username: "fitness_beast",
      challenge: "One-Arm Pushup",
      points: 750,
      badge: "none",
      avatar: "/placeholder.svg?height=100&width=100&text=FB",
      thumbnail: "/placeholder.svg?height=200&width=200&text=Pushup",
    },
    {
      id: 5,
      username: "hoop_dreams",
      challenge: "Half-Court Swish",
      points: 680,
      badge: "none",
      avatar: "/placeholder.svg?height=100&width=100&text=HD",
      thumbnail: "/placeholder.svg?height=200&width=200&text=Half-Court",
    },
  ])

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLeaders((prev) => {
        const newLeaders = [...prev]
        const randomIndex = Math.floor(Math.random() * newLeaders.length)
        const pointIncrease = Math.floor(Math.random() * 50) + 10

        newLeaders[randomIndex] = {
          ...newLeaders[randomIndex],
          points: newLeaders[randomIndex].points + pointIncrease,
        }

        // Sort by points
        return newLeaders.sort((a, b) => b.points - a.points)
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 bg-dark" id="leaderboard">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold flex items-center">
            <Trophy className="h-6 w-6 text-primary mr-2" /> TODAY'S LEGENDS
          </h2>

          <button className="text-[#8667ff] flex items-center text-sm font-medium">
            View full leaderboard <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </motion.div>

        <div className="bg-dark/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
          {leaders.map((leader, index) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex items-center p-4 ${index !== leaders.length - 1 ? "border-b border-gray-800" : ""}`}
            >
              {/* Rank */}
              <div className="w-8 text-center font-bold text-lg mr-4">
                {index === 0 ? (
                  <span className="text-primary">#1</span>
                ) : index === 1 ? (
                  <span className="text-[#8667ff]">#2</span>
                ) : index === 2 ? (
                  <span className="text-primary">#3</span>
                ) : (
                  <span className="text-white/60">#{index + 1}</span>
                )}
              </div>

              {/* Avatar */}
              <div className="relative mr-4">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={leader.avatar || "/placeholder.svg"}
                    alt={leader.username}
                    className="w-full h-full object-cover"
                  />
                </div>

                {leader.badge === "crown" && (
                  <div className="absolute -top-2 -right-2 bg-primary rounded-full p-0.5">
                    <Crown className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              {/* User info */}
              <div className="flex-1 mr-4">
                <div className="flex items-center">
                  <span className="font-medium text-white">{leader.username}</span>
                  <AnimatePresence>
                    {index === 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="ml-2 px-2 py-0.5 bg-primary/20 rounded text-xs text-primary"
                      >
                        LEADER
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <p className="text-sm text-white/60">
                  Completed <span className="text-[#8667ff]">{leader.challenge}</span>
                </p>
              </div>

              {/* Points */}
              <div className="mr-4 text-right">
                <div className="font-bold text-white">{leader.points.toLocaleString()}</div>
                <div className="text-xs text-white/60">POINTS</div>
              </div>

              {/* Thumbnail */}
              <div className="hidden md:block relative w-16 h-16 rounded overflow-hidden mr-4">
                <img
                  src={leader.thumbnail || "/placeholder.svg"}
                  alt={leader.challenge}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                    <Play className="h-3 w-3 text-white" fill="white" />
                  </button>
                </div>
              </div>

              {/* Challenge button */}
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/80 text-white text-xs font-bold whitespace-nowrap"
              >
                CHALLENGE
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-white/60 text-sm mb-4">
            Leaderboards reset daily. Complete challenges to climb the ranks!
          </p>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            View Weekly Champions
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
