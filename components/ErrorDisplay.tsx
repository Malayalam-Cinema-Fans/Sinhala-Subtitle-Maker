
import React from 'react';
import { ErrorIcon } from './IconComponents';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="text-center w-full bg-red-900/20 border border-red-500/50 rounded-lg p-6 flex flex-col items-center">
      <ErrorIcon className="w-12 h-12 text-red-400 mb-4" />
      <h3 className="text-xl font-semibold text-red-300 mb-2">Translation Failed</h3>
      <p className="text-red-400 mb-6 max-w-md">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 border border-gray-600 text-base font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-800 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};
