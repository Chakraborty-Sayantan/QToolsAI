/* import { NextResponse } from "next/server";

// Define the structure of the articles from the NewsData.io API
interface NewsDataArticle {
  title: string;
  description: string | null;
  link: string;
  image_url: string | null;
  pubDate: string;
  source_id: string;
  creator: string[] | null;
  category: string[];
}

// Define the structure of the article object we want to send to the client
interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: { name: string };
  author: string | null;
  url: string;
  urlToImage: string;
  publishedAt: string;
  category: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");
  const category = searchParams.get("category");
  const query = searchParams.get("q");

  const apiKey = process.env.NEWS_DATA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key is not configured" },
      { status: 500 }
    );
  }

  const baseUrl = "https://newsdata.io/api/1/news";
  const queryParams = new URLSearchParams({
    apikey: apiKey,
    language: "en",
  });

  let requestedCategory = "top"; // Default for NewsData.io

  if (endpoint === "top-headlines" && category) {
    // Map your categories to what NewsData.io supports
    const categoryMap: { [key: string]: string } = {
      general: "top",
      business: "business",
      technology: "technology",
      entertainment: "entertainment",
      sports: "sports",
      science: "science",
      health: "health",
    };
    requestedCategory = categoryMap[category] || "top";
    queryParams.append("category", requestedCategory);
    queryParams.append("country", "us");
  } else if (endpoint === "search" && query) {
    queryParams.append("q", query);
  } else {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const response = await fetch(`${baseUrl}?${queryParams.toString()}`);
    const data = await response.json();

    if (data.status !== "success") {
      throw new Error(
        data.results?.message || "Failed to fetch news from NewsData.io API"
      );
    }

    const formattedArticles: NewsArticle[] = data.results.map(
      (article: NewsDataArticle, index: number) => ({
        id: `${article.source_id}-${index}-${new Date(
          article.pubDate
        ).getTime()}`,
        title: article.title,
        description: article.description || "No description available.",
        source: { name: article.source_id },
        author: article.creator ? article.creator.join(", ") : article.source_id,
        url: article.link,
        urlToImage:
          article.image_url ||
          "/placeholder.svg?height=200&width=300&text=News+Image",
        publishedAt: article.pubDate,
        category: category || "search",
      })
    );

    return NextResponse.json({ articles: formattedArticles });
  } catch (error) {
    console.error("NewsData.io API fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
} */