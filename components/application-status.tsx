"use client"

import { useApplicationStatus } from "@/context/application-status-context"
import { Loader2 } from "lucide-react"

export default function ApplicationStatus() {
  const { regularStatus, moderatorStatus, isLoading } = useApplicationStatus()

  return (
    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-blue-900 rounded-lg p-3 shadow-lg">
      <div className="space-y-2">
        <div className="flex items-center">
          {isLoading ? (
            <Loader2 className="w-3 h-3 mr-2 animate-spin text-blue-400" />
          ) : (
            <div className={`w-3 h-3 rounded-full mr-2 ${regularStatus.isOpen ? "bg-green-500" : "bg-red-500"}`}></div>
          )}
          <div>
            <p className="text-sm font-medium">Crew Applications:</p>
            <p
              className={`text-lg font-bold ${isLoading ? "text-gray-400" : regularStatus.isOpen ? "text-green-500" : "text-red-500"}`}
            >
              {isLoading ? "LOADING..." : regularStatus.isOpen ? "OPEN" : "CLOSED"}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          {isLoading ? (
            <Loader2 className="w-3 h-3 mr-2 animate-spin text-blue-400" />
          ) : (
            <div
              className={`w-3 h-3 rounded-full mr-2 ${moderatorStatus.isOpen ? "bg-green-500" : "bg-red-500"}`}
            ></div>
          )}
          <div>
            <p className="text-sm font-medium">Moderator Applications:</p>
            <p
              className={`text-lg font-bold ${isLoading ? "text-gray-400" : moderatorStatus.isOpen ? "text-green-500" : "text-red-500"}`}
            >
              {isLoading ? "LOADING..." : moderatorStatus.isOpen ? "OPEN" : "CLOSED"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
