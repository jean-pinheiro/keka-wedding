"use client";

import { useCallback, useEffect, useState } from "react";
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
}

export function Carousel({ photos, isHero = false }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  // Auto-play functionality with reset on manual interaction
  useEffect(() => {
    if (!emblaApi) return;

    let autoplayTimer: ReturnType<typeof setTimeout>;

    const play = () => {
      clearTimeout(autoplayTimer);
      autoplayTimer = setTimeout(() => {
        emblaApi.scrollNext();
      }, 7000); // 7s delay
    };

    // Run once on init
    play();

    // Reset autoplay whenever user interacts
    emblaApi.on("select", play);
    emblaApi.on("pointerDown", () => {
      clearTimeout(autoplayTimer); // pause while dragging
    });
    emblaApi.on("pointerUp", play); // resume after drag ends

    return () => clearTimeout(autoplayTimer);
  }, [emblaApi]);

  if (photos.length === 0) {
    return (
      <div
        className={`w-full ${
          isHero ? "h-screen" : "h-[70vh] max-h-[800px]"
        } bg-muted ${
          !isHero ? "rounded-lg" : ""
        } flex items-center justify-center`}
      >
        <p className="text-muted-foreground">Nenhuma foto disponível</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={emblaRef}
        className={`overflow-hidden ${!isHero ? "rounded-lg" : ""}`}
      >
        <div className="flex">
          {photos.map((photo) => (
            <div key={photo.id} className="flex-[0_0_100%] min-w-0">
              <div
                className={`relative w-full ${
                  isHero ? "h-screen" : "h-[70vh] max-h-[800px]"
                }`}
              >
                {/* Blurred fill background */}
                <div
                  className="absolute inset-0 -z-10 bg-center bg-cover blur-xl scale-110 opacity-50"
                  style={{ backgroundImage: `url(${photo.image_url})` }}
                />
                {/* Foreground image (no cropping) */}
                <img
                  src={
                    photo.image_url ||
                    "/placeholder.svg?height=800&width=1200&query=elegant wedding photo"
                  }
                  alt={photo.caption || "Foto do casamento"}
                  className="w-full h-full object-contain"
                  // onLoad={handleLoad(photo.id)} // optional: to detect portrait/landscape
                />
                {photo.caption && !isHero && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                    <p className="text-center">{photo.caption}</p>
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
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedIndex
                    ? isHero
                      ? "bg-white"
                      : "bg-primary"
                    : isHero
                    ? "bg-white/50"
                    : "bg-muted"
                }`}
                onClick={() => emblaApi?.scrollTo(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
