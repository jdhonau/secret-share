import React, { useState } from 'react';
import { Button } from './Button';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  content: string;
  language: string;
}

const LANGUAGE_TO_EXTENSION: Record<string, string> = {
  javascript: 'js',
  typescript: 'ts',
  python: 'py',
  java: 'java',
  csharp: 'cs',
  php: 'php',
  ruby: 'rb',
  go: 'go',
  rust: 'rs',
  html: 'html',
  css: 'css',
  json: 'json',
  markdown: 'md',
  plaintext: 'txt',
};

export const DownloadButton: React.FC<DownloadButtonProps> = ({ content, language }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [filename, setFilename] = useState('');

  const handleDownload = () => {
    const extension = LANGUAGE_TO_EXTENSION[language] || 'txt';
    const finalFilename = filename.trim() 
      ? `${filename.trim()}${filename.includes('.') ? '' : `.${extension}`}`
      : `secret-code.${extension}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowDialog(false);
    setFilename('');
  };

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        variant="secondary"
        size="sm"
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Download Code</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter a filename for your code. The appropriate file extension will be added automatically.
            </p>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setShowDialog(false);
                  setFilename('');
                }}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDownload}
                variant="default"
                size="sm"
              >
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 