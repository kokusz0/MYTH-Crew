"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type ApplicationStatusContextType = {
  isApplicationOpen: boolean
  setApplicationOpen: (isOpen: boolean) => void
  lastUpdated: string | null
  isLoading: boolean
}

const ApplicationStatusContext = createContext<ApplicationStatusContextType | undefined>(undefined)

export function ApplicationStatusProvider({ children }: { children: ReactNode }) {
  const [isApplicationOpen, setIsApplicationOpen] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState(0)

  // Function to fetch the current status from the API
  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/application-status")
      if (response.ok) {
        const data = await response.json()
        setIsApplicationOpen(data.isOpen)
        setLastUpdated(data.lastUpdated)
      }
    } catch (error) {
      console.error("Error fetching application status:", error)
    } finally {
      setIsLoading(false)
      setLastChecked(Date.now())
    }
  }

  // Initial fetch on component mount
  useEffect(() => {
    fetchStatus()
  }, [])

  // Set up periodic status check (every 30 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchStatus()
    }, 30000) // Check every 30 seconds

    return () => clearInterval(intervalId)
  }, [])

  // Function to update the status via API
  const setApplicationOpen = async (isOpen: boolean) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/application-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isOpen }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsApplicationOpen(data.isOpen)
        setLastUpdated(data.lastUpdated)
      } else {
        // If API call fails, revert to previous state
        console.error("Failed to update application status")
      }
    } catch (error) {
      console.error("Error updating application status:", error)
    } finally {
      setIsLoading(false)
      setLastChecked(Date.now())
    }
  }

  return (
    <ApplicationStatusContext.Provider value={{ isApplicationOpen, setApplicationOpen, lastUpdated, isLoading }}>
      {children}
    </ApplicationStatusContext.Provider>
  )
}

export function useApplicationStatus() {
  const context = useContext(ApplicationStatusContext)
  if (context === undefined) {
    throw new Error("useApplicationStatus must be used within an ApplicationStatusProvider")
  }
  return context
}
