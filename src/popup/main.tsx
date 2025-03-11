import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import App from "./App";
import "./index.css";

// Hardcoded Supabase credentials for Chrome extension
// In a production app, you might want to use a more secure approach
const supabaseUrl = "https://asiyptxldlpdmtarcxbq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzaXlwdHhsZGxwZG10YXJjeGJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NTcwNjYsImV4cCI6MjA1NjQzMzA2Nn0.Xyedt985RkrZiPuaQ-HRQSzo2gEt44YV7UBIjFGsp7M";


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