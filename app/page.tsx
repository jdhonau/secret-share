import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Secret Share',
  description: 'Share secrets securely',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to Secret Share</h1>
        <p className="text-lg">
          A secure way to share sensitive information.
        </p>
      </div>
    </main>
  )
} 