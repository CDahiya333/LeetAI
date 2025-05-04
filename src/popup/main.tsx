import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import App from "./App";
import "./index.css";

const chromeStorage = {
  getItem: (key: string) =>
    new Promise<string | null>((resolve, reject) => {
      chrome.storage.local.get(key, (res) => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve(res[key] ?? null);
      });
    }),
  setItem: (key: string, value: string) =>
    new Promise<void>((resolve, reject) => {
      chrome.storage.local.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve();
      });
    }),
  removeItem: (key: string) =>
    new Promise<void>((resolve, reject) => {
      chrome.storage.local.remove(key, () => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve();
      });
    }),
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase credentials not found!");
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: chromeStorage,
    autoRefreshToken: true,
    persistSession: true,
  },
});
(async () => {
  const { data, error, status, statusText } = await supabase
    .from("users")
    .select("*")
    .limit(1);

  console.log({ data, error, status, statusText });
})();

// Render the app
const container: HTMLElement | null = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App supabase={supabase} />
    </StrictMode>
  );
} else {
  console.error("Root element not found!");
}
