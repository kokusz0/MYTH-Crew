import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Path to the status file
const statusFilePath = path.join(process.cwd(), "application-status.json")

// Initialize the status file if it doesn't exist
function initStatusFile() {
  if (!fs.existsSync(statusFilePath)) {
    fs.writeFileSync(statusFilePath, JSON.stringify({ isOpen: true, lastUpdated: new Date().toISOString() }))
  }
}

// Get the current status
function getStatus() {
  initStatusFile()
  const statusData = fs.readFileSync(statusFilePath, "utf-8")
  return JSON.parse(statusData)
}

// Update the status
function updateStatus(isOpen: boolean) {
  const newStatus = { isOpen, lastUpdated: new Date().toISOString() }
  fs.writeFileSync(statusFilePath, JSON.stringify(newStatus))
  return newStatus
}

// GET endpoint to retrieve the current status
export async function GET() {
  try {
    const status = getStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error("Error getting application status:", error)
    return NextResponse.json({ isOpen: true, error: "Failed to get status" }, { status: 500 })
  }
}

// POST endpoint to update the status
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { isOpen } = data

    if (typeof isOpen !== "boolean") {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
    }

    const newStatus = updateStatus(isOpen)
    return NextResponse.json(newStatus)
  } catch (error) {
    console.error("Error updating application status:", error)
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}
