interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>()
  
  set<T>(key: string, data: T, ttlSeconds: number = 300) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    })
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }
  
  clear() {
    this.cache.clear()
  }
}

export const apiCache = new APICache()

export async function cachedFetch<T>(
  url: string, 
  options: RequestInit = {}, 
  ttlSeconds: number = 300
): Promise<T> {
  const cacheKey = `${url}-${JSON.stringify(options)}`
  
  const cached = apiCache.get<T>(cacheKey)
  if (cached) {
    console.log(`[Cache HIT] ${url}`)
    return cached
  }
  
  console.log(`[Cache MISS] ${url}`)
  const response = await fetch(url, options)
  const data = await response.json()
  
  apiCache.set(cacheKey, data, ttlSeconds)
  return data
}