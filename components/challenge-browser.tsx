"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavigationBar } from "@/components/navigation-bar"
import { useTheme } from "@/components/theme-context"

interface Challenge {
  id: number
  title: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  xp: number
  participants: number
  thumbnail: string
  isNew: boolean
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "3-Point Precision",
    category: "Basketball",
    difficulty: "Intermediate",
    xp: 250,
    participants: 1243,
    thumbnail: "/placeholder.svg?height=120&width=200",
    isNew: true,
  },
  {
    id: 2,
    title: "Speed Dribbling",
    category: "Basketball",
    difficulty: "Beginner",
    xp: 150,
    participants: 2567,
    thumbnail: "/placeholder.svg?height=120&width=200",
    isNew: false,
  },
  {
    id: 3,
    title: "Core Strength",
    category: "Fitness",
    difficulty: "Beginner",
    xp: 180,
    participants: 3421,
    thumbnail: "/placeholder.svg?height=120&width=200",
    isNew: false,
  },
  {
    id: 4,
    title: "Yoga Flow",
    category: "Yoga",
    difficulty: "Intermediate",
    xp: 220,
    participants: 1876,
    thumbnail: "/placeholder.svg?height=120&width=200",
    isNew: true,
  },
  {
    id: 5,
    title: "Agility Ladder Drills",
    category: "Fitness",
    difficulty: "Advanced",
    xp: 350,
    participants: 876,
    thumbnail: "/placeholder.svg?height=120&width=200",
    isNew: true,
  },
  {
    id: 6,
    title: "Balance Poses",
    category: "Yoga",
    difficulty: "Advanced",
    xp: 320,
    participants: 1432,
    thumbnail: "/placeholder.svg?height=120&width=200",
    isNew: false,
  },
  {
    id: 7,
    title: "HIIT Cardio Workout",
    category: "Fitness",
    difficulty: "Intermediate",
    xp: 280,
    participants: 2134,
    thumbnail: "/placeholder.svg?height=120&width=200",
    isNew: false,
  },
  {
    id: 8,
    title: "Shooting Drills",
    category: "Basketball",
    difficulty: "Intermediate",
    xp: 230,
    participants: 987,
    thumbnail: "/placeholder.svg?height=120&width=200",
    isNew: true,
  },
]

export function ChallengeBrowser() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeSort, setActiveSort] = useState("Popular")
  const theme = useTheme()
  const router = useRouter()

  const filteredChallenges = challenges.filter((challenge) => {
    if (activeCategory !== "All" && challenge.category !== activeCategory) {
      return false
    }

    if (searchQuery && !challenge.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    return true
  })

  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    if (activeSort === "New") {
      return a.isNew ? -1 : 1
    } else if (activeSort === "Popular") {
      return b.participants - a.participants
    } else if (activeSort === "XP") {
      return b.xp - a.xp
    }
    return 0
  })

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Desktop Navigation - Top Bar */}
      <div className="hidden md:block border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black tracking-tight">
                SPORTYFY<span className="text-gray-600">.LIVE</span>
              </h1>
            </div>

            {/* Center Navigation */}
            <div className="flex items-center space-x-8">
              <button
                onClick={() => router.push("/challenges")}
                className="text-black font-medium border-b-2 border-black pb-1"
              >
                Challenges
              </button>
              <button
                onClick={() => router.push("/skill-tree")}
                className="text-gray-600 hover:text-black transition-colors font-medium"
              >
                Pathways
              </button>
              <button
                onClick={() => router.push("/social")}
                className="text-gray-600 hover:text-black transition-colors font-medium"
              >
                Social
              </button>
              <button
                onClick={() => router.push("/profile")}
                className="text-gray-600 hover:text-black transition-colors font-medium"
              >
                Profile
              </button>
            </div>

            {/* Right Side - User Info */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Hi, User</span>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors font-medium"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-[73px] z-10 bg-white px-4 shadow-sm">
        <div className="mx-auto max-w-5xl">
          <div className="scrollbar-hide -mx-1 flex overflow-x-auto py-3">
            {["All", "Fitness", "Yoga", "Basketball"].map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={`mx-1 shrink-0 ${
                  activeCategory === category
                    ? `bg-gray-900 text-white`
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="bg-white px-4 pb-2 pt-1 shadow-sm">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{filteredChallenges.length} challenges found</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <Tabs defaultValue="Popular" className="w-[180px]">
                <TabsList className="h-8 bg-gray-100">
                  <TabsTrigger
                    value="Popular"
                    className={`h-6 text-xs data-[state=active]:bg-gray-900 data-[state=active]:text-white`}
                    onClick={() => setActiveSort("Popular")}
                  >
                    Popular
                  </TabsTrigger>
                  <TabsTrigger
                    value="New"
                    className={`h-6 text-xs data-[state=active]:bg-gray-900 data-[state=active]:text-white`}
                    onClick={() => setActiveSort("New")}
                  >
                    New
                  </TabsTrigger>
                  <TabsTrigger
                    value="XP"
                    className={`h-6 text-xs data-[state=active]:bg-gray-900 data-[state=active]:text-white`}
                    onClick={() => setActiveSort("XP")}
                  >
                    XP
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-5xl">
          {sortedChallenges.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedChallenges.map((challenge) => (
                <Card
                  key={challenge.id}
                  className="overflow-hidden bg-white border border-gray-200 transition-transform hover:scale-[1.02]"
                >
                  <div className="relative h-32">
                    <img
                      src={challenge.thumbnail || "/placeholder.svg"}
                      alt={challenge.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-white/20 text-white backdrop-blur-sm">{challenge.category}</Badge>
                        {challenge.isNew && <Badge className="bg-green-500 text-white">New</Badge>}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-poppins font-medium text-gray-800">{challenge.title}</h4>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-gray-400 text-gray-600">
                          {challenge.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-[8px] bg-gray-200 text-gray-700">U</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-500">{challenge.participants}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge className="bg-gray-900 text-white">+{challenge.xp} XP</Badge>
                        <Badge className="bg-green-500 text-white mt-1">AI-Verified</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
              <p className="text-gray-500">No challenges found</p>
              <Button
                variant="link"
                className="text-blue-500"
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("All")
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <NavigationBar />
    </div>
  )
}
