"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Slugify a display name to match the filename convention:
 * "Jordan Rivers" → "jordan-rivers"
 * Expects files at /public/avatars/<slug>.jpg
 */
function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

interface AvatarProps {
  name: string;
  color?: string;
  size?: number;         // pixel diameter, default 36
  src?: string;          // Optional explicit src override
  className?: string;
}

export function Avatar({ name, color = "#94a3b8", size = 36, src, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const slug = toSlug(name);
  const initial = name.charAt(0).toUpperCase();

  // Use explicit src if provided, otherwise fallback to the generated slug
  const imageSrc = src || `/avatars/${slug}.jpg`;

  const base = "rounded-full shrink-0 inline-flex items-center justify-center overflow-hidden font-bold text-white";
  const sizeStyle = { width: size, height: size, fontSize: size * 0.38 };

  if (!failed) {
    return (
      <span
        className={cn(base, className)}
        style={{ ...sizeStyle, backgroundColor: color }}
        aria-label={name}
      >
        <Image
          src={imageSrc}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
          priority={false}
        />
      </span>
    );
  }

  return (
    <span
      className={cn(base, className)}
      style={{ ...sizeStyle, backgroundColor: color }}
      aria-label={name}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}