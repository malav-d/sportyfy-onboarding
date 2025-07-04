interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

class ApiClient {
  private baseURL: string
  private authToken: string | null = null

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "https://api.sportyfy.live/api"
    this.authToken = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  }

  setAuthToken(token: string) {
    this.authToken = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  clearAuthToken() {
    this.authToken = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`
    }

    return headers
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    const headers: HeadersInit = {
      ...this.getHeaders(),
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (response.status === 401) {
        this.clearAuthToken()
        window.location.href = "/"
        return { status: 401, error: "Unauthorized" }
      }

      const data = await response.json()

      if (!response.ok) {
        return {
          status: response.status,
          error: data.message || "An error occurred",
        }
      }

      return {
        status: response.status,
        data,
      }
    } catch (error) {
      return {
        status: 500,
        error: error instanceof Error ? error.message : "Network error",
      }
    }
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request("/dashboard/stats")
  }

  async getTutorialStatus() {
    return this.request("/tutorial/status")
  }

  async updateTutorialProgress(step: number) {
    return this.request("/tutorial/progress", {
      method: "POST",
      body: JSON.stringify({ step }),
    })
  }

  async completeTutorial() {
    return this.request("/tutorial/complete", {
      method: "POST",
    })
  }

  async getAvailableChallenges() {
    return this.request("/challenges/available")
  }

  async getActiveChallenges() {
    return this.request("/challenges/active")
  }

  async getActivityFeed() {
    return this.request("/activities/feed")
  }

  async getLeaderboard(type: "global" | "weekly" | "friends" = "global") {
    return this.request(`/leaderboard/${type}`)
  }

  async joinChallenge(challengeId: string) {
    return this.request(`/challenges/${challengeId}/join`, {
      method: "POST",
    })
  }

  async likeActivity(activityId: string) {
    return this.request(`/activity/${activityId}/like`, {
      method: "POST",
    })
  }

  // Tutorial Challenge endpoints
  async getTutorialChallenge() {
    return this.request<TutorialChallengeResponse>("/challenges/tutorial")
  }

  async submitChallenge(challengeId: string, formData: FormData) {
    return this.request<SubmissionResponse>(`/challenges/${challengeId}/submit`, {
      method: "POST",
      body: formData,
      headers: {
        // Remove Content-Type to let browser set it with boundary for FormData
        ...Object.fromEntries(Object.entries(this.getHeaders()).filter(([key]) => key !== "Content-Type")),
      },
    })
  }

  async getSubmissionStatus(submissionId: string) {
    return this.request<SubmissionStatus>(`/submissions/${submissionId}/status`)
  }
}

export const apiClient = new ApiClient()

export interface TutorialChallengeResponse {
  data: {
    id: string
    type: string
    attributes: {
      title: string
      description: string
      duration_limit: number
      points_reward: number
      xp_reward: number
      badge_reward: string
      video_url: string
      video_example_url: string
      category: string
      starts_at: string
      ends_at: string | null
      is_paid: boolean
      entry_fee: string
      is_tutorial: boolean
      difficulty: {
        key: string
        label: string
      }
      challenge_type: {
        key: string
        label: string
      }
      scoring_method: {
        key: string
        label: string
      }
      requirements: {
        camera_pose: {
          key: string
          label: string
        }
        min_valid_reps: number
        duration_seconds: number
        environment_tips: Array<{
          label: string
        }>
      }
      verification_rules: {
        pose: string
        down_knee_angle: {
          max: number
          tol: number
        }
        up_leg_straight: {
          min: number
          tol: number
        }
        track_invalid_reps: boolean
      }
      metrics_spec: {
        primary: {
          key: string
          unit: string
          label: string
        }
        secondary: {
          key: string
          unit: string
          label: string
        }
      }
    }
  }
}

export interface TutorialChallenge {
  id: string
  title: string
  description: string
}

export interface SubmissionResponse {
  id: string
  status: "pending" | "success" | "failure"
}

export interface SubmissionStatus {
  id: string
  status: "pending" | "success" | "failure"
  feedback?: string
}
