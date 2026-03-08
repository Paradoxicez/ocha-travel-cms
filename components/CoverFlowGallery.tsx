"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

interface CoverFlowGalleryProps {
  images: string[];
  alt: string;
}

export default function CoverFlowGallery({
  images,
  alt,
}: CoverFlowGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(Math.max(0, Math.min(images.length - 1, index)));
    },
    [images.length]
  );

  // Auto-play
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(autoPlayRef.current);
  }, [images.length]);

  const pauseAutoPlay = () => {
    clearInterval(autoPlayRef.current);
  };

  const resumeAutoPlay = () => {
    clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4000);
  };

  // Mouse/Touch drag
  const onDragStart = (clientX: number) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    dragCurrentX.current = clientX;
    pauseAutoPlay();
  };

  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = dragStartX.current - dragCurrentX.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) goTo(activeIndex + 1);
      else goTo(activeIndex - 1);
    }
    resumeAutoPlay();
  };

  const onDragMove = (clientX: number) => {
    if (!isDragging) return;
    dragCurrentX.current = clientX;
  };

  // Visible range: show 5 items centered on active
  const visibleRange = 3;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto h-[340px] select-none overflow-hidden sm:h-[420px] md:h-[480px]"
      onMouseDown={(e) => onDragStart(e.clientX)}
      onMouseMove={(e) => onDragMove(e.clientX)}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
      onTouchEnd={onDragEnd}
    >
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1200px" }}>
        {images.map((src, i) => {
          const offset = i - activeIndex;
          const absOffset = Math.abs(offset);

          if (absOffset > visibleRange) return null;

          const translateX = offset * 220;
          const translateZ = -absOffset * 150;
          const rotateY = offset * -35;
          const scale = absOffset === 0 ? 1 : Math.max(0.6, 1 - absOffset * 0.15);
          const opacity = absOffset === 0 ? 1 : Math.max(0.3, 1 - absOffset * 0.25);
          const zIndex = images.length - absOffset;

          return (
            <div
              key={src}
              className="absolute cursor-pointer transition-all duration-500 ease-out"
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                transformStyle: "preserve-3d",
              }}
              onClick={() => {
                goTo(i);
                pauseAutoPlay();
                resumeAutoPlay();
              }}
            >
              <div className={`relative h-[280px] w-[380px] overflow-hidden rounded-2xl shadow-2xl transition-shadow duration-500 sm:h-[340px] sm:w-[460px] md:h-[400px] md:w-[540px] ${absOffset === 0 ? "shadow-black/40" : "shadow-black/20"}`}>
                <Image
                  src={src}
                  alt={`${alt} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="540px"
                  loading={i === 0 ? undefined : absOffset <= 1 ? "eager" : "lazy"}
                  priority={i === 0}
                />
                {absOffset === 0 && (
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-white/30" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1">
        {images.length <= 30 ? (
          images.map((_, i) => {
            const dist = Math.abs(i - activeIndex);
            if (dist > 8) return null;
            return (
              <button
                key={i}
                onClick={() => {
                  goTo(i);
                  pauseAutoPlay();
                  resumeAutoPlay();
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "h-2.5 w-6 bg-primary"
                    : dist <= 3
                      ? "h-2 w-2 bg-zinc-400 hover:bg-zinc-600"
                      : "h-1.5 w-1.5 bg-zinc-300"
                }`}
                aria-label={`Image ${i + 1}`}
              />
            );
          })
        ) : (
          <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Left/Right click areas */}
      <button
        className="absolute left-0 top-0 z-20 h-full w-1/4 cursor-pointer"
        onClick={() => { goTo(activeIndex - 1); pauseAutoPlay(); resumeAutoPlay(); }}
        aria-label="Previous"
      />
      <button
        className="absolute right-0 top-0 z-20 h-full w-1/4 cursor-pointer"
        onClick={() => { goTo(activeIndex + 1); pauseAutoPlay(); resumeAutoPlay(); }}
        aria-label="Next"
      />
    </div>
  );
}
