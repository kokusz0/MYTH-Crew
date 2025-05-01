"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useApplicationStatus } from "@/context/application-status-context"
import { Shield, LogOut } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const { isApplicationOpen, setApplicationOpen } = useApplicationStatus()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [adminUser, setAdminUser] = useState("")

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
    }
  }, [router])

  const toggleApplicationStatus = () => {
    setApplicationOpen(!isApplicationOpen)
  }

  const logout = () => {
    localStorage.removeItem("mythCrewAdminAuth")
    localStorage.removeItem("mythCrewAdminUser")
    // Keep the code auth so they only need to re-enter credentials
    router.push("/admin/login")
  }

  const fullLogout = () => {
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
          <section className="p-6 border border-blue-900 rounded-lg">
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Application Status</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 mb-2">Current Status:</p>
                <p className={`text-xl font-bold ${isApplicationOpen ? "text-green-500" : "text-red-500"}`}>
                  {isApplicationOpen ? "OPEN" : "CLOSED"}
                </p>
              </div>
              <Button
                onClick={toggleApplicationStatus}
                className={isApplicationOpen ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
              >
                {isApplicationOpen ? "Close Applications" : "Open Applications"}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
