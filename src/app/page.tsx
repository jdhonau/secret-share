'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CryptoJS from 'crypto-js';
import Header from './components/Header';

const formSchema = z.object({
  secret: z.string().min(1, 'Secret is required'),
  expiryDays: z.number().min(1).max(30),
  maxViews: z.number().min(1).max(100),
  passkey: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expiryDays: 7,
      maxViews: 1,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Encrypt the secret with the passkey if provided
      const encryptedSecret = data.passkey
        ? CryptoJS.AES.encrypt(data.secret, data.passkey).toString()
        : CryptoJS.AES.encrypt(data.secret, 'default-key').toString();

      const response = await fetch('/api/secrets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: encryptedSecret,
          expiryDays: data.expiryDays,
          maxViews: data.maxViews,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create secret');
      }

      const baseUrl = window.location.origin;
      setGeneratedLink(`${baseUrl}/secret/${result.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create secret');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <Header />
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {error && (
          <div className="mb-6 bg-red-50 p-4 rounded-md text-red-700">
            <p>{error}</p>
          </div>
        )}
{/* bg-purple-100 border border-gray-400 p-4 rounded-md */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              
              Secret
            </label>
            <textarea
              {...register('secret')}
              className="w-full p-4 border-1 bg-purple-100 text-gray-900 border-gray-400 p-4 rounded-md"
              rows={4}
              placeholder="Enter your secret message..."
            />
            {errors.secret && (
              <p className="text-red-500 text-sm mt-1">{errors.secret.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry (Days)
            </label>
            <input
              type="number"
              {...register('expiryDays', { valueAsNumber: true })}
              className="w-full p-2 border-1 rounded-md text-gray-900 bg-purple-100 border-gray-400 rounded-md"
            />
            {errors.expiryDays && (
              <p className="text-red-500 text-sm mt-1">{errors.expiryDays.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Views
            </label>
            <input
              type="number"
              {...register('maxViews', { valueAsNumber: true })}
              className="w-full p-2 border-1 rounded-md text-gray-900 bg-purple-100 border-gray-400 rounded-md"
            />
            {errors.maxViews && (
              <p className="text-red-500 text-sm mt-1">{errors.maxViews.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passkey (Optional)
            </label>
            <input
              type="password"
              {...register('passkey')}
              className="w-full p-2 border-1 rounded-md text-gray-900 bg-purple-100 border-gray-400 rounded-md"
              placeholder="Enter a passkey for additional security"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-900 text-white py-2 px-4 rounded-md hover:bg-purple-200 hover:text-purple-900 transition-colors disabled:bg-blue-400"
          >
            {isLoading ? 'Generating...' : 'Generate Secure Link'}
          </button>
        </form>

        {generatedLink && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h2 className="text-lg font-semibold mb-2 text-purple-900">Your Secure Link</h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="w-full p-2 bg-white border rounded-md text-gray-900"
              />
              <button
                onClick={() => navigator.clipboard.writeText(generatedLink)}
                className="bg-purple-900 p-2 rounded-md hover:bg-purple-200 hover:text-purple-900 transition-colors"
              >
                Copy
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Share this link with the intended recipient. The secret will be destroyed after viewing or when it expires.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

