import { sendToFlutter } from "@/lib/bridge/mobileBridge";

export function useFlutterBridge() {
    return {
        goHome: () => sendToFlutter("home"),
        goCategories: () => sendToFlutter("categories"),
        goOffers: () => sendToFlutter("offers"),
        goCheck: () => sendToFlutter("check"),
        goProfile: () => sendToFlutter("profile"),
    };
}
