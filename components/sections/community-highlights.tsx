"use client"

import { motion } from "framer-motion"
import { Play, Heart, MessageCircle, Award, Star, Flame, Users } from "lucide-react"

export function CommunityHighlights() {
  const highlights = [
    {
      id: 1,
      type: "video",
      username: "b_ball_king",
      content: "/placeholder.svg?height=300&width=300&text=Basketball+Trick",
      likes: 1243,
      comments: 89,
      caption: "Nailed this trick after 50 attempts! 🔥",
    },
    {
      id: 2,
      type: "achievement",
      username: "soccer_queen",
      badge: "Streak Master",
      icon: <Flame className="h-5 w-5 text-[#ff073a]" />,
      description: "7-day challenge streak completed!",
    },
    {
      id: 3,
      type: "video",
      username: "trick_master",
      content: "/placeholder.svg?height=300&width=300&text=Bottle+Flip",
      likes: 2567,
      comments: 134,
      caption: "This bottle flip challenge is insane",
    },
    {
      id: 4,
      type: "challenge",
      title: "Challenge of the Day",
      name: "Blindfold Free Throw",
      participants: 1234,
      thumbnail: "/placeholder.svg?height=200&width=200&text=Blindfold+Shot",
    },
    {
      id: 5,
      type: "video",
      username: "fitness_beast",
      content: "/placeholder.svg?height=300&width=300&text=Fitness+Challenge",
      likes: 987,
      comments: 56,
      caption: "New personal best on this challenge!",
    },
    {
      id: 6,
      type: "creator",
      username: "hoop_dreams",
      avatar: "/placeholder.svg?height=100&width=100&text=HD",
      description: "Created 5 viral challenges this week",
      badge: "Top Creator",
    },
  ]

  return (
    <section className="py-16 bg-black relative overflow-hidden" id="community">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#ff073a]/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#00d9ff]/10 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-center mb-4"
        >
          COMMUNITY HIGHLIGHTS
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-white/70 text-center max-w-2xl mx-auto mb-12"
        >
          Check out what's happening in the Sportyfy community
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="relative group"
            >
              <div
                className="absolute -inset-0.5 rounded-lg opacity-30 blur group-hover:opacity-70 transition duration-300"
                style={{ background: "linear-gradient(45deg, #ff073a, #00d9ff)" }}
              ></div>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                {highlight.type === "video" && (
                  <>
                    {/* Video content */}
                    <div className="relative aspect-square">
                      <img
                        src={highlight.content || "/placeholder.svg"}
                        alt={highlight.caption}
                        className="w-full h-full object-cover"
                      />

                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                          <Play className="h-5 w-5 text-white" fill="white" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff073a] to-[#00d9ff] flex items-center justify-center text-xs font-bold mr-2">
                          {highlight.username.substring(0, 1).toUpperCase()}
                        </div>
                        <span className="font-medium text-white">{highlight.username}</span>
                      </div>

                      <p className="text-white/80 mb-3">{highlight.caption}</p>

                      <div className="flex space-x-4">
                        <div className="flex items-center text-white/60 text-sm">
                          <Heart className="h-4 w-4 mr-1 text-[#ff073a]" />
                          <span>{highlight.likes}</span>
                        </div>

                        <div className="flex items-center text-white/60 text-sm">
                          <MessageCircle className="h-4 w-4 mr-1 text-[#00d9ff]" />
                          <span>{highlight.comments}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {highlight.type === "achievement" && (
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-[#ff073a]/20 flex items-center justify-center mb-4">
                      {highlight.icon}
                    </div>

                    <div className="bg-gradient-to-r from-[#ff073a] to-[#00d9ff] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                      {highlight.badge}
                    </div>

                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#ff073a] to-[#00d9ff] flex items-center justify-center text-xs font-bold mr-2">
                        {highlight.username.substring(0, 1).toUpperCase()}
                      </div>
                      <span className="font-medium text-white">{highlight.username}</span>
                    </div>

                    <p className="text-white/80">{highlight.description}</p>
                  </div>
                )}

                {highlight.type === "challenge" && (
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <Award className="h-5 w-5 text-[#39ff14] mr-2" />
                      <span className="text-sm font-medium text-white/80">{highlight.title}</span>
                    </div>

                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 rounded overflow-hidden mr-4">
                        <img
                          src={highlight.thumbnail || "/placeholder.svg"}
                          alt={highlight.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-white mb-1">{highlight.name}</h3>
                        <div className="flex items-center text-white/60 text-sm">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{highlight.participants.toLocaleString()} participants</span>
                        </div>
                      </div>
                    </div>

                    <button className="w-full py-2 bg-[#39ff14]/20 text-[#39ff14] rounded-lg text-sm font-medium hover:bg-[#39ff14]/30 transition-colors">
                      Join Challenge
                    </button>
                  </div>
                )}

                {highlight.type === "creator" && (
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-[#00d9ff]">
                      <img
                        src={highlight.avatar || "/placeholder.svg"}
                        alt={highlight.username}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="bg-[#00d9ff] text-black text-xs font-bold px-3 py-1 rounded-full mb-2">
                      {highlight.badge}
                    </div>

                    <h3 className="font-bold text-white mb-2">{highlight.username}</h3>
                    <p className="text-white/80 mb-4">{highlight.description}</p>

                    <div className="flex justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-[#00d9ff]" fill="#00d9ff" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
