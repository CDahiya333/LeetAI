export function trackPageNavigation() {
  let lastUrl = location.href;

  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      console.log("Detected URL change, reinjecting LeetAI...");
      window.dispatchEvent(new Event("leetai-url-changed"));
    }
  }).observe(document.body, { subtree: true, childList: true });
}
