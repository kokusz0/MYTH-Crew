import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for admin status
const adminStatus = {
  // username: { lastActive: timestamp, isOnline: boolean }
}

// Clean up function to mark admins as offline after inactivity (5 minutes)
const cleanupInactiveAdmins = () => {
  const now = Date.now()
  const inactiveThreshold = 5 * 60 * 1000 // 5 minutes in milliseconds

  Object.keys(adminStatus).forEach((username) => {
    if (now - adminStatus[username].lastActive > inactiveThreshold) {
      adminStatus[username].isOnline = false
    }
  })
}

// GET endpoint to retrieve admin status
export async function GET() {
  try {
    cleanupInactiveAdmins()
    return NextResponse.json(adminStatus)
  } catch (error) {
    console.error("Error getting admin status:", error)
    return NextResponse.json({ error: "Failed to get admin status" }, { status: 500 })
  }
}

// POST endpoint to update admin status
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { username, action } = data

    if (!username || !action) {
      return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 })
    }

    if (action === "ping") {
      // Update or create admin status
      adminStatus[username] = {
        lastActive: Date.now(),
        isOnline: true,
      }
    } else if (action === "logout") {
      // Mark admin as offline
      if (adminStatus[username]) {
        adminStatus[username].isOnline = false
      }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    cleanupInactiveAdmins()
    return NextResponse.json(adminStatus)
  } catch (error) {
    console.error("Error updating admin status:", error)
    return NextResponse.json({ error: "Failed to update admin status" }, { status: 500 })
  }
}
