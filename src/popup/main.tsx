import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import App from "./App";
import "./index.css";

// Hardcoded Supabase credentials for Chrome extension
// In a production app, you might want to use a more secure approach
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";


// Initialize Supabase client
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Render the app
const container: HTMLElement | null = document.getElementById('root');
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