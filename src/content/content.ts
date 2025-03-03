import { removeLoading, showLoading } from "./loading";
// import { VALID_MODELS } from "../constants/valid_models";
console.log("LeetAI content script loaded and running!");

interface SendMessage {
  type: "SEND_MESSAGE";
  message: string;
  problemDescription: string;
  modelName: string;
}

// --------------------
// Styles Injection
// --------------------
function injectStyles(): void {
  if (document.getElementById("leetai-styles")) return;

  const style = document.createElement("style");
  style.id = "leetai-styles";
  style.textContent = `
    /* Container for both button and chat */
    #leetai-container { 
      position: fixed; 
      z-index: 10000; 
      bottom: 20px;
      right: 20px;
    }
    
    /* Floating button styling */
    #leetai-button {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #2563eb;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transition: background-color 0.3s ease;
    }
    #leetai-button:hover {
      background-color: #1d4ed8;
    }
    
    /* Chat container styling with transitions */
    #leetai-chat {
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 350px;
      height: 500px;
      background-color: #1f2937;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      z-index: 10001;
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    /* When visible, enable interactions and show chat */
    #leetai-chat.visible {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    
    /* Chat header and close button */
    #leetai-chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background-color: #111827;
      color: white;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    #leetai-chat-close {
      cursor: pointer;
      font-weight: bold;
      transition: color 0.3s ease;
    }
    #leetai-chat-close:hover {
      color: #f87171;
    }
    
    /* Chat messages container */
    #leetai-chat-messages {
      flex-grow: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    /* Chat input container */
    #leetai-chat-input-container {
      padding: 12px;
      display: flex;
      gap: 8px;
    }
    #leetai-chat-input {
      flex-grow: 1;
      padding: 8px 12px;
      border-radius: 20px;
      background-color: #374151;
      color: white;
      border: none;
    }
    #leetai-chat-input:focus {
      outline: none;
      box-shadow: 0 0 0 2px #3b82f6;
    }
    #leetai-chat-send {
      background-color: #3b82f6;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: none;
      color: white;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }
    #leetai-chat-send:hover {
      background-color: #2563eb;
    }
    
    /* Message styling */
    .leetai-message { 
      padding: 8px 12px; 
      border-radius: 8px; 
      margin-bottom: 8px; 
      max-width: 80%; 
    }
    .leetai-message.user { 
      background-color: #3b82f6; 
      color: white; 
      align-self: flex-end; 
    }
    .leetai-message.ai { 
      background-color: #374151; 
      color: white; 
      align-self: flex-start; 
    }
  `;
  document.head.appendChild(style);
}

// --------------------
// UI Creation
// --------------------
function createChatUI(): void {
  if (document.getElementById("leetai-container")) return;

  // Create container for UI elements
  const container = document.createElement("div");
  container.id = "leetai-container";
  document.body.appendChild(container);

  // Floating button (always visible)
  const button = document.createElement("div");
  button.id = "leetai-button";
  button.innerHTML = `<img width="50" height="50" src="https://img.icons8.com/sf-black-filled/64/bot.png" alt="bot"/>`;
  container.appendChild(button);

  // Chat interface (initially hidden via CSS opacity and transform)
  const chat = document.createElement("div");
  chat.id = "leetai-chat";
  // Note: We do NOT remove the chat from the DOM; we just control its visibility via the 'visible' class.
  chat.innerHTML = `
    <div id="leetai-chat-header">
      <div>LeetAI</div>
      <select id="leetai-model-select"></select>
      <div id="leetai-chat-close">✕</div>
    </div>
    <div id="leetai-chat-messages"></div>
    <div id="leetai-chat-input-container">
      <input id="leetai-chat-input" type="text" placeholder="Enter your Question?">
      <button id="leetai-chat-send">➤</button>
    </div>
  `;
  container.appendChild(chat);
  // populateModelSelect();
  setupEventListeners();
}
// function populateModelSelect(): void {
//   console.log("populateModelSelect called, VALID_MODELS:", VALID_MODELS);
//   const selectElement = document.getElementById("leetai-model-select") as HTMLSelectElement | null;
//   if (!selectElement) {
//     console.error("Model select element not found");
//     return;
//   }

