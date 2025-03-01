export function trackPageNavigation() {
    let lastUrl = location.href;
  
    new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        window.dispatchEvent(new Event("leetai-url-changed"));
      }
    }).observe(document, { subtree: true, childList: true });
  }
  