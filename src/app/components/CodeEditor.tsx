import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Select } from './Select';

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'plaintext', label: 'Plain Text' },
] as const;

type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]['value'];

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  onLanguageChange?: (language: string) => void;
  className?: string;
  initialLanguage?: string;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  onLanguageChange, 
  className, 
  initialLanguage = 'plaintext',
  readOnly = false
}) => {
  const [language, setLanguage] = useState(initialLanguage);

  useEffect(() => {
    onLanguageChange?.(language);
  }, [language, onLanguageChange]);

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange?.(newValue);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-end">
        <Select
          value={language}
          onChange={handleLanguageChange}
          options={SUPPORTED_LANGUAGES}
          className="w-48"
        />
      </div>
      <div className="border rounded-md overflow-hidden">
        <Editor
          height="300px"
          defaultLanguage={language}
          language={language}
          value={value}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            readOnly,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor; 