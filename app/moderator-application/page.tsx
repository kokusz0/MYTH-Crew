"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import AnimatedStarsBackground from "@/components/animated-stars-background"
import { useApplicationStatus } from "@/context/application-status-context"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ModeratorApplicationPage() {
  const router = useRouter()
  const { moderatorStatus, isLoading } = useApplicationStatus()
  const [step, setStep] = useState(1)
  const totalSteps = 3
  const progress = (step / totalSteps) * 100
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  const [formData, setFormData] = useState({
    discordUsername: "",
    age: "",
    locationTimezone: "",
    activeHours: "",
    activeTimes: [] as string[],
    commitments: "",
    moderationExperience: "",
    whyModerator: "",
    handleDisrespect: "",
    readRules: "",
    familiarWithBots: "",
    handleSpam: "",
    handleArgument: "",
    additionalInfo: "",
    agreeToGuidelines: "",
  })

  // Check if applications are open
  useEffect(() => {
    if (!isLoading) {
      setPageLoading(false)
      if (!moderatorStatus.isOpen) {
        router.push("/")
      }
    }
  }, [moderatorStatus.isOpen, isLoading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentValues = (prev[name] as string[]) || []
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] }
      } else {
        return { ...prev, [name]: currentValues.filter((v) => v !== value) }
      }
    })
  }

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    }
  }

  const submitApplication = async () => {
    // Check if applications are still open before submitting
    try {
      const statusCheck = await fetch("/api/application-status")
      const statusData = await statusCheck.json()

      if (!statusData.moderator.isOpen) {
        toast({
          title: "Applications Closed",
          description: "Sorry, moderator applications are currently closed. Please try again later.",
          variant: "destructive",
        })
        setTimeout(() => {
          router.push("/")
        }, 3000)
        return
      }

      setIsSubmitting(true)

      // Submit to our API route
      const response = await fetch("/api/submit-moderator-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: "Application Submitted",
          description: "Thank you for applying to be a MYTH Crew moderator! We'll review your application soon.",
        })
        // Reset form or redirect
        setTimeout(() => {
          window.location.href = "/"
        }, 3000)
      } else {
        throw new Error(result.message || "Failed to submit application")
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "There was an error submitting your application. Please try again later.",
        variant: "destructive",
      })
      console.error("Error submitting application:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (pageLoading || isLoading) {
    return (
      <main className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <div className="flex items-center gap-2 text-blue-400 text-xl">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading...</span>
        </div>
      </main>
    )
  }

  if (!moderatorStatus.isOpen) {
    return null // This will never render as we redirect in useEffect
  }

  return (
    <main className="min-h-[calc(100vh-73px)] p-4 relative">
      <div className="absolute inset-0 bg-black -z-10">
        <AnimatedStarsBackground />
      </div>

      <div className="max-w-3xl mx-auto bg-black/90 p-6 rounded-lg backdrop-blur-sm border border-blue-900">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">MYTH Crew Moderator Application</h1>

        <div className="mb-8">
          <Progress value={progress} className="h-2 bg-gray-200" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Basic Info</span>
            <span>Experience</span>
            <span>Scenarios</span>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="discordUsername">Discord Username</Label>
              <Input
                id="discordUsername"
                name="discordUsername"
                value={formData.discordUsername}
                onChange={handleInputChange}
                placeholder="Your Discord username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Your age"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="locationTimezone">Location & Time Zone</Label>
              <Input
                id="locationTimezone"
                name="locationTimezone"
                value={formData.locationTimezone}
                onChange={handleInputChange}
                placeholder="e.g., United States, EST"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>How many hours per day are you typically active on Discord?</Label>
              <RadioGroup
                value={formData.activeHours}
                onValueChange={(value) => handleRadioChange("activeHours", value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1-2 hours" id="hours-1-2" />
                  <Label htmlFor="hours-1-2">1-2 hours</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3-5 hours" id="hours-3-5" />
                  <Label htmlFor="hours-3-5">3-5 hours</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6+ hours" id="hours-6-plus" />
                  <Label htmlFor="hours-6-plus">6+ hours</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>When are you most active? (Select all that apply)</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="morning"
                    checked={formData.activeTimes.includes("Morning (6AM–12PM)")}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("activeTimes", "Morning (6AM–12PM)", checked === true)
                    }
                  />
                  <Label htmlFor="morning">Morning (6AM–12PM)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="afternoon"
                    checked={formData.activeTimes.includes("Afternoon (12PM–6PM)")}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("activeTimes", "Afternoon (12PM–6PM)", checked === true)
                    }
                  />
                  <Label htmlFor="afternoon">Afternoon (12PM–6PM)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="evening"
                    checked={formData.activeTimes.includes("Evening (6PM–12AM)")}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("activeTimes", "Evening (6PM–12AM)", checked === true)
                    }
                  />
                  <Label htmlFor="evening">Evening (6PM–12AM)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="late-night"
                    checked={formData.activeTimes.includes("Late Night (12AM–6AM)")}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("activeTimes", "Late Night (12AM–6AM)", checked === true)
                    }
                  />
                  <Label htmlFor="late-night">Late Night (12AM–6AM)</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commitments">
                Do you have any upcoming commitments (school, work, vacation) that may affect your activity?
              </Label>
              <Textarea
                id="commitments"
                name="commitments"
                value={formData.commitments}
                onChange={handleInputChange}
                placeholder="Please explain briefly."
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="moderationExperience">Do you have any past moderation experience?</Label>
              <Textarea
                id="moderationExperience"
                name="moderationExperience"
                value={formData.moderationExperience}
                onChange={handleInputChange}
                placeholder="Describe your previous moderation experience, if any."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whyModerator">Why do you want to become a moderator for MYTH?</Label>
              <Textarea
                id="whyModerator"
                name="whyModerator"
                value={formData.whyModerator}
                onChange={handleInputChange}
                placeholder="Explain your motivation for becoming a moderator."
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="handleDisrespect">
                How would you handle a member who is being disrespectful or breaking the rules?
              </Label>
              <Textarea
                id="handleDisrespect"
                name="handleDisrespect"
                value={formData.handleDisrespect}
                onChange={handleInputChange}
                placeholder="Describe your approach."
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Have you read and understood the MYTH Crew rules?</Label>
              <RadioGroup
                value={formData.readRules}
                onValueChange={(value) => handleRadioChange("readRules", value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="rules-yes" />
                  <Label htmlFor="rules-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="rules-no" />
                  <Label htmlFor="rules-no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="I will review them now" id="rules-review" />
                  <Label htmlFor="rules-review">I will review them now</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Are you familiar with moderation bots (e.g., Dyno, MEE6, Carl-bot, etc.)?</Label>
              <RadioGroup
                value={formData.familiarWithBots}
                onValueChange={(value) => handleRadioChange("familiarWithBots", value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="bots-yes" />
                  <Label htmlFor="bots-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Somewhat" id="bots-somewhat" />
                  <Label htmlFor="bots-somewhat">Somewhat</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="bots-no" />
                  <Label htmlFor="bots-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline" className="border-blue-600 text-blue-600">
                Previous
              </Button>
              <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="handleSpam">
                A member starts spamming inappropriate images in general chat. What do you do?
              </Label>
              <Textarea
                id="handleSpam"
                name="handleSpam"
                value={formData.handleSpam}
                onChange={handleInputChange}
                placeholder="Explain your response step-by-step."
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="handleArgument">
                Two members are arguing in voice chat and it's getting heated. How do you step in?
              </Label>
              <Textarea
                id="handleArgument"
                name="handleArgument"
                value={formData.handleArgument}
                onChange={handleInputChange}
                placeholder="Explain what actions you would take."
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Do you have anything else you'd like to add?</Label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Any additional information you'd like to share."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>
                By submitting this form, do you agree to follow all MYTH Crew guidelines and uphold the standards of a
                staff member?
              </Label>
              <RadioGroup
                value={formData.agreeToGuidelines}
                onValueChange={(value) => handleRadioChange("agreeToGuidelines", value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes, I agree" id="agree-yes" />
                  <Label htmlFor="agree-yes">Yes, I agree</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="agree-no" />
                  <Label htmlFor="agree-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline" className="border-blue-600 text-blue-600">
                Previous
              </Button>
              <Button onClick={submitApplication} className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </main>
  )
}
