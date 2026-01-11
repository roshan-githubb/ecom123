export function getScrollPosition() {
  return {
    x: window.scrollX || window.pageXOffset,
    y: window.scrollY || window.pageYOffset,
  }
}

export function scrollToPosition(x: number, y: number, behavior: ScrollBehavior = 'smooth') {
  window.scrollTo({
    left: x,
    top: y,
    behavior,
  })
}

export function scrollToTop(behavior: ScrollBehavior = 'smooth') {
  scrollToPosition(0, 0, behavior)
}

export function scrollIntoView(element: HTMLElement, options?: ScrollIntoViewOptions) {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'nearest',
    ...options,
  })
}

export function isElementInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export function createScrollHandler(callback: () => void, delay: number = 100) {
  let timeoutId: NodeJS.Timeout | null = null
  
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(callback, delay)
  }
}