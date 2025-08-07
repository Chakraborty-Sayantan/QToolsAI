import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { text } = await req.json();

  const prompt = `
    Analyze the sentiment of the following text and return "Positive", "Negative", or "Neutral".
    ---
    ${text}
    ---
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
    const sentiment = response.text();

    return Response.json({ sentiment });
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to analyze sentiment" },
      { status: 500 }
    );
  }
}