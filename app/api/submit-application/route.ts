import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Get the webhook URL from environment variables
    const webhookUrl = process.env.DISCORD_APPLICATION_WEBHOOK

    if (!webhookUrl) {
      console.log("Discord webhook URL not configured, but continuing for preview mode")
      // Return success in preview mode to allow testing
      return NextResponse.json({ success: true, preview: true })
    }

    // Format the data for Discord
    const discordPayload = {
      content: "New MYTH Crew Application",
      embeds: [
        {
          title: "Application from " + data.inGameName,
          color: 3447003, // Blue color
          fields: [
            { name: "In-game Name", value: data.inGameName, inline: true },
            { name: "Age", value: data.age, inline: true },
            { name: "Discord User", value: data.discordUser, inline: true },
            { name: "CnR Level", value: data.level, inline: true },
            { name: "Activity", value: data.activity, inline: true },
            { name: "Prior Crew Experience", value: data.priorExperience || "None" },
            { name: "Reason for Joining", value: data.joinReason },
            { name: "Contribution to MYTH", value: data.contribution },
            { name: "Additional Information", value: data.additionalInfo || "None provided" },
          ],
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
    console.error("Error in submit-application route:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
