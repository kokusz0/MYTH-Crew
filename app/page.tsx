"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import LeadershipSection from "@/components/leadership-section"
import ApplicationStatus from "@/components/application-status"
import { useApplicationStatus } from "@/context/application-status-context"

export default function Home() {
  const { isApplicationOpen } = useApplicationStatus()

  return (
    <main className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950 to-black -z-10"></div>

      <ApplicationStatus />

      <div className="text-center max-w-3xl mx-auto bg-black/80 p-8 rounded-lg backdrop-blur-sm border border-blue-900">
        <h1 className="text-4xl font-bold text-blue-400 mb-6">Welcome to MYTH</h1>
        <p className="text-lg mb-8 text-gray-300">Join our elite crew in CnR and become part of something legendary.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/application">
            <Button
              className={`px-6 py-2 ${
                isApplicationOpen ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-600 cursor-not-allowed"
              }`}
              disabled={!isApplicationOpen}
            >
              {isApplicationOpen ? "Join Us Now" : "Applications Closed"}
            </Button>
          </Link>
          <Link href="/feedback">
            <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-950 px-6 py-2">
              Send Feedback
            </Button>
          </Link>
        </div>
      </div>

      <LeadershipSection />
    </main>
  )
}
