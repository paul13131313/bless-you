import { NextRequest, NextResponse } from "next/server";
import { fetchYawnPhotos } from "@/lib/pexels";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("per_page") || "15", 10);

  const data = await fetchYawnPhotos(page, Math.min(perPage, 30));

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
    },
  });
}
