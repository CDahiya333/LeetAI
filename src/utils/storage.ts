export const saveChatMessage = async (message: string) => {
    return new Promise<void>((resolve) => {
      chrome.storage.local.get("chatHistory", (data) => {
        const history = data.chatHistory || [];
        history.push(message);
        chrome.storage.local.set({ chatHistory: history }, resolve);
      });
    });
  };
  
  export const fetchChatHistory = async (): Promise<string[]> => {
    return new Promise((resolve) => {
      chrome.storage.local.get("chatHistory", (data) => {
        resolve(data.chatHistory || []);
      });
    });
  };
  