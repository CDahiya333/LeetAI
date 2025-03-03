import { GoogleGenerativeAI } from "@google/generative-ai";
import { VALID_MODELS, ValidModel } from "./constants/valid_models";
import { HELPER_PROMPT } from "./constants/prompt";
import MarkdownIt from "markdown-it";

function formatMarkdown(text: string): string {
  const md = new MarkdownIt({ html: true, linkify: true });
  return md.render(text);
}


export function handleMessage(
  message: {
    type: string;
    message: string;
    problemDescription: string;
    modelName: string;
  },
  sendResponse: (response: string) => void
): void {
  console.log("Processing message:", message.type);
  
  // Type guard to check if message.modelName is a ValidModel
  if (VALID_MODELS.some((model) => model.name === message.modelName)) {
    fetchAIResponse(
      message.message,
      message.problemDescription,
      message.modelName as ValidModel
    )
      .then((aiResponse: string) => {
        console.log("AI response received");
        sendResponse(aiResponse);
      })
      .catch((error) => {
        console.error("AI response error:", error);
        sendResponse(`Error: ${error.message}`);
      });
  } else {
    console.error("Invalid model name:", message.modelName);
    sendResponse(`Error: Invalid model name '${message.modelName}'.`);
  }
}

// Fetch API key from Chrome storage
async function getApiKeyFromStorage(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["apiKey"], (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error("Failed to get API key from storage: " + chrome.runtime.lastError.message));
        return;
      }
      
      if (!result.apiKey) {
        reject(new Error("API key not found in storage. Please add your API key in the extension popup."));
        return;
      }
      
      resolve(result.apiKey);
    });
  });
}

// Fetch AI response
async function fetchAIResponse(
  userMessage: string,
  problemDescription: string,
  modelName: ValidModel
): Promise<string> {
  const selectedModel = VALID_MODELS.find((m) => m.name === modelName);
  if (!selectedModel) {
    console.log("Model Support Not Added");
    throw new Error(`Model '${modelName}' not found`);
  }
  
  // Constructing the Prompt
  const prompt = HELPER_PROMPT.replace(
    "{{problemDescription}}",
    problemDescription
  ).replace("{{userMessage}}", userMessage);

  if (selectedModel.model === "gemini-2.0-flash") {
    return await fetchGeminiResponse(prompt);
  } else if (selectedModel.model === "gpt-4o") {
    // OpenAI Logic will be added here later
    return `AI Response: Your question was "${userMessage}" regarding "${problemDescription}".`;
  } else {
    throw new Error(`Model '${modelName}' support not added yet.`);
  }
}

async function fetchGeminiResponse(curatedPrompt: string): Promise<string> {
  try {
    // Get API key from storage instead of environment variables
    const apiKey = await getApiKeyFromStorage();
    
    console.log("Initializing Gemini with API key");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    console.log("Sending prompt to Gemini");
    const result = await model.generateContent(curatedPrompt);
    const response = await result.response;
    const text = response.text();
    const formattedResponse = formatMarkdown(text);
    
    console.log("Received response from Gemini");
    return formattedResponse;
  } catch (error: unknown) {
    console.error("Gemini API error:", error);
    
    if (error instanceof Error) {
      // Now you can safely access error.message
      throw new Error(`Gemini API Error: ${error.message}`);
    } else {
      // Handle cases where the error is not an Error object
      throw new Error("An unknown error occurred with the Gemini API.");
    }
  }
}