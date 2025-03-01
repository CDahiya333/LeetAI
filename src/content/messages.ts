export function addMessage(type: "user" | "ai", content: string) {
  const messagesContainer = document.getElementById("leetai-chat-messages");
  if (!messagesContainer) return;

  const messageElement = document.createElement("div");
  messageElement.className = `leetai-message ${type}`;
  messageElement.innerHTML = content;
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
