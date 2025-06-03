"use client"

import { motion } from "framer-motion"
import { Play, Share2, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SocialProof({ theme }: { theme: any }) {
  const successStories = [
    {
      id: 1,
      name: "Sarah J.",
      story: "Bottle flip trick shot went viral",
      views: "2.1M",
      shares: "45K",
      likes: "189K",
      featured: "Featured on ESPN",
      video: "/placeholder.svg?height=400&width=300&text=Bottle+Flip",
    },
    {
      id: 2,
      name: "Mike T.",
      story: "Basketball trick shot from roof",
      views: "1.8M",
      shares: "32K",
      likes: "156K",
      featured: "Shared by NBA stars",
      video: "/placeholder.svg?height=400&width=300&text=Roof+Shot",
    },
    {
      id: 3,
      name: "Priya K.",
      story: "Soccer freestyle challenge",
      views: "3.2M",
      shares: "67K",
      likes: "245K",
      featured: "Started a trend",
      video: "/placeholder.svg?height=400&width=300&text=Soccer+Freestyle",
    },
  ]

  return (
    <section className="py-16 bg-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#39ff14]/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-[#ff073a]/10 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-center mb-4"
        >
          ATHLETES GOING VIRAL
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-white/70 text-center max-w-2xl mx-auto mb-12"
        >
          These athletes turned their skills into viral sensations with Sportyfy challenges
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {successStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="relative group"
            >
              <div
                className="absolute -inset-0.5 rounded-lg opacity-50 blur group-hover:opacity-100 transition duration-300"
                style={{ background: "linear-gradient(45deg, #ff073a, #00d9ff)" }}
              ></div>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                {/* Video thumbnail */}
                <div className="relative aspect-video">
                  <img
                    src={story.video || "/placeholder.svg"}
                    alt={story.story}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <Play className="h-5 w-5 text-white" fill="white" />
                    </button>
                  </div>

                  {/* Featured badge */}
                  <div className="absolute top-2 right-2 bg-[#ff073a] text-white text-xs font-bold px-2 py-1 rounded">
                    {story.featured}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-white mb-1">{story.name}</h3>
                  <p className="text-white/70 mb-4">{story.story}</p>

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center text-white/60 text-sm">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{story.views} views</span>
                    </div>

                    <div className="flex space-x-3">
                      <div className="flex items-center text-white/60 text-sm">
                        <Heart className="h-4 w-4 mr-1 text-[#ff073a]" />
                        <span>{story.likes}</span>
                      </div>

                      <div className="flex items-center text-white/60 text-sm">
                        <Share2 className="h-4 w-4 mr-1 text-[#00d9ff]" />
                        <span>{story.shares}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-[#ff073a] to-[#00d9ff] text-white hover:opacity-90 transition-opacity"
                    size="sm"
                  >
                    TRY THIS CHALLENGE
                  </Button>
                </div>
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
          <Button className="bg-[#39ff14] hover:bg-[#39ff14]/80 text-black font-bold" size="lg">
            JOIN THE FUN
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
