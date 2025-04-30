import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Get the webhook URL from environment variables
    const webhookUrl = process.env.DISCORD_FEEDBACK_WEBHOOK

    if (!webhookUrl) {
      console.log("Discord feedback webhook URL not configured, but continuing for preview mode")
      // Return success in preview mode to allow testing
      return NextResponse.json({ success: true, preview: true })
    }

    // Format the data for Discord
    const discordPayload = {
      content: "New MYTH Crew Feedback",
      embeds: [
        {
          title: `Feedback Rating: ${data.rating}/5 Stars`,
          color: 3447003, // Blue color
          description: data.comment || "No comment provided",
          timestamp: new Date().toISOString(),
        },
      ],
    }

    // Send to Discord webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Discord API error:", errorText)
      return NextResponse.json({ success: false, message: "Failed to submit to Discord" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in submit-feedback route:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
