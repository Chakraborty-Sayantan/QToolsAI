import { HfInference } from '@huggingface/inference'

export async function POST(req: Request) {
  const { code, language, level } = await req.json()

  // Validate input
  if (!code || code.trim().length < 10) {
    return Response.json(
      { error: "Please provide at least 10 characters of code to explain" },
      { status: 400 }
    )
  }

  // Define explanation levels
  const levelMap = {
    beginner: "Explain this code in simple terms for a beginner programmer. Use plain language and avoid technical jargon.",
    intermediate: "Explain this code in detail for an intermediate programmer. Include key concepts and logic.",
    advanced: "Provide a technical explanation of this code for an advanced programmer. Include detailed analysis of algorithms and patterns.",
  }

  // Create a prompt for the model
  const prompt = `
    ${levelMap[level as keyof typeof levelMap]}
    
    Code (${language}):
    ${code}
    
    Provide a clear and structured explanation of what this code does. Break it down into the following sections:
    1. **Purpose**: What is the overall goal of this code?
    2. **Key Components**: What are the main parts of the code (e.g., functions, loops, conditions)?
    3. **How It Works**: Step-by-step explanation of how the code achieves its goal.
    4. **Example**: Provide a simple example of how this code might be used.

    Use bullet points for clarity and keep the explanation concise.
  `

  try {
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY
    if (!HF_API_KEY) {
      throw new Error("Missing Hugging Face API key")
    }

    const hf = new HfInference(HF_API_KEY)

    // Use a code explanation model
    const response = await fetch(
      `https://api-inference.huggingface.co/models/codellama/CodeLlama-7b-hf`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            do_sample: true,
          },
        }),
      }
    )

    // Check if the response is HTML (error page)
    const contentType = response.headers.get("content-type")
    if (contentType?.includes("text/html")) {
      const errorHtml = await response.text()
      console.error("HTML Error Response:", errorHtml)
      throw new Error("Hugging Face API returned an HTML error page. Check your API key and model access.")
    }

    // Parse the JSON response
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to explain code")
    }

    if (!data?.[0]?.generated_text) {
      throw new Error("No explanation generated")
    }

    // Format the explanation for better readability
    const explanation = data[0].generated_text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold for headings
      .replace(/\n/g, "<br>") // Line breaks
      .replace(/\d+\.\s+/g, "<br><strong>$&</strong>"); // Numbered lists

    return Response.json({ explanation })
  } catch (error) {
    console.error("Error explaining code:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to explain code" },
      { status: 500 }
    )
  }
}