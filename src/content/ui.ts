import { addMessage } from "./messages";
import { showLoading, removeLoading } from "./loading";
import { getProblemDescription } from "./problem";
import { VALID_MODELS } from "../constants/valid_models";

type Model = {
  name: string;
  display: string;
};

export function createChatUI(): void {
  let container = document.getElementById("leetai-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "leetai-container";
    document.body.appendChild(container);
  }

  if (document.getElementById("leetai-chat")) {
    console.log("Chat UI already exists, skipping creation");
    return;
  }

  console.log("Creating chat UI");

  // Floating button
  const button = document.createElement("div");
  button.id = "leetai-button";
  button.innerHTML = `<img width="50" height="50" src="https://img.icons8.com/sf-black-filled/64/bot.png" alt="bot"/>`;
  container.appendChild(button);

  // Chat box
  const chat = document.createElement("div");
  chat.id = "leetai-chat";
  chat.className = "hidden";
  chat.innerHTML = `
    <div id="leetai-chat-header">
      <div>LeetAI </div>
      <select id="leetai-model-select"></select>
      <div id="leetai-chat-close">✕</div>
    </div>
    <div id="leetai-chat-messages"></div>
    <div id="leetai-chat-input-container">
      <input id="leetai-chat-input" type="text" placeholder="Ask about this problem...">
      <button id="leetai-chat-send">➤</button>
    </div>
  `;
  container.appendChild(chat);

  populateModelDropdown();
  setupEventListeners();
}

function populateModelDropdown(): void {
  const selectElement = document.getElementById("leetai-model-select") as HTMLSelectElement | null;
  if (!selectElement) {
    console.error("Model select element not found");
    return;
  }

  selectElement.innerHTML = "";

  VALID_MODELS.forEach((model: Model) => {
    const optionElement = document.createElement("option");
    optionElement.value = model.name;
    optionElement.text = model.display;
    selectElement.add(optionElement);
  });
}

function setupEventListeners(): void {
  const button = document.getElementById("leetai-button");
  const closeButton = document.getElementById("leetai-chat-close");
  const sendButton = document.getElementById("leetai-chat-send");
  const inputField = document.getElementById("leetai-chat-input") as HTMLInputElement | null;

  button?.addEventListener("click", toggleChat);
  closeButton?.addEventListener("click", toggleChat);
  sendButton?.addEventListener("click", sendMessage);

  inputField?.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
}

export function toggleChat(): void {
  const chat = document.getElementById("leetai-chat");
  if (chat) {
    chat.classList.toggle("hidden");
    if (!chat.classList.contains("hidden")) {
      const inputField = document.getElementById("leetai-chat-input") as HTMLInputElement | null;
      inputField?.focus();
    }
  }
}

async function sendMessage(): Promise<void> {
  const input = document.getElementById("leetai-chat-input") as HTMLInputElement | null;
  if (!input) return;

  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";
  const loadingElement = showLoading();

  try {
    const problemDescription = await getProblemDescription();
    const modelSelect = document.getElementById("leetai-model-select") as HTMLSelectElement | null;
    const modelName = modelSelect ? modelSelect.value : VALID_MODELS[0].name;

    chrome.runtime.sendMessage(
      { type: "SEND_MESSAGE", message, problemDescription, modelName },
      (response: string | undefined) => {
        removeLoading(loadingElement);
        addMessage("ai", response || "Error: API Endpoint Irresponsive");
      }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    removeLoading(loadingElement);
    addMessage("ai", "Sorry, there was an error processing your request. Please try again.");
  }
}
