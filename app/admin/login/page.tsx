"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import AnimatedStarsBackground from "@/components/animated-stars-background"

// Admin credentials
const ADMIN_CREDENTIALS = [
  { username: "Kokusz", password: "m$2W@zL8" },
  { username: "Patryk", password: "G7v#qP9*" },
]

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check if user has entered the special code
    const codeAuth = localStorage.getItem("mythCrewCodeAuth")
    if (codeAuth !== "authorized") {
      router.push("/")
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Check credentials
    const isValid = ADMIN_CREDENTIALS.some((cred) => cred.username === username && cred.password === password)

    setTimeout(() => {
      if (isValid) {
        // Store admin authentication
        localStorage.setItem("mythCrewAdminAuth", "authorized")
        localStorage.setItem("mythCrewAdminUser", username)

        // Redirect to admin dashboard
        router.push("/admin")
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid username or password. Please try again.",
          variant: "destructive",
        })
        setPassword("")
      }
      setIsLoading(false)
    }, 1000) // Simulate a delay for security
  }

  if (!isAuthorized) {
    return <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">Loading...</div>
  }

  return (
    <main className="min-h-[calc(100vh-73px)] p-4 relative">
      <div className="absolute inset-0 bg-black -z-10">
        <AnimatedStarsBackground />
      </div>

      <div className="max-w-md mx-auto bg-black/90 p-8 rounded-lg backdrop-blur-sm border border-blue-900 mt-16">
        <h1 className="text-2xl font-bold text-blue-400 mb-6 text-center">MYTH Crew Admin Login</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Login"}
          </Button>
        </form>
      </div>
      <Toaster />
    </main>
  )
}
