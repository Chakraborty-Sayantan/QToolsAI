import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
  `https://random-word-api.vercel.app/api?words=1&_=${Date.now()}`
);
    if (!response.ok) {
      throw new Error('Failed to fetch random word');
    }
    const data = await response.json();
    // The API returns an array, so we take the first element
    return NextResponse.json({ word: data[0] });
  } catch (error) {
    console.error("Error fetching random word:", error);
    // Provide a fallback word in case the API fails
    const fallbackWords = ["react", "javascript", "tailwind", "nextjs", "typescript", "developer", "component"];
    const fallbackWord = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
    return NextResponse.json({ word: fallbackWord });
  }
}
