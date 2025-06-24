"use client"

import { useState, useEffect } from "react"
import { X, Smartphone } from "lucide-react"
import PhoneForm from "@/components/auth/phone-form"
import OTPVerification from "@/components/auth/otp-verification"
import ProfileCompletion from "@/components/auth/profile-completion"
import { useAuth } from "@/contexts/auth-context"

interface AuthPanelProps {
  isOpen: boolean
  onClose: () => void
}

type AuthStep = "phone" | "otp" | "profile"

export default function AuthPanel({ isOpen, onClose }: AuthPanelProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>("phone")
  const { pendingPhone, isAuthenticated, clearError } = useAuth()

  useEffect(() => {
    if (pendingPhone) {
      setCurrentStep("otp")
    }
  }, [pendingPhone])

  useEffect(() => {
    if (isAuthenticated) {
      onClose()
      setCurrentStep("phone")
    }
  }, [isAuthenticated, onClose])

  const handleClose = () => {
    if (clearError && typeof clearError === "function") {
      clearError()
    }
    onClose()
    setTimeout(() => setCurrentStep("phone"), 300)
  }

  const handleOTPVerified = (isNewUser: boolean) => {
    if (isNewUser) {
      setCurrentStep("profile")
    }
    // If existing user, the useEffect above will handle closing the panel
  }

  const handleBackToPhone = () => {
    if (clearError && typeof clearError === "function") {
      clearError()
    }
    setCurrentStep("phone")
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 z-50 transition-opacity duration-300" onClick={handleClose} />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-black" />
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">SPORTYFY</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${currentStep === "phone" ? "bg-black" : "bg-gray-300"}`} />
              <div className={`w-2 h-2 rounded-full ${currentStep === "otp" ? "bg-black" : "bg-gray-300"}`} />
              <div className={`w-2 h-2 rounded-full ${currentStep === "profile" ? "bg-black" : "bg-gray-300"}`} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {currentStep === "phone" && <PhoneForm />}
            {currentStep === "otp" && <OTPVerification onVerified={handleOTPVerified} onBack={handleBackToPhone} />}
            {currentStep === "profile" && <ProfileCompletion />}
          </div>
        </div>
      </div>
    </>
  )
}
