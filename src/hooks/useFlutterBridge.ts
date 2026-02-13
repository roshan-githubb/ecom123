import { sendToFlutter } from "@/lib/bridge/mobileBridge";

export function useFlutterBridge() {
    return {
        // goHome: () => sendToFlutter("home"),
        // goCategories: () => sendToFlutter("categories"),
        // goOffers: () => sendToFlutter("offers"),
        // goCheck: () => sendToFlutter("check"), // Not used - CartButton is commented out in Navbar
        // goProfile: () => sendToFlutter("profile"),
        exitWebView: () => sendToFlutter("exit"),
    };
}
