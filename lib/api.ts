interface ApiResponse<T> {
    data?: T
    error?: string
    status: number
  }
  
  class ApiClient {
    private baseURL: string
    private authToken: string | null = null
  
    constructor() {
      this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
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
  
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
      const url = `${this.baseURL}${endpoint}`
  
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
      }
  
      if (this.authToken) {
        headers.Authorization = `Bearer ${this.authToken}`
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
  }
  
  export const apiClient = new ApiClient()
