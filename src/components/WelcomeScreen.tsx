import React from 'react';
import { Code, Lightbulb, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  username: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ username }) => {
  return (
    <div className="flex flex-col h-full bg-black bg-opacity-80 backdrop-blur-md rounded-xl shadow-lg p-6 text-white font-sans">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Welcome, {username}!</h2>
        <p className="text-gray-400 mt-1">
          Your AI assistant for mastering LeetCode problems.
        </p>
      </div>

      {/* Tip Box */}
      <div className="bg-[#111] border border-gray-700 rounded-lg p-4 mb-4 shadow-md">
        <h3 className="text-lg font-medium mb-3 flex items-center text-white">
          <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
          How to Use
        </h3>
        <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
          <li>Click the floating button to open the LeetAI chat.</li>
          <li>Ask any DSA-related question during a problem.</li>
          <li>Use the model dropdown to switch LLM behavior.</li>
        </ul>
      </div>

      {/* Feature Highlights */}
      <div className="bg-[#111] border border-gray-700 rounded-lg p-4 mb-4 shadow-md">
        <h3 className="text-lg font-medium mb-3 flex items-center text-white">
          <Lightbulb className="w-5 h-5 mr-2 text-orange-300" />
          Tips for Best Results
        </h3>
        <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
          <li>Give complete context like problem name or input/output.</li>
          <li>Ask about time complexity, edge cases, and dry runs.</li>
          <li>Use markdown or code blocks to share code snippets.</li>
        </ul>
      </div>

      {/* Footer or Summary */}
      <div className="mt-auto text-sm text-center text-gray-500 pt-4 border-t border-gray-700">
        <Code className="w-4 h-4 inline mr-1 text-teal-400" />
        Made with 💻 by the LeetAI Team
      </div>
    </div>
  );
};

export default WelcomeScreen;
