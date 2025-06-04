"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Flame, Trophy, Target, Users, Clock, TrendingUp, Play, Heart, Crown, Zap, Award } from "lucide-react"
import { NavigationBar } from "@/components/navigation-bar"
import { useTheme } from "@/components/theme-context"
import { useAuth } from "@/contexts/auth-context"
import { TutorialChallenge } from "@/components/tutorial-challenge"
import { apiClient } from "@/lib/api"

interface DashboardStats {
  user: {
    id: number
    name: string
    email: string
    phone: string
    level: number
    current_xp: number
    xp_to_next_level: number
    global_rank: number | null
    avatar_url: string | null
    profile_completed: boolean
    has_completed_tutorial: boolean
    created_at: string
    last_activity_at: string | null
  }
  stats: {
    total_xp: number
    badges_count: number
    challenges_won: number
    challenges_completed: number
    current_streak: number
    challenges_in_progress: number
  }
}

interface Challenge {
  id: string
  title: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Expert"
  xp: number
  participants: number
  deadline: string
  thumbnail: string
  isJoined: boolean
  status?: "not_started" | "in_progress" | "submitted" | "completed"
}

interface ActivityItem {
  id: string
  user: {
    name: string
    level: number
    avatar?: string
  }
  action: string
  challenge?: string
  timestamp: string
  likes: number
  isLiked: boolean
}

interface LeaderboardEntry {
  rank: number
  user: {
    id: number
    name: string
    avatar_url: string | null
    level: number
  }
  total_xp: number
  challenges_won: number
  weekly_xp: number
  is_current_user: boolean
}

interface LeaderboardResponse {
  success: boolean
  data: LeaderboardEntry[]
  current_user_rank: number
}

