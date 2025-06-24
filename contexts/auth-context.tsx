"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth"
import { auth, isFirebaseAvailable, debugFirebaseConfig } from "@/lib/firebase"

interface User {
  id: string
  name: string
  email: string
  phone: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  sendOTP: (phone: string) => Promise<void>
  verifyOTP: (otp: string) => Promise<{ isNewUser: boolean; token: string }>
  updateUserProfile: (name: string, email: string) => Promise<void>
  logout: () => void
  error: string | null
  clearError: () => void
  pendingPhone: string | null
  authToken: string | null
  isFirebaseReady: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingPhone, setPendingPhone] = useState<string | null>(null)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)
  const [recaptchaWidgetId, setRecaptchaWidgetId] = useState<number | null>(null)
  const [isFirebaseReady, setIsFirebaseReady] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

  useEffect(() => {
    // Debug Firebase configuration
    debugFirebaseConfig()

    // Check Firebase availability
    const firebaseReady = isFirebaseAvailable()
    setIsFirebaseReady(firebaseReady)

    console.log("🔥 Firebase Ready:", firebaseReady)
    console.log("🌐 Current hostname:", window.location.hostname)
    console.log("🔗 Current origin:", window.location.origin)

    // Check for stored auth token on mount
    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("user_data")
    if (token && userData) {
      try {
        setAuthToken(token)
        setUser(JSON.parse(userData))
      } catch (e) {
        // Clear invalid data
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user_data")
      }
    }

    // Cleanup recaptcha on unmount
    return () => {
      if (recaptchaVerifier) {
        try {
          // Check if the verifier is still valid before clearing
          if (typeof recaptchaVerifier.clear === "function") {
            recaptchaVerifier.clear()
          }
        } catch (e) {
          // Silently handle cleanup errors as component is unmounting
          console.warn("Recaptcha cleanup warning:", e)
        }
      }
    }
  }, [])

  const clearError = () => {
    setError(null)
  }

  const clearRecaptcha = () => {
    if (recaptchaVerifier) {
      try {
        // Additional safety checks
        if (typeof recaptchaVerifier.clear === "function") {
          recaptchaVerifier.clear()
        }
        setRecaptchaVerifier(null)
        setRecaptchaWidgetId(null)
      } catch (e) {
        // Log warning but don't throw error
        console.warn("Error clearing recaptcha:", e)
        // Still reset the state even if clearing failed
        setRecaptchaVerifier(null)
        setRecaptchaWidgetId(null)
      }
    }

    // Also clear the container element
    const recaptchaContainer = document.getElementById("recaptcha-container")
    if (recaptchaContainer) {
      recaptchaContainer.innerHTML = ""
    }
  }

  const initRecaptcha = () => {
    try {
      if (typeof window === "undefined" || !auth) {
        console.error("Cannot initialize reCAPTCHA: window or auth not available")
        return null
      }

      // Clear existing recaptcha first
      clearRecaptcha()

      // Create a fresh container
      const recaptchaContainer = document.getElementById("recaptcha-container")
      if (!recaptchaContainer) {
        console.error("Recaptcha container not found")
        return null
      }

      // Create a new div with a unique ID
      const uniqueId = `recaptcha-${Date.now()}`
      const recaptchaDiv = document.createElement("div")
      recaptchaDiv.id = uniqueId
      recaptchaContainer.appendChild(recaptchaDiv)

      console.log("🔐 Initializing reCAPTCHA with ID:", uniqueId)

      const verifier = new RecaptchaVerifier(auth, uniqueId, {
        size: "invisible",
        callback: () => {
          console.log("✅ reCAPTCHA solved")
        },
        "expired-callback": () => {
          console.log("⏰ reCAPTCHA expired")
          setError("Verification expired. Please try again.")
        },
        "error-callback": (error: any) => {
          console.error("❌ reCAPTCHA error:", error)
          setError("Verification system error. Please try again.")
        },
      })

      setRecaptchaVerifier(verifier)
      return verifier
    } catch (error) {
      console.error("Error initializing recaptcha:", error)
      setError("Failed to initialize verification system. Please try again.")
      return null
    }
  }

  // Fallback OTP simulation for development/demo purposes
  const simulateOTPForDemo = async (phone: string) => {
    console.log("🎭 Simulating OTP for demo purposes")

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create a mock confirmation result
    const mockConfirmation = {
      confirm: async (otp: string) => {
        if (otp === "123456") {
          // Return a mock user for demo
          return {
            user: {
              uid: `demo_${Date.now()}`,
              phoneNumber: phone,
              getIdToken: async () => "demo_token_" + Date.now(),
            },
          }
        } else {
          throw new Error("Invalid OTP. Use 123456 for demo.")
        }
      },
    }

    setConfirmationResult(mockConfirmation as any)
    setPendingPhone(phone)
    console.log("✅ Demo OTP sent. Use 123456 to verify.")
  }

  const sendOTP = async (phone: string) => {
    console.log("📱 Attempting to send OTP to:", phone)
    console.log("🔥 Firebase Ready:", isFirebaseReady)
    console.log("🔐 Auth object:", !!auth)

    if (!isFirebaseReady || !auth) {
      console.error("❌ Firebase not ready or auth not available")
      setError("Authentication service is temporarily unavailable. Please try again in a moment.")
      return
    }

    if (typeof window === "undefined") {
      setError("This feature is only available in the browser")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Initialize recaptcha
      const verifier = initRecaptcha()
      if (!verifier) {
        throw new Error("Failed to initialize verification system")
      }

      // Format phone number (ensure it starts with country code)
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`

      console.log("📞 Sending OTP to:", formattedPhone)
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, verifier)

      setConfirmationResult(confirmation)
      setPendingPhone(formattedPhone)
      setRetryCount(0) // Reset retry count on success
      console.log("✅ OTP sent successfully")
    } catch (err: any) {
      console.error("❌ Error sending OTP:", err)

      // Handle specific Firebase errors
      let errorMessage = "Failed to send OTP. Please try again."
      let shouldShowDemoOption = false

      if (err.code === "auth/invalid-phone-number") {
        errorMessage = "Invalid phone number format. Please enter a valid Indian mobile number."
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again after some time."
      } else if (
        err.code === "auth/captcha-check-failed" ||
        (err.message && err.message.includes("Hostname match not found"))
      ) {
        // Check if we should try demo mode
        if (retryCount < 2) {
          setRetryCount((prev) => prev + 1)
          errorMessage = `Domain verification issue (attempt ${retryCount + 1}/3). Trying again...`

          // Auto-retry after a short delay
          setTimeout(() => {
            sendOTP(phone)
          }, 2000)

          setError(errorMessage)
          setIsLoading(false)
          return
        } else {
          // After 2 failed attempts, offer demo mode
          shouldShowDemoOption = true
          errorMessage = "Domain verification failed. This happens in development environments."
        }
      } else if (err.code === "auth/quota-exceeded") {
        errorMessage = "SMS quota exceeded. Please try again later."
      } else if (err.code === "auth/invalid-app-credential") {
        errorMessage = "App configuration error. Please contact support."
      } else if (err.message) {
        errorMessage = `Error: ${err.message}`
      }

      // If domain verification failed after retries, try demo mode for development
      if (
        shouldShowDemoOption &&
        (window.location.hostname.includes("v0.dev") ||
          window.location.hostname.includes("localhost") ||
          window.location.hostname.includes("vercel.app"))
      ) {
        console.log("🎭 Attempting demo mode due to domain verification failure")
        try {
          await simulateOTPForDemo(phone.startsWith("+") ? phone : `+91${phone}`)
          setError("Demo mode: Domain verification failed, using demo OTP. Use code: 123456")
          setIsLoading(false)
          return
        } catch (demoErr) {
          console.error("Demo mode also failed:", demoErr)
        }
      }

      setError(errorMessage)

      // Reset recaptcha on error
      clearRecaptcha()
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOTP = async (otp: string): Promise<{ isNewUser: boolean; token: string }> => {
    if (!confirmationResult) throw new Error("No confirmation result available")

    setIsLoading(true)
    setError(null)
    try {
      console.log("🔐 Verifying OTP:", otp)

      // Verify OTP with Firebase (or demo)
      const result = await confirmationResult.confirm(otp)
      const firebaseUser = result.user

      console.log("✅ Firebase user authenticated:", firebaseUser.uid)

      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken()

      // For demo mode, simulate backend response
      if (idToken.startsWith("demo_token_")) {
        console.log("🎭 Demo mode: Simulating backend verification")

        // Simulate successful verification
        const demoToken = `demo_auth_${Date.now()}`
        setAuthToken(demoToken)
        localStorage.setItem("auth_token", demoToken)

        // Clean up
        setConfirmationResult(null)
        clearRecaptcha()

        // Return as new user for demo
        return { isNewUser: true, token: demoToken }
      }

      // Make API call to backend with Firebase ID token
      const response = await fetch(`${API_BASE_URL}/auth/firebase_verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          firebase_uid: firebaseUser.uid,
          phone: firebaseUser.phoneNumber,
        }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Backend verification failed: ${errorData}`)
      }

      const data = await response.json()
      setAuthToken(data.token)
      localStorage.setItem("auth_token", data.token)

      // Clean up
      setConfirmationResult(null)
      clearRecaptcha()

      // If user data exists, set it and return existing user
      if (data.user && data.user.name && data.user.email) {
        setUser(data.user)
        localStorage.setItem("user_data", JSON.stringify(data.user))
        setPendingPhone(null)
        return { isNewUser: false, token: data.token }
      }

      // If no complete user data, it's a new user
      return { isNewUser: true, token: data.token }
    } catch (err: any) {
      console.error("❌ Error verifying OTP:", err)

      if (err.code === "auth/invalid-verification-code" || err.message.includes("Invalid OTP")) {
        setError("Invalid OTP. Please check and try again")
      } else if (err.code === "auth/code-expired") {
        setError("OTP has expired. Please request a new one")
      } else {
        setError(err.message || "OTP verification failed")
      }
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserProfile = async (name: string, email: string) => {
    if (!authToken) throw new Error("No auth token available")

    setIsLoading(true)
    setError(null)
    try {
      // For demo mode, simulate profile update
      if (authToken.startsWith("demo_auth_")) {
        console.log("🎭 Demo mode: Simulating profile update")

        const demoUser = {
          id: `demo_user_${Date.now()}`,
          name,
          email,
          phone: pendingPhone || "+919999999999",
        }

        setUser(demoUser)
        localStorage.setItem("user_data", JSON.stringify(demoUser))
        setPendingPhone(null)
        setIsLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/auth/update_profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ name, email }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Failed to update profile: ${errorData}`)
      }

      const data = await response.json()
      setUser(data.user)
      localStorage.setItem("user_data", JSON.stringify(data.user))
      setPendingPhone(null)
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setPendingPhone(null)
    setAuthToken(null)
    setConfirmationResult(null)
    setError(null)
    setRetryCount(0)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")

    // Clean up recaptcha
    clearRecaptcha()

    // Sign out from Firebase
    if (auth) {
      auth.signOut().catch(console.error)
    }
  }

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    sendOTP,
    verifyOTP,
    updateUserProfile,
    logout,
    error,
    clearError,
    pendingPhone,
    authToken,
    isFirebaseReady,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
