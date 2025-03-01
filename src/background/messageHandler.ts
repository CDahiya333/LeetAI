import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();
import { VALID_MODELS, ValidModel } from "../constants/valid_models";
import { HELPER_PROMPT } from "../constants/prompt";

export function handleMessage(
  message: {
    type: string;
    message: string;
    problemDescription: string;
    modelName: string;
  },
  sendResponse: (response: string) => void
): void {
  // Type guard to check if message.modelName is a ValidModel
  if (VALID_MODELS.some((model) => model.name === message.modelName)) {
    fetchAIResponse(
      message.message,
      message.problemDescription,
      message.modelName as ValidModel
    )
      .then((aiResponse: string) => sendResponse(aiResponse)) // Extract the string
      .catch((error) => sendResponse(`Error: ${error.message}`));
  } else {
    sendResponse(`Error: Invalid model name '${message.modelName}'.`);
  }
}

// Mock function (replace with actual API request)
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
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = curatedPrompt;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Now you can safely access error.message
      throw new Error(`Gemini API Error: ${error.message}`);
    } else {
      // Handle cases where the error is not an Error object
      throw new Error("An unknown error occurred.");
    }
  }
}
