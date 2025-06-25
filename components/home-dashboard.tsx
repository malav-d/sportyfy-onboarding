"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Play, Flame, Trophy, Heart, Shuffle, ChevronRight, Home, LayoutGrid, MessageSquare, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { TutorialChallenge } from "@/components/tutorial-challenge"
import { apiClient } from "@/lib/api"

// Keep all existing interfaces unchanged
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

export function HomeDashboard() {
  // Keep all existing state and logic unchanged
  const [showTutorial, setShowTutorial] = useState(false)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>([])
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeMode, setActiveMode] = useState(0)

  const hasLoadedData = useRef(false)
  const mountedRef = useRef(true)

  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Keep all existing useEffect hooks unchanged
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated && user && !hasLoadedData.current) {
      hasLoadedData.current = true
      loadDashboardData()
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    if (dashboardStats?.user && !dashboardStats.user.has_completed_tutorial) {
      setShowTutorial(true)
    }
  }, [dashboardStats])

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Keep all existing functions unchanged
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

      if (statsResponse.data?.success && statsResponse.data?.data) {
        setDashboardStats(statsResponse.data.data)
      }
      if (challengesResponse.data?.success && challengesResponse.data?.data) {
        setAvailableChallenges(challengesResponse.data.data)
      } else {
        setAvailableChallenges([])
      }
      if (activityResponse.data) {
        if (activityResponse.data.success && activityResponse.data.data) {
          setActivityFeed(Array.isArray(activityResponse.data.data) ? activityResponse.data.data : [])
        } else if (Array.isArray(activityResponse.data)) {
          setActivityFeed(activityResponse.data)
        } else {
          setActivityFeed([])
        }
      } else {
        setActivityFeed([])
      }
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
    hasLoadedData.current = false
    loadDashboardData()
  }

  const joinChallenge = async (challengeId: string) => {
    try {
      await apiClient.joinChallenge(challengeId)
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

  // Keep existing loading and error states
  if (authLoading || !isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black">Loading your arena...</p>
        </div>
      </div>
    )
  }

  if (showTutorial) {
    return <TutorialChallenge onComplete={handleTutorialComplete} />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => {
              hasLoadedData.current = false
              loadDashboardData()
            }}
            className="bg-black text-white hover:bg-gray-800"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const xpProgress = dashboardStats ? (dashboardStats.user.current_xp / dashboardStats.user.xp_to_next_level) * 100 : 0

  const modes = [
    { name: "Fitness", icon: "💪", completed: 8, total: 8, category: "fitness" },
    { name: "Yoga", icon: "🧘", completed: 5, total: 10, category: "yoga" },
    { name: "Basketball", icon: "🏀", completed: 12, total: 15, category: "basketball" },
  ]

  const dailyQuest = {
    target: "Complete 3 challenges",
    progress: dashboardStats?.stats.challenges_completed || 0,
    goal: 3,
  }

  return (
    <div className="min-h-screen bg-white">
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
            </div>

            {/* Right Side - User Info */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Hi, {dashboardStats?.user.name}</span>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => router.push("/profile")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors font-medium"
              >
                Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Welcome back, {dashboardStats?.user.name} 👋</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Level Progress</p>
              <p className="text-black font-medium">
                {dashboardStats?.user.current_xp || 0} / {dashboardStats?.user.xp_to_next_level || 3000} XP
              </p>
            </div>
            <div className="w-32">
              <Progress value={xpProgress} className="h-2 bg-gray-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 space-y-6 pb-24 md:pb-6">
        {/* Hero CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-black text-white"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
          <div className="relative p-8 text-center">
            <div className="mb-6">
              <Button
                onClick={() => router.push("/challenges")}
                size="lg"
                className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-semibold"
              >
                <Play className="h-6 w-6 mr-3" />
                Start New Challenge
              </Button>
            </div>
            <p className="text-gray-300">Pick a mode, train 30s, get instant feedback.</p>
          </div>
        </motion.div>

        {/* Daily Quest */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-50 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-black">Today's Quest: {dailyQuest.target}</p>
                <p className="text-sm text-gray-600">
                  {dailyQuest.progress}/{dailyQuest.goal} completed
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 relative">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                    strokeDasharray={`${(dailyQuest.progress / dailyQuest.goal) * 100}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold">
                    {Math.round((dailyQuest.progress / dailyQuest.goal) * 100)}%
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => router.push("/challenges")}
              >
                Go!
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Mode Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-black">Training Modes</h3>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {modes.map((mode, index) => (
              <motion.div
                key={mode.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveMode(index)}
                className={`flex-shrink-0 w-48 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  activeMode === index
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{mode.icon}</div>
                  <h4 className="font-semibold mb-1">{mode.name}</h4>
                  <p className={`text-sm ${activeMode === index ? "text-gray-300" : "text-gray-600"}`}>
                    {mode.completed} / {mode.total} done
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${activeMode === index ? "bg-white" : "bg-black"}`}
                      style={{ width: `${(mode.completed / mode.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Play Tile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => {
            // Random challenge logic
            if (availableChallenges.length > 0) {
              const randomChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)]
              joinChallenge(randomChallenge.id)
            }
          }}
          className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-6 cursor-pointer hover:from-gray-200 hover:to-gray-100 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <Shuffle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-black">Surprise Me!</h4>
                <p className="text-gray-600">Not sure what to train? Tap me!</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </motion.div>

        {/* Recent Activity Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-black">Recent Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activityFeed.slice(0, 3).map((activity, index) => (
              <div key={activity.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs bg-black text-white">
                      {activity.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{activity.user.name}</p>
                    <p className="text-xs text-gray-600">{activity.timestamp}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-800 mb-3">{activity.action}</p>
                {activity.challenge && <p className="text-xs text-black font-medium mb-3">{activity.challenge}</p>}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => likeActivity(activity.id)}
                    className={`flex items-center space-x-1 text-xs ${
                      activity.isLiked ? "text-black" : "text-gray-500"
                    } hover:text-black transition-colors`}
                  >
                    <Heart className={`h-3 w-3 ${activity.isLiked ? "fill-current" : ""}`} />
                    <span>{activity.likes}</span>
                  </button>
                  <Button size="sm" variant="outline" className="text-xs">
                    Retry
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mobile Navigation - Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-around">
          {[
            { icon: Home, label: "Home", path: "/dashboard", active: true },
            { icon: LayoutGrid, label: "Discover", path: "/challenges" },
            { icon: Trophy, label: "Challenges", path: "/my-challenges" },
            { icon: MessageSquare, label: "Social", path: "/social" },
            { icon: User, label: "Profile", path: "/profile" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                item.active ? "text-black" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <item.icon className={`h-5 w-5 ${item.active ? "fill-current" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
