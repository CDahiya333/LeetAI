import { useState, useEffect } from "react";
import { BrainCircuit, LogOut, Key, Zap } from "lucide-react";
import AuthScreen from "../components/AuthScreen";
import ApiKeyScreen from "../components/ApiKeyScreen";
import WelcomeScreen from "../components/WelcomeScreen";
import { SupabaseClient, User } from '@supabase/supabase-js';
import ErrorScreen from "../components/ErrorScreen";

interface AppProps {
  supabase: SupabaseClient;
}

function App({ supabase }: AppProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [apiKey, setApiKey] = useState<string | null>("");
  const [screen, setScreen] = useState<"welcome" | "auth" | "apiKey" | "error">("auth");

  useEffect(() => {
    if (!supabase || !supabase.auth) {
      console.error("Supabase instance is invalid!");
      setScreen("error"); // Show an error screen
      return;
    }
  
    // Proceed with normal authentication flow
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({ username: session.user.user_metadata?.username || "" });
        setIsAuthenticated(true);
      }
      chrome.storage?.sync?.get(["apiKey"], (result) => {
        setApiKey(result.apiKey || null);
        setScreen(session ? (result.apiKey ? "welcome" : "apiKey") : "auth");
      });
    });
  }, [supabase]); // Ensure Supabase dependency

  const handleLogin = (user: User) => {
    setUser({ username: user.user_metadata.username || "" });
    setIsAuthenticated(true);
    // After login, check for API key and route accordingly
    chrome.storage?.sync?.get(["apiKey"], (result) => {
      setScreen(result.apiKey ? "welcome" : "apiKey");
    });
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      chrome.storage?.sync?.remove(["user", "apiKey"], () => {
        setUser(null);
        setApiKey(null);
        setIsAuthenticated(false);
        setScreen("auth");
      });
    } catch (error) {
      console.error("Logout Error:", error);
      // Handle logout error
    }
  };

  const handleSaveApiKey = (key: string) => {
    chrome.storage?.sync?.set({ apiKey: key }, () => {
      setApiKey(key);
      setScreen("welcome");
    });
  };

  const renderScreen = () => {
    if (!isAuthenticated) return <AuthScreen onLogin={handleLogin} supabase={supabase} />;
    if (screen === "apiKey") return <ApiKeyScreen apiKey={apiKey || ""} onSave={handleSaveApiKey} />;
    if (screen === "error") return <ErrorScreen message="Supabase instance is invalid." />; 
    return <WelcomeScreen username={user?.username || ""} />;
  };

  return (
    <div className="w-[400px] h-[500px] bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 flex flex-col">
      <header className="flex justify-between items-center mb-6 pb-2 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white flex items-center">
          <BrainCircuit className="w-6 h-6 mr-2 text-blue-400" />
          LeetAI
        </h1>
        {isAuthenticated && (
          <div className="flex space-x-2">
            <button onClick={() => setScreen("apiKey")} className="p-1 text-gray-300 hover:text-white" title="Configure API Key">
              <Key className="w-5 h-5" />
            </button>
            <button onClick={handleLogout} className="p-1 text-gray-300 hover:text-white" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </header>

      <main className="flex-grow">{renderScreen()}</main>

      <footer className="mt-4 pt-2 border-t border-gray-700 flex justify-between items-center text-xs text-gray-400">
        <div className="flex items-center">
          <Zap className="w-4 h-4 mr-1" />
          <span>LeetAI v1.0.0</span>
        </div>
        <div>Made with ❤️ for your DSA Journey</div>
      </footer>
    </div>
  );
}

export default App;