import { handleMessage } from "./messageHandler";

chrome.runtime.onInstalled.addListener(() => {
  console.log("LeetAI Extension Installed");

  chrome.storage.local.get(["apiKey"], (result) => {
    if (!result.apiKey) {
      console.log("No API key found, please add one in the extension popup");
    } else {
      console.log("API key found in storage");
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background script:", message.type);

  if (message.type === "SEND_MESSAGE") {
    console.log("Processing SEND_MESSAGE from:", sender.tab?.url);
    handleMessage(message, sendResponse);
    return true; // Keeps the response channel open for async responses
  }

  console.log("Unhandled message type:", message.type);
  return false;
});

