"use client";

import { useState } from "react";
import type { Photo } from "@/lib/types";

interface PhotoCardProps {
  photo: Photo;
}

export default function PhotoCard({ photo }: PhotoCardProps) {
  const [loaded, setLoaded] = useState(false);

  // Calculate aspect ratio for placeholder sizing
  const aspectRatio = photo.height / photo.width;

  return (
    <div className="relative w-full" style={{ backgroundColor: "#f0f0f0" }}>
      {/* Aspect ratio spacer (keeps layout stable before image loads) */}
      {!loaded && (
        <div style={{ paddingBottom: `${aspectRatio * 100}%` }} />
      )}

      <img
        src={photo.url}
        alt=""
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="w-full block"
        style={{
          display: loaded ? "block" : "none",
        }}
      />
    </div>
  );
}