//   // Clear any existing options
//   selectElement.innerHTML = "";

//   // Append an option for each valid model
//   VALID_MODELS.forEach(model => {
//     const option = document.createElement("option");
//     option.value = model.name; // e.g. 'openai_4o' or 'gemini_flash'
//     option.text = model.display;
//     selectElement.appendChild(option);
//   });
// }
// --------------------
// Event Listeners Setup
// --------------------
function setupEventListeners(): void {
  document.getElementById("leetai-button")?.addEventListener("click", toggleChat);
  document.getElementById("leetai-chat-close")?.addEventListener("click", toggleChat);
  document.getElementById("leetai-chat-send")?.addEventListener("click", sendMessage);
  document.getElementById("leetai-chat-input")?.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  });
}

// Toggle chat visibility with transition
function toggleChat(): void {
  const chat = document.getElementById("leetai-chat");
  if (chat) {
    // Toggle the 'visible' class to animate appearance/disappearance
    chat.classList.toggle("visible");
    if (chat.classList.contains("visible")) {
      (document.getElementById("leetai-chat-input") as HTMLInputElement)?.focus();
    }
  }
}

// Add message to the chat window
function addMessage(type: "user" | "ai", content: string): void {
  const messagesContainer = document.getElementById("leetai-chat-messages");
  if (!messagesContainer) return;

  const messageElement = document.createElement("div");
  messageElement.className = `leetai-message ${type}`;
  messageElement.innerHTML = content;
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// --------------------
// Problem Description Extraction
// --------------------
async function getProblemDescription(): Promise<string> {
  try {
    const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    return metaDescription?.content.trim() || "No description available";
  } catch (error) {
    console.error("Error getting problem description:", error);
    return "Failed to extract problem description";
  }
}

// --------------------
// Message Sending & Response Handling
// --------------------
async function sendMessage(): Promise<void> {
  const input = document.getElementById("leetai-chat-input") as HTMLInputElement;
  if (!input || !input.value.trim()) return;

  const userMessage = input.value.trim();
  input.value = "";
  addMessage("user", userMessage);

  try {
    const loadingElement = showLoading();
    const problemDescription = await getProblemDescription();
    // Default model is gemini-2.0-flash if none selected
    const modelSelect = document.getElementById("leetai-model-select") as HTMLSelectElement;
    const modelName = modelSelect?.value || "gemini_flash";

    const payload: SendMessage = {
      type: "SEND_MESSAGE",
      message: userMessage,
      problemDescription,
      modelName,
    };

    chrome.runtime.sendMessage(payload, (response: string | undefined) => {
      removeLoading(loadingElement);
      addMessage("ai", response || "Error: API Endpoint Irresponsive");
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error sending message:", error.message);
    } else {
      console.error("Error sending message:", error);
    }
    addMessage("ai", "Sorry, there was an error processing your request.");
  }
}

// --------------------
// Injection & SPA Navigation Handling
// --------------------
function injectLeetAI(): void {
  // Only inject if on a LeetCode problem page
  if (!window.location.href.includes("leetcode.com/problems/")) return;
  // Prevent duplicate injection if container already exists
  if (document.getElementById("leetai-container")) return;

  injectStyles();
  createChatUI();
  console.log("LeetAI injected successfully.");
}

// Observe URL changes for SPA navigation
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    const existing = document.getElementById("leetai-container");
    if (existing) existing.remove();
    if (location.href.includes("leetcode.com/problems/")) {
      setTimeout(injectLeetAI, 1000); // Delay to allow new page content to load
    }
  }
}).observe(document.body, { subtree: true, childList: true });

// Initialize injection on page load
window.addEventListener("load", () => setTimeout(injectLeetAI, 500));
injectLeetAI();
