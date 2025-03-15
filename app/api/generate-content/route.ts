import { HfInference } from '@huggingface/inference'


export async function POST(req: Request) {
  const { topic, contentType, tone, length } = await req.json()

  // Define length parameters
  const lengthMap = {
    short: "100-200 words",
    medium: "300-500 words",
    long: "700-1000 words",
  }

  const prompt = `
    Generate ${contentType.replace("-", " ")} content about "${topic}".
    Tone: ${tone}
    Length: ${lengthMap[length as keyof typeof lengthMap]}
    
    Make sure the content is engaging, well-structured, and optimized for the specified content type.
    
    You are an expert content creator with experience in various content types including blog posts, social media, emails, and marketing copy.
  `

  try {
    // Make sure your API key is properly set
    const apiKey = process.env.HUGGINGFACE_API_KEY
    
    if (!apiKey) {
      throw new Error("Missing Hugging Face API key")
    }
    
    const hf = new HfInference(apiKey)
    
    const result = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 1024,
        temperature: 0.7
      }
    })

    return Response.json({ content: result.generated_text })
  } catch (error) {
    console.error("Error generating content:", error)
    return Response.json({ error: "Failed to generate content" }, { status: 500 })
  }
}