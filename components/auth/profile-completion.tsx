"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

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
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Complete your profile</h2>
        <p className="text-gray-400">Just a few more details to get you started</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            type="text"
            placeholder="Full Name"
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            })}
            type="email"
            placeholder="Email Address"
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
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
          {isLoading ? "COMPLETING..." : "COMPLETE PROFILE"}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Your information is secure and will not be shared with third parties
        </p>
      </form>
    </div>
  )
}
