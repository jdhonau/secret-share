import { NextResponse } from "next/server"
import { secretsStore } from "@/app/lib/store"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  // Check if the secret exists
  if (!secretsStore[id]) {
    return NextResponse.json({ error: "Secret not found or has expired" }, { status: 404 })
  }

  // Check if the secret has expired
  const now = new Date()
  if (secretsStore[id].expiryDate < now) {
    delete secretsStore[id]
    return NextResponse.json({ error: "Secret has expired" }, { status: 404 })
  }

  // Check if the secret has reached max views
  if (secretsStore[id].views >= secretsStore[id].maxViews) {
    delete secretsStore[id]
    return NextResponse.json({ error: "Secret has reached maximum views" }, { status: 404 })
  }

  // Increment views
  secretsStore[id].views += 1

  // If this was the last view, delete the secret
  if (secretsStore[id].views >= secretsStore[id].maxViews) {
    const secret = secretsStore[id].secret
    delete secretsStore[id]
    return NextResponse.json({ secret })
  }

  return NextResponse.json({ secret: secretsStore[id].secret })
}
