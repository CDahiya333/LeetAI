import { removeLoading, showLoading } from "./loading";
// import { VALID_MODELS } from "../constants/valid_models";
console.log("LeetAI content script loaded and running!");

const models = [
  {
    model: "gemini-2.0-flash",
    name: "gemini_flash",
    display: "Gemini 2.0 Flash",
  },
  {
    model: "gpt-4o",
    name: "openai_4o",
    display: "GPT-4o",
  },
  {
    model: 'claude-3.7-sonnet', 
    name: 'claude_3.7_sonnet',
    display: 'Claude 3.7'
  },
];
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
    /* Modern Black & White LeetAi Extension Styling */

/* Container for button & chat */
#leetai-container {
  position: fixed;
  z-index: 10000;
  bottom: 20px;
  right: 20px;
}

/* Floating button with glow effect */
#leetai-button {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: linear-gradient(145deg, #222, #111);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}
#leetai-button:hover {
  background: linear-gradient(145deg, #111, #222);
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

/* Chat window with glassmorphism */
#leetai-chat {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 580px;
  height: 540px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 10001;
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
  transition: opacity 0.4s ease, transform 0.4s ease;
}

/* Chat visible state */
#leetai-chat.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

/* Chat header with close button */
#leetai-chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
  /* Model Select Styling */
  #leetai-model-select {
  background: linear-gradient(145deg, #222, #111);
  color: #fff;
  border: 1px solid #444;
  border-radius: 12px;

  /* Spacing & sizing */
  padding: 6px 28px 6px 10px; 
  font-size: 0.9em;
  cursor: pointer;

  /* Smooth transitions */
  transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
  outline: none; /* remove default outline */
}
  /* Hover & focus effects */
#leetai-model-select:hover {
  background: linear-gradient(145deg, #111, #222);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  transform: scale(1.02);
}
#leetai-model-select:focus {
  box-shadow: 0 0 5px rgba(248, 113, 113, 0.4);
}
#leetai-chat-close {
  cursor: pointer;
  font-size: 20px;
  transition: color 0.3s ease;
}
#leetai-chat-close:hover {
  color: #f87171;
}

/* Chat messages container */
#leetai-chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scrollbar-width: thin;
}

/* Chat input section */
#leetai-chat-input-container {
  padding: 14px;
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
#leetai-chat-input {
  flex-grow: 1;
  padding: 10px 14px;
  border-radius: 24px;
  background-color: #222;
  color: white;
  border: none;
  transition: all 0.3s ease;
}
#leetai-chat-input:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
}

/* Send button with hover & click effects */
#leetai-chat-send {
  background: white;
  color: black;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  font-weight: bold;
  transition: all 0.3s ease;
}
#leetai-chat-send:hover {
  background: #e0e0e0;
}
#leetai-chat-send:active {
  transform: scale(0.9);
}

/* Message bubbles */
.leetai-message {
  padding: 10px 14px;
  border-radius: 10px;
  max-width: 80%;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* User messages */
.leetai-message.user {
  background: #ffffff;
  color: black;
  align-self: flex-end;
  animation: fadeInRight 0.3s ease;
}

/* AI messages */
.leetai-message.ai {
  background: #333;
  color: white;
  align-self: flex-start;
  animation: fadeInLeft 0.3s ease;
}

/* Animations */
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
 /* Markdown paragraph styling */
.markdown-paragraph {
  margin: 1em 0;
  line-height: 1.6;
  color: #ccc; 
}

/* Code block wrapper */
.code-block-wrapper {
  position: relative;
  margin: 0.8em 0;      
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #444;  
  background-color: #222;   
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); 
}

/* Code header (language label and copy button) */
.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333; 
  padding: 2px 2px;      
  border-bottom: 1px solid #444;
}

/* Code language label */
.code-language {
  font-family: monospace;
  font-size: 12px;
  color: #aaa;   
  font-weight: bold;
  margin: 0;     
}

