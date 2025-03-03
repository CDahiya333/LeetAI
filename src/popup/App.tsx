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
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [screen, setScreen] = useState<"welcome" | "auth" | "apiKey" | "error">("auth");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("App component mounted");
    
    // Validate Supabase instance
    if (!supabase || typeof supabase.auth?.getSession !== 'function') {
      console.error("Supabase instance is invalid or not properly initialized");
      setError("Supabase client initialization failed");
      setScreen("error");
      return;
    }
    
    // Check for existing session
    const checkSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          setError("Failed to retrieve session: " + error.message);
          setScreen("error");
          return;
        }
        
        // Get API key from Chrome storage
        chrome.storage.local.get(["apiKey"], (result) => {
          console.log("Retrieved from storage:", result);
          setApiKey(result.apiKey || null);
          
          if (data.session) {
            // User is authenticated
            console.log("User authenticated:", data.session.user);
            setUser({ 
              email: data.session.user.email || "User" 
            });
            setIsAuthenticated(true);
            setScreen(result.apiKey ? "welcome" : "apiKey");
          } else {
            // No session, show auth screen
            console.log("No session found, showing auth screen");
            setScreen("auth");
          }
        });
      } catch (err) {
        console.error("Unexpected error during session check:", err);
        setError("An unexpected error occurred while checking your session");
        setScreen("error");
      }
    };
    
    checkSession();
  }, [supabase]);

  const handleLogin = (user: User) => {
    console.log("Login successful:", user);
    setUser({ email: user.email || "User" });
    setIsAuthenticated(true);
    
    // After login, check for API key and route accordingly
    chrome.storage.local.get(["apiKey"], (result) => {
      setApiKey(result.apiKey || null);
      setScreen(result.apiKey ? "welcome" : "apiKey");
    });
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await supabase.auth.signOut();
      
      // Clear user data from storage
      chrome.storage.local.remove(["apiKey"], () => {
        setUser(null);
        setApiKey(null);
        setIsAuthenticated(false);
        setScreen("auth");
        console.log("Logout complete");
      });
    } catch (error) {
      console.error("Logout Error:", error);
      setError("Failed to sign out. Please try again.");
    }
  };

  const handleSaveApiKey = (key: string) => {
    console.log("Saving API key...");
    chrome.storage.local.set({ apiKey: key }, () => {
      setApiKey(key);
      setScreen("welcome");
      console.log("API key saved");
    });
  };

  const renderScreen = () => {
    console.log("Rendering screen:", screen, "isAuthenticated:", isAuthenticated);
    
    if (screen === "error") {
      return <ErrorScreen message={error || "An unknown error occurred"} />;
    }
    
    if (!isAuthenticated) {
      return <AuthScreen onLogin={handleLogin} supabase={supabase} />;
    }
    
    if (screen === "apiKey") {
      return <ApiKeyScreen apiKey={apiKey || ""} onSave={handleSaveApiKey} />;
    }
    
    return <WelcomeScreen username={user?.email.split('@')[0] || "User"} />;
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
            <button type="button" onClick={() => setScreen("apiKey")} className="p-1 text-gray-300 hover:text-white" title="Configure API Key">
              <Key className="w-5 h-5" />
            </button>
            <button type="button" onClick={handleLogout} className="p-1 text-gray-300 hover:text-white" title="Logout">
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