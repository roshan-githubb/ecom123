import { isFlutterWebView } from "../env/isFlutterWebView";

export type FlutterTarget =
    | "home"
    | "categories"
    | "offers"
    | "check"
    | "profile"
    | "exit";

export function sendToFlutter(target: FlutterTarget): void {

    try {

        //checking if it's flutter view
        if (!isFlutterWebView()) return;
        const flutter = (window as any).flutter_inappwebview;
 
        if (flutter?.callHandler) {
            flutter.callHandler("NavigationBridge", target);
        } else {
            console.warn("Flutter bridge not available yet");
        }
    } catch (e) {
        console.error("Bridge error:", e);
    }
}


export function requestLocationFromFlutter(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
        try {
            if (!isFlutterWebView()) {
                reject(new Error("Not in Flutter WebView"));
                return;
            }

            const flutter = (window as any).flutter_inappwebview;

            if (flutter?.callHandler) {
                // Call Flutter to get location
                flutter.callHandler("GetLocation")
                    .then((result: any) => {
                        if (result && result.latitude && result.longitude) {
                            resolve({
                                latitude: result.latitude,
                                longitude: result.longitude
                            });
                        } else {
                            reject(new Error("Invalid location data from Flutter"));
                        }
                    })
                    .catch((error: any) => {
                        reject(new Error(error?.message || "Failed to get location from Flutter"));
                    });
            } else {
                reject(new Error("Flutter bridge not available"));
            }
        } catch (e) {
            reject(e);
        }
    });
}
