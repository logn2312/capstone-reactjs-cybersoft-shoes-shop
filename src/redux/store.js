import { configureStore } from '@reduxjs/toolkit'
import productReducer from './slices/productSlice'
import userReducer from './slices/userSlice'
import cartReducer from './slices/cartSlice'

export const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    cart: cartReducer,
  },
})

store.subscribe(() => {
  localStorage.setItem('cart', JSON.stringify(store.getState().cart.items))
})
