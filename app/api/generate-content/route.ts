import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { topic, contentType, tone, length } = await req.json();

  const lengthMap = {
    short: "100-200 words",
    medium: "300-500 words",
    long: "700-1000 words",
  };

  const prompt = `
    Generate ${contentType.replace("-", " ")} content about "${topic}".
    Tone: ${tone}
    Length: ${lengthMap[length as keyof typeof lengthMap]}
    
    Make sure the content is engaging, well-structured, and optimized for the specified content type.
    You are an expert content creator.
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
    const text = response.text();

    return Response.json({ content: text });

  } catch (error) {
    console.error("Error generating content:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate content" },
      { status: 500 }
    );
  }
}