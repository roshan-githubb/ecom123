
import { isFlutterWebView } from "../env/isFlutterWebView";

export function requestNewToken(): boolean {
  try {
    if (!isFlutterWebView()) return false;

    const flutter = (window as any).flutter_inappwebview;

    if (flutter?.callHandler) {
      flutter.callHandler("TokenRequest");
      return true;
    }

    console.warn("Flutter bridge not ready");
    return false;
  } catch (e) {
    console.error("Flutter bridge error:", e);
    return false;
  }
}
