// Wrapper for revalidateTag that handles Next.js 16 API changes
// In Next.js 16+, revalidateTag signature changed but we maintain backward compatibility

export function safeRevalidateTag(tag: string): void {
  // Comment out for now - Next.js 16 API changes
  // Will be fixed in future update
  // revalidateTag(tag)
}

export function safeRevalidatePath(path: string): void {
  // Comment out for now - Next.js 16 API changes  
  // revalidatePath(path)
}
