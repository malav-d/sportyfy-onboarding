"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Flame, Search, Trophy } from "lucide-react"
import { NavigationBar } from "@/components/navigation-bar"
import { useTheme } from "@/components/theme-context"

const activityData = [
  { day: "Mon", value: 3 },
  { day: "Tue", value: 5 },
  { day: "Wed", value: 2 },
  { day: "Thu", value: 7 },
  { day: "Fri", value: 4 },
  { day: "Sat", value: 6 },
  { day: "Sun", value: 8 },
]

const friendActivity = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    achievement: "Completed 'Perfect Free Throw' challenge",
    time: "2h ago",
    xp: 150,
  },
  {
    id: 2,
    name: "Sarah Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    achievement: "Reached Level 12 in Basketball",
    time: "5h ago",
    xp: 200,
  },
  {
    id: 3,
    name: "Mike Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    achievement: "New personal record: 3-point streak",
    time: "Yesterday",
    xp: 120,
  },
]

const recommendedChallenges = [
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
    title: "Agility Ladder Drills",
    category: "Fitness",
    difficulty: "Advanced",
    xp: 350,
    participants: 876,
    thumbnail: "/placeholder.svg?height=120&width=200",
    isNew: true,
  },
]

export function HomeDashboard() {
  const [currentXp, setCurrentXp] = useState(750)
  const [nextLevelXp, setNextLevelXp] = useState(1000)
  const [currentLevel, setCurrentLevel] = useState(8)
  const [streakDays, setStreakDays] = useState(12)
  const theme = useTheme()

  const xpProgress = (currentXp / nextLevelXp) * 100

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f13]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#1a1a22] p-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className={`h-10 w-10 border-2 border-[${theme.colors.primary}]`}>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User avatar" />
              <AvatarFallback className={`bg-[${theme.colors.primary}] text-white`}>JD</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-poppins text-lg font-bold">Jordan Davis</h2>
                <Badge className={`bg-[${theme.colors.primary}]`}>Lvl {currentLevel}</Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span>{currentXp} XP</span>
                <span className="text-gray-600">|</span>
                <span className="flex items-center gap-1">
                  <Flame className="h-3 w-3 text-[#ff073a]" />
                  {streakDays} day streak
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="icon" className="rounded-full border-[#1a1a22] bg-[#1a1a22]">
            <Search className="h-5 w-5 text-white" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* XP Progress */}
          <Card className="bg-[#1a1a22] border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Level Progress</p>
                  <p className="font-medium">
                    <span className={`text-[${theme.colors.primary}]`}>{currentXp}</span>
                    <span className="text-gray-400">/{nextLevelXp} XP</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Next Level</p>
                  <p className="font-medium">{currentLevel + 1}</p>
                </div>
              </div>
              <Progress
                value={xpProgress}
                className={`h-2 bg-[${theme.colors.primary}]`}
              />
            </CardContent>
          </Card>

          {/* Today's Challenge */}
          <Card className="overflow-hidden border-0">
            <div
              className={`relative h-40 bg-gradient-to-r from-[${theme.colors.primary}] to-[${theme.colors.secondary}]`}
            >
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                <Badge className="mb-2 w-fit bg-white/20 backdrop-blur-sm">Today's Challenge</Badge>
                <h3 className="font-poppins text-xl font-bold">Perfect Your Jump Shot</h3>
                <p className="text-sm text-white/80">Master the fundamentals of basketball shooting</p>
                <Button className={`mt-3 w-fit bg-white text-[${theme.colors.primary}] hover:bg-white/90`}>
                  Start Challenge
                </Button>
              </div>
            </div>
          </Card>

          {/* Weekly Activity */}
          <Card className="bg-[#1a1a22] border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: "Challenges",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[150px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <Bar
                      dataKey="value"
                      fill="var(--color-value)"
                      radius={[4, 4, 0, 0]}
                      className={`fill-[${theme.colors.primary}]`}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-[${theme.colors.primary}]/10`}
                  >
                    <Trophy className={`h-4 w-4 text-[${theme.colors.primary}]`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">35 challenges</p>
                    <p className="text-xs text-gray-400">This week</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-[${theme.colors.primary}]/10`}
                  >
                    <Flame className={`h-4 w-4 text-[${theme.colors.primary}]`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{streakDays} day streak</p>
                    <p className="text-xs text-gray-400">Keep it up!</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Friend Activity */}
          <Card className="bg-[#1a1a22] border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Friend Activity</CardTitle>
              <Button variant="ghost" className={`h-8 text-xs text-[${theme.colors.secondary}]`}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#0f0f13]">
                {friendActivity.map((friend) => (
                  <div key={friend.id} className="flex items-start gap-3 p-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{friend.name}</p>
                        <Badge
                          variant="outline"
                          className={`text-xs font-normal text-[${theme.colors.primary}] border-[${theme.colors.primary}]`}
                        >
                          +{friend.xp} XP
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300">{friend.achievement}</p>
                      <p className="text-xs text-gray-400">{friend.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Challenges */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-poppins text-lg font-bold">Recommended Challenges</h3>
              <Button variant="ghost" className={`h-8 text-xs text-[${theme.colors.secondary}]`}>
                View All
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedChallenges.map((challenge) => (
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
                        <span className="text-xs text-gray-400">{challenge.participants} athletes</span>
                      </div>
                      <Badge className={`bg-[${theme.colors.primary}]`}>+{challenge.xp} XP</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <NavigationBar />
    </div>
  )
}
