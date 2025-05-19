import Link from "next/link"

export default function Header() {
  return (
    <header className="mb-8">
      <Link href="/" className="inline-block">
        <h1 className="text-3xl font-bold text-purple-900">SecretShare</h1>
      </Link>
      <p className="text-gray-600 mt-2">Share sensitive information securely with automatic expiration</p>
    </header>
  )
}
