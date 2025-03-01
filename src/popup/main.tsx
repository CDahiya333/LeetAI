import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Check if we're in a Chrome extension environment
const isChromeExtension = !!window.chrome && !!chrome.runtime && !!chrome.runtime.id;

// Polyfill chrome.storage for development environment
if (!isChromeExtension) {
  window.chrome = {
    ...window.chrome,
    storage: {
      sync: {
        get: (keys, callback) => {
          const result: Record<string, string | null> = {};
          if (typeof keys === 'string') {
            result[keys] = localStorage.getItem(keys);
          } else if (Array.isArray(keys)) {
            keys.forEach(key => {
              result[key] = localStorage.getItem(key);
            });
          } else if (keys === null) {
            // Get all items from localStorage
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key) {
                result[key] = localStorage.getItem(key);
              }
            }
          }
          callback(result);
        },
        set: (items, callback) => {
          Object.keys(items).forEach(key => {
            localStorage.setItem(key, items[key]);
          });
          if (callback) callback();
        },
        remove: (keys, callback) => {
          if (typeof keys === 'string') {
            localStorage.removeItem(keys);
          } else if (Array.isArray(keys)) {
            keys.forEach(key => {
              localStorage.removeItem(key);
            });
          }
          if (callback) callback();
        }
      }
    }
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);