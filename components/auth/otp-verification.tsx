"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface OTPVerificationProps {
  onVerified: (isNewUser: boolean) => void
  onBack: () => void
}

export default function OTPVerification({ onVerified, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { verifyOTP, sendOTP, isLoading, error, pendingPhone, clearError } = useAuth()

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return

    // Clear error when user starts typing
    if (error && clearError) {
      clearError()
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 6) {
      handleVerify(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join("")
    if (code.length === 6) {
      try {
        const result = await verifyOTP(code)
        onVerified(result.isNewUser)
      } catch (err) {
        // Error is handled by the auth context
      }
    }
  }

  const handleResend = async () => {
    if (pendingPhone) {
      setCountdown(30)
      setCanResend(false)
      await sendOTP(pendingPhone)

      // Reset countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Enter OTP</h2>
        <p className="text-gray-400">
          We've sent a 6-digit code to <span className="text-white font-medium">{pendingPhone}</span>
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center space-x-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                if (el) {
                  inputRefs.current[index] = el
                }
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="text-orange-500 hover:text-orange-400 transition-colors disabled:opacity-50"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-400">
              Resend OTP in <span className="text-white">{countdown}s</span>
            </p>
          )}
        </div>

        <Button
          onClick={() => handleVerify()}
          disabled={isLoading || otp.some((digit) => digit === "")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? "VERIFYING..." : "VERIFY"}
        </Button>

        <div className="text-center">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
            ← Back to edit phone number
          </button>
        </div>
      </div>
    </div>
  )
}
