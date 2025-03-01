// ErrorScreen.tsx

import React from 'react';

interface ErrorScreenProps {
  message?: string; // Optional error message to display
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Error!</h2>
      {message && <p className="text-white">{message}</p>}
    </div>
  );
};

export default ErrorScreen;