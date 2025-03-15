import { HfInference } from '@huggingface/inference'

export async function POST(req: Request) {
  const { concept, style, mood, additionalDetails } = await req.json()

  // Validate input
  if (!concept || concept.trim().length < 3) {
    return Response.json(
      { error: "Please provide a concept with at least 3 characters" },
      { status: 400 }
    )
  }

  // Define style and mood descriptions
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
  }

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
  }

  // Create the prompt for the model
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
  `

  try {
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY
    if (!HF_API_KEY) {
      throw new Error("Missing Hugging Face API key")
    }

    const hf = new HfInference(HF_API_KEY)

    // Call the Hugging Face API
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 300, // Limit the response length
        temperature: 0.7, // Controls creativity
        do_sample: true, // Enables sampling for better results
      },
    })

    if (!response?.generated_text) {
      throw new Error("No prompt generated")
    }

    // Clean up the generated text
    const generatedPrompt = response.generated_text
      .replace(/<\/?s>/g, "") // Remove special tokens
      .trim()

    return Response.json({ prompt: generatedPrompt })
  } catch (error) {
    console.error("Error generating prompt:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate prompt" },
      { status: 500 }
    )
  }
}