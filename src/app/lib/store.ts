// This is a simple in-memory store for ephemeral secrets
export const secretsStore: Record<
  string,
  {
    secret: string
    expiryDate: Date
    maxViews: number
    views: number
  }
> = {}

// Cleanup function to remove expired secrets (would be better handled by a cron job in production)
export const cleanupExpiredSecrets = () => {
  const now = new Date()
  Object.keys(secretsStore).forEach((id) => {
    if (secretsStore[id].expiryDate < now || secretsStore[id].views >= secretsStore[id].maxViews) {
      delete secretsStore[id]
    }
  })
} 