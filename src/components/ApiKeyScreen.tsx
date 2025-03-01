import React, { useState } from 'react';
import { Key, Save, AlertCircle } from 'lucide-react';

interface ApiKeyScreenProps {
  apiKey: string |  null;
  onSave: (key: string) => void;
}

const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ apiKey, onSave }) => {
  const [key, setKey] = useState(apiKey || "");
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!key.trim()) {
      setError('API Key is required');
      return;
    }
    
    if (!key.startsWith('sk-')) {
      setError('Invalid OpenAI API Key format');
      return;
    }
    
    onSave(key);
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">OpenAI API Key</h2>
      
      <div className="mb-4 p-3 bg-blue-500 bg-opacity-20 border border-blue-500 rounded text-blue-300 text-sm flex items-start">
        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
        <p>
          API key is stored locally and never sent to any servers.
          Only used while making request to OpenAI API-endpoint.
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-300 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">
            OpenAI API Key
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Key className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="apiKey"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="bg-gray-800 block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              placeholder="sk-..."
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">OpenAI Dashboard</a>
          </p>
        </div>
        
        <button
          type="submit"
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="w-5 h-5 mr-2" />
          Save API Key
        </button>
      </form>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2 text-gray-300">Why do I need an API key?</h3>
        <p className="text-sm text-gray-400">
          LeetAI uses OpenAI API to make requests on your behalf, giving you full control over cost and usage.
          API is stored locally further increasing security or API leaks. 
          Feel free to check the github repo for more details.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyScreen;