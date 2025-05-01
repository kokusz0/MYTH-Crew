"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"

type ApplicationStatusContextType = {
  isApplicationOpen: boolean
  setApplicationOpen: (isOpen: boolean) => void
  lastUpdated: string | null
  isLoading: boolean
  refreshStatus: () => Promise<void>
}

const ApplicationStatusContext = createContext<ApplicationStatusContextType | undefined>(undefined)

export function ApplicationStatusProvider({ children }: { children: ReactNode }) {
  const [isApplicationOpen, setIsApplicationOpen] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Function to fetch the current status from the API
  const fetchStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/application-status")
      if (response.ok) {
        const data = await response.json()
        setIsApplicationOpen(data.isOpen)
        setLastUpdated(data.lastUpdated)
      } else {
        console.error("Failed to fetch application status:", await response.text())
      }
    } catch (error) {
      console.error("Error fetching application status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Expose refresh function to components
  const refreshStatus = async () => {
    await fetchStatus()
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
        toast({
          title: "Status Updated",
          description: `Applications are now ${isOpen ? "open" : "closed"}.`,
        })
      } else {
        const errorText = await response.text()
        console.error("Failed to update application status:", errorText)
        toast({
          title: "Update Failed",
          description: "Failed to update application status. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating application status:", error)
      toast({
        title: "Update Error",
        description: "An error occurred while updating the status.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ApplicationStatusContext.Provider
      value={{ isApplicationOpen, setApplicationOpen, lastUpdated, isLoading, refreshStatus }}
    >
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