export function HomeDashboard() {
  const [showTutorial, setShowTutorial] = useState(false)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>([])
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Ref to track if data has been loaded to prevent duplicate calls
  const hasLoadedData = useRef(false)
  const mountedRef = useRef(true)

  const theme = useTheme()
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Separate effect for authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, authLoading, router])

  // Separate effect for data loading - only runs once when authenticated
  useEffect(() => {
    if (isAuthenticated && user && !hasLoadedData.current) {
      hasLoadedData.current = true
      loadDashboardData()
    }
  }, [isAuthenticated, user])

  // Separate effect for tutorial status check - only after dashboard stats are loaded
  useEffect(() => {
    if (dashboardStats?.user && !dashboardStats.user.has_completed_tutorial) {
      setShowTutorial(true)
    }
  }, [dashboardStats])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const loadDashboardData = async () => {
    if (!mountedRef.current) return

    setIsLoading(true)
    setError(null)

    try {
      const [statsResponse, challengesResponse, activityResponse, leaderboardResponse] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getAvailableChallenges(),
        apiClient.getActivityFeed(),
        apiClient.getLeaderboard("weekly"),
      ])

      if (!mountedRef.current) return

      // Handle the nested response structure
      if (statsResponse.data?.success && statsResponse.data?.data) {
        setDashboardStats(statsResponse.data.data)
      }
      if (challengesResponse.data?.success && challengesResponse.data?.data) {
        setAvailableChallenges(challengesResponse.data.data)
      } else {
        setAvailableChallenges([]) // Ensure it's always an array
      }
      if (activityResponse.data) setActivityFeed(activityResponse.data)
      // Handle the nested response structure for leaderboard
      if (leaderboardResponse.data?.success && leaderboardResponse.data?.data) {
        setLeaderboard(leaderboardResponse.data.data)
        setCurrentUserRank(leaderboardResponse.data.current_user_rank)
      }
    } catch (error) {
      if (mountedRef.current) {
        setError("Failed to load dashboard data")
        console.error("Dashboard data loading error:", error)
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }

  const handleTutorialComplete = () => {
    setShowTutorial(false)
    // Reset the flag to allow data reload after tutorial completion
    hasLoadedData.current = false
    loadDashboardData()
  }

  const joinChallenge = async (challengeId: string) => {
    try {
      await apiClient.joinChallenge(challengeId)
      // Refresh challenges with proper nested structure handling
      const response = await apiClient.getAvailableChallenges()
      if (response.data?.success && response.data?.data && mountedRef.current) {
        setAvailableChallenges(response.data.data)
      }
    } catch (error) {
      console.error("Failed to join challenge:", error)
    }
  }

  const likeActivity = async (activityId: string) => {
    try {
      await apiClient.likeActivity(activityId)
      // Update local state optimistically
      if (mountedRef.current) {
        setActivityFeed((prev) =>
          prev.map((item) =>
            item.id === activityId
              ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 }
              : item,
          ),
        )
      }
    } catch (error) {
      console.error("Failed to like activity:", error)
      // Revert optimistic update
      if (mountedRef.current) {
        setActivityFeed((prev) =>
          prev.map((item) =>
            item.id === activityId
              ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes + 1 : item.likes - 1 }
              : item,
          ),
        )
      }
    }
  }

  if (authLoading || !isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f13]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white">Loading your arena...</p>
        </div>
      </div>
    )
  }

  if (showTutorial) {
    return <TutorialChallenge onComplete={handleTutorialComplete} />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f13]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f13]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button
            onClick={() => {
              hasLoadedData.current = false
              loadDashboardData()
            }}
            className="bg-primary text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const xpProgress = dashboardStats ? (dashboardStats.user.current_xp / dashboardStats.user.xp_to_next_level) * 100 : 0

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f13]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#1a1a22]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-primary">
                  <AvatarImage src={dashboardStats?.user.avatar_url || "/placeholder.svg"} alt="User avatar" />
                  <AvatarFallback className="bg-primary text-white">
                    {dashboardStats?.user.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {dashboardStats?.user.level || 1}
                </div>
              </div>
              <div>
                <h2 className="font-bold text-white text-lg">
                  Welcome back, <span className="text-primary">{dashboardStats?.user.name}</span>!
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>
                    Rank {dashboardStats?.user.global_rank ? `#${dashboardStats.user.global_rank}` : "Unranked"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-primary" />
                    {dashboardStats?.stats.current_streak || 0} day streak
                  </span>
                </div>
              </div>
            </div>

            {/* XP Progress */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Level Progress</p>
                <p className="text-white font-medium">
                  {dashboardStats?.user.current_xp || 0} / {dashboardStats?.user.xp_to_next_level || 3000} XP
                </p>
              </div>
              <div className="w-32">
                <Progress value={xpProgress} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* Hero Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total XP",
              value: dashboardStats?.stats.total_xp || 0,
              icon: Zap,
              color: "text-yellow-400",
            },
            {
              label: "Badges",
              value: dashboardStats?.stats.badges_count || 0,
              icon: Award,
              color: "text-purple-400",
            },
            {
              label: "Challenges Won",
              value: dashboardStats?.stats.challenges_won || 0,
              icon: Trophy,
              color: "text-primary",
            },
            {
              label: "Global Rank",
              value: dashboardStats?.user.global_rank ? `#${dashboardStats.user.global_rank}` : "Unranked",
              icon: Crown,
              color: "text-blue-400",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-4 text-center">
                  <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "New Challenge", icon: Target, action: () => router.push("/challenges") },
                { label: "View Progress", icon: TrendingUp, action: () => router.push("/profile") },
                { label: "Leaderboards", icon: Crown, action: () => router.push("/leaderboards") },
                { label: "Invite Friends", icon: Users, action: () => {} },
              ].map((action) => (
                <Button
                  key={action.label}
                  onClick={action.action}
                  variant="outline"
                  className="h-16 flex-col gap-2 border-gray-600 hover:border-primary hover:bg-primary/10"
                >
                  <action.icon className="h-5 w-5" />
                  <span className="text-xs">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Available Challenges */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-white">Available Challenges</h3>
            <div className="grid gap-4">
              {availableChallenges.length > 0 ? (
                availableChallenges.slice(0, 6).map((challenge) => (
                  <motion.div key={challenge.id} whileHover={{ scale: 1.02 }} className="group">
                    <Card className="bg-gray-800/50 border-gray-700 hover:border-primary/50 transition-all">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-700">
                            <img
                              src={challenge.thumbnail || "/placeholder.svg"}
                              alt={challenge.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <Play className="absolute inset-0 m-auto h-6 w-6 text-white opacity-70" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-white group-hover:text-primary transition-colors">
                                {challenge.title}
                              </h4>
                              <Badge className="bg-primary text-white">+{challenge.xp} XP</Badge>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  challenge.difficulty === "Beginner"
                                    ? "border-green-500 text-green-400"
                                    : challenge.difficulty === "Intermediate"
                                      ? "border-yellow-500 text-yellow-400"
                                      : "border-red-500 text-red-400"
                                }`}
                              >
                                {challenge.difficulty}
                              </Badge>
                              <span className="text-xs text-gray-400">{challenge.category}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {challenge.participants}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(challenge.deadline).toLocaleDateString()}
                                </span>
                              </div>
                              {challenge.isJoined ? (
                                <Badge variant="outline" className="border-primary text-primary">
                                  {challenge.status === "completed" ? "Completed" : "Joined"}
                                </Badge>
                              ) : (
                                <Button
                                  onClick={() => joinChallenge(challenge.id)}
                                  size="sm"
                                  className="bg-primary text-white hover:opacity-90"
                                >
                                  Join
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h4 className="text-lg font-medium text-white mb-2">No Challenges Available</h4>
                    <p className="text-gray-400 text-sm">
                      New challenges are coming soon! Check back later for exciting opportunities to test your skills.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Feed */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">Live Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-80 overflow-y-auto">
                  {activityFeed.slice(0, 10).map((activity) => (
                    <div key={activity.id} className="p-4 border-b border-gray-700 last:border-b-0">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{activity.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white">
                            <span className="font-medium">{activity.user.name}</span>
                            <Badge className="ml-2 text-xs bg-primary/20 text-primary">L{activity.user.level}</Badge>
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{activity.action}</p>
                          {activity.challenge && <p className="text-xs text-primary mt-1">{activity.challenge}</p>}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => likeActivity(activity.id)}
                              className={`flex items-center gap-1 text-xs ${
                                activity.isLiked ? "text-red-400" : "text-gray-400"
                              } hover:text-red-400 transition-colors`}
                            >
                              <Heart className={`h-3 w-3 ${activity.isLiked ? "fill-current" : ""}`} />
                              {activity.likes}
                            </button>
                            <span className="text-xs text-gray-500">{activity.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Leaderboard */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  Weekly Leaders
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {leaderboard.length > 0 ? (
                  leaderboard.slice(0, 5).map((entry, index) => (
                    <div key={entry.user.id} className="p-4 border-b border-gray-700 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0
                              ? "bg-yellow-400 text-black"
                              : index === 1
                                ? "bg-gray-400 text-black"
                                : index === 2
                                  ? "bg-orange-400 text-black"
                                  : "bg-gray-600 text-white"
                          }`}
                        >
                          {entry.rank}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={entry.user.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{entry.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white">{entry.user.name}</p>
                            {entry.is_current_user && <Badge className="text-xs bg-primary/20 text-primary">You</Badge>}
                          </div>
                          <p className="text-xs text-gray-400">
                            {entry.total_xp.toLocaleString()} XP • {entry.challenges_won} wins
                          </p>
                          <p className="text-xs text-gray-500">+{entry.weekly_xp} XP this week</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    <p className="text-sm">No leaderboard data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <NavigationBar />
    </div>
  )
}