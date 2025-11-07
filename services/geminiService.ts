import { GoogleGenAI, Type } from '@google/genai';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const systemInstruction = `
You are an expert translator specializing in English to Sinhala.
Your task is to translate English subtitle text into fluent, simple, spoken Sinhala. The translation should be meaningful and capture the natural conversational tone of the original, not a literal word-for-word translation.

You will be given a numbered list of English lines. You MUST follow these rules strictly:
1.  For each numbered line you receive, provide one and only one corresponding Sinhala translation.
2.  NEVER split a single input line into multiple translated lines. Keep the translation for one input line as a single string element in the output array.
3.  If an input line is short, contains only punctuation (like "..." or "-"), or seems like a non-translatable sound (like "♪"), you must still provide a corresponding entry in the output array. You can use a similar punctuation or a placeholder like "-" if a direct translation is not possible. DO NOT skip or merge these lines.
4.  Your response MUST be a single, valid JSON object.
5.  This JSON object must have a key named "translations".
6.  The value of "translations" must be an array of strings.
7.  This array must contain the exact same number of strings as the number of lines in the input. The order must be preserved perfectly.

Example of correct output:
If the input text is:
---
1. Hello, how are you?
2. - I'm fine.
3. ...
---
Your JSON output MUST be exactly this:
{
  "translations": [
    "හෙලෝ, ඔයාට කොහොමද?",
    "- මම හොඳින්.",
    "..."
  ]
}
`;

export const translateSubtitles = async (
  texts: string[],
  onProgress: (progress: number) => void
): Promise<string[]> => {
  const BATCH_SIZE = 50; // Translate 50 lines at a time
  const totalTexts = texts.length;
  let allTranslatedTexts: string[] = [];

  onProgress(0);

  for (let i = 0; i < totalTexts; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    
    // Create a clean, numbered list. Replace newlines within a single subtitle text block with a space
    // to prevent the model from misinterpreting it as a separate line.
    const numberedBatch = batch.map((line, index) => `${i + index + 1}. ${line.replace(/\n/g, ' ')}`).join('\n');

    const prompt = `Translate the following ${batch.length} English subtitle lines into Sinhala. Adhere strictly to the system instruction rules.
---
${numberedBatch}
---
`;

    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    translations: {
                        type: Type.ARRAY,
                        description: `An array of exactly ${batch.length} translated Sinhala strings, in the same order as the input.`,
                        items: {
                            type: Type.STRING,
                        },
                    },
                },
                required: ['translations']
            },
        },
      });

      const responseText = response.text.trim();
      if (!responseText) {
          throw new Error(`Received an empty response from the AI model for batch starting at index ${i}.`);
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
          console.error("Failed to parse JSON response:", responseText);
          throw new Error("The AI model returned an invalid format. The response was not valid JSON.");
      }

      if (result && Array.isArray(result.translations) && result.translations.length === batch.length) {
          allTranslatedTexts = [...allTranslatedTexts, ...result.translations];
      } else {
          console.error(`Mismatched translation count. Expected: ${batch.length}, Got: ${result?.translations?.length || 0}`);
          throw new Error(`Translation mismatch or invalid format for batch starting at index ${i}. Expected ${batch.length} translations, got ${result?.translations?.length || 0}.`);
      }

      const progress = Math.round(((i + batch.length) / totalTexts) * 100);
      onProgress(Math.min(progress, 100)); // Ensure progress doesn't exceed 100

    } catch (error) {
      console.error(`Gemini API call failed for batch starting at index ${i}:`, error);
      if (error instanceof Error && (error.message.includes('JSON') || error.message.includes('format') || error.message.includes('mismatch'))) {
          throw new Error("Failed to translate subtitles. The AI model returned an invalid format. Please try again.");
      }
      throw new Error("Failed to translate subtitles. The AI model may be temporarily unavailable.");
    }
  }

  return allTranslatedTexts;
};