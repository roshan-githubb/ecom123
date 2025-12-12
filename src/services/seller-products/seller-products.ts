

export async function getSellerItems(sellerId: string) {
  try {
    console.log(`/api/seller-items/${sellerId}`)
    const res = await fetch(`/api/seller-items/${sellerId}`);
    

    if (!res.ok) {
     
      console.error(
        " Items Fetch Error:", res,
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
      console.error(" Failed to parse JSON from /api/seller-items:", jsonErr);
      throw new Error("Invalid JSON received from /api/seller-items");
    }

  } catch (err: any) {
    // console.error(" getSellerItems() Exception:", err.message || err);
    throw err; 
  }
}


