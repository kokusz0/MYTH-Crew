"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import AnimatedStarsBackground from "@/components/animated-stars-background"
import { useRouter } from "next/navigation"

// Secret admin code
const ADMIN_CODE = "A9FJ-L3KD-7XQM-V2TN"

export default function FeedbackPage() {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating)
  }

  const handleRatingHover = (hoveredRating: number) => {
    setHoveredRating(hoveredRating)
  }

  const handleRatingLeave = () => {
    setHoveredRating(0)
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value)
  }

  const submitFeedback = async () => {
    // Check for admin code
    if (comment.trim() === ADMIN_CODE) {
      // Set code authorization in localStorage
      localStorage.setItem("mythCrewCodeAuth", "authorized")

      // Clear any previous admin auth
      localStorage.removeItem("mythCrewAdminAuth")
      localStorage.removeItem("mythCrewAdminUser")

      // Redirect to admin login page
      router.push("/admin/login")
      return
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting your feedback.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Submit to our API route instead of directly to Discord
      const response = await fetch("/api/submit-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: "Feedback Submitted",
          description: "Thank you for your feedback! We appreciate your input.",
        })
        // Reset form
        setRating(0)
        setComment("")
      } else {
        throw new Error(result.message || "Failed to submit feedback")
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "There was an error submitting your feedback. Please try again later.",
        variant: "destructive",
      })
      console.error("Error submitting feedback:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-73px)] p-4 relative">
      <div className="absolute inset-0 bg-black -z-10">
        <AnimatedStarsBackground />
      </div>

      <div className="max-w-2xl mx-auto bg-black/90 p-8 rounded-lg backdrop-blur-sm border border-blue-900">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">MYTH Crew Feedback</h1>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">How would you rate your experience?</h2>

            <div className="flex justify-center space-x-2" onMouseLeave={handleRatingLeave}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => handleRatingHover(star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={40}
                    className={`
                      ${
                        hoveredRating >= star || (!hoveredRating && rating >= star)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                      transition-colors
                    `}
                  />
                </button>
              ))}
            </div>

            <p className="text-center text-gray-600">
              {rating > 0 ? `You selected ${rating} star${rating > 1 ? "s" : ""}` : "Click to rate"}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="block text-sm font-medium">
              Additional Comments (optional)
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={handleCommentChange}
              placeholder="Tell us more about your experience..."
              className="min-h-[150px]"
            />
          </div>

          <div className="flex justify-center">
            <Button onClick={submitFeedback} className="bg-blue-600 hover:bg-blue-700 px-8" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  )
}
