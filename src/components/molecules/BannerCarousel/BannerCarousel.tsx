
"use client";

import { useState } from "react";
import Image from "next/image";

interface CarouselBannerProps {
    images: string[];
}

export default function CarouselBanner({ images }: CarouselBannerProps) {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden bg-gray-100">
                <Image
                    src={images[current]}
                    alt="banner"
                    fill
                    className="object-cover"
                />

                {/* <button
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
                >
                    ‹
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
                >
                    ›
                </button> */}
            </div>

            {/* dots */}
            <div className="flex gap-2 mt-3">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-3 w-3 rounded-full transition-all ${current === index
                                ? "bg-blue-600 w-5"
                                : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}




