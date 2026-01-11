import toast from 'react-hot-toast'
import { CartToast } from '@/components/atoms/CartToast/CartToast'
import { createElement } from 'react'

interface CartToastState {
  toastId: string | null
  itemCount: number
  timeoutId: NodeJS.Timeout | null
}

class CartToastService {
  private state: CartToastState = {
    toastId: null,
    itemCount: 0,
    timeoutId: null
  }

  private readonly TOAST_DURATION = 3000 

  showCartToast() {
   
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId)
    }

    this.state.itemCount++

    const message = this.state.itemCount === 1 
      ? "Added to cart!" 
      : `${this.state.itemCount} items added to cart!`

   
    if (this.state.toastId) {
      toast.dismiss(this.state.toastId)
    }

   
    this.state.toastId = toast.custom(
      (t) => createElement(CartToast, {
        message,
        isVisible: t.visible,
        duration: this.TOAST_DURATION,
        onDismiss: () => {
          toast.dismiss(t.id)
          this.resetState()
        }
      }),
      {
        duration: this.TOAST_DURATION,
        position: 'top-right',
      }
    )

    
    this.state.timeoutId = setTimeout(() => {
      this.resetState()
    }, this.TOAST_DURATION)
  }

  showErrorToast(message: string = "Failed to add to cart") {
    // Dismiss any existing toast
    if (this.state.toastId) {
      toast.dismiss(this.state.toastId)
    }

    // Show custom error toast using the CartToast component with progress bar
    this.state.toastId = toast.custom(
      (t) => createElement(CartToast, {
        message,
        isVisible: t.visible,
        duration: this.TOAST_DURATION,
        onDismiss: () => {
          toast.dismiss(t.id)
          this.resetState()
        },
        variant: 'error'
      }),
      {
        duration: this.TOAST_DURATION,
        position: 'top-right',
      }
    )
  }

  showOutOfStockToast(message: string = "This product is out of stock") {
    // Dismiss any existing toast
    if (this.state.toastId) {
      toast.dismiss(this.state.toastId)
    }

    // Show custom out of stock toast using the same CartToast component
    this.state.toastId = toast.custom(
      (t) => createElement(CartToast, {
        message,
        isVisible: t.visible,
        duration: this.TOAST_DURATION,
        onDismiss: () => {
          toast.dismiss(t.id)
          this.resetState()
        },
        variant: 'error' // Add variant prop for different styling
      }),
      {
        duration: this.TOAST_DURATION,
        position: 'top-right',
      }
    )
  }

  private resetState() {
    this.state = {
      toastId: null,
      itemCount: 0,
      timeoutId: null
    }
  }


  dismissToast() {
    if (this.state.toastId) {
      toast.dismiss(this.state.toastId)
      this.resetState()
    }
  }
}


export const cartToast = new CartToastService()