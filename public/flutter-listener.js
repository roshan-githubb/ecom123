(function () {
  console.log("[FlutterBridge] Auth listener loaded");

  window.flutterAuthHandler = async function (token) {
    try {
      if (!token || typeof token !== "string") {
        console.warn("[FlutterBridge] Invalid token received:", token);
        return;
      }

      console.log("[FlutterBridge] Token received from Flutter:", token);
      alert("Flutter token received:\n" + token);

      const res = await fetch("/api/auth/flutter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        console.error("[FlutterBridge] Failed to store token", await res.text());
        return;
      }

      console.log("[FlutterBridge] Auth cookie set successfully");

      window.dispatchEvent(
        new CustomEvent("flutter-auth", {
          detail: { received: true },
        })
      );
    } catch (err) {
      console.error("[FlutterBridge] Error handling token:", err);
    }
  };
})();
