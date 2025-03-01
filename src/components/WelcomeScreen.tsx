import React from 'react';
import { Code, Lightbulb, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  username: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ username }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Welcome, {username}!</h2>
        <p className="text-gray-400 mt-1">Your AI assistant for getting better at LeetCode problems</p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
          How to use LeetAI
        </h3>
        <ol className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-start">
            <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">1</span>
            <span>Navigate to any LeetCode problem page</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">2</span>
            <span>Click the LeetAI icon in the bottom right corner</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">3</span>
            <span>Chat with AI for getting hints and guidance.</span>
          </li>
        </ol>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
            <h4 className="font-medium">Get Hints</h4>
          </div>
          <p className="text-xs text-gray-400">
            Ask for hints to make sure you get better at problem solving.
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Code className="w-5 h-5 mr-2 text-green-400" />
            <h4 className="font-medium">Code Help</h4>
          </div>
          <p className="text-xs text-gray-400">
            Get help with specific parts of your code
          </p>
        </div>
      </div>
      
      {/* <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">
          LeetAI is ready to help with your DSA journey!
        </p>
      </div> */}
    </div>
  );
};

export default WelcomeScreen;