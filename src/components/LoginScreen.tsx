import React, { useState } from "react";
import { LogIn, Mail, Lock } from "lucide-react";
import { SupabaseClient, User } from "@supabase/supabase-js";

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onSignupClick: () => void;
  supabase: SupabaseClient;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onSignupClick,
  supabase,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Basic validation
      if (!email || !password) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      // Login with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login Error:", error.message);
        setError(error.message);
      } else if (data.user) {
        console.log("Login successful:", data.user);
        onLogin(data.user);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[350px] items-center justify-center px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="w-full max-w-sm  bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-800 -mb-18">
        <h2 className="text-3xl font-extrabold text-white text-center">
          Login to LeetAI
        </h2>

        {error && (
          <div className="p-3 bg-red-500 bg-opacity-10 border border-red-500 text-red-400 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
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
                className="w-full pl-10 pr-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <LogIn className="w-5 h-5 mr-2" />
            )}
            Login
          </button>
        </form>

        <div className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSignupClick}
            className="text-blue-400 hover:text-blue-300 transition-colors duration-150 focus:outline-none"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
