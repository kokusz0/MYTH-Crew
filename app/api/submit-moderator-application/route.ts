import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Get the webhook URL from environment variables or use the provided one
    const webhookUrl =
      process.env.DISCORD_MODERATOR_WEBHOOK ||
      "https://discord.com/api/webhooks/1367564989107404920/IW5Sh-l0-ypmSW63UUXPTgxXLRXm7UCLCL1EAeD1LBtrlK6ZTpDanUjgEC10gExleD66"

    if (!webhookUrl) {
      console.log("Discord webhook URL not configured, but continuing for preview mode")
      // Return success in preview mode to allow testing
      return NextResponse.json({ success: true, preview: true })
    }

    // Format active times array into a string
    const activeTimes = Array.isArray(data.activeTimes)
      ? data.activeTimes.join(", ")
      : data.activeTimes || "Not specified"

    // Format the data for Discord
    const discordPayload = {
      content: "New MYTH Crew Moderator Application",
      embeds: [
        {
          title: "Moderator Application from " + data.discordUsername,
          color: 3447003, // Blue color
          fields: [
            { name: "Discord Username", value: data.discordUsername, inline: true },
            { name: "Age", value: data.age, inline: true },
            { name: "Location & Time Zone", value: data.locationTimezone, inline: true },
            { name: "Active Hours", value: data.activeHours || "Not specified", inline: true },
            { name: "Active Times", value: activeTimes, inline: false },
            { name: "Commitments", value: data.commitments || "None mentioned" },
            { name: "Moderation Experience", value: data.moderationExperience || "None mentioned" },
            { name: "Why Become a Moderator", value: data.whyModerator },
            { name: "Handling Disrespect", value: data.handleDisrespect },
            { name: "Read Rules", value: data.readRules || "Not specified", inline: true },
            { name: "Familiar with Bots", value: data.familiarWithBots || "Not specified", inline: true },
            { name: "Handling Spam", value: data.handleSpam },
            { name: "Handling Arguments", value: data.handleArgument },
            { name: "Additional Info", value: data.additionalInfo || "None provided" },
            { name: "Agrees to Guidelines", value: data.agreeToGuidelines || "Not specified" },
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
    console.error("Error in submit-moderator-application route:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
