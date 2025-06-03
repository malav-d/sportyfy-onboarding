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
  }, [])

  const clearError = () => {
    setError(null)
  }

  const initRecaptcha = () => {
    try {
      if (typeof window === "undefined") return null

      // Clear existing recaptcha if any
      if (recaptchaVerifier) {
        recaptchaVerifier.clear()
      }

      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA solved")
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired")
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
      if (err.code === "auth/invalid-phone-number") {
        setError("Invalid phone number format")
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many requests. Please try again later")
      } else if (err.code === "auth/captcha-check-failed") {
        setError("Verification failed. Please try again")
      } else {
        setError(err.message || "Failed to send OTP")
      }

      // Reset recaptcha on error
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear()
          setRecaptchaVerifier(null)
        } catch (e) {
          console.error("Error clearing recaptcha:", e)
        }
      }
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
      if (recaptchaVerifier) {
        recaptchaVerifier.clear()
        setRecaptchaVerifier(null)
      }

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
    if (recaptchaVerifier) {
      recaptchaVerifier.clear()
      setRecaptchaVerifier(null)
    }

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
