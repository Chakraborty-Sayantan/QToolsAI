import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { text } = await req.json();

  const prompt = `
    Extract the most relevant keywords from the following text. Return them as a comma-separated list.
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const keywords = response.text();

    return Response.json({ keywords });
  } catch (error) {
    console.error("Error extracting keywords:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to extract keywords" },
      { status: 500 }
    );
  }
}