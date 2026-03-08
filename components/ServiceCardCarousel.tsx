"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ServiceCardCarouselProps {
  images: string[];
  alt: string;
}

export default function ServiceCardCarousel({
  images,
  alt,
}: ServiceCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () =>
    setCurrentIndex((i) => Math.min(images.length - 1, i + 1));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

  return (
    <div
      className="relative overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={src} className="relative aspect-[4/3] w-full flex-shrink-0">
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow transition-all hover:bg-white disabled:opacity-0"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4 text-secondary" />
          </button>
          <button
            onClick={next}
            disabled={currentIndex >= images.length - 1}
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow transition-all hover:bg-white disabled:opacity-0"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4 text-secondary" />
          </button>

          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1">
            {images.length <= 10
              ? images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentIndex
                        ? "w-4 bg-white"
                        : "w-1.5 bg-white/50"
                    }`}
                    aria-label={`Image ${i + 1}`}
                  />
                ))
              : (
                <span className="rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                  {currentIndex + 1} / {images.length}
                </span>
              )}
          </div>
        </>
      )}
    </div>
  );
}
