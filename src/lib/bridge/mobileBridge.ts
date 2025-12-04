import { isFlutterWebView } from "../env/isFlutterWebView";

export type FlutterTarget =
    | "home"
    | "categories"
    | "offers"
    | "check"
    | "profile";

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
