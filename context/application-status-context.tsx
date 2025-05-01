"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type ApplicationStatusContextType = {
  isApplicationOpen: boolean
  setApplicationOpen: (isOpen: boolean) => void
}

const ApplicationStatusContext = createContext<ApplicationStatusContextType | undefined>(undefined)

export function ApplicationStatusProvider({ children }: { children: ReactNode }) {
  const [isApplicationOpen, setIsApplicationOpen] = useState(true)

  // Load status from localStorage on initial render
  useEffect(() => {
    const savedStatus = localStorage.getItem("mythCrewApplicationStatus")
    if (savedStatus !== null) {
      setIsApplicationOpen(savedStatus === "open")
    }
  }, [])

  // Save status to localStorage whenever it changes
  const setApplicationOpen = (isOpen: boolean) => {
    setIsApplicationOpen(isOpen)
    localStorage.setItem("mythCrewApplicationStatus", isOpen ? "open" : "closed")
  }

  return (
    <ApplicationStatusContext.Provider value={{ isApplicationOpen, setApplicationOpen }}>
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
