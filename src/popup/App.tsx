import { useState, useEffect } from "react";
import { BrainCircuit, LogOut, Key, Zap } from "lucide-react";
import AuthScreen from "../components/AuthScreen";
import ApiKeyScreen from "../components/ApiKeyScreen";
import WelcomeScreen from "../components/WelcomeScreen";
// import { saveChatMessage, fetchChatHistory } from "../utils/storage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [screen, setScreen] = useState<"welcome" | "auth" | "apiKey">("auth");

  useEffect(() => {
    chrome.storage?.sync?.get(["user", "apiKey"], (result) => {
      if (result.user) {
        const storedUser = JSON.parse(result.user);
        setUser(storedUser);
        setIsAuthenticated(true);
        setScreen(result.apiKey ? "welcome" : "apiKey");
      }
      if (result.apiKey) {
        setApiKey(result.apiKey);
      }
    });
  }, []);

  const handleLogin = (username: string) => {
    const userData = { username };
    chrome.storage?.sync?.set({ user: JSON.stringify(userData) }, () => {
      setUser(userData);
      setIsAuthenticated(true);
      setScreen(apiKey ? "welcome" : "apiKey");
    });
  };

  const handleLogout = () => {
    chrome.storage?.sync?.remove(["user", "apiKey"], () => {
      setUser(null);
      setApiKey("");
      setIsAuthenticated(false);
      setScreen("auth");
    });
  };

  const handleSaveApiKey = (key: string) => {
    chrome.storage?.sync?.set({ apiKey: key }, () => {
      setApiKey(key);
      setScreen("welcome");
    });
  };

  const renderScreen = () => {
    if (!isAuthenticated) return <AuthScreen onLogin={handleLogin} />;
    if (screen === "apiKey") return <ApiKeyScreen apiKey={apiKey} onSave={handleSaveApiKey} />;
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
