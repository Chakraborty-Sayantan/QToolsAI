import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { code, language, level } = await req.json();

  if (!code || code.trim().length < 10) {
    return Response.json(
      { error: "Please provide at least 10 characters of code to explain" },
      { status: 400 }
    );
  }

  const levelMap = {
    beginner: "Explain this code in simple terms for a beginner programmer. Use plain language and avoid technical jargon.",
    intermediate: "Explain this code in detail for an intermediate programmer. Include key concepts and logic.",
    advanced: "Provide a technical explanation of this code for an advanced programmer. Include detailed analysis of algorithms and patterns.",
  };

  const prompt = `
    ${levelMap[level as keyof typeof levelMap]}
    
    Code (${language}):
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Provide a clear and structured explanation of what this code does. Break it down into the following sections:
    1. **Purpose**: What is the overall goal of this code?
    2. **Key Components**: What are the main parts of the code (e.g., functions, loops, conditions)?
    3. **How It Works**: Step-by-step explanation of how the code achieves its goal.
    4. **Example**: Provide a simple example of how this code might be used.

    Use markdown for formatting, including bolding for headings and bullet points for clarity.
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
    const explanation = response.text();

    return Response.json({ explanation });
  } catch (error) {
    console.error("Error explaining code:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to explain code" },
      { status: 500 }
    );
  }
}