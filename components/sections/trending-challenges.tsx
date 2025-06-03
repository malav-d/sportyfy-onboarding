"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Star, Users, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TrendingChallenges({ theme }: { theme: any }) {
  const [activeCategory, setActiveCategory] = useState("all")
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const categories = [
    { id: "all", name: "All" },
    { id: "trickshots", name: "#TrickShots" },
    { id: "skilltests", name: "#SkillTests" },
    { id: "creative", name: "#CreativeChallenges" },
  ]

  const challenges = [
    {
      id: 1,
      title: "Blindfold Free Throw",
      difficulty: 4,
      participants: 2453,
      thumbnail: "/placeholder.svg?height=640&width=360&text=Blindfold+Free+Throw",
      category: "trickshots",
    },
    {
      id: 2,
      title: "Bottle Flip Dunk",
      difficulty: 3,
      participants: 5621,
      thumbnail: "/placeholder.svg?height=640&width=360&text=Bottle+Flip+Dunk",
      category: "trickshots",
    },
    {
      id: 3,
      title: "One-Minute Juggle",
      difficulty: 2,
      participants: 8734,
      thumbnail: "/placeholder.svg?height=640&width=360&text=One-Minute+Juggle",
      category: "skilltests",
    },
    {
      id: 4,
      title: "Crossbar Challenge",
      difficulty: 3,
      participants: 4321,
      thumbnail: "/placeholder.svg?height=640&width=360&text=Crossbar+Challenge",
      category: "skilltests",
    },
    {
      id: 5,
      title: "Basketball HORSE",
      difficulty: 2,
      participants: 6789,
      thumbnail: "/placeholder.svg?height=640&width=360&text=Basketball+HORSE",
      category: "creative",
    },
    {
      id: 6,
      title: "Trick Shot Chain",
      difficulty: 5,
      participants: 1234,
      thumbnail: "/placeholder.svg?height=640&width=360&text=Trick+Shot+Chain",
      category: "creative",
    },
  ]

  const filteredChallenges =
    activeCategory === "all" ? challenges : challenges.filter((challenge) => challenge.category === activeCategory)

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const { current } = scrollContainerRef
    const scrollAmount = direction === "left" ? -300 : 300
    current.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  return (
    <section className="py-16 bg-gray-950" id="challenges">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold flex items-center"
          >
            <span className="text-2xl mr-2">🔥</span> TRENDING NOW
          </motion.h2>

          <div className="hidden md:flex space-x-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex overflow-x-auto scrollbar-hide space-x-2 mb-6 pb-2"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-[#ff073a] to-[#00d9ff] text-white"
                  : "bg-gray-900 text-white/70 hover:bg-gray-800"
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Challenge grid */}
        <div ref={scrollContainerRef} className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4">
          {filteredChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 w-64 md:w-72"
            >
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 group">
                {/* Thumbnail */}
                <div className="relative aspect-[9/16] overflow-hidden">
                  <img
                    src={challenge.thumbnail || "/placeholder.svg"}
                    alt={challenge.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <Play className="h-5 w-5 text-white" fill="white" />
                    </button>
                  </div>

                  {/* Difficulty */}
                  <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3"
                        fill={i < challenge.difficulty ? "#ff073a" : "transparent"}
                        stroke={i < challenge.difficulty ? "#ff073a" : "white"}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-white mb-2">{challenge.title}</h3>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-white/60 text-sm">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{challenge.participants.toLocaleString()}</span>
                    </div>

                    <Button size="sm" className="bg-[#39ff14] hover:bg-[#39ff14]/80 text-black text-xs font-bold">
                      TRY THIS
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* View all card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: filteredChallenges.length * 0.1 }}
            className="flex-shrink-0 w-64 md:w-72 flex items-center justify-center"
          >
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 border-dashed p-8 h-full flex flex-col items-center justify-center text-center">
              <ChevronRight className="h-8 w-8 text-[#00d9ff] mb-4" />
              <h3 className="font-bold text-white mb-2">View All Challenges</h3>
              <p className="text-white/60 text-sm mb-4">Discover more epic challenges</p>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Explore
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
