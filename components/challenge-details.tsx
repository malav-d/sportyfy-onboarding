"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Award,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Dumbbell,
  Play,
  Share2,
  Star,
  Trophy,
} from "lucide-react"
import Link from "next/link"

export function ChallengeDetails() {
  const [expandedSections, setExpandedSections] = useState({
    equipment: false,
    progression: true,
    skills: false,
    reviews: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-poppins text-lg font-bold">Challenge Details</h1>
          <div className="ml-auto">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Video Preview */}
        <div className="relative aspect-video w-full bg-gray-900">
          <img
            src="/placeholder.svg?height=300&width=600"
            alt="Challenge preview"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button size="icon" className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm">
              <Play className="h-8 w-8 text-white" fill="white" />
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <Badge className="mb-2 bg-[#5c3bfe]">Basketball</Badge>
            <h2 className="font-poppins text-2xl font-bold text-white">3-Point Precision</h2>
            <div className="mt-1 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400" fill="rgb(250 204 21)" />
                <span className="text-sm text-white">4.8</span>
              </div>
              <div className="h-4 w-px bg-white/30"></div>
              <div className="flex items-center gap-1">
                <Avatar className="h-4 w-4">
                  <AvatarFallback className="text-[8px]">U</AvatarFallback>
                </Avatar>
                <span className="text-sm text-white">1,243 athletes</span>
              </div>
              <div className="h-4 w-px bg-white/30"></div>
              <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                Intermediate
              </Badge>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl p-4">
          <div className="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5c3bfe]/10">
                <Trophy className="h-6 w-6 text-[#5c3bfe]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Reward</p>
                <p className="font-poppins text-xl font-bold text-[#5c3bfe]">+250 XP</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5c3bfe]/10">
                <Clock className="h-6 w-6 text-[#5c3bfe]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Time</p>
                <p className="font-medium">15 minutes</p>
              </div>
            </div>
          </div>

          <Card className="mb-4">
            <CardContent className="p-4">
              <h3 className="mb-2 font-poppins text-lg font-medium">Description</h3>
              <p className="text-gray-600">
                Master the art of 3-point shooting with this precision challenge. Improve your shooting form, accuracy,
                and consistency from beyond the arc. This challenge will help you develop the muscle memory needed for
                reliable long-range shooting.
              </p>
            </CardContent>
          </Card>

          {/* Equipment Section */}
          <Card className="mb-4">
            <CardContent className="p-0">
              <button
                className="flex w-full items-center justify-between p-4"
                onClick={() => toggleSection("equipment")}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5c3bfe]/10">
                    <Dumbbell className="h-5 w-5 text-[#5c3bfe]" />
                  </div>
                  <h3 className="font-poppins text-lg font-medium">Equipment Needed</h3>
                </div>
                {expandedSections.equipment ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {expandedSections.equipment && (
                <div className="border-t px-4 py-3">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Basketball</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Basketball court with 3-point line</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Smartphone with camera</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Water bottle</span>
                    </li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progression Section */}
          <Card className="mb-4">
            <CardContent className="p-0">
              <button
                className="flex w-full items-center justify-between p-4"
                onClick={() => toggleSection("progression")}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5c3bfe]/10">
                    <Award className="h-5 w-5 text-[#5c3bfe]" />
                  </div>
                  <h3 className="font-poppins text-lg font-medium">Challenge Progression</h3>
                </div>
                {expandedSections.progression ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {expandedSections.progression && (
                <div className="border-t px-4 py-3">
                  <div className="space-y-4">
                    <div className="relative flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5c3bfe] text-white">
                          1
                        </div>
                        <div className="mt-2 h-full w-0.5 bg-gray-200"></div>
                      </div>
                      <div className="flex-1 pb-6">
                        <h4 className="font-medium">Warm-up Shots</h4>
                        <p className="text-sm text-gray-600">
                          Take 10 warm-up shots from different positions around the 3-point line to get comfortable.
                        </p>
                      </div>
                    </div>
                    <div className="relative flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5c3bfe] text-white">
                          2
                        </div>
                        <div className="mt-2 h-full w-0.5 bg-gray-200"></div>
                      </div>
                      <div className="flex-1 pb-6">
                        <h4 className="font-medium">Form Check</h4>
                        <p className="text-sm text-gray-600">
                          Record your shooting form from the side angle and analyze your technique.
                        </p>
                      </div>
                    </div>
                    <div className="relative flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5c3bfe] text-white">
                          3
                        </div>
                        <div className="mt-2 h-full w-0.5 bg-gray-200"></div>
                      </div>
                      <div className="flex-1 pb-6">
                        <h4 className="font-medium">Corner Shots</h4>
                        <p className="text-sm text-gray-600">
                          Take 10 shots from each corner of the 3-point line. Record your accuracy.
                        </p>
                      </div>
                    </div>
                    <div className="relative flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5c3bfe] text-white">
                          4
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Top of the Key Challenge</h4>
                        <p className="text-sm text-gray-600">
                          Take 20 shots from the top of the key. Aim for at least 10 successful shots to complete the
                          challenge.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card className="mb-4">
            <CardContent className="p-0">
              <button className="flex w-full items-center justify-between p-4" onClick={() => toggleSection("skills")}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5c3bfe]/10">
                    <Trophy className="h-5 w-5 text-[#5c3bfe]" />
                  </div>
                  <h3 className="font-poppins text-lg font-medium">Skills You'll Develop</h3>
                </div>
                {expandedSections.skills ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {expandedSections.skills && (
                <div className="border-t px-4 py-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-gray-200 p-3">
                      <h4 className="font-medium">Shooting Form</h4>
                      <Progress value={85} className="mt-2 h-2" />
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3">
                      <h4 className="font-medium">Accuracy</h4>
                      <Progress value={70} className="mt-2 h-2 bg-[#5c3bfe]" />
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3">
                      <h4 className="font-medium">Consistency</h4>
                      <Progress value={65} className="mt-2 h-2" />
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3">
                      <h4 className="font-medium">Focus</h4>
                      <Progress value={80} className="mt-2 h-2" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card className="mb-4">
            <CardContent className="p-0">
              <button className="flex w-full items-center justify-between p-4" onClick={() => toggleSection("reviews")}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5c3bfe]/10">
                    <Star className="h-5 w-5 text-[#5c3bfe]" />
                  </div>
                  <h3 className="font-poppins text-lg font-medium">User Reviews</h3>
                </div>
                {expandedSections.reviews ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {expandedSections.reviews && (
                <div className="border-t px-4 py-3">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-3xl font-bold">4.8</div>
                      <div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">Based on 128 reviews</p>
                      </div>
                    </div>
                    <Button className="bg-[#5c3bfe]">Write a Review</Button>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                            <AvatarFallback>MJ</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Michael Johnson</p>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${
                                    star <= 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">2 days ago</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        This challenge really improved my 3-point shooting! The form check was especially helpful in
                        identifying issues with my technique.
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                            <AvatarFallback>SL</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Sarah Lee</p>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${
                                    star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">1 week ago</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Great challenge! I saw improvement in my shooting percentage after just a few sessions. Would
                        recommend to anyone looking to improve their long-range game.
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" className="mt-3 w-full text-[#5c3bfe]">
                    View All Reviews
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 border-t bg-white p-4 shadow-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Challenge Reward</p>
            <p className="font-poppins text-xl font-bold text-[#5c3bfe]">+250 XP</p>
          </div>
          <Link href="/challenge-prep">
            <Button className="bg-[#5c3bfe] px-8 py-6 text-lg font-medium">Start Challenge</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
