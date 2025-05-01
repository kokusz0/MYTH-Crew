"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"

type ApplicationType = "regular" | "moderator"

type ApplicationStatusState = {
  isOpen: boolean
  lastUpdated: string | null
}

type ApplicationStatusContextType = {
  regularStatus: ApplicationStatusState
  moderatorStatus: ApplicationStatusState
  setApplicationStatus: (type: ApplicationType, isOpen: boolean) => Promise<void>
  isLoading: boolean
  refreshStatus: () => Promise<void>
}

const defaultStatus: ApplicationStatusState = {
  isOpen: true,
  lastUpdated: null,
}

const ApplicationStatusContext = createContext<ApplicationStatusContextType | undefined>(undefined)

export function ApplicationStatusProvider({ children }: { children: ReactNode }) {
  const [regularStatus, setRegularStatus] = useState<ApplicationStatusState>(defaultStatus)
  const [moderatorStatus, setModeratorStatus] = useState<ApplicationStatusState>(defaultStatus)
  const [isLoading, setIsLoading] = useState(true)

  // Function to fetch the current status from the API
  const fetchStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/application-status")
      if (response.ok) {
        const data = await response.json()
        setRegularStatus({
          isOpen: data.regular.isOpen,
          lastUpdated: data.regular.lastUpdated,
        })
        setModeratorStatus({
          isOpen: data.moderator.isOpen,
          lastUpdated: data.moderator.lastUpdated,
        })
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
  const setApplicationStatus = async (type: ApplicationType, isOpen: boolean) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/application-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, isOpen }),
      })

      if (response.ok) {
        const data = await response.json()

        if (type === "regular") {
          setRegularStatus({
            isOpen: data.regular.isOpen,
            lastUpdated: data.regular.lastUpdated,
          })
        } else {
          setModeratorStatus({
            isOpen: data.moderator.isOpen,
            lastUpdated: data.moderator.lastUpdated,
          })
        }

        toast({
          title: "Status Updated",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} applications are now ${isOpen ? "open" : "closed"}.`,
        })
      } else {
        const errorText = await response.text()
        console.error(`Failed to update ${type} application status:`, errorText)
        toast({
          title: "Update Failed",
          description: `Failed to update ${type} application status. Please try again.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(`Error updating ${type} application status:`, error)
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
      value={{
        regularStatus,
        moderatorStatus,
        setApplicationStatus,
        isLoading,
        refreshStatus,
      }}
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
