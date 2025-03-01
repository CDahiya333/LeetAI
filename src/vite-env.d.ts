/// <reference types="vite/client" />

interface Window {
  chrome?: {
    storage?: {
      sync?: {
        get: (keys: string[], callback: (result: any) => void) => void;
        set: (items: any, callback?: () => void) => void;
        remove: (keys: string[], callback?: () => void) => void;
      };
    };
    runtime?: {
      id?: string;
    };
  };
}