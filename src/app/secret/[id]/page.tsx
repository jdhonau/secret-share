"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import CryptoJS from "crypto-js"
import Header from "@/app/components/Header"
import CodeEditor from "@/app/components/CodeEditor"
import { Button } from "@/app/components/Button"
import { DownloadButton } from "@/app/components/DownloadButton"
import { Copy } from "lucide-react"

export default function SecretPage() {
  const params = useParams()
  const id = params.id as string

  const [secret, setSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState('plaintext')
  const [isLoading, setIsLoading] = useState(true)
  const [passkey, setPasskey] = useState("")
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [encryptedData, setEncryptedData] = useState<string | null>(null)

  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const response = await fetch(`/api/secrets?id=${params.id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch secret')
        }

        // Store the encrypted data and try to decrypt with default key
        setEncryptedData(data.secret)
        setLanguage(data.language || 'plaintext')
        
        // Try to decrypt with default key first
        try {
          const decrypted = CryptoJS.AES.decrypt(data.secret, "default-key").toString(CryptoJS.enc.Utf8)
          if (decrypted) {
            setSecret(decrypted)
          } else {
            // If default key doesn't work, we'll need the passkey
            setSecret(null)
          }
        } catch (err) {
          // If decryption fails, we'll need the passkey
          setSecret(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch secret')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSecret()
  }, [params.id])

  const decryptSecret = () => {
    if (!encryptedData) return

    setIsDecrypting(true)
    try {
      const key = passkey || "default-key"
      const decrypted = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8)

      if (decrypted) {
        setSecret(decrypted)
      } else {
        setError("Invalid passkey or corrupted data")
      }
    } catch (error) {
      setError("Failed to decrypt. Please check your passkey.")
    } finally {
      setIsDecrypting(false)
    }
  }

  const handleCopy = () => {
    if (secret) {
      navigator.clipboard.writeText(secret)
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-purple-900">Secret Message</h2>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(secret)
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <DownloadButton content={secret} language={language} />
              </div>
            </div>
            <div className="relative">
              <CodeEditor
                value={secret}
                initialLanguage={language}
                onLanguageChange={setLanguage}
                onChange={(newValue) => setSecret(newValue)}
                className="w-full"
              />
            </div>
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
              <Button
                onClick={decryptSecret}
                disabled={isDecrypting}
                className="w-full bg-purple-900 text-white hover:bg-purple-200 hover:text-purple-900 transition-colors disabled:bg-purple-400"
              >
                {isDecrypting ? "Decrypting..." : "View Secret"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
