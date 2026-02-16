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
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "#f0f0f0",
        paddingBottom: `${aspectRatio * 100}%`,
      }}
    >
      <img
        src={photo.url}
        alt=""
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}
