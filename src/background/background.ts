import { handleMessage } from "./messageHandler";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received from:", sender);
  handleMessage(message, sendResponse);
  return true; // Keeps the response channel open for async responses
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("LeetAI Extension Installed");
});
