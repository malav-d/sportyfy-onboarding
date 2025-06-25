"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavigationBar } from "@/components/navigation-bar"
import { Calendar, Trophy, Zap, Medal, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme-context"

// Sample data for the radar chart
const skillData = [
  { skill: "Fitness", value: 80 },
  { skill: "Yoga", value: 70 },
  { skill: "Basketball", value: 90 },
]

// Sample data for achievements
const achievements = [
  {
    id: 1,
    name: "Fitness Fanatic",
    description: "Completed 30 fitness workouts",
    icon: <Trophy className="h-6 w-6 text-gray-600" />,
    date: "1 week ago",
  },
  {
    id: 2,
    name: "Yoga Master",
    description: "Achieved advanced yoga poses",
    icon: <Zap className="h-6 w-6 text-gray-600" />,
    date: "2 weeks ago",
  },
  {
    id: 3,
    name: "Basketball Pro",
    description: "Scored 100 baskets",
    icon: <Medal className="h-6 w-6 text-gray-600" />,
    date: "3 weeks ago",
  },
]

// Sample data for recent activity
const recentActivity = [
  {
    id: 1,
    action: "Completed fitness workout",
    challenge: "Core Strength",
    xp: 300,
    time: "Today",
  },
  {
    id: 2,
    action: "Improved yoga pose",
    challenge: "Advanced Balance",
    xp: 400,
    time: "Yesterday",
  },
  {
    id: 3,
    action: "Practiced basketball drills",
    challenge: "Shooting Accuracy",
    xp: 200,
    time: "2 days ago",
  },
]

export function ProfileOverview() {
  const [currentXp, setCurrentXp] = useState(750)
  const [nextLevelXp, setNextLevelXp] = useState(1000)
  const [currentLevel, setCurrentLevel] = useState(8)
  const [streakDays, setStreakDays] = useState(12)
  const theme = useTheme()
  const router = useRouter()

  const xpProgress = (currentXp / nextLevelXp) * 100

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
                className="text-gray-600 hover:text-black transition-colors font-medium"
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
                className="text-black font-medium border-b-2 border-black pb-1"
              >
                Profile
              </button>
            </div>

            {/* Right Side - User Info */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Hi, Jordan</span>
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

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Profile Header */}
          <Card className="border">
            <CardContent className="p-6">
              <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
                <div className="relative mb-4 sm:mb-0">
                  <Avatar className="h-24 w-24 border-4 border-gray-300">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User avatar" />
                    <AvatarFallback className="bg-gray-600 text-2xl text-white">JD</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-white">
                    <span className="text-sm font-bold">{currentLevel}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
                  <h2 className="font-poppins text-2xl font-bold">Jordan Davis</h2>
                  <p className="text-gray-500">Fitness enthusiast from New York</p>
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <Badge className="bg-gray-100 text-gray-800 border border-gray-300">Fitness</Badge>
                    <Badge className="bg-gray-200 text-gray-900 border border-gray-400">Yoga</Badge>
                    <Badge variant="outline" className="border-gray-400 text-gray-700">
                      Basketball
                    </Badge>
                  </div>
                  <div className="mt-4 w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Level {currentLevel}</span>
                      <span className="text-sm text-gray-500">
                        {currentXp}/{nextLevelXp} XP
                      </span>
                    </div>
                    <Progress value={xpProgress} className="h-2 bg-gray-300" />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Skill Assessment Score: <span className="font-semibold">85/100</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Potential: <span className="font-semibold">High</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Improvement Trajectory: <span className="font-semibold">Steady</span>
                    </p>
                    <div className="flex items-center mt-2">
                      <p className="text-sm text-gray-500 mr-2">Skill Verification:</p>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card className="border">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <Trophy className="h-5 w-5 text-gray-600" />
                </div>
                <p className="text-2xl font-bold">127</p>
                <p className="text-center text-xs text-gray-500">Challenges Completed</p>
              </CardContent>
            </Card>
            <Card className="border">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold">48h</p>
                <p className="text-center text-xs text-gray-500">Training Time</p>
              </CardContent>
            </Card>
            <Card className="border">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <Zap className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold">{streakDays}</p>
                <p className="text-center text-xs text-gray-500">Day Streak</p>
              </CardContent>
            </Card>
            <Card className="border">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <Medal className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-2xl font-bold">15</p>
                <p className="text-center text-xs text-gray-500">Achievements</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="skills" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 border">
              <TabsTrigger value="skills" className="data-[state=active]:bg-gray-200 data-[state=active]:text-black">
                Skills
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="data-[state=active]:bg-gray-200 data-[state=active]:text-black"
              >
                Achievements
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-gray-200 data-[state=active]:text-black">
                Activity
              </TabsTrigger>
            </TabsList>
            <TabsContent value="skills" className="mt-4">
              <Card className="border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Skill Levels (AI Verified)</span>
                    <Link href="/skill-tree">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                      >
                        View Skill Tree
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {skillData.map((skill) => (
                      <div key={skill.skill}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">{skill.skill}</span>
                          <span className="text-sm text-gray-500">{skill.value}%</span>
                        </div>
                        <Progress value={skill.value} className="h-2 bg-gray-400" />
                        <p className="text-xs text-gray-500 mt-1">Focus on {skill.skill} form improvement.</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="achievements" className="mt-4">
              <Card className="border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recent Achievements</span>
                    <Button variant="ghost" size="sm" className="text-blue-500">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{achievement.name}</h4>
                          <p className="text-sm text-gray-500">{achievement.description}</p>
                          <p className="text-xs text-gray-500">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="activity" className="mt-4">
              <Card className="border">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative space-y-4 pl-6">
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="relative">
                        <div className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-gray-600"></div>
                        <div className="rounded-lg border border-gray-200 p-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{activity.action}</h4>
                            <Badge className="bg-gray-100 text-gray-800 border border-gray-300">
                              +{activity.xp} XP
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{activity.challenge}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Calendar Section */}
          <Card className="border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Activity Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }).map((_, i) => {
                  // Randomly determine if the day has activity
                  const hasActivity = Math.random() > 0.4
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-md ${
                        hasActivity ? "bg-gray-600" : "bg-gray-200"
                      } transition-colors hover:opacity-80`}
                    ></div>
                  )
                })}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="h-3 w-3 rounded-sm bg-gray-200"></div>
                  <div className="h-3 w-3 rounded-sm bg-gray-300"></div>
                  <div className="h-3 w-3 rounded-sm bg-gray-500"></div>
                  <div className="h-3 w-3 rounded-sm bg-gray-600"></div>
                </div>
                <span>More</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <NavigationBar />
    </div>
  )
}
