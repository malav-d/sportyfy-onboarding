"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { SkillAssessmentScreen } from "@/components/skill-assessment-screen"
import { ArrowLeft, Camera, User } from "lucide-react"

interface ProfileCreationScreenProps {
  selectedSports: string[]
}

export function ProfileCreationScreen({ selectedSports }: ProfileCreationScreenProps) {
  const [showSkillAssessment, setShowSkillAssessment] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    ageRange: "",
    height: "",
    location: "",
    bio: "",
    publicProfile: true,
    showActivity: true,
  })

  if (showSkillAssessment) {
    return <SkillAssessmentScreen selectedSports={selectedSports} />
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  return (
    <Card className="w-full max-w-md overflow-hidden bg-white/95 shadow-xl">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-poppins text-xl font-bold">Create Your Profile</h2>
              <div className="text-xs text-gray-500">Step 2 of 3</div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-2/3 bg-[#5c3bfe]"></div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col items-center">
          <div className="group relative mb-3 h-24 w-24 cursor-pointer overflow-hidden rounded-full bg-gray-100">
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              <User className="h-12 w-12" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>
          <span className="text-sm text-[#5c3bfe]">Upload Avatar</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Choose a unique username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ageRange">Age Range</Label>
            <select
              id="ageRange"
              name="ageRange"
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5c3bfe]"
              value={formData.ageRange}
              onChange={handleChange}
            >
              <option value="">Select your age range</option>
              <option value="15-18">15-18</option>
              <option value="19-22">19-22</option>
              <option value="23-25">23-25</option>
              <option value="26+">26+</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (optional)</Label>
              <Input
                id="height"
                name="height"
                placeholder="e.g., 5'10''"
                value={formData.height}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">Used for personalized training</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (optional)</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., New York"
                value={formData.location}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">Find nearby athletes</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Short Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about your sports journey..."
              className="h-20 resize-none"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-3 rounded-lg bg-gray-50 p-3">
            <h3 className="font-poppins text-sm font-medium">Privacy Settings</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Public Profile</p>
                <p className="text-xs text-gray-500">Allow others to view your profile</p>
              </div>
              <Switch
                checked={formData.publicProfile}
                onCheckedChange={(checked) => handleSwitchChange("publicProfile", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Activity Visibility</p>
                <p className="text-xs text-gray-500">Show your activity in feeds</p>
              </div>
              <Switch
                checked={formData.showActivity}
                onCheckedChange={(checked) => handleSwitchChange("showActivity", checked)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="outline" className="border-gray-200 text-gray-600">
            Back
          </Button>
          <Button className="bg-[#5c3bfe] hover:bg-[#4c2fe0]" onClick={() => setShowSkillAssessment(true)}>
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
