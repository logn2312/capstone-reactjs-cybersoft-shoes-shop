import { createSlice } from '@reduxjs/toolkit'

const isSame = (item, id, size) => item.id === id && item.size === size

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || []
  } catch {
    return []
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart(),
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, size, quantity } = action.payload
      const found = state.items.find((i) => isSame(i, product.id, size))
      if (found) {
        found.quantity += quantity
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          size,
          quantity,
        })
      }
    },
    changeQuantity: (state, action) => {
      const { id, size, delta } = action.payload
      const item = state.items.find((i) => isSame(i, id, size))
      if (item) item.quantity = Math.max(1, item.quantity + delta)
    },
    removeFromCart: (state, action) => {
      const { id, size } = action.payload
      state.items = state.items.filter((i) => !isSame(i, id, size))
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, changeQuantity, removeFromCart, clearCart } = cartSlice.actions

export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0)

export default cartSlice.reducer
