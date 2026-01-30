import { requestNewToken } from "@/lib/bridge/flutterAuth";

export function useFlutterAuth() {
  const retryAuth = () => {
    return requestNewToken();
  };

  return { retryAuth };
}
