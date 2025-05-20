import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { secretsStore } from "@/app/lib/store"

export async function POST(request: Request) {
  try {
    const { secret, expiryDays, maxViews, language = "plaintext" } = await request.json()

    if (!secret) {
      return NextResponse.json({ error: "Secret is required" }, { status: 400 })
    }

    // Generate a unique ID for the secret
    const id = uuidv4()

    // Calculate expiry date
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + (expiryDays || 7))

    // Store the secret
    secretsStore[id] = {
      secret,
      expiryDate,
      maxViews: maxViews || 1,
      views: 0,
      language,
    }

    return NextResponse.json({ id })
  } catch (error) {
    console.error("Error creating secret:", error)
    return NextResponse.json({ error: "Failed to create secret" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 })
  }

  const secretData = secretsStore[id]

  if (!secretData) {
    return NextResponse.json({ error: "Secret not found" }, { status: 404 })
  }

  if (new Date() > secretData.expiryDate) {
    delete secretsStore[id]
    return NextResponse.json({ error: "Secret has expired" }, { status: 410 })
  }

  if (secretData.views >= secretData.maxViews) {
    delete secretsStore[id]
    return NextResponse.json({ error: "Secret has reached maximum views" }, { status: 410 })
  }

  secretData.views += 1

  return NextResponse.json({
    secret: secretData.secret,
    language: secretData.language,
  })
}
