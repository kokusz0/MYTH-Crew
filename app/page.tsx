"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import LeadershipSection from "@/components/leadership-section"
import ApplicationStatus from "@/components/application-status"
import { useApplicationStatus } from "@/context/application-status-context"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const { regularStatus, moderatorStatus } = useApplicationStatus()

  return (
    <main className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950 to-black -z-10"></div>

      <ApplicationStatus />

      <div className="text-center max-w-3xl mx-auto bg-black/80 p-8 rounded-lg backdrop-blur-sm border border-blue-900">
        <h1 className="text-4xl font-bold text-blue-400 mb-6">Welcome to MYTH</h1>
        <p className="text-lg mb-8 text-gray-300">Join our elite crew in CnR and become part of something legendary.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          <Link href="/application">
            <Button
              className={`px-6 py-2 ${
                regularStatus.isOpen ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-600 cursor-not-allowed"
              }`}
              disabled={!regularStatus.isOpen}
            >
              {regularStatus.isOpen ? "Join Us Now" : "Applications Closed"}
            </Button>
          </Link>
          <Link href="/feedback">
            <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-950 px-6 py-2">
              Send Feedback
            </Button>
          </Link>
        </div>

        {moderatorStatus.isOpen && (
          <div className="mt-4 pt-4 border-t border-blue-900">
            <p className="text-gray-300 mb-3">Want to help moderate our community?</p>
            <Link href="/moderator-application">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2">
                Apply to be a Moderator
              </Button>
            </Link>
          </div>
        )}
      </div>

      <LeadershipSection />
      <Toaster />
    </main>
  )
}
