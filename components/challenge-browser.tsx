"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavigationBar } from "@/components/navigation-bar"
import { ArrowLeft, Filter, Search } from "lucide-react"
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
    title: "Free Throw Mastery",
    category: "Basketball",
    difficulty: "Beginner",
    xp: 180,
    participants: 3421,
    thumbnail: "/placeholder.svg?height=120&width=200",
    isNew: false,
  },
  {
    id: 4,
    title: "Penalty Kick Precision",
    category: "Soccer",
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
    title: "Ball Control Mastery",
    category: "Soccer",
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
    title: "Serve Accuracy",
    category: "Tennis",
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
    <div className="flex min-h-screen flex-col bg-[#0f0f13]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#1a1a22] p-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-white hover:bg-[#0f0f13]/50">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-9 bg-[#0f0f13] border-0 text-white"
              placeholder="Search challenges"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 border-0 bg-[#0f0f13] text-white">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="sticky top-[73px] z-10 bg-[#1a1a22] px-4 shadow-sm">
        <div className="mx-auto max-w-5xl">
          <div className="scrollbar-hide -mx-1 flex overflow-x-auto py-3">
            {["All", "Basketball", "Soccer", "Fitness", "Tennis", "Volleyball"].map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={`mx-1 shrink-0 ${
                  activeCategory === category
                    ? `bg-[${theme.colors.primary}]`
                    : "border-[#0f0f13] bg-[#0f0f13] text-gray-300 hover:text-white"
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
      <div className="bg-[#1a1a22] px-4 pb-2 pt-1 shadow-sm">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">{filteredChallenges.length} challenges found</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <Tabs defaultValue="Popular" className="w-[180px]">
                <TabsList className="h-8 bg-[#0f0f13]">
                  <TabsTrigger
                    value="Popular"
                    className={`h-6 text-xs data-[state=active]:bg-[${theme.colors.primary}] data-[state=active]:text-white`}
                    onClick={() => setActiveSort("Popular")}
                  >
                    Popular
                  </TabsTrigger>
                  <TabsTrigger
                    value="New"
                    className={`h-6 text-xs data-[state=active]:bg-[${theme.colors.primary}] data-[state=active]:text-white`}
                    onClick={() => setActiveSort("New")}
                  >
                    New
                  </TabsTrigger>
                  <TabsTrigger
                    value="XP"
                    className={`h-6 text-xs data-[state=active]:bg-[${theme.colors.primary}] data-[state=active]:text-white`}
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
                  className="overflow-hidden bg-[#1a1a22] border-0 transition-transform hover:scale-[1.02]"
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
                        {challenge.isNew && <Badge className={`bg-[${theme.colors.secondary}] text-white`}>New</Badge>}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-poppins font-medium">{challenge.title}</h4>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            challenge.difficulty === "Beginner"
                              ? `border-[${theme.colors.secondary}] text-[${theme.colors.secondary}]`
                              : challenge.difficulty === "Intermediate"
                                ? `border-[${theme.colors.primary}] text-[${theme.colors.primary}]`
                                : `border-[${theme.colors.primary}] text-[${theme.colors.primary}]`
                          }
                        >
                          {challenge.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-[8px] bg-[#0f0f13]">U</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-400">{challenge.participants}</span>
                        </div>
                      </div>
                      <Badge className={`bg-[${theme.colors.primary}]`}>+{challenge.xp} XP</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#1a1a22] p-6 text-center">
              <p className="text-gray-400">No challenges found</p>
              <Button
                variant="link"
                className={`text-[${theme.colors.secondary}]`}
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
