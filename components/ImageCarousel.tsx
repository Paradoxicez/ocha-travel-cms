"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  aspectRatio?: "video" | "square";
  visibleCount?: { mobile: number; desktop: number };
  className?: string;
}

export default function ImageCarousel({
  images,
  alt,
  aspectRatio = "video",
  visibleCount = { mobile: 1, desktop: 3 },
  className = "",
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const visible = isMobile ? visibleCount.mobile : visibleCount.desktop;
  const maxIndex = Math.max(0, images.length - visible);

  const prev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((i) => Math.min(maxIndex, i + 1));
  }, [maxIndex]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

  if (images.length === 0) return null;

  const aspectClass =
    aspectRatio === "square" ? "aspect-square" : "aspect-video";

  return (
    <div className={`relative ${className}`}>
      <div
        className="overflow-hidden rounded-2xl"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / visible)}%)`,
          }}
        >
          {images.map((src, i) => (
            <div
              key={src}
              className="flex-shrink-0 px-1"
              style={{ width: `${100 / visible}%` }}
            >
              <div className={`relative ${aspectClass} overflow-hidden rounded-xl bg-zinc-100`}>
                <Image
                  src={src}
                  alt={`${alt} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes={`(max-width: 768px) ${Math.round(100 / visibleCount.mobile)}vw, ${Math.round(100 / visibleCount.desktop)}vw`}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {images.length > visible && (
        <>
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className="absolute -left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-default md:-left-5"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-secondary" />
          </button>
          <button
            onClick={next}
            disabled={currentIndex >= maxIndex}
            className="absolute -right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-default md:-right-5"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-secondary" />
          </button>

          <div className="mt-4 flex justify-center gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex
                    ? "w-6 bg-primary"
                    : "w-2 bg-zinc-300 hover:bg-zinc-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
