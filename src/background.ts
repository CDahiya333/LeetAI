import { handleMessage } from "./messageHandler";

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

// // Function to inject content script dynamically
// const injectContentScript = (tabId: number) => {
//   console.log(`Injecting content script into tab ${tabId}...`);

//   chrome.scripting.executeScript({
//     target: { tabId },
//     files: [chrome.runtime.getURL("content/content.js")], // Use runtime.getURL for safety
//   }).catch(err => console.error("Failed to inject content script:", err));
// };

// // Detect when a LeetCode problem page loads (Direct Page Load)
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === "complete" && tab.url?.startsWith("https://leetcode.com/problems/")) {
//     console.log("LeetCode problem page detected. Injecting content script.");
//     injectContentScript(tabId);
//   }
// });

// // Detect when LeetCode uses SPA navigation (history.pushState changes)
// chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
//   if (details.url.startsWith("https://leetcode.com/problems/")) {
//     console.log("SPA navigation detected on LeetCode. Injecting content script.");
//     injectContentScript(details.tabId);
//   }
// }, { url: [{ hostContains: "leetcode.com" }] });
