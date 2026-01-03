/**
 * Safe data fetching utility that logs errors instead of crashing
 */

export interface SafeDataResult<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export async function safeDataFetch<T>(
  fetchFn: () => Promise<T>,
  fallbackData: T | null = null,
  context: string = 'Unknown'
): Promise<SafeDataResult<T>> {
  try {
    const data = await fetchFn();
    
    // Check if data is undefined or null
    if (data === undefined || data === null) {
      console.warn(`[${context}] Data is null/undefined, using fallback`);
      return {
        data: fallbackData,
        error: 'Data is null or undefined',
        success: false
      };
    }

    return {
      data,
      error: null,
      success: true
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${context}] Data fetch failed:`, errorMessage);
    
    return {
      data: fallbackData,
      error: errorMessage,
      success: false
    };
  }
}

export function safeAccess<T>(
  obj: any,
  path: string,
  fallback: T,
  context: string = 'SafeAccess'
): T {
  try {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined) {
        console.warn(`[${context}] Path "${path}" is null/undefined at "${key}"`);
        return fallback;
      }
      current = current[key];
    }
    
    return current !== undefined ? current : fallback;
  } catch (error) {
    console.error(`[${context}] Error accessing path "${path}":`, error);
    return fallback;
  }
}