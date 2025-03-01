import { trackPageNavigation } from "../utils/navigation";
import { injectStyles } from "./styles";
import { createChatUI, toggleChat } from "./ui";
import { addMessage } from "./messages";
import { showLoading, removeLoading } from "./loading";
import { getProblemDescription } from "./problem";

trackPageNavigation();
window.addEventListener("leetai-url-changed", () => {
  console.log("LeetCode problem changed!");
});

async function injectLeetAI() {
  if (!location.href.includes("leetcode.com/problems/")) return;
  if (document.getElementById("leetai-container")) return; // Prevent duplicate injections

  injectStyles();
  createChatUI();
  const loadingElement = showLoading();

  try {
    const problem = await getProblemDescription();
    console.log(`Problem Description: ${problem}`);
  } catch (error) {
    addMessage("ai", "Can you tell me what problem are you facing are where do you feel stuck?");
    console.error("Error fetching problem description:", error);
  }finally{
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
      setTimeout(injectLeetAI, 500);
    }
  }
}).observe(document, { subtree: true, childList: true });

window.addEventListener("load", injectLeetAI);
injectLeetAI();
