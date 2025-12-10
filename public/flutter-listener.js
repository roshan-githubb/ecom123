(function () {
  console.log("[FlutterBridge] Auth listener loaded");

  window.flutterAuthHandler = function (token) {
    try {
      if (!token || typeof token !== "string") {
        console.warn("[FlutterBridge] Invalid token received:", token);
        return;
      }

      localStorage.setItem("auth_token", token);
      console.log("[FlutterBridge] Token stored:", token);

      window.dispatchEvent(new CustomEvent("flutter-auth", { detail: token }));
    } catch (e) {
      console.error("[FlutterBridge] Error handling token:", e);
    }
  };
})();
