import { HfInference } from '@huggingface/inference'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { text, sourceLanguage, targetLanguage } = await req.json()

  // Validate input text
  if (!text || text.trim().length < 2) {
    return NextResponse.json(
      { error: "Please provide at least 2 characters to translate" },
      { status: 400 }
    );
  }

  try {
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
    if (!HF_API_KEY) {
      throw new Error("Missing Hugging Face API key");
    }

    const hf = new HfInference(HF_API_KEY);

    // Define the model based on the language pair
    let model = `Helsinki-NLP/opus-mt-${sourceLanguage}-${targetLanguage}`;
    let response;

    try {
      // Try the direct model first
      response = await hf.translation({
        model,
        inputs: text,
      });
    } catch (primaryError) {
      console.warn(`Direct model ${model} failed. Trying fallbacks...`, primaryError);

      // Fallback logic
      if (targetLanguage === 'en') {
        model = "Helsinki-NLP/opus-mt-mul-en"; // Many-to-English
      } else if (sourceLanguage === 'en') {
        model = "Helsinki-NLP/opus-mt-en-mul"; // English-to-Many
      } else {
        throw new Error("Direct translation model not available for this language pair.");
      }
      
      console.log(`Using fallback model: ${model}`);
      response = await hf.translation({
        model,
        inputs: text,
      });
    }

    if (!response?.translation_text) {
      throw new Error("Invalid translation response from the API");
    }

    return NextResponse.json({ translatedText: response.translation_text });
  } catch (error) {
    console.error("Error translating text:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to translate text",
      },
      { status: 500 }
    );
  }
}