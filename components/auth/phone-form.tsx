"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { Phone, ArrowRight } from "lucide-react"

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

  const [countryCode, setCountryCode] = useState("+91")

  const onSubmit = async (data: PhoneFormData) => {
    const fullPhoneNumber = `${countryCode}${data.phone}`
    await sendOTP(fullPhoneNumber)
  }

  const handleInputChange = () => {
    // Clear error when user starts typing
    if (error && clearError) {
      clearError()
    }
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex-1">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <Phone className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-black mb-3">Enter Phone Number</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            We'll send you a verification code via SMS to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
              Mobile Number
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value="🇮🇳 +91"
                disabled
                className="px-4 py-4 bg-gray-100 border border-gray-300 rounded-none text-gray-600 cursor-not-allowed w-24 text-center font-mono"
              />
              <input
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Please enter a valid 10-digit mobile number",
                  },
                })}
                type="tel"
                placeholder="Enter 10-digit number"
                onChange={handleInputChange}
                className="flex-1 px-4 py-4 bg-white border-2 border-gray-300 rounded-none text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors font-mono text-lg"
              />
            </div>
            {errors.phone && <p className="text-red-600 text-sm mt-2 font-medium">{errors.phone.message}</p>}
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
        </form>
      </div>

      {/* Bottom CTA */}
      <div className="pt-6 border-t border-gray-200">
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
        >
          {isLoading ? (
            <span>SENDING...</span>
          ) : (
            <>
              <span>SEND VERIFICATION CODE</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
          By continuing, you agree to our <span className="underline">Terms of Service</span> and{" "}
          <span className="underline">Privacy Policy</span>
        </p>
      </div>

      {/* Hidden recaptcha container for Firebase */}
      <div id="recaptcha-container"></div>
    </div>
  )
}
