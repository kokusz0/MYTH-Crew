"use client"

import { useApplicationStatus } from "@/context/application-status-context"

export default function ApplicationStatus() {
  const { isApplicationOpen } = useApplicationStatus()

  return (
    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-blue-900 rounded-lg p-3 shadow-lg">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${isApplicationOpen ? "bg-green-500" : "bg-red-500"}`}></div>
        <div>
          <p className="text-sm font-medium">Application Status:</p>
          <p className={`text-lg font-bold ${isApplicationOpen ? "text-green-500" : "text-red-500"}`}>
            {isApplicationOpen ? "OPEN" : "CLOSED"}
          </p>
        </div>
      </div>
    </div>
  )
}
