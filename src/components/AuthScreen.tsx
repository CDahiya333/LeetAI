import React, { useState } from 'react';
import { LogIn, User as LucidUser, Lock } from 'lucide-react';
import { SupabaseClient, User  } from '@supabase/supabase-js'; // Correct import

interface AuthScreenProps {
  onLogin: (user: User) => void;
  supabase: SupabaseClient; // Correct type
}


const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, supabase }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Error state

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message); // Set error message
        // Handle signup error (e.g., display an error message)
      } else {
        const user = data.user;
        const { error: metadataError } = await supabase.auth.updateUser({
          data: { username },
        });
        if (metadataError) {
          console.error("Metadata Update Error:", metadataError.message);
          setError(metadataError.message);
        } else {
          if(user){ //Ensuring that user field is not Null
            onLogin(user);
          }
        }
      }
    } catch (err) {
      if(err instanceof Error){
        setError(err.message);
      }else{
        setError("An Unknown Error Occured.")
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to LeetAI</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-300 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LucidUser className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-800 block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                placeholder="Enter your username"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LogIn className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Email input
                className="bg-gray-800 block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                placeholder="Enter your password"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Login
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default AuthScreen;