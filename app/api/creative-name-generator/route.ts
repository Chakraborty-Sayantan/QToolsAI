import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { category, keywords } = await req.json();

  const prompt = `
    Generate 5 creative names for a ${category} based on the following keywords: ${keywords}.
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
    const names = response.text();

    return Response.json({ names });
  } catch (error) {
    console.error("Error generating creative names:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate creative names" },
      { status: 500 }
    );
  }
}