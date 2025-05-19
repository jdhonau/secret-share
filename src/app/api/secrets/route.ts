import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { secretsStore } from "@/app/lib/store"

export async function POST(request: Request) {
  try {
    const { secret, expiryDays, maxViews } = await request.json()

    if (!secret) {
      return NextResponse.json({ error: "Secret is required" }, { status: 400 })
    }

    // Generate a unique ID for the secret
    const id = randomUUID()

    // Calculate expiry date
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + (expiryDays || 7))

    // Store the secret
    secretsStore[id] = {
      secret,
      expiryDate,
      maxViews: maxViews || 1,
      views: 0,
    }

    return NextResponse.json({ id })
  } catch (error) {
    console.error("Error creating secret:", error)
    return NextResponse.json({ error: "Failed to create secret" }, { status: 500 })
  }
}
