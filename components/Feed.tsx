"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import PhotoCard from "./PhotoCard";
import type { Photo } from "@/lib/types";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const PAGE_SIZE = 15;

export default function Feed() {
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const dataLoaded = useRef(false);

  // data.json を一度だけ読み込む
  useEffect(() => {
    if (dataLoaded.current) return;
    dataLoaded.current = true;
    fetch(`${BASE_PATH}/data.json`)
      .then((res) => res.json())
      .then((data: Photo[]) => {
        setAllPhotos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data.json:", err);
        setLoading(false);
      });
  }, []);

  const photos = allPhotos.slice(0, displayCount);
  const hasMore = displayCount < allPhotos.length;

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (hasMore) {
      setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, allPhotos.length));
    }
  }, [hasMore, allPhotos.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore) {
          loadMore();
        }
      },
      { rootMargin: "600px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div className="flex flex-col">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}

      {loading && (
        <div className="flex justify-center py-8">
          <div
            className="w-5 h-5 border-2 rounded-full animate-spin"
            style={{ borderColor: "#e0e0e0", borderTopColor: "#999" }}
          />
        </div>
      )}

      <div ref={sentinelRef} className="h-px" />
    </div>
  );
}
