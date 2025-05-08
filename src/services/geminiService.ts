
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

// Function to generate a cover letter with the specified format
export const generateCoverLetter = async (
  cvContent: string, 
  companyName: string, 
  positionTitle: string, 
  jobRequirements: string, 
  jobDescription: string
): Promise<string> => {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const prompt = `
Generate a professional cover letter using ONLY verifiable content from my CV:
${cvContent}

For ${positionTitle} at ${companyName}
Job requirements: ${jobRequirements}
Job description: ${jobDescription}

FORMAT REQUIREMENTS:
1. Start with this contact block:
Abbey Aina
olamilekansunday445@gmail.com
${today}
Hiring Manager
${companyName}

2. Begin with a warm, clear statement of interest, referencing the position and company.

3. In 1-2 short paragraphs, highlight relevant skills/experiences from my CV that match the job requirements.

4. Include a bullet list of 2-3 contributions or strengths based on my CV and the job role.

5. Close with:
- Reaffirmation of interest
- Mention of values or mission fit
- Thank the reader

6. End with "Best regards," followed by "Abbey Aina"

STRICT RULES:
- Use only verifiable content from my CV
- DO NOT include placeholders or imaginary projects
- DO NOT duplicate links already found in the CV
- DO NOT include the job ad text itself
- Keep tone enthusiastic but professional
- Limit paragraphs to 3 lines maximum
`;

  return await generateContent(prompt);
};

// Function to enhance CV based on job requirements with specific formatting
export const enhanceCv = async (
  cvContent: string, 
  jobRequirements: string, 
  jobDescription: string
): Promise<string> => {
  const prompt = `
Enhance this CV for a tech/design role:
${cvContent}

Based on these job requirements:
${jobRequirements}

And this job description:
${jobDescription}

INSTRUCTIONS:
- Keep the structure appropriate for tech/design roles
- Emphasize relevant achievements and skills that match the job requirements
- DO NOT change or reformat any existing links — preserve them exactly as they appear
- Tailor tone and content to the position
- Keep the structure and links from the original CV
- Improve clarity, grammar, and flow professionally
- DO NOT add introductory text like "Here's your CV"
- DO NOT duplicate links already in the CV
- Return ONLY the enhanced CV content
`;

  return await generateContent(prompt);
};
