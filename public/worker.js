export {}; // Ensures this is a module

// Listen for messages from the popup or content script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "SET_API_KEY") {
    cachedApiKey = message.apiKey;
    chrome.storage.sync.set({ apiKey: cachedApiKey });
    sendResponse({ status: "API key saved!" });
    return true;
  }

  if (message.type === "SEND_MESSAGE") {
    if (!cachedApiKey) {
      sendResponse({ type: "ERROR", error: "API key not found. Please set it in the extension popup." });
      return true;
    }

    try {
      const problemDescription = message.problemDescription;
      const userMessage = message.message;

      // Prepare the prompt
      const prompt = `
        I'm working on a LeetCode problem:
        
        Description: ${problemDescription}
        
        My question: ${userMessage}
      `;

      // Call OpenAI API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cachedApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are LeetAI, an assistant for solving LeetCode problems."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();

      if (data.error) {
        sendResponse({ type: "ERROR", error: data.error.message });
        return true;
      }

      // Send response back
      sendResponse({ type: "RESPONSE", response: data.choices[0].message.content });
    } catch (error) {
      sendResponse({ type: "ERROR", error: error.message });
    }

    return true; // Required for async sendResponse
  }
});
