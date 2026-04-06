// Pexels APIから写真データを取得してpublic/data.jsonに保存するprebuildスクリプト
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const BASE_URL = "https://api.pexels.com/v1";

const QUERIES = [
  "yawning person",
  "yawning cat",
  "yawning dog",
  "yawning baby",
  "yawning animal",
  "yawn mouth open",
];

const PER_PAGE = 30; // Pexels APIの最大値
const PAGES_PER_QUERY = 3; // 各クエリで3ページ分取得

async function fetchFromPexels(query, page) {
  const url = `${BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=${PER_PAGE}&page=${page}&orientation=portrait`;
  const res = await fetch(url, {
    headers: { Authorization: PEXELS_API_KEY },
  });

  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status} for query "${query}" page ${page}`);
  }

  const data = await res.json();
  return data.photos.map((p) => ({
    id: String(p.id),
    url: p.src.large2x || p.src.large,
    width: p.width,
    height: p.height,
  }));
}

async function main() {
  if (!PEXELS_API_KEY) {
    throw new Error("PEXELS_API_KEY environment variable is required");
  }

  console.log("Fetching photos from Pexels API...");

  const allPhotos = [];
  const seenIds = new Set();

  for (const query of QUERIES) {
    for (let page = 1; page <= PAGES_PER_QUERY; page++) {
      console.log(`  Fetching: "${query}" page ${page}...`);
      const photos = await fetchFromPexels(query, page);
      for (const photo of photos) {
        if (!seenIds.has(photo.id)) {
          seenIds.add(photo.id);
          allPhotos.push(photo);
        }
      }
      // Rate limit対策: 200ms待つ
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  // シャッフル（Fisher-Yates）
  for (let i = allPhotos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPhotos[i], allPhotos[j]] = [allPhotos[j], allPhotos[i]];
  }

  const outputPath = join(__dirname, "..", "public", "data.json");
  writeFileSync(outputPath, JSON.stringify(allPhotos, null, 0));
  console.log(`Saved ${allPhotos.length} photos to public/data.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
