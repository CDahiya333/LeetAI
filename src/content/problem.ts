export function getProblemDescription(): string {
  const descriptionElement = document.querySelector(
    'meta[name="description"]'
  ) as HTMLMetaElement;
  return descriptionElement ? descriptionElement.content.trim() : "No description available";
}
