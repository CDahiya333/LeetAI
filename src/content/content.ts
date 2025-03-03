// console.log("Content SCript loaded successfully");

import { trackPageNavigation } from "../utils/navigation";
import { injectStyles } from "./styles";
import { createChatUI } from "./ui";
import { addMessage } from "./messages";
import { showLoading, removeLoading } from "./loading";
import { getProblemDescription } from "./problem";
console.log("leetAI content script loaded and running!")
// Initialize page tracking
trackPageNavigation();

window.addEventListener("leetai-url-changed", () => {
  console.log("LeetCode problem changed!");
  setTimeout(injectLeetAI, 1000); // Delay injection to ensure problem page loads
});

async function injectLeetAI() {
  if (!location.href.includes("leetcode.com/problems/")) return;

  // Prevent duplicate injections
  if (document.getElementById("leetai-container")) {
    console.log("LeetAI already injected.");
    return;
  }

  console.log("Injecting LeetAI...");

  injectStyles();
  createChatUI();
  const loadingElement = showLoading();

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Ensure DOM is ready
    const problem = await getProblemDescription();
    console.log(`Problem Description: ${problem}`);
  } catch (error) {
    addMessage("ai", "Can you tell me what problem are you facing and where do you feel stuck?");
    console.error("Error fetching problem description:", error);
  } finally {
    removeLoading(loadingElement);
  }

  // Greeting message
  addMessage("ai", "Hi there! I'm LeetAI. How can I help you with this LeetCode problem?");
}

// SPA Navigation Handling
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        document.getElementById("leetai-container")?.remove();

        if (url.includes("leetcode.com/problems/")) {
            // Wait for a short delay, then inject
            setTimeout(injectLeetAI, 500);
        }
    }
}).observe(document.body, { subtree: true, childList: true });

// Ensure LeetAI is injected even after the initial load
window.addEventListener("load", () => setTimeout(injectLeetAI, 500));
injectLeetAI();