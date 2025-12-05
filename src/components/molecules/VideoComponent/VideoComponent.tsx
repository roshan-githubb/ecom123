"use client";

import { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface HeroVideoProps {
    videoSrc: string;
}

export default function HeroVideo({ videoSrc }: HeroVideoProps) {
    const [muted, setMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const toggleMute = () => {
        if (!videoRef.current) return;

        const newState = !muted;
        videoRef.current.muted = newState;
        setMuted(newState);
    };

    return (
        <div className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden rounded-2xl">
            <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                loop
                muted={muted}
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            />

            <button
                onClick={toggleMute}
                className="absolute top-4 right-4 p-3 rounded-full bg-black/50 hover:bg-black/70 transition text-white"
            >
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
        </div>
    );
}
