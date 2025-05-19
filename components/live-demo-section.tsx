"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LiveIndicator } from "@/components/live-indicator"
import { Play, Heart, MessageCircle, Share2 } from "lucide-react"

interface LiveDemoSectionProps {
  viewerCount: number
  earnings: number
}

export function LiveDemoSection({ viewerCount, earnings }: LiveDemoSectionProps) {
  const [activeTab, setActiveTab] = useState("create")

  const liveStreams = [
    {
      title: "Mumbai Cricket Finals",
      viewers: 1243,
      creator: "Rahul S.",
      thumbnail: "/placeholder.svg?height=200&width=350",
    },
    {
      title: "Street Basketball Tournament",
      viewers: 876,
      creator: "Priya P.",
      thumbnail: "/placeholder.svg?height=200&width=350",
    },
    {
      title: "College Football Match",
      viewers: 654,
      creator: "Arjun K.",
      thumbnail: "/placeholder.svg?height=200&width=350",
    },
  ]

  return (
    <section className="py-20 bg-[#1c1c1c]" id="sports">
      <div className="container mx-auto px-4">
        <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl text-center mb-16 tracking-wide">
          LIVE <span className="text-[#f23c21]">DEMO</span>
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="bg-[#252525] rounded-sm overflow-hidden">
            <div className="flex border-b border-[#1c1c1c]">
              <button
                className={`flex-1 py-3 font-medium text-center transition-colors ${
                  activeTab === "create" ? "bg-[#f23c21] text-white" : "bg-transparent text-gray-400"
                }`}
                onClick={() => setActiveTab("create")}
              >
                CREATE STREAM
              </button>
              <button
                className={`flex-1 py-3 font-medium text-center transition-colors ${
                  activeTab === "watch" ? "bg-[#f23c21] text-white" : "bg-transparent text-gray-400"
                }`}
                onClick={() => setActiveTab("watch")}
              >
                WATCH STREAM
              </button>
              <button
                className={`flex-1 py-3 font-medium text-center transition-colors ${
                  activeTab === "earn" ? "bg-[#f23c21] text-white" : "bg-transparent text-gray-400"
                }`}
                onClick={() => setActiveTab("earn")}
              >
                EARN
              </button>
            </div>

            <div className="p-6">
              {activeTab === "create" && (
                <div>
                  <div className="relative aspect-[16/9] bg-black rounded-sm overflow-hidden mb-6">
                    <img
                      src="/placeholder.svg?height=400&width=700"
                      alt="Stream preview"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button className="bg-[#f23c21] hover:bg-[#d32c15] text-white font-medium px-6 py-2 rounded-sm">
                        START STREAMING
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#1c1c1c] p-4 rounded-sm">
                      <h4 className="font-medium mb-2">1. Choose Sport</h4>
                      <div className="flex flex-wrap gap-2">
                        {["Cricket", "Football", "Basketball", "Hockey", "Other"].map((sport, index) => (
                          <div
                            key={index}
                            className={`px-3 py-1 rounded-sm text-sm ${
                              index === 0 ? "bg-[#f23c21] text-white" : "bg-[#252525] text-gray-300"
                            }`}
                          >
                            {sport}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#1c1c1c] p-4 rounded-sm">
                      <h4 className="font-medium mb-2">2. Add Details</h4>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Stream Title"
                          className="w-full bg-[#252525] border-0 rounded-sm p-2 text-white text-sm"
                          defaultValue="Mumbai Cricket Finals"
                        />
                        <input
                          type="text"
                          placeholder="Location"
                          className="w-full bg-[#252525] border-0 rounded-sm p-2 text-white text-sm"
                          defaultValue="Shivaji Park, Mumbai"
                        />
                      </div>
                    </div>

                    <div className="bg-[#1c1c1c] p-4 rounded-sm">
                      <h4 className="font-medium mb-2">3. Go Live</h4>
                      <p className="text-sm text-gray-300 mb-3">Your camera and microphone are ready.</p>
                      <Button className="w-full bg-[#f23c21] hover:bg-[#d32c15] text-white font-medium rounded-sm">
                        START <span className="ml-1">→</span>
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 text-center">
                    It's that simple! No downloads, no complicated setup - just point and stream.
                  </p>
                </div>
              )}

              {activeTab === "watch" && (
                <div>
                  <h3 className="font-['Bebas_Neue'] text-2xl mb-4 tracking-wide flex items-center">
                    <LiveIndicator />
                    <span className="ml-2">CURRENTLY LIVE</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {liveStreams.map((stream, index) => (
                      <div key={index} className="bg-[#1c1c1c] rounded-sm overflow-hidden">
                        <div className="relative">
                          <img
                            src={stream.thumbnail || "/placeholder.svg"}
                            alt={stream.title}
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute top-2 left-2 flex items-center bg-black/70 px-2 py-1 rounded-sm">
                            <LiveIndicator />
                            <span className="ml-2 text-xs">{stream.viewers}</span>
                          </div>
                          <div className="absolute bottom-2 right-2">
                            <Button size="sm" className="bg-[#f23c21] hover:bg-[#d32c15] h-8 rounded-sm">
                              <Play className="h-4 w-4 mr-1" /> Watch
                            </Button>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium truncate">{stream.title}</h4>
                          <p className="text-xs text-gray-400">{stream.creator}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#1c1c1c] rounded-sm overflow-hidden">
                    <div className="relative aspect-video">
                      <img
                        src="/placeholder.svg?height=400&width=700"
                        alt="Live stream"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex items-center bg-black/70 px-2 py-1 rounded-sm">
                        <LiveIndicator />
                        <span className="ml-2 text-xs">{viewerCount}</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <h3 className="font-medium">Mumbai Cricket Finals</h3>
                        <p className="text-xs text-gray-300">Rahul S. • Shivaji Park, Mumbai</p>
                      </div>
                    </div>
                    <div className="p-3 flex justify-between">
                      <div className="flex space-x-4">
                        <button className="flex items-center text-gray-400 hover:text-[#f23c21]">
                          <Heart className="h-5 w-5 mr-1" />
                          <span className="text-xs">2.4K</span>
                        </button>
                        <button className="flex items-center text-gray-400 hover:text-[#f23c21]">
                          <MessageCircle className="h-5 w-5 mr-1" />
                          <span className="text-xs">482</span>
                        </button>
                        <button className="flex items-center text-gray-400 hover:text-[#f23c21]">
                          <Share2 className="h-5 w-5 mr-1" />
                          <span className="text-xs">Share</span>
                        </button>
                      </div>
                      <Button size="sm" className="bg-[#f23c21] hover:bg-[#d32c15] h-8 rounded-sm">
                        Support
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "earn" && (
                <div>
                  <div className="bg-[#1c1c1c] p-6 rounded-sm mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                      <div>
                        <h3 className="font-['Bebas_Neue'] text-2xl tracking-wide">YOUR EARNINGS</h3>
                        <p className="text-sm text-gray-400">Last 30 days</p>
                      </div>
                      <div className="font-['Bebas_Neue'] text-4xl text-[#f23c21]">₹{earnings.toLocaleString()}</div>
                    </div>

                    <div className="h-32 bg-[#252525] rounded-sm mb-4 relative overflow-hidden">
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-[#f23c21]/20"></div>
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-[#f23c21]/30"></div>
                      <div className="absolute inset-x-0 bottom-0 h-8 bg-[#f23c21]/40"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-400">Viewers</p>
                        <p className="font-medium">{viewerCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Tips</p>
                        <p className="font-medium">₹3,250</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Subscribers</p>
                        <p className="font-medium">124</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Sponsors</p>
                        <p className="font-medium">2</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#1c1c1c] p-4 rounded-sm">
                      <h4 className="font-medium mb-3">Withdraw Earnings</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Available Balance</span>
                          <span className="font-medium text-[#f23c21]">₹{earnings.toLocaleString()}</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Enter amount"
                          className="w-full bg-[#252525] border-0 rounded-sm p-2 text-white text-sm"
                        />
                        <Button className="w-full bg-[#f23c21] hover:bg-[#d32c15] text-white font-medium rounded-sm">
                          Withdraw to Bank
                        </Button>
                      </div>
                    </div>

                    <div className="bg-[#1c1c1c] p-4 rounded-sm">
                      <h4 className="font-medium mb-3">Earnings Breakdown</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Viewer Tips</span>
                          <span className="font-medium">₹3,250 (40%)</span>
                        </div>
                        <div className="w-full bg-[#252525] h-2 rounded-full overflow-hidden">
                          <div className="bg-[#f23c21] h-full" style={{ width: "40%" }}></div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm">Subscriptions</span>
                          <span className="font-medium">₹2,480 (31%)</span>
                        </div>
                        <div className="w-full bg-[#252525] h-2 rounded-full overflow-hidden">
                          <div className="bg-[#f23c21] h-full" style={{ width: "31%" }}></div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm">Sponsorships</span>
                          <span className="font-medium">₹2,273 (29%)</span>
                        </div>
                        <div className="w-full bg-[#252525] h-2 rounded-full overflow-hidden">
                          <div className="bg-[#f23c21] h-full" style={{ width: "29%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button className="bg-[#f23c21] hover:bg-[#d32c15] text-white font-medium px-8 py-6 text-lg rounded-sm">
              TRY IT NOW <span className="ml-1">→</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
