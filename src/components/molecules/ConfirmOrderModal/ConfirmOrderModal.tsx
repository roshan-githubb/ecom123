"use client"

import { Modal } from "../Modal/Modal"

interface ConfirmOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  orderDetails?: {
    total: number
    currency: string
    itemCount: number
  }
  isLoading?: boolean
}

export const ConfirmOrderModal = ({
  isOpen,
  onClose,
  onConfirm,
  orderDetails,
  isLoading = false,
}: ConfirmOrderModalProps) => {
  if (!isOpen) return null

  return (
    <Modal
      heading="Confirm Order"
      onClose={onClose}
      centerHeading={true}
      showCloseButton={true}
    >
      <div className="space-y-6">
        {orderDetails && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-gray-800">Order Summary</h3>
            <div className="flex justify-between text-sm">
              <span>Items ({orderDetails.itemCount})</span>
              <span>{orderDetails.currency} {orderDetails.total}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{orderDetails.currency} {orderDetails.total}</span>
            </div>
          </div>
        )}

        <div className="text-center space-y-2">
          <p className="text-gray-700">
            Are you sure you want to place this order?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              'Confirm Order'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmOrderModal