"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type AdminStatusType = {
  [username: string]: {
    lastActive: number
    isOnline: boolean
  }
}

type AdminStatusContextType = {
  adminStatus: AdminStatusType
  updateAdminStatus: (username: string) => void
  markAdminOffline: (username: string) => void
}

const AdminStatusContext = createContext<AdminStatusContextType | undefined>(undefined)

export function AdminStatusProvider({ children }: { children: ReactNode }) {
  const [adminStatus, setAdminStatus] = useState<AdminStatusType>({})

  // Function to fetch admin status
  const fetchAdminStatus = async () => {
    try {
      const response = await fetch("/api/admin-status")
      if (response.ok) {
        const data = await response.json()
        setAdminStatus(data)
      }
    } catch (error) {
      console.error("Error fetching admin status:", error)
    }
  }

  // Function to update admin status (ping)
  const updateAdminStatus = async (username: string) => {
    try {
      await fetch("/api/admin-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, action: "ping" }),
      })
      fetchAdminStatus() // Refresh status after update
    } catch (error) {
      console.error("Error updating admin status:", error)
    }
  }

  // Function to mark admin as offline
  const markAdminOffline = async (username: string) => {
    try {
      await fetch("/api/admin-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, action: "logout" }),
      })
      fetchAdminStatus() // Refresh status after update
    } catch (error) {
      console.error("Error marking admin offline:", error)
    }
  }

  // Initial fetch on component mount
  useEffect(() => {
    fetchAdminStatus()
  }, [])

  // Set up periodic status check and ping (every 60 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchAdminStatus()

      // If we have a logged in admin, ping their status
      const adminUser = localStorage.getItem("mythCrewAdminUser")
      if (adminUser) {
        updateAdminStatus(adminUser)
      }
    }, 60000) // Check every minute

    return () => clearInterval(intervalId)
  }, [])

  // Initial ping if admin is logged in
  useEffect(() => {
    const adminUser = localStorage.getItem("mythCrewAdminUser")
    if (adminUser) {
      updateAdminStatus(adminUser)
    }
  }, [])

  return (
    <AdminStatusContext.Provider value={{ adminStatus, updateAdminStatus, markAdminOffline }}>
      {children}
    </AdminStatusContext.Provider>
  )
}

export function useAdminStatus() {
  const context = useContext(AdminStatusContext)
  if (context === undefined) {
    throw new Error("useAdminStatus must be used within an AdminStatusProvider")
  }
  return context
}
