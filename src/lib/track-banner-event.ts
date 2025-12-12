"use server";

interface BannerEventData {
  event_type: "impression" | "click";
  session_id?: string;
  page_url?: string;
  page_type?: string;
  user_agent?: string;
  user_id?: string;
  referrer?: string;
  device_type?: string;
  browser?: string;
  os?: string;
}

export async function trackBannerEvent(
  bannerId: string,
  eventData: BannerEventData
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/banners/${bannerId}/track`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
        },
        body: JSON.stringify(eventData),
      }
    );

    if (!response.ok) {
      console.error("Failed to track banner event:", response.statusText);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("Error tracking banner event:", error);
    return { success: false };
  }
}
