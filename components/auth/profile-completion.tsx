"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { User, ArrowRight } from "lucide-react"

interface ProfileFormData {
  name: string
  email: string
}

export default function ProfileCompletion() {
  const { updateUserProfile, isLoading, error, clearError } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>()

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateUserProfile(data.name, data.email)
    } catch (err) {
      // Error is handled by the auth context
    }
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
            <User className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-black mb-3">Complete Profile</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Just a few more details to get you started on your fitness journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">Full Name</label>
            <input
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              type="text"
              placeholder="Enter your full name"
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-none text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors text-lg"
            />
            {errors.name && <p className="text-red-600 text-sm mt-2 font-medium">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
              Email Address
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              })}
              type="email"
              placeholder="Enter your email address"
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-none text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors text-lg"
            />
            {errors.email && <p className="text-red-600 text-sm mt-2 font-medium">{errors.email.message}</p>}
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
            <span>COMPLETING...</span>
          ) : (
            <>
              <span>COMPLETE PROFILE</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
          Your information is secure and will not be shared with third parties
        </p>
      </div>
    </div>
  )
}
