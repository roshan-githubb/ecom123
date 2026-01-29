"use client"

import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { isFlutterWebView } from "@/lib/env/isFlutterWebView"

//Retry clicked → new token requested with current url → flutter calls flutterauthhandler → server sets cookie → dispatch flutter-auth → web UI listener updates modal

type AuthErrorModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  // onLogin?: () => void
  title?: string
  description?: string
}

type RetryState = "idle" | "loading" | "failed"
export function AuthErrorModal({
  open,
  onOpenChange,
  // onLogin,
  title = "Invalid Authentication",
  description = "An error occurred during authentication. Please try again.",
}: AuthErrorModalProps) {
  // const { retryAuth } = useFlutterAuth()
  const [retryState, setRetryState] = useState<RetryState>("idle")

  const handleLoginRetry = () => {
    // if not  mobile view
    console.log('location ', window.location.href)
    if (!isFlutterWebView()) {
      console.warn("Retry called outside Flutter webview")
      setRetryState("failed") // fallback for web/desktop
      return
    }

    setRetryState("loading")
    const flutter = (window as any).flutter_inappwebview

    //  new token request, sending the current URL
    flutter.flutter_inappwebview?.callHandler(
      "TokenRequest",
      window.location.href
    )

    const listener = () => {
      setRetryState("idle")
      window.removeEventListener("flutter-auth", listener)
    }
    window.addEventListener("flutter-auth", listener)

    // Fallback timeout if Flutter does not respond
    setTimeout(() => {
      if (retryState === "loading") {
        setRetryState("failed")
        window.removeEventListener("flutter-auth", listener)
      }
    }, 8000)
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <div className="fixed inset-0 bg-black/40" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold">
              {title}
            </Dialog.Title>

            {retryState !== "failed" && (
              <Dialog.Description className="mt-2 text-sm text-gray-600">
                {description}
              </Dialog.Description>
            )}
            {retryState === "failed" && (
              <p className="mt-3 text-sm text-red-600">
                Login retry failed. Please reopen the app and try again.
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              {retryState === "failed" && (
                <button
                  onClick={() => {
                    setRetryState("idle")
                    onOpenChange(false)
                  }}
                  className="rounded-md border px-4 py-2 text-sm"
                >
                  Close
                </button>
              )}

              <button
                disabled={retryState === "loading"}
                onClick={handleLoginRetry}
                className="rounded-md transition-colors duration-200 bg-myBlue  h-9 font-medium text-sm hover:opacity-90 px-4 py-2  text-white disabled:opacity-50"
              >
                {retryState === "loading" ? "Retrying…" : "Retry"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  )
}
