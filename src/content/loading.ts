export function showLoading(): HTMLElement {
  const messagesContainer = document.getElementById("leetai-chat-messages");
  const loadingElement = document.createElement("div");
  loadingElement.className = "leetai-message ai leetai-loading";
  loadingElement.innerHTML = "⏳ Typing...";
  messagesContainer?.appendChild(loadingElement);
  return loadingElement;
}

export function removeLoading(loadingElement: HTMLElement) {
  loadingElement.remove();
}
