import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const resend = new Resend(process.env.RESEND_API_KEY);

const requestSchema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  request: z.string().min(1, "Feature request description is required."),
});

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(2, "10 s"),
});

export async function POST(req: NextRequest) {
  const ip = req.ip ?? "127.0.0.1";
  // Check if the current IP has exceeded the rate limit
  const { success } = await ratelimit.limit(ip);
  if (!success) {
  // If the rate limit is exceeded, return a 429 Too Many Requests error
  return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  
  try {
    const body = await req.json();
    const parseResult = requestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
    }

    const { email, request } = parseResult.data;

    const toEmail = process.env.TO_EMAIL;
    if (!toEmail) {
      console.error("TO_EMAIL environment variable is not set.");
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: "Feature Requests <requests@qtoolsai.store>",
      to: [toEmail],
      subject: "New Feature Request for QToolsAI!",
      html: `
        <h1>New Feature Request</h1>
        <p><strong>From:</strong> ${email || "Anonymous"}</p>
        <p><strong>Request:</strong></p>
        <p>${request}</p>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
    }

    return NextResponse.json({ message: "Request received!" }, { status: 200 });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}