"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useApplicationStatus } from "@/context/application-status-context"
import { useAdminStatus } from "@/context/admin-status-context"
import { Shield, LogOut, RefreshCw, Users, Clock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function AdminPage() {
  const router = useRouter()
  const { regularStatus, moderatorStatus, setApplicationStatus, isLoading, refreshStatus } = useApplicationStatus()
  const { adminStatus, updateAdminStatus, markAdminOffline } = useAdminStatus()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [adminUser, setAdminUser] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    // Check if user is authorized via both code and admin auth
    const codeAuth = localStorage.getItem("mythCrewCodeAuth")
    const adminAuth = localStorage.getItem("mythCrewAdminAuth")
    const user = localStorage.getItem("mythCrewAdminUser")

    if (codeAuth !== "authorized" || adminAuth !== "authorized") {
      router.push("/")
    } else {
      setIsAuthorized(true)
      setAdminUser(user || "Admin")

      // Update admin status on load
      if (user) {
        updateAdminStatus(user)
      }
    }
  }, [router, updateAdminStatus])

  // Ping admin status every minute
  useEffect(() => {
    if (!adminUser) return

    const intervalId = setInterval(() => {
      updateAdminStatus(adminUser)
    }, 60000) // Every minute

    return () => clearInterval(intervalId)
  }, [adminUser, updateAdminStatus])

  const toggleApplicationStatus = async (type: "regular" | "moderator") => {
    try {
      const currentStatus = type === "regular" ? regularStatus.isOpen : moderatorStatus.isOpen
      await setApplicationStatus(type, !currentStatus)
    } catch (error) {
      console.error(`Error toggling ${type} status:`, error)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown"
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const manualRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshStatus()
      toast({
        title: "Status Refreshed",
        description: "Application status has been refreshed.",
      })
    } catch (error) {
      console.error("Error refreshing status:", error)
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh application status.",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const logout = () => {
    if (adminUser) {
      markAdminOffline(adminUser)
    }
    localStorage.removeItem("mythCrewAdminAuth")
    localStorage.removeItem("mythCrewAdminUser")
    // Keep the code auth so they only need to re-enter credentials
    router.push("/admin/login")
  }

  const fullLogout = () => {
    if (adminUser) {
      markAdminOffline(adminUser)
    }
    localStorage.removeItem("mythCrewCodeAuth")
    localStorage.removeItem("mythCrewAdminAuth")
    localStorage.removeItem("mythCrewAdminUser")
    router.push("/")
  }

  if (!isAuthorized) {
    return <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">Loading...</div>
  }

  return (
    <main className="min-h-[calc(100vh-73px)] p-4 bg-gradient-to-b from-blue-950 to-black">
      <div className="max-w-4xl mx-auto bg-black/90 p-8 rounded-lg backdrop-blur-sm border border-blue-900">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Shield className="text-blue-400 mr-2" size={24} />
            <h1 className="text-3xl font-bold text-blue-400">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-gray-300">
              Logged in as <span className="text-blue-400 font-semibold">{adminUser}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-yellow-600 text-yellow-400 hover:bg-yellow-950"
                onClick={logout}
              >
                Re-login
              </Button>
              <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-950" onClick={fullLogout}>
                <LogOut size={16} className="mr-1" /> Full Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Online Admins Section */}
          <section className="p-6 border border-blue-900 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold text-blue-400 flex items-center">
                <Users className="mr-2" size={20} /> Online Admins
              </h2>
              <div className="text-xs text-gray-400 flex items-center">
                <Clock size={12} className="mr-1" /> Auto-updates every minute
              </div>
            </div>

            <div className="space-y-2">
              {Object.keys(adminStatus).length === 0 ? (
                <p className="text-gray-400">No admins currently online</p>
              ) : (
                Object.entries(adminStatus).map(([username, status]) => (
                  <div key={username} className="flex items-center justify-between p-2 border-b border-gray-800">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${status.isOnline ? "bg-green-500" : "bg-gray-500"}`}
                      ></div>
                      <span className="text-gray-300">{username}</span>
                    </div>
                    <div className="text-xs text-gray-400">{status.isOnline ? "Online" : "Offline"}</div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Regular Applications Section */}
          <section className="p-6 border border-blue-900 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold text-blue-400">Crew Application Status</h2>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={manualRefresh}
                disabled={refreshing || isLoading}
              >
                <RefreshCw size={14} className={refreshing || isLoading ? "animate-spin" : ""} />
                Refresh
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 mb-2">Current Status:</p>
                <p className={`text-xl font-bold ${regularStatus.isOpen ? "text-green-500" : "text-red-500"}`}>
                  {regularStatus.isOpen ? "OPEN" : "CLOSED"}
                </p>
                <p className="text-xs text-gray-400 mt-1">Last updated: {formatDate(regularStatus.lastUpdated)}</p>
              </div>
              <Button
                onClick={() => toggleApplicationStatus("regular")}
                className={regularStatus.isOpen ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : regularStatus.isOpen ? "Close Applications" : "Open Applications"}
              </Button>
            </div>
          </section>

          {/* Moderator Applications Section */}
          <section className="p-6 border border-blue-900 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold text-blue-400">Moderator Application Status</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 mb-2">Current Status:</p>
                <p className={`text-xl font-bold ${moderatorStatus.isOpen ? "text-green-500" : "text-red-500"}`}>
                  {moderatorStatus.isOpen ? "OPEN" : "CLOSED"}
                </p>
                <p className="text-xs text-gray-400 mt-1">Last updated: {formatDate(moderatorStatus.lastUpdated)}</p>
              </div>
              <Button
                onClick={() => toggleApplicationStatus("moderator")}
                className={moderatorStatus.isOpen ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : moderatorStatus.isOpen ? "Close Applications" : "Open Applications"}
              </Button>
            </div>
          </section>
        </div>
      </div>
      <Toaster />
    </main>
  )
}
