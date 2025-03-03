export function injectStyles() {
  // Check if styles already injected
  if (document.getElementById("leetai-styles")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "leetai-styles";
  style.textContent = `
    #leetai-container { position: fixed; z-index: 10000; }
    #leetai-button { position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px; border-radius: 50%; background-color: #2563eb; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); }
    #leetai-button:hover { background-color: #1d4ed8; }
    #leetai-chat { position: fixed; bottom: 80px; right: 20px; width: 350px; height: 500px; background-color: #1f2937; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); display: flex; flex-direction: column; z-index: 10001; }
    #leetai-chat.hidden { display: none; }
    #leetai-chat-header { padding: 12px 16px; background-color: #111827; color: white; display: flex; justify-content: space-between; align-items: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
    #leetai-chat-close { cursor: pointer; font-weight: bold; }
    #leetai-chat-close:hover { color: #f87171; }
    #leetai-chat-messages { flex-grow: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
    #leetai-model-select {
      background-color: #374151;
      color: white;
      border: none;
      border-radius: 20px;
      padding: 6px 12px;
      font-size: 14px;
      cursor: pointer;
      margin-right: 8px; 
    }
    #leetai-model-select:focus {
      outline: none;
      box-shadow: 0 0 0 2px #3b82f6; 
    }
    #leetai-chat-input-container { padding: 12px; display: flex; gap: 8px; }
    #leetai-chat-input { flex-grow: 1; padding: 8px 12px; border-radius: 20px; background-color: #374151; color: white; border: none; }
    #leetai-chat-input:focus { outline: none; box-shadow: 0 0 0 2px #3b82f6; }
    #leetai-chat-send { background-color: #3b82f6; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; color: white; font-weight: bold; }
    #leetai-chat-send:hover { background-color: #2563eb; }
    .leetai-message { padding: 8px 12px; border-radius: 8px; margin-bottom: 8px; max-width: 80%; }
    .leetai-message.user { background-color: #3b82f6; color: white; align-self: flex-end; }
    .leetai-message.ai { background-color: #374151; color: white; align-self: flex-start; }
    .leetai-loading { font-style: italic; opacity: 0.7; }
  `;
  document.head.appendChild(style);
}