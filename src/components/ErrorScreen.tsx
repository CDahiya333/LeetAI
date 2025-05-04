// ErrorScreen.tsx

import React from 'react';

interface ErrorScreenProps {
  message?: string; // Optional error message to display
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="w-full max-w-sm bg-gray-900 border border-red-500 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-red-500 text-center mb-3">Error!</h2>
        {message && (
          <p className="text-sm text-red-300 text-center bg-red-500 bg-opacity-20 border border-red-500 rounded p-3">
            {message}
          </p>
        )}
      </div>
    </div>
  );
  
};

export default ErrorScreen;