/* Copy button styling */
.copy-button {
  background: linear-gradient(145deg, #222, #111);
  border: 1px solid #444;
  padding: 6px 6px 6px 6px; 
  border-radius: 12px;     
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #fff;
}
.copy-button:hover {
  background: linear-gradient(145deg, #111, #222);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  transform: scale(1.02);
}

/* Highlight.js code styling */
.hljs {
  margin: 0;
  padding: 12px;          
  overflow-x: auto;
  font-family: 'Consolas', 'Monaco', 'Andale Mono', monospace;
  font-size: 14px;
  line-height: 1.45;      
  tab-size: 4;
  background-color: #222; 
  color: #ccc;            
  box-sizing: border-box; 
}

/* Ensure pre blocks don't wrap code unexpectedly */
pre.hljs {
  white-space: pre;
  word-wrap: normal;
  max-width: 100%;
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
  button.innerHTML = `<svg width="50" height="50" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- Black Circle Background -->
  <circle cx="32" cy="32" r="30" fill="black"/>
  <!-- White Magnifying Glass Icon -->
  <path fill="white" d="M27.765 42.244c-8.614 0-15.622-7.008-15.622-15.622S19.151 11 27.765 11s15.622 7.008 15.622 15.622-7.007 15.622-15.622 15.622zm0-28.398c-7.045 0-12.775 5.73-12.775 12.775s5.73 12.775 12.775 12.775 12.775-5.73 12.775-12.775-5.73-12.775-12.775-12.775z"></path>
  <path fill="white" d="M34.869 39.146l4.014-3.738 9.286 9.114a3.164 3.164 0 01-.07 4.562l-.071.066a3.163 3.163 0 01-4.561-.257l-8.598-9.747zM27.77 34.173c-2.882 0-5.412-.876-7.656-2.526a1.002 1.002 0 01-.35-.81c.008-.461.445-.969 1.02-.959.284.005.493.153.713.308 1.837 1.302 3.832 1.971 6.275 1.971 1.875 0 4.492-.476 6.314-2.118a.98.98 0 01.638-.261.92.92 0 01.686.241c.222.209.33.527.336.735a1.02 1.02 0 01-.318.775c-1.333 1.237-4.262 2.644-7.658 2.644z"></path>
</svg>
`;
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
  populateModelSelect();
  setupEventListeners();
}

function populateModelSelect(): void {
  console.log("populateModelSelect called, VALID_MODELS:", models);
  const selectElement = document.getElementById(
    "leetai-model-select"
  ) as HTMLSelectElement | null;
  if (!selectElement) {
    console.error("Model select element not found");
    return;
  }

  // Clear any existing options
  selectElement.innerHTML = "";

  // Append an option for each valid model
  models.forEach((model) => {
    const option = document.createElement("option");
    option.value = model.name; // e.g. 'openai_4o' or 'gemini_flash'
    option.text = model.display;
    selectElement.appendChild(option);
  });

  // Set default selected model (first one in the list)
  if (models.length > 0) {
    // Store the selected model in local storage for persistence
    chrome.storage.local.set({ selectedModel: models[0].name });
  }
}
// --------------------
// Event Listeners Setup
// --------------------
function setupEventListeners(): void {
  document
    .getElementById("leetai-button")
    ?.addEventListener("click", toggleChat);
  document
    .getElementById("leetai-chat-close")
    ?.addEventListener("click", toggleChat);
  document
    .getElementById("leetai-chat-send")
    ?.addEventListener("click", sendMessage);
  document
    .getElementById("leetai-chat-input")
    ?.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") sendMessage();
    });
  const modelSelect = document.getElementById(
    "leetai-model-select"
  ) as HTMLSelectElement;
  if (modelSelect) {
    modelSelect.addEventListener("change", function () {
      const selectedModel = modelSelect.value;
      console.log("Model changed to:", selectedModel);
      // Save the selected model to storage
      chrome.storage.local.set({ selectedModel: selectedModel });
    });
  }

  document.addEventListener('click', function(event) {
    if (!event.target) return;
    const target = event.target as HTMLElement;
    
    if (target.classList?.contains('copy-button')) {
      const code = target.getAttribute('data-code');
  
      if (!code) return;
      
      navigator.clipboard.writeText(decodeURIComponent(code)).then(function() {
        const originalText = target.textContent;
        target.textContent = 'Copied!';
        
        setTimeout(function() {
          if (originalText) {
            target.textContent = originalText;
          }
        }, 2000);
      }).catch(function(err) {
        console.error('Could not copy text: ', err);
      });
    }
  });
}

// Toggle chat visibility with transition
function toggleChat(): void {
  const chat = document.getElementById("leetai-chat");
  if (chat) {
    // Toggle the 'visible' class to animate appearance/disappearance
    chat.classList.toggle("visible");
    if (chat.classList.contains("visible")) {
      (
        document.getElementById("leetai-chat-input") as HTMLInputElement
      )?.focus();
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
    const metaDescription = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement;
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
  const input = document.getElementById(
    "leetai-chat-input"
  ) as HTMLInputElement;
  if (!input || !input.value.trim()) return;

  const userMessage = input.value.trim();
  input.value = "";
  addMessage("user", userMessage);

  try {
    const loadingElement = showLoading();
    const problemDescription = await getProblemDescription();
    
    // Fetching Model from Chrome Local Storage
    const modelName = await new Promise<string>((resolve) => {
      chrome.storage.local.get(["selectedModel"], (data) => {
        resolve(data.selectedModel || models[0].name);
      });
    });

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
