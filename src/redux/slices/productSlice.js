import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getProducts, getProductById, getProductByCategory } from '../../services/api.js'
import { isOriginalProduct } from '../../utils/format.js'

const onlyOriginal = (products) => (products ?? []).filter(isOriginalProduct)

export const fetchProducts = createAsyncThunk('product/fetchAll', () => getProducts())

export const fetchProductById = createAsyncThunk('product/fetchById', (id) => getProductById(id))

export const searchProducts = createAsyncThunk('product/search', (keyword) => getProducts(keyword))

export const fetchProductsByCategory = createAsyncThunk('product/fetchByCategory', (categoryId) =>
  categoryId ? getProductByCategory(categoryId) : getProducts(),
)

const productSlice = createSlice({
  name: 'product',
  initialState: {
    list: [],
    detail: null,
    searchResults: [],
    categoryProducts: [],
    categoryRequestId: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.list = onlyOriginal(action.payload)
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
        state.detail = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        if (!action.payload) state.error = 'Không tìm thấy sản phẩm'
        state.detail = action.payload && {
          ...action.payload,
          relatedProducts: onlyOriginal(action.payload.relatedProducts),
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(searchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.searchResults = onlyOriginal(action.payload)
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchProductsByCategory.pending, (state, action) => {
        state.loading = true
        state.error = null
        state.categoryProducts = []
        state.categoryRequestId = action.meta.requestId
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.categoryRequestId) return
        state.loading = false
        state.categoryProducts = onlyOriginal(action.payload)
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        if (action.meta.requestId !== state.categoryRequestId) return
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default productSlice.reducer
