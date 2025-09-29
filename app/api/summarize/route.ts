import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { text, length, style } = await req.json();

  // Define length parameters
  const lengthMap = {
    short: "a brief summary in 1-2 sentences",
    medium: "a medium-length summary in 3-5 sentences",
    long: "a detailed summary in 6-8 sentences",
  };

  // Define style parameters
  const styleMap = {
    concise: "a concise, to-the-point summary",
    detailed: "a detailed summary with key context",
    "bullet-points": "a summary in bullet points",
  };

  // Create a prompt based on the user's input
  const prompt = `
    Summarize the following text.
    
    Text: "${text}"
    
    Summary Length: ${lengthMap[length as keyof typeof lengthMap]}
    Summary Style: ${styleMap[style as keyof typeof styleMap]}
  `;

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("Missing Google AI API key");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text();

    return Response.json({ summary });

  } catch (error) {
    console.error("Error summarizing text:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to summarize text" },
      { status: 500 }
    );
  }
}