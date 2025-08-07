import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { emailContent, responseType } = await req.json();

  const prompt = `
    Generate a ${responseType} email response to the following email:
    ---
    ${emailContent}
    ---
    The response should be clear, concise, and appropriate for the given context.
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
    const text = response.text();

    return Response.json({ response: text });
  } catch (error) {
    console.error("Error generating email response:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate email response" },
      { status: 500 }
    );
  }
}