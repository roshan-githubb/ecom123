"use client"

import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"

type AuthErrorModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin?: () => void
  title?: string
  description?: string
}

export function AuthErrorModal({
  open,
  onOpenChange,
  onLogin,
  title = "Invalid Authentication",
  description = "An error occurred during authentication. Please try again.",
}: AuthErrorModalProps) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onOpenChange}
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Panel */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  {title}
                </Dialog.Title>

                <Dialog.Description className="mt-2 text-sm text-gray-600">
                  {description}
                </Dialog.Description>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </button>

                 
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
