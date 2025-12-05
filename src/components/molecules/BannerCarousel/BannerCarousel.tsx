"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { CAROUSEL_AUTO_SLIDE_INTERVAL } from "@/lib/constants";
import { useRouter } from "next/navigation";


interface CarouselBannerProps {
  bannerCarousel: BannerCarouselProps[];
}
interface BannerCarouselProps {
  image: string;
  link: string
}

export default function CarouselBanner({ bannerCarousel }: CarouselBannerProps) {
  const [current, setCurrent] = useState(0);
  const router = useRouter()

  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [current]);

  const startAutoSlide = () => {
    stopAutoSlide();
    slideInterval.current = setTimeout(() => {
      prevSlide();
    }, CAROUSEL_AUTO_SLIDE_INTERVAL);
  };

  const stopAutoSlide = () => {
    if (slideInterval.current) clearTimeout(slideInterval.current);
  };


  const prevSlide = () => {
    setCurrent((prev) => (prev + 1) % bannerCarousel.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === 0 ? bannerCarousel.length - 1 : prev - 1));
  };

  const isSwipe = useRef(false);
  const startX = useRef(0);
  const endX = useRef(0);
  const isDragging = useRef(false);
  const minDistance = 40;


  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    endX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    handleSwipe();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    endX.current = e.clientX;
  };

  const onMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    handleSwipe();
  };

  const handleSwipe = () => {
    const distance = startX.current - endX.current;
    isSwipe.current = false;

    if (Math.abs(distance) >= minDistance) {
      if (distance > 0) nextSlide();
      else prevSlide();
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      <div
        className="
      relative 
      w-full 
      h-52 sm:h-64 
      rounded-2xl 
      bg-gray-100 
      overflow-hidden
      shadow-[0_8px_20px_rgba(0,0,0,0.15)]
    "
        onClick={() => {
          stopAutoSlide();

          !isSwipe.current ? router.push(bannerCarousel[current]?.link ?? "/coming-soon") : null;

          // router.push(bannerCarousel[current]?.link ?? "/coming-soon")
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}

      >
        <Image
          src={bannerCarousel[current]?.image}
          alt="banner"
          fill
          className="object-cover pointer-events-none"
        // onClick={() => router.push(bannerCarousel[current]?.link ?? "/coming-soon")}
        />

      </div>

      {/* dots */}
      <div className="flex gap-2 mt-3">
        {bannerCarousel.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-3 w-3 rounded-full transition-all ${current === index ? "bg-blue-600 w-5" : "bg-gray-300"
              }`}
          />
        ))}
      </div>
    </div>

  );
}
