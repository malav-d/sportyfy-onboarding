"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface PhoneFormData {
  phone: string
}

export default function PhoneForm() {
  const { sendOTP, isLoading, error, clearError } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneFormData>()

  const onSubmit = async (data: PhoneFormData) => {
    await sendOTP(data.phone)
  }

  const handleInputChange = () => {
    // Clear error when user starts typing
    if (error && clearError) {
      clearError()
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Enter your phone number</h2>
        <p className="text-gray-400">We'll send you a verification code via SMS</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[+]?[1-9]\d{1,14}$/,
                message: "Please enter a valid phone number",
              },
            })}
            type="tel"
            placeholder="Phone number (e.g., +919876543210)"
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? "SENDING..." : "SEND OTP"}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </form>

      {/* Hidden recaptcha container for Firebase */}
      <div id="recaptcha-container"></div>
    </div>
  )
}