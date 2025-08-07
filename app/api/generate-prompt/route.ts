import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { concept, style, mood, additionalDetails } = await req.json();

  if (!concept || concept.trim().length < 3) {
    return Response.json(
      { error: "Please provide a concept with at least 3 characters" },
      { status: 400 }
    );
  }

  const styleDescriptions: Record<string, string> = {
    photorealistic: "hyper-realistic, detailed photography, 8K, high definition",
    "digital-art": "digital art, detailed, vibrant colors, sharp lines",
    anime: "anime style, cel shaded, vibrant colors, 2D illustration",
    "3d-render": "3D render, octane render, ray tracing, highly detailed textures",
    "oil-painting": "oil painting, textured canvas, brush strokes, classical art style",
    watercolor: "watercolor painting, soft edges, flowing colors, paper texture",
    "pixel-art": "pixel art, 16-bit, retro game style, limited color palette",
    sketch: "pencil sketch, hand-drawn, detailed linework, shading",
    "comic-book": "comic book style, bold outlines, flat colors, action-oriented",
    fantasy: "fantasy art, magical, ethereal, detailed, imaginative",
  };

  const moodDescriptions: Record<string, string> = {
    vibrant: "vibrant, colorful, energetic, lively",
    dark: "dark, moody, shadows, low-key lighting, mysterious",
    serene: "serene, peaceful, calm, soothing colors, gentle",
    dramatic: "dramatic lighting, high contrast, intense, emotional",
    mysterious: "mysterious, foggy, enigmatic, intriguing",
    whimsical: "whimsical, playful, fantastical, imaginative",
    futuristic: "futuristic, sci-fi, high-tech, neon lights",
    nostalgic: "nostalgic, retro, vintage, warm tones, memory-like",
    ethereal: "ethereal, dreamlike, soft glowing light, otherworldly",
    minimalist: "minimalist, clean, simple, uncluttered, elegant",
  };

  const prompt = `
    Generate a detailed AI image generation prompt based on the following inputs:
    - Concept: ${concept}
    - Style: ${styleDescriptions[style] || style}
    - Mood: ${moodDescriptions[mood] || mood}
    - Additional Details: ${additionalDetails || "none"}

    The prompt should be structured as follows:
    1. Start with the main subject or concept.
    2. Describe the art style and mood.
    3. Add specific details about lighting, environment, and composition.
    4. Include quality descriptors like "highly detailed" and "masterpiece".

    Make the prompt professional and suitable for AI image generation tools like DALL-E, Midjourney, or Stable Diffusion.
  `;

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("Missing Google AI API key");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const generatedPrompt = response.text();

    return Response.json({ prompt: generatedPrompt.trim() });
  } catch (error) {
    console.error("Error generating prompt:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate prompt" },
      { status: 500 }
    );
  }
}