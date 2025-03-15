import { HfInference } from '@huggingface/inference'

export async function POST(req: Request) {
  const { text, length, style } = await req.json()

  // Define length parameters
  const lengthMap = {
    short: "1-2 sentences",
    medium: "3-5 sentences",
    long: "6-8 sentences",
  }

  // Define style parameters
  const styleMap = {
    concise: "Create a concise summary that captures the main points",
    detailed: "Create a detailed summary that includes key information and context",
    "bullet-points": "Create a bullet-point summary of the main points",
  }

  // Create a prompt based on the user's input
  const prompt = `
    Summarize the following text:
    
    ${text}
    
    Length: ${lengthMap[length as keyof typeof lengthMap]}
    Style: ${styleMap[style as keyof typeof styleMap]}
  `

  try {
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
    if (!HF_API_KEY) {
      throw new Error("Missing Hugging Face API key");
    }

    const hf = new HfInference(HF_API_KEY);

    // Use the request method directly
    const response = await hf.request({
      model: "facebook/bart-large-cnn",
      inputs: prompt,
      parameters: {
        max_new_tokens: length === "short" ? 100 : length === "medium" ? 200 : 300,
        temperature: 0.7,
        do_sample: true,
      }
    });

    // Handle the response format
    if (!Array.isArray(response) || !response[0]?.summary_text) {
      throw new Error("Invalid response format from Hugging Face API");
    }

    return Response.json({ summary: response[0].summary_text });
  } catch (error) {
    console.error("Error summarizing text:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to summarize text" }, 
      { status: 500 }
    );
  }
}