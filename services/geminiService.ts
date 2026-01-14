
import { GoogleGenAI } from "@google/genai";
import { GardenPreferences } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

/**
 * Generates an initial garden layout image based on preferences.
 */
export const generateGardenImage = async (prefs: GardenPreferences): Promise<string> => {
  const ai = getAIClient();
  const featuresString = prefs.features.length > 0 ? ` featuring ${prefs.features.join(', ')}` : '';
  const prompt = `A professional architectural 3D render of a ${prefs.style} garden. 
    Size: ${prefs.size}. Lighting: ${prefs.sunlight}. 
    Details: ${prefs.customDescription}${featuresString}. 
    High-end landscape design, photorealistic, 4k resolution, beautiful composition.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image data received from the AI.");
};

/**
 * Edits an existing image based on a text prompt using Gemini 2.5 Flash Image (Nano Banana).
 */
export const editGardenImage = async (base64Image: string, editPrompt: string): Promise<string> => {
  const ai = getAIClient();
  
  // Strip the "data:image/png;base64," prefix if it exists
  const base64Data = base64Image.split(',')[1] || base64Image;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/png'
          }
        },
        {
          text: `Modify this garden design according to this request: ${editPrompt}. 
                 Maintain the overall layout but apply the changes seamlessly. 
                 Photorealistic, professional landscape photography style.`
        }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Failed to edit the image.");
};
