"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import AnimatedStarsBackground from "@/components/animated-stars-background"
import { useApplicationStatus } from "@/context/application-status-context"
import { useRouter } from "next/navigation"

export default function ApplicationPage() {
  const router = useRouter()
  const { isApplicationOpen } = useApplicationStatus()
  const [step, setStep] = useState(1)
  const totalSteps = 3
  const progress = (step / totalSteps) * 100
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    inGameName: "",
    age: "",
    discordUser: "",
    level: "",
    priorExperience: "",
    joinReason: "",
    contribution: "",
    activity: "",
    additionalInfo: "",
  })

  // Check if applications are open
  useEffect(() => {
    setIsLoading(false)
    if (!isApplicationOpen) {
      router.push("/")
    }
  }, [isApplicationOpen, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, activity: value }))
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
    try {
      setIsSubmitting(true)

      // Submit to our API route instead of directly to Discord
      const response = await fetch("/api/submit-application", {
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
          description: "Thank you for applying to MYTH Crew! We'll review your application soon.",
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

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <div className="text-blue-400 text-xl">Loading...</div>
      </main>
    )
  }

  if (!isApplicationOpen) {
    return null // This will never render as we redirect in useEffect
  }

  return (
    <main className="min-h-[calc(100vh-73px)] p-4 relative">
      <div className="absolute inset-0 bg-black -z-10">
        <AnimatedStarsBackground />
      </div>

      <div className="max-w-3xl mx-auto bg-black/90 p-6 rounded-lg backdrop-blur-sm border border-blue-900">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">MYTH Crew Application</h1>

        <div className="mb-8">
          <Progress value={progress} className="h-2 bg-gray-200" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Personal Info</span>
            <span>Experience</span>
            <span>Final Details</span>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="inGameName">What is your CnR in-game name?</Label>
              <Input
                id="inGameName"
                name="inGameName"
                value={formData.inGameName}
                onChange={handleInputChange}
                placeholder="Your in-game name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">How old are you?</Label>
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
              <Label htmlFor="discordUser">What's your discord user? (e.g., @name)</Label>
              <Input
                id="discordUser"
                name="discordUser"
                value={formData.discordUser}
                onChange={handleInputChange}
                placeholder="Your Discord username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">What level are you in CnR?</Label>
              <Input
                id="level"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                placeholder="Your CnR level"
                required
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
              <Label htmlFor="priorExperience">Do you have any experience in other crews? If yes, which ones?</Label>
              <Textarea
                id="priorExperience"
                name="priorExperience"
                value={formData.priorExperience}
                onChange={handleInputChange}
                placeholder="Your previous crew experience"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="joinReason">Why do you want to join MYTH?</Label>
              <Textarea
                id="joinReason"
                name="joinReason"
                value={formData.joinReason}
                onChange={handleInputChange}
                placeholder="Your reasons for joining"
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contribution">What can you bring to MYTH? (skills, loyalty, activity, etc.)</Label>
              <Textarea
                id="contribution"
                name="contribution"
                value={formData.contribution}
                onChange={handleInputChange}
                placeholder="Your potential contributions"
                required
                className="min-h-[100px]"
              />
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
              <Label>How active are you in CnR?</Label>
              <RadioGroup value={formData.activity} onValueChange={handleRadioChange} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Daily" id="daily" />
                  <Label htmlFor="daily">Daily</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Few times a week" id="few-times" />
                  <Label htmlFor="few-times">Few times a week</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Weekends only" id="weekends" />
                  <Label htmlFor="weekends">Weekends only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Rarely" id="rarely" />
                  <Label htmlFor="rarely">Rarely</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Anything else we should know about you?</Label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Any additional information"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline" className="border-blue-600 text-blue-600">
                Previous
              </Button>
              <Button onClick={submitApplication} className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Finish"}
              </Button>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </main>
  )
}
