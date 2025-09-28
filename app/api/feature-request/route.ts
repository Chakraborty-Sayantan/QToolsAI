import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, request } = await req.json();

    if (!request) {
      return NextResponse.json({ error: "Feature request description is required." }, { status: 400 });
    }

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