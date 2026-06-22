"use client";

import { useEffect, useState } from "react";

export default function ReviewsCarousel({ images }: { images: readonly string[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = () => setI((v) => (v - 1 + images.length) % images.length);
  const next = () => setI((v) => (v + 1) % images.length);

  useEffect(() => {
    if (paused || images.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [paused, images.length]);

  if (!images.length) return null;

  return (
    <div
      className="mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative">
        <div className="flex min-h-[180px] items-center justify-center rounded-soft border border-sand bg-white p-5 shadow-sm sm:p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[i]}
            alt={`Отзыв ${i + 1}`}
            className="max-h-[60vh] w-full rounded-lg object-contain"
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Предыдущий отзыв"
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-espresso shadow-md transition hover:bg-white sm:-left-5"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Следующий отзыв"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-espresso shadow-md transition hover:bg-white sm:-right-5"
            >
              ›
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-5 flex justify-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Отзыв ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                idx === i ? "w-6 bg-terracotta" : "w-2.5 bg-clay/50 hover:bg-clay"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
