"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Photo {
  id: string;
  image_url: string;
  caption?: string;
  sort_order: number;
}

interface CarouselProps {
  photos: Photo[];
  isHero?: boolean;
  intervalMs?: number;
}

export function Carousel({
  photos,
  isHero = false,
  intervalMs = 7000,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // --- autoplay timer
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clear = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
  const start = () => {
    clear();
    timerRef.current = setInterval(() => emblaApi?.scrollNext(), intervalMs);
  };
  const kick = () => {
    // restart countdown after any interaction
    if (!emblaApi) return;
    start();
  };

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    kick();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    kick();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", () => {
      onSelect();
      kick();
    });
    // if user drags/swipes, also restart timer when released
    emblaApi.on("pointerUp", kick);

    start();
    return () => clear();
  }, [emblaApi, onSelect]);

  if (photos.length === 0) {
    return (
      <div
        className={[
          "w-full",
          isHero ? "h-screen" : "min-h-[320px] h-[60vh] max-h-[800px]",
          !isHero ? "rounded-lg" : "",
          "bg-muted flex items-center justify-center",
        ].join(" ")}
      >
        <p className="text-muted-foreground">Nenhuma foto disponível</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={`overflow-hidden ${!isHero ? "rounded-lg" : ""}`}
        ref={emblaRef}
      >
        <div className="flex">
          {photos.map((photo) => (
            <div key={photo.id} className="flex-[0_0_100%] min-w-0">
              <div
                className={[
                  "relative w-full overflow-hidden",
                  isHero
                    ? "h-screen"
                    : "min-h-[320px] h-[60vh] max-h-[800px] rounded-lg",
                ].join(" ")}
              >
                {/* Blurred backdrop (non-hero only) */}
                {!isHero && (
                  <img
                    src={photo.image_url}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 opacity-60"
                  />
                )}

                {/* Foreground image */}
                <div
                  className={
                    isHero
                      ? "absolute inset-0"
                      : "relative z-10 w-full h-full flex items-center justify-center"
                  }
                >
                  <img
                    src={
                      photo.image_url ||
                      "/placeholder.svg?height=800&width=1200&query=elegant wedding photo"
                    }
                    alt={photo.caption || "Foto do casamento"}
                    className={
                      isHero
                        ? "w-full h-full object-cover"
                        : "max-w-full max-h-full object-contain"
                    }
                  />
                </div>

                {/* Optional caption */}
                {photo.caption && !isHero && (
                  <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/45 text-white p-3">
                    <p className="text-center text-sm">{photo.caption}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {photos.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${
              isHero
                ? "bg-white/20 hover:bg-white/30 text-white border-white/30"
                : "bg-white/80 hover:bg-white"
            }`}
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className={`absolute right-4 top-1/2 -translate-y-1/2 ${
              isHero
                ? "bg-white/20 hover:bg-white/30 text-white border-white/30"
                : "bg-white/80 hover:bg-white"
            }`}
            onClick={scrollNext}
            disabled={nextBtnDisabled}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div
            className={`flex justify-center gap-2 ${
              isHero ? "absolute bottom-32 left-1/2 -translate-x-1/2" : "mt-4"
            }`}
          >
            {photos.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === selectedIndex
                    ? isHero
                      ? "bg-white"
                      : "bg-primary"
                    : isHero
                    ? "bg-white/50"
                    : "bg-muted"
                }`}
                onClick={() => {
                  emblaApi?.scrollTo(index);
                  kick();
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
