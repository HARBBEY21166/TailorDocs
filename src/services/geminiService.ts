
import { getApiKey } from "../utils/localStorageUtils";

// Types for API responses and requests
export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

interface GeminiRequestContent {
  role: string;
  parts: { text: string }[];
}

// Gemini API endpoint
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Function to generate content using Gemini API
export const generateContent = async (prompt: string): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("API key is required");
  }

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate content");
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No content generated");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};

// Function to generate a cover letter
export const generateCoverLetter = async (
  cvContent: string, 
  companyName: string, 
  positionTitle: string, 
  jobRequirements: string, 
  jobDescription: string
): Promise<string> => {
  const prompt = `
Generate a cover letter using:
- My qualifications: ${cvContent}
- For ${positionTitle} at ${companyName}
- Job requirements: ${jobRequirements}
- Job description: ${jobDescription}

Output should be professional and tailored to this specific role. 
Format it with a proper salutation, body paragraphs, and closing.
Include a title: "Cover letter for ${companyName}: ${positionTitle}"
  `;

  return await generateContent(prompt);
};

// Function to enhance CV based on job requirements
export const enhanceCv = async (
  cvContent: string, 
  jobRequirements: string, 
  jobDescription: string
): Promise<string> => {
  const prompt = `
Generate an updated CV using:
- My current CV: ${cvContent}
- Job requirements: ${jobRequirements}
- Job description: ${jobDescription}

Output should be professional and tailored to this specific role.
Reorder and highlight skills to match the job requirements.
Keep the same basic structure but emphasize relevant experience and skills.
DO NOT invent new experience or qualifications that aren't in the original CV.
  `;

  return await generateContent(prompt);
};
