import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import App from "./App";
import "./index.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// console.log({
//   SUPA_URL: import.meta.env.VITE_SUPABASE_URL,
//   SUPA_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
// });

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase credentials not found!");
}

// Initialize Supabase client
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

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
