"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Shield, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"

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
    <div className="p-6 h-full flex flex-col">
      <div className="flex-1">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-black mb-3">Verify Your Number</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Enter the 6-digit code sent to <span className="font-mono font-bold text-black">{pendingPhone}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4 uppercase tracking-wide text-center">
            Verification Code
          </label>
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
                className="w-12 h-14 text-center text-2xl font-bold bg-white border-2 border-gray-300 rounded-none text-black focus:outline-none focus:border-black transition-colors font-mono"
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 text-sm font-medium text-center">{error}</p>
          </div>
        )}

        {/* Resend Section */}
        <div className="text-center mb-8">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 text-black hover:text-gray-700 transition-colors disabled:opacity-50 font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Resend Code</span>
            </button>
          ) : (
            <p className="text-gray-600">
              Resend code in <span className="font-mono font-bold text-black">{countdown}s</span>
            </p>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-gray-200 space-y-4">
        <Button
          onClick={() => handleVerify()}
          disabled={isLoading || otp.some((digit) => digit === "")}
          className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
        >
          {isLoading ? (
            <span>VERIFYING...</span>
          ) : (
            <>
              <span>VERIFY CODE</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>

        <button
          onClick={onBack}
          className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-black transition-colors py-3 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to edit phone number</span>
        </button>
      </div>
    </div>
  )
}
