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
  isPlaceOrderError?: boolean
}

type RetryState = "idle" | "loading" | "failed"
export function AuthErrorModal({
  open,
  onOpenChange,
  // onLogin,
  title = "Authentication Required",
  description = "An error occurred during authentication. Please try again.",
  isPlaceOrderError = false,
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
            {/* Icon */}
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <svg className="h-6 w-6 text-myBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <Dialog.Title className="text-center text-xl font-semibold text-gray-900">
              {isPlaceOrderError ? "Login Required to Place Order" : title}
            </Dialog.Title>

            {retryState !== "failed" && (
              <Dialog.Description className="mt-3 text-center text-sm text-gray-600 leading-relaxed">
                {isPlaceOrderError ? (
                  <>
                    To complete your order, please use the <span className="font-semibold text-myBlue">WeeTok app</span> or log in to your account.
                    <br />
                    <br />
                    Orders cannot be placed through the web browser without authentication.
                  </>
                ) : (
                  description
                )}
              </Dialog.Description>
            )}
            {retryState === "failed" && (
              <p className="mt-3 text-center text-sm text-red-600">
                Login retry failed. Please reopen the app and try again.
              </p>
            )}

            <div className="mt-6 flex flex-col gap-2">
              {isPlaceOrderError && retryState !== "failed" ? (
                <>
                  <button
                    disabled={retryState === "loading"}
                    onClick={handleLoginRetry}
                    className="w-full rounded-lg transition-colors duration-200 bg-myBlue h-10 font-medium text-sm hover:opacity-90 text-white disabled:opacity-50"
                  >
                    {retryState === "loading" ? "Opening WeeTok App..." : "Open WeeTok App"}
                  </button>
                  <button
                    onClick={() => onOpenChange(false)}
                    className="w-full rounded-lg border border-gray-300 h-10 font-medium text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Continue Shopping
                  </button>
                </>
              ) : (
                <div className="flex justify-end gap-2">
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
                    className="rounded-md transition-colors duration-200 bg-myBlue h-9 font-medium text-sm hover:opacity-90 px-4 py-2 text-white disabled:opacity-50"
                  >
                    {retryState === "loading" ? "Retrying…" : "Retry"}
                  </button>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  )
}
