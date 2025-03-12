import { GoogleGenerativeAI } from "@google/generative-ai";
import { VALID_MODELS, ValidModel } from "./constants/valid_models";
import { HELPER_PROMPT } from "./constants/prompt";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js"; // For code syntax highlighting

function formatMarkdown(text: string): string {
  // Create markdown-it instance with configuration
  const md = new MarkdownIt({
    html: true,        // Enable HTML tags in source
    linkify: true,     // Autoconvert URL-like text to links
    typographer: true, // Enable smartquotes and other typographic replacements
    highlight: function(str, lang) {
      // Syntax highlighting for code blocks
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch {
          console.error("Error while highlighting code block:", str);}
      }
      // Use generic highlighting if language not specified or not found
      return hljs.highlightAuto(str).value;
    }
  });
    
  // Custom renderer for links to make them open in new tab
  const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.link_open = function(tokens, idx, options, _env, self) {
    // Add target="_blank" and rel="noopener noreferrer" to all links
    tokens[idx].attrPush(['target', '_blank']);
    tokens[idx].attrPush(['rel', 'noopener noreferrer']);
    
    return defaultRender(tokens, idx, options, _env, self);
  };

  // Render the markdown
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
  console.log("Processing message:", message.type, "Model:", message.modelName);
  
  // Type guard to check if message.modelName is a ValidModel
  const validModel = VALID_MODELS.find((model) => model.name === message.modelName);
  
  if (validModel) {
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
    sendResponse(`Error: Invalid model name '${message.modelName}'. Available models: ${VALID_MODELS.map(m => m.name).join(', ')}`);
  }
}

// Fetch API key from Chrome storage
async function getApiKeyFromStorage(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["apiKey"], (result) => {
      if (chrome.runtime.lastError) {
        reject(
          new Error(
            "Failed to get API key from storage: " +
              chrome.runtime.lastError.message
          )
        );
        return;
      }

      if (!result.apiKey) {
        reject(
          new Error(
            "API key not found in storage. Please add your API key in the extension popup."
          )
        );
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
    return await fetchOpenAiResponse(prompt);
  } else if (selectedModel.model === "claude-3.7-sonnet") {
    return await fetchClaudeResponse(prompt);
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

async function fetchOpenAiResponse(curatedPrompt: string): Promise<string> {
  try {
    // Get API key from storage instead of environment variables
    const apiKey = await getApiKeyFromStorage();

    console.log("Initializing OpenAI with API key");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an AI assistant." },
          { role: "user", content: curatedPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content.trim() || "";
    const formattedResponse = formatMarkdown(text);

    console.log("Received response from OpenAI");
    return formattedResponse;
  } catch (error: unknown) {
    console.error("OpenAI API error:", error);

    if (error instanceof Error) {
      throw new Error(`OpenAI API Error: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred with the OpenAI API.");
    }
  }
}

async function fetchClaudeResponse(curatedPrompt: string): Promise<string> {
  try {
    // Get API key from storage instead of environment variables
    const apiKey = await getApiKeyFromStorage();

    console.log("Initializing Claude with API key");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3.7-sonnet",
        messages: [{ role: "user", content: curatedPrompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API Error: ${response.statusText}`);
    }

    const data = await response.json();
    // Fixed extraction of text from Claude API response
    const text = data.content[0]?.text || "";
    const formattedResponse = formatMarkdown(text);

    console.log("Received response from Claude");
    return formattedResponse;
  } catch (error: unknown) {
    console.error("Claude API error:", error);

    if (error instanceof Error) {
      throw new Error(`Claude API Error: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred with the Claude API.");
    }
  }
}
