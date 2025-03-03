export async function getProblemDescription(): Promise<string> {
  // Try different selectors to find the problem description
  try {
    // First try meta description
    const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (metaDescription && metaDescription.content.trim()) {
      return metaDescription.content.trim();
    }
    
    // If all else fails, wait a bit and retry once
    return new Promise((resolve) => {
      setTimeout(() => {
        const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
        resolve(metaDesc ? metaDesc.content.trim() : "No description available");
      }, 2000);
    });
  } catch (error) {
    console.error("Error getting problem description:", error);
    return "Failed to extract problem description";
  }
}