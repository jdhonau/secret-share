'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CryptoJS from 'crypto-js';
import Header from '../../components/Header';

export default function ViewSecret() {
  const { id } = useParams();
  const [secret, setSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [passkey, setPasskey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [decrypted, setDecrypted] = useState(false);

  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const response = await fetch(`/api/secrets?id=${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch secret');
        }

        setSecret(data.secret);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch secret');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecret();
  }, [id]);

  const handleDecrypt = () => {
    if (!secret) return;

    try {
      const decryptedBytes = CryptoJS.AES.decrypt(secret, passkey || 'default-key');
      const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedText) {
        throw new Error('Invalid passkey');
      }

      setSecret(decryptedText);
      setDecrypted(true);
    } catch (error) {
      setError('Invalid passkey');
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen p-8 max-w-2xl mx-auto">
        <Header />
        <div className="text-center">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8 max-w-2xl mx-auto">
        <Header />
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <Header />
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-purple-900">Secret Retrieval</h1>

        {!decrypted ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              This secret is protected. Enter the passkey to view it.
            </p>
            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="Enter passkey (if required)"
              className="w-full p-2 border rounded-md text-gray-900"
            />
            <button
              onClick={handleDecrypt}
              className="w-full bg-purple-900 text-white py-2 px-4 rounded-md hover:bg-purple-200 hover:text-purple-900 transition-colors"
            >
              Decrypt Secret
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-purple-100 border border-gray-400 p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-2 text-gray-900"></h2>
              <p className="whitespace-pre-wrap text-gray-900">{secret}</p>
            </div>
            <button
              onClick={() => secret && navigator.clipboard.writeText(secret)}
              className="bg-gray-400 p-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Copy
            </button>
            
            <div className="rounded-md p-4" style={{ backgroundColor: '#bfbfbf' }}>
              <p className="text-sm text-red-500 italic">
                This secret has been revealed and cannot be viewed again. Make sure to save it if needed.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 