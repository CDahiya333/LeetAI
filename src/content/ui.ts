import { addMessage } from "./messages";
import { showLoading, removeLoading } from "./loading";
import { getProblemDescription } from "./problem";
import { VALID_MODELS } from "../constants/valid_models";

export function createChatUI() {
  const container = document.createElement("div");
  container.id = "leetai-container";
  document.body.appendChild(container);

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
  function populateModelDropdown() {
    const selectElement = document.getElementById(
      "leetai-model-select"
    ) as HTMLSelectElement;

    for (const model of VALID_MODELS) {
      const optionElement = document.createElement("option");
      optionElement.value = model.name;
      optionElement.text = model.display;
      selectElement.add(optionElement);
    }
  }
  document.addEventListener("DOMContentLoaded", populateModelDropdown);
  button.addEventListener("click", toggleChat);
  document
    .getElementById("leetai-chat-close")
    ?.addEventListener("click", toggleChat);
  document
    .getElementById("leetai-chat-send")
    ?.addEventListener("click", sendMessage);
}

export function toggleChat() {
  const chat = document.getElementById("leetai-chat");
  if (chat) {
    chat.classList.toggle("hidden");
    if (!chat.classList.contains("hidden")) {
      (
        document.getElementById("leetai-chat-input") as HTMLInputElement
      )?.focus();
    }
  }
}

function sendMessage() {
  const input = document.getElementById(
    "leetai-chat-input"
  ) as HTMLInputElement;
  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";

  const loadingElement = showLoading();
  const problemDescription = getProblemDescription();
  const modelName = (
    document.getElementById("leetai-model-select") as HTMLSelectElement
  ).value;

  chrome.runtime.sendMessage(
    {
      type: "SEND_MESSAGE",
      message,
      problemDescription,
      modelName,
    },
    (response: string) => {
      removeLoading(loadingElement);
      addMessage("ai", response || "Error: API Endpoint Irresponsive");
    }
  );
}
