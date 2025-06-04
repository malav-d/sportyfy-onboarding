"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth"
import { auth } from "@/lib/firebase"

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

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

  useEffect(() => {
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
  }, []) // Remove recaptchaVerifier from dependency array to prevent re-runs

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
      if (typeof window === "undefined") return null

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

      const verifier = new RecaptchaVerifier(auth, uniqueId, {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA solved")
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired")
          setError("Verification expired. Please try again.")
        },
      })

      setRecaptchaVerifier(verifier)
      return verifier
    } catch (error) {
      console.error("Error initializing recaptcha:", error)
      setError("Failed to initialize verification system")
      return null
    }
  }

  const sendOTP = async (phone: string) => {
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

      console.log("Sending OTP to:", formattedPhone)
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, verifier)

      setConfirmationResult(confirmation)
      setPendingPhone(formattedPhone)
      console.log("OTP sent successfully")
    } catch (err: any) {
      console.error("Error sending OTP:", err)

      // Handle specific Firebase errors
      let errorMessage = "Failed to send OTP"

      if (err.code === "auth/invalid-phone-number") {
        errorMessage = "Invalid phone number format. Please include country code (e.g., +91)"
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later"
      } else if (err.code === "auth/captcha-check-failed") {
        errorMessage =
          "Verification failed. This might be due to domain configuration. Please contact support or try again later."
      } else if (err.code === "auth/quota-exceeded") {
        errorMessage = "SMS quota exceeded. Please try again later"
      } else if (err.code === "auth/invalid-app-credential") {
        errorMessage = "Invalid app credentials. Please contact support"
      } else if (err.message) {
        errorMessage = err.message
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
      console.log("Verifying OTP:", otp)

      // Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp)
      const firebaseUser = result.user

      console.log("Firebase user authenticated:", firebaseUser.uid)

      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken()

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
      console.error("Error verifying OTP:", err)

      if (err.code === "auth/invalid-verification-code") {
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
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")

    // Clean up recaptcha
    clearRecaptcha()

    // Sign out from Firebase
    auth.signOut().catch(console.error)
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
