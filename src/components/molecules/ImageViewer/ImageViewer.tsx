"use client"

import { useEffect } from "react"
import PhotoSwipeLightbox from "photoswipe/lightbox"


export function ProductLightbox({ images, galleryId }: { images: string[], galleryId: string }) {
  useEffect(() => {
    if (!images || images.length === 0) return

    const lightbox = new PhotoSwipeLightbox({
      gallery: `#${galleryId}`,
      children: "a",
      pswpModule: () => import("photoswipe"),
    })
    lightbox.init()
    return () => lightbox.destroy()
  }, [images, galleryId])

  return (
    <div id={galleryId} className="hidden">
      {images.map((src, i) => (
        <a key={i} href={src} data-pswp-width="1600" data-pswp-height="1600" />
      ))}
    </div>
  )
}

