
import React, { useState } from 'react';
import { CopyIcon, DownloadIcon, CheckIcon } from './IconComponents';

interface ResultDisplayProps {
  translatedSrtContent: string;
  onReset: () => void;
  fileName: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ translatedSrtContent, onReset, fileName }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedSrtContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([translatedSrtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'translated_sinhala.srt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold text-green-400 mb-4">Translation Complete!</h2>
      <div className="relative w-full mb-4">
        <textarea
          readOnly
          value={translatedSrtContent}
          className="w-full h-64 p-4 bg-gray-900 border border-gray-700 rounded-lg font-mono text-sm text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button onClick={handleCopy} className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
          {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5 text-gray-400" />}
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button
          onClick={handleDownload}
          className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 transition-colors"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          Download .SRT
        </button>
        <button
          onClick={onReset}
          className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-base font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-800 transition-colors"
        >
          Translate Another File
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
