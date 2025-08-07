import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { pnr } = await req.json();
  const apiKey = process.env.INDIAN_RAIL_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const response = await fetch(`https://indianrailapi.com/api/v2/PNRCheck/apikey/${apiKey}/PNRNumber/${pnr}/Route/1/`);
    const data = await response.json();

    if (data.ResponseCode !== 200) {
      throw new Error(data.Message || 'Failed to fetch PNR status');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching PNR status:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}
