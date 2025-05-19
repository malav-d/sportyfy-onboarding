"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavigationBar } from "@/components/navigation-bar"
import { Calendar, Edit, Share2, Trophy, Zap, Medal, Clock } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme-context"

// Sample data for the radar chart
const skillData = [
  { skill: "Shooting", value: 75 },
  { skill: "Dribbling", value: 85 },
  { skill: "Passing", value: 65 },
  { skill: "Defense", value: 50 },
  { skill: "Stamina", value: 80 },
]

// Sample data for achievements
const achievements = [
  {
    id: 1,
    name: "Sharpshooter",
    description: "Made 50 three-pointers",
    icon: <Trophy className="h-6 w-6 text-[#ff073a]" />,
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Streak Master",
    description: "Maintained a 10-day streak",
    icon: <Zap className="h-6 w-6 text-[#00d9ff]" />,
    date: "1 week ago",
  },
  {
    id: 3,
    name: "Challenge Champion",
    description: "Completed 25 challenges",
    icon: <Medal className="h-6 w-6 text-[#00d9ff]" />,
    date: "2 weeks ago",
  },
]

// Sample data for recent activity
const recentActivity = [
  {
    id: 1,
    action: "Completed challenge",
    challenge: "3-Point Precision",
    xp: 250,
    time: "Today",
  },
  {
    id: 2,
    action: "Achieved new level",
    challenge: "Level 9",
    xp: 500,
    time: "Yesterday",
  },
  {
    id: 3,
    action: "Earned badge",
    challenge: "Sharpshooter",
    xp: 100,
    time: "3 days ago",
  },
]

export function ProfileOverview() {
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
          <h1 className="font-poppins text-xl font-bold">Profile</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 border-0 bg-[#0f0f13] text-white">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 border-0 bg-[#0f0f13] text-white">
              <Edit className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Profile Header */}
          <Card className="bg-[#1a1a22] border-0">
            <CardContent className="p-6">
              <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
                <div className="relative mb-4 sm:mb-0">
                  <Avatar className={`h-24 w-24 border-4 border-[${theme.colors.primary}]`}>
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User avatar" />
                    <AvatarFallback className={`bg-[${theme.colors.primary}] text-2xl text-white`}>JD</AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[${theme.colors.primary}] text-white`}
                  >
                    <span className="text-sm font-bold">{currentLevel}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
                  <h2 className="font-poppins text-2xl font-bold">Jordan Davis</h2>
                  <p className="text-gray-400">Basketball enthusiast from New York</p>
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <Badge className={`bg-[${theme.colors.primary}]`}>Basketball</Badge>
                    <Badge className={`bg-[${theme.colors.secondary}]`}>Fitness</Badge>
                    <Badge
                      variant="outline"
                      className={`border-[${theme.colors.primary}] text-[${theme.colors.primary}]`}
                    >
                      Soccer
                    </Badge>
                  </div>
                  <div className="mt-4 w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Level {currentLevel}</span>
                      <span className="text-sm text-gray-400">
                        {currentXp}/{nextLevelXp} XP
                      </span>
                    </div>
                    <Progress value={xpProgress} className={`h-2 bg-[${theme.colors.primary}]`} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card className="bg-[#1a1a22] border-0">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div
                  className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[${theme.colors.primary}]/10`}
                >
                  <Trophy className={`h-5 w-5 text-[${theme.colors.primary}]`} />
                </div>
                <p className="text-2xl font-bold">127</p>
                <p className="text-center text-xs text-gray-400">Challenges Completed</p>
              </CardContent>
            </Card>
            <Card className="bg-[#1a1a22] border-0">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div
                  className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[${theme.colors.primary}]/10`}
                >
                  <Clock className={`h-5 w-5 text-[${theme.colors.primary}]`} />
                </div>
                <p className="text-2xl font-bold">48h</p>
                <p className="text-center text-xs text-gray-400">Training Time</p>
              </CardContent>
            </Card>
            <Card className="bg-[#1a1a22] border-0">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div
                  className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[${theme.colors.primary}]/10`}
                >
                  <Zap className={`h-5 w-5 text-[${theme.colors.primary}]`} />
                </div>
                <p className="text-2xl font-bold">{streakDays}</p>
                <p className="text-center text-xs text-gray-400">Day Streak</p>
              </CardContent>
            </Card>
            <Card className="bg-[#1a1a22] border-0">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div
                  className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[${theme.colors.primary}]/10`}
                >
                  <Medal className={`h-5 w-5 text-[${theme.colors.primary}]`} />
                </div>
                <p className="text-2xl font-bold">15</p>
                <p className="text-center text-xs text-gray-400">Achievements</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="skills" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#1a1a22]">
              <TabsTrigger
                value="skills"
                className={`data-[state=active]:bg-[${theme.colors.primary}] data-[state=active]:text-white`}
              >
                Skills
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className={`data-[state=active]:bg-[${theme.colors.primary}] data-[state=active]:text-white`}
              >
                Achievements
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className={`data-[state=active]:bg-[${theme.colors.primary}] data-[state=active]:text-white`}
              >
                Activity
              </TabsTrigger>
            </TabsList>
            <TabsContent value="skills" className="mt-4">
              <Card className="bg-[#1a1a22] border-0">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Skill Levels</span>
                    <Link href="/skill-tree">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`border-[${theme.colors.secondary}] text-[${theme.colors.secondary}] hover:bg-[${theme.colors.secondary}] hover:text-white`}
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
                          <span className="text-sm text-gray-400">{skill.value}%</span>
                        </div>
                        <Progress
                          value={skill.value}
                          className="h-2 bg-[${theme.colors.primary}]"                          
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="achievements" className="mt-4">
              <Card className="bg-[#1a1a22] border-0">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recent Achievements</span>
                    <Button variant="ghost" size="sm" className={`text-[${theme.colors.secondary}]`}>
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f0f13]">
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{achievement.name}</h4>
                          <p className="text-sm text-gray-300">{achievement.description}</p>
                          <p className="text-xs text-gray-400">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="activity" className="mt-4">
              <Card className="bg-[#1a1a22] border-0">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative space-y-4 pl-6">
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-[#0f0f13]"></div>
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="relative">
                        <div
                          className={`absolute -left-6 top-0 h-4 w-4 rounded-full bg-[${theme.colors.primary}]`}
                        ></div>
                        <div className="rounded-lg border border-[#0f0f13] p-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{activity.action}</h4>
                            <Badge className={`bg-[${theme.colors.primary}]`}>+{activity.xp} XP</Badge>
                          </div>
                          <p className="text-sm text-gray-300">{activity.challenge}</p>
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Calendar Section */}
          <Card className="bg-[#1a1a22] border-0">
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
                        hasActivity ? `bg-[${theme.colors.primary}]` : "bg-[#0f0f13]"
                      } transition-colors hover:opacity-80`}
                    ></div>
                  )
                })}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="h-3 w-3 rounded-sm bg-[#0f0f13]"></div>
                  <div className={`h-3 w-3 rounded-sm bg-[${theme.colors.primary}]/30`}></div>
                  <div className={`h-3 w-3 rounded-sm bg-[${theme.colors.primary}]/60`}></div>
                  <div className={`h-3 w-3 rounded-sm bg-[${theme.colors.primary}]`}></div>
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
