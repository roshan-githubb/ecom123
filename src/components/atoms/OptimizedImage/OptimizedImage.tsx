import Image from 'next/image'
import { getOptimizedImageProps, getImageWithFallback } from '@/lib/utils/image-utils'

interface OptimizedImageProps {
  src: string
  alt: string
  context: 'card' | 'banner' | 'icon' | 'thumbnail' | 'hero' | 'modal'
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  index?: number
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  context,
  width,
  height,
  className,
  priority,
  fill = false,
  index,
  onError,
  ...props
}: OptimizedImageProps) {
  const optimizedProps = getOptimizedImageProps(
    getImageWithFallback(src),
    alt,
    context,
    width,
    height,
    priority
  )

  if (fill) {
    return (
      <Image
        src={optimizedProps.src}
        alt={optimizedProps.alt}
        fill
        className={className}
        sizes={optimizedProps.sizes}
        priority={optimizedProps.priority}
        onError={onError}
        {...props}
      />
    )
  }

  return (
    <Image
      src={optimizedProps.src}
      alt={optimizedProps.alt}
      width={optimizedProps.width}
      height={optimizedProps.height}
      className={className}
      sizes={optimizedProps.sizes}
      priority={optimizedProps.priority}
      onError={onError}
      {...props}
    />
  )
}

export default OptimizedImage