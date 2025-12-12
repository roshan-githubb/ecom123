

export async function getSimilarProducts(sellerId: string) {
  try {
    console.log(`/api/category/${sellerId}`)
    const res = await fetch(`/api/category/${sellerId}`);
    

    if (!res.ok) {
     
      console.error(
        " Category Items Fetch Error:", res,
        res.status,
        res.statusText
      );

      const errorText = await res.text().catch(() => "No error body");

      // console.error(" API Response Body:", errorText);

      // throw new Error(`Failed to fetch  items: ${res.status}`);
    }

   
    try {
      return await res.json();
    } catch (jsonErr) {
      console.error(" Failed to parse JSON from /api/category:", jsonErr);
      throw new Error("Invalid JSON received from /api/category");
    }

  } catch (err: any) {
    // console.error(" getSimilarProducts() Exception:", err.message || err);
    throw err; 
  }
}


