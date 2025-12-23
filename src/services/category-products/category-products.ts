

export async function getSimilarProducts(categoryId: string) {
  try {
    const res = await fetch(`/api/category/${categoryId}`);
    
    if (!res.ok) {
      console.error("Category API error:", res.status, res.statusText);
      return { products: [], items: [] };
    }

    const data = await res.json();
    return data;

  } catch (err: any) {
    console.error("getSimilarProducts() Exception:", err.message || err);
    return { products: [], items: [] };
  }
}


