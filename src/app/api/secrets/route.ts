import { NextResponse } from "next/server"
import { randomUUID } from "crypto"

// This is a simple in-memory store for demonstration
// In production, you should use a database
const secretsStore: Record<
  string,
  {
    secret: string
    expiryDate: Date
    maxViews: number
    views: number
  }
> = {}

// Cleanup function to remove expired secrets (would be better handled by a cron job in production)
const cleanupExpiredSecrets = () => {
  const now = new Date()
  Object.keys(secretsStore).forEach((id) => {
    if (secretsStore[id].expiryDate < now || secretsStore[id].views >= secretsStore[id].maxViews) {
      delete secretsStore[id]
    }
  })
}

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

    // Run cleanup to remove expired secrets
    cleanupExpiredSecrets()

    return NextResponse.json({ id })
  } catch (error) {
    console.error("Error creating secret:", error)
    return NextResponse.json({ error: "Failed to create secret" }, { status: 500 })
  }
}
