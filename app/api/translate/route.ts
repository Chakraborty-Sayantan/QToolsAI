import { HfInference } from '@huggingface/inference'

export async function POST(req: Request) {
  const { text, sourceLanguage, targetLanguage } = await req.json()

  // Validate input text
  if (!text || text.trim().length < 2) {
    return Response.json(
      { error: "Please provide at least 2 characters to translate" },
      { status: 400 }
    );
  }

  // Get language names from codes
  const languages: Record<string, string> = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ru: "Russian",
    zh: "Chinese",
    ja: "Japanese",
    ko: "Korean",
    ar: "Arabic",
    hi: "Hindi",
  }

  const sourceLang = languages[sourceLanguage] || sourceLanguage
  const targetLang = languages[targetLanguage] || targetLanguage

  try {
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
    if (!HF_API_KEY) {
      throw new Error("Missing Hugging Face API key");
    }

    const hf = new HfInference(HF_API_KEY);

    // Primary model for specific language pair
    const model = `Helsinki-NLP/opus-mt-${sourceLanguage}-${targetLanguage}`;
    // Fallback model for unsupported pairs
    const fallbackModel = "Helsinki-NLP/opus-mt-mul-en";

    let response;
    try {
      // Try primary model first
      response = await hf.translation({
        model,
        inputs: text,
      });
    } catch (primaryError) {
      console.log(`Primary model failed, trying fallback: ${primaryError}`);
      // Try fallback model if primary fails
      response = await hf.translation({
        model: fallbackModel,
        inputs: text,
      });
    }

    if (!response?.translation_text) {
      throw new Error("Invalid translation response");
    }

    return Response.json({ translatedText: response.translation_text });
  } catch (error) {
    console.error("Error translating text:", error);
    return Response.json(
      { 
        error: error instanceof Error ? error.message : "Failed to translate text",
        retry: true // Indicate that the user can retry
      },
      { status: 500 }
    );
  }
}