import type { Photo } from "./types";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const BASE_URL = "https://api.pexels.com/v1";

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
}

const QUERIES = [
  "yawning person",
  "yawning cat",
  "yawning dog",
  "yawning baby",
  "yawning animal",
  "yawn mouth open",
];

export async function fetchYawnPhotos(
  page: number = 1,
  perPage: number = 15
): Promise<{ photos: Photo[]; hasMore: boolean }> {
  if (!PEXELS_API_KEY) {
    return fetchMockPhotos(page, perPage);
  }

  // Rotate through queries based on page number
  const query = QUERIES[(page - 1) % QUERIES.length];

  // Calculate actual Pexels page (since we cycle through queries)
  const pexelsPage = Math.ceil(page / QUERIES.length);

  const res = await fetch(
    `${BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${pexelsPage}&orientation=portrait`,
    {
      headers: { Authorization: PEXELS_API_KEY },
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    console.error("Pexels API error:", res.status);
    return fetchMockPhotos(page, perPage);
  }

  const data: PexelsSearchResponse = await res.json();

  const photos: Photo[] = data.photos.map((p) => ({
    id: String(p.id),
    url: p.src.large2x || p.src.large,
    width: p.width,
    height: p.height,
  }));

  return {
    photos,
    hasMore: data.total_results > pexelsPage * perPage,
  };
}

// Mock photos for development without API key
function fetchMockPhotos(
  page: number,
  perPage: number
): { photos: Photo[]; hasMore: boolean } {
  const photos: Photo[] = Array.from({ length: perPage }, (_, i) => {
    const id = (page - 1) * perPage + i + 1;
    const width = 800;
    const height = 600 + (id % 5) * 100;
    return {
      id: `mock-${id}`,
      url: `https://picsum.photos/seed/${id}/${width}/${height}`,
      width,
      height,
    };
  });

  return { photos, hasMore: true };
}
