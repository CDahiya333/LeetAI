import * as dotenv from 'dotenv';
dotenv.config({ path: "../env" });
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import App from "./App";
import "./index.css";

// Check if we're in a Chrome extension environment
const isChromeExtension =
  !!window.chrome && !!chrome.runtime && !!chrome.runtime.id;

// Polyfill chrome.storage for development environment
if (!isChromeExtension) {
  // ... your existing polyfill code ...
}

const supabaseUrl = process.env.YOUR_SUPABASE_URL;
const supabaseAnonKey = process.env.YOUR_SUPABASE_ANON_KEY;
let supabase: SupabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key not found in .env');
  // Initialize with a dummy client
  // supabase = createClient("dummyUrl", "dummyKey");
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  const container = document.getElementById('root');
  
  if (container) {
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <App supabase={supabase} />
      </StrictMode>
    );
  } else {
    // Handle the case where the root element is not found
    console.error("Root element not found!");
  }
}
