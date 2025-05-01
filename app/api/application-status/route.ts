import { type NextRequest, NextResponse } from "next/server"

// In-memory storage (this will reset on server restart, but works for demo purposes)
let applicationStatus = {
  isOpen: true,
  lastUpdated: new Date().toISOString(),
}

// GET endpoint to retrieve the current status
export async function GET() {
  try {
    return NextResponse.json(applicationStatus)
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

    // Update the status
    applicationStatus = {
      isOpen,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(applicationStatus)
  } catch (error) {
    console.error("Error updating application status:", error)
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}
