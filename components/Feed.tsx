"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import PhotoCard from "./PhotoCard";
import type { Photo } from "@/lib/types";

export default function Feed() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);
  const loadingRef = useRef(false);

  const fetchPhotos = useCallback(async (pageNum: number) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await fetch(`/api/photos?page=${pageNum}&per_page=15`);
      const data = await res.json();
      if (data.photos.length === 0) {
        setHasMore(false);
      } else {
        setPhotos((prev) => [...prev, ...data.photos]);
        setPage(pageNum + 1);
        setHasMore(data.hasMore);
      }
    } catch (err) {
      console.error("Failed to fetch photos:", err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      fetchPhotos(1);
    }
  }, [fetchPhotos]);

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loadingRef.current) {
          fetchPhotos(page);
        }
      },
      { rootMargin: "600px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [page, hasMore, fetchPhotos]);

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
