"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import CryptoJS from "crypto-js"
import Header from "@/app/components/Header"

export default function SecretPage() {
  const params = useParams()
  const id = params.id as string

  const [secret, setSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [passkey, setPasskey] = useState("")
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [encryptedData, setEncryptedData] = useState<string | null>(null)

  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const response = await fetch(`/api/secrets/${id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch secret")
        }

        if (data.secret) {
          setEncryptedData(data.secret)
        } else {
          setError("Secret not found or has expired")
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch secret")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSecret()
  }, [id])

  const decryptSecret = () => {
    if (!encryptedData) return

    setIsDecrypting(true)
    try {
      // Try with provided passkey
      const key = passkey || "default-key"
      const decrypted = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8)

      if (decrypted) {
        setSecret(decrypted)
        setEncryptedData(null) // Clear encrypted data after successful decryption
      } else {
        setError("Invalid passkey or corrupted data")
      }
    } catch (error) {
      setError("Failed to decrypt. Please check your passkey.")
    } finally {
      setIsDecrypting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen p-8 max-w-2xl mx-auto">
        <Header />
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <p>Loading secret...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen p-8 max-w-2xl mx-auto">
        <Header />
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="bg-red-50 p-4 rounded-md text-red-700">
            <p>{error}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <Header />
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {secret ? (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-purple-900">Secret Message</h2>
            <div className="p-4 bg-purple-100 rounded-md whitespace-pre-wrap">{secret}</div>
            <p className="text-sm text-gray-600 mt-4">
              This secret has now been revealed and will be destroyed. If you need to share it again, please create a
              new secure link.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-purple-900">Decrypt Secret</h2>
            <p className="mb-4">
              This secret may be protected with a passkey. If you know the passkey, enter it below.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passkey (if required)</label>
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter passkey if one was set"
                />
              </div>
              <button
                onClick={decryptSecret}
                disabled={isDecrypting}
                className="w-full bg-purple-900 text-white py-2 px-4 rounded-md hover:bg-purple-200 hover:text-purple-900 transition-colors disabled:bg-purple-400"
              >
                {isDecrypting ? "Decrypting..." : "View Secret"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
