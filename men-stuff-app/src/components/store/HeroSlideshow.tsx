"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { HeroSlide } from "@/app/_constants/placeholderData";

const AUTOPLAY_INTERVAL_MS = 7000;

interface HeroSlideshowProps {
  slides: HeroSlide[];
}

export default function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-neutral-200"
      aria-label="Hero slideshow"
    >
      <div className="relative aspect-[19/9] max-h-[90vh] w-full md:aspect-[19/9]">
        {slides.map((slide, index) => (
          <Link
            key={slide.id}
            href={slide.href}
            className={`absolute inset-0 block transition-opacity duration-500 ${
              index === current ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
            aria-hidden={index !== current}
          >
            <img
              src={slide.imageUrl}
              alt=""
              className="h-full w-full object-cover"
              width={1920}
              height={900}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 px-4 text-center text-white">
              <h2 className="max-w-[12em] text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="mt-2 text-lg md:text-xl opacity-90">
                  {slide.subtitle}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {slides.length > 1 && (
        <ul
          className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2"
          role="tablist"
          aria-label="Slide navigation"
        >
          {slides.map((slide, index) => (
            <li key={slide.id} role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={index === current}
                aria-label={`Slide ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  index === current
                    ? "w-8 bg-white"
                    : "w-2 bg-white/60 hover:bg-white/80"
                }`}
                onClick={() => setCurrent(index)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
