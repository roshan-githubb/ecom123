export function isFlutterWebView(): boolean {
    return typeof (window as any).flutter_inappwebview !== "undefined";
}
