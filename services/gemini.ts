import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateIconImage = async (prompt: string, variation: string): Promise<string> => {
  try {
    // We append specific instruction for macOS icon style and the variation to ensure diversity
    const finalPrompt = `
      Design a high-quality macOS application icon. 
      Style: ${variation}.
      Subject: ${prompt}.
      Requirements: Rounded square (squircle) shape, high resolution, professional UI design, highly detailed, 3D rendering, suitable for a dark dock background.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: finalPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1",
        }
      }
    });

    // Extract image from response
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating icon:", error);
    throw error;
  }
};