import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { jobDescription, userExperience } = await req.json();

  const prompt = `
    Based on the following job description and user experience, generate 3-5 impactful resume bullet points.
    
    Job Description:
    ---
    ${jobDescription}
    ---
    
    User Experience:
    ---
    ${userExperience}
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
    const bulletPoints = response.text();

    return Response.json({ bulletPoints });
  } catch (error) {
    console.error("Error generating resume bullet points:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate resume bullet points" },
      { status: 500 }
    );
  }
}