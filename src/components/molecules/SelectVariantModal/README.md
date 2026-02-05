# SelectVariantModal - Usage Guide

The `SelectVariantModal` component now works seamlessly with both **Backend products** and **Algolia search result products** through an automatic adapter.

## How It Works

The component automatically detects the product format and adapts it:

```tsx
import { SelectVariantModal } from "@/components/molecules"

// Works with BOTH Backend and Algolia products
export function MyComponent() {
  const [showModal, setShowModal] = useState(false)
  const product = getProductFromAnySource() // Backend or Algolia
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>Open Modal</button>
      
      {showModal && (
        <SelectVariantModal 
          product={product} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  )
}
```

## Product Format Support

### Backend Format ✅
```tsx
{
  id: string
  title: string
  images: [{ url: string }]
  options: [{
    id: string
    title: string
    values: [{
      id: string
      value: string
    }]
  }]
  variants: [{
    id: string
    options: [{ id: string, value: string }]
    inventory_quantity: number
    calculated_price: {
      calculated_amount: number
      original_amount: number
      currency_code: string
    }
  }]
}
```

### Algolia Format ✅
```tsx
{
  title: string
  thumbnail: string
  options: [
    { color: 'Black' },
    { size: '8' },
    // ...
  ]
  variants: [{
    id: string
    title: string
    color: string
    size: string
    stocked_quantity: number
    prices: [{ amount: number, currency_code: string }]
  }]
}
```

## How Adaptation Works

The `adaptAlgoliaProductToBackendFormat()` function:

1. **Detects Algolia format** - Checks if product has flat option objects instead of structured `{id, title, values}`
2. **Extracts option names** - Scans variants for option keys (color, size, etc.)
3. **Builds option structure** - Creates proper `{id, title, values}` format
4. **Normalizes variants** - Converts flat variant properties to nested options structure
5. **Maps prices** - Converts Algolia price format to backend `calculated_price` format

## No Breaking Changes

- ✅ Existing code using backend products works as-is
- ✅ Algolia products from search now work automatically
- ✅ No extra API calls needed
- ✅ Zero code duplication

## Helper Functions

### `isAlgoliaProduct(product)`
Checks if a product is in Algolia format
```tsx
if (isAlgoliaProduct(product)) {
  // It's from Algolia
}
```

### `adaptAlgoliaProductToBackendFormat(product)`
Manually adapt an Algolia product (used internally but available for custom use)
```tsx
const backendFormatProduct = adaptAlgoliaProductToBackendFormat(algoliaProduct)
```

## Performance Notes

- Adaptation happens on component mount via `useEffect`
- No performance impact on backend products (they skip adaptation)
- Adaptation is O(n) where n = number of options + variants
- Safe for use with dynamic product switching
