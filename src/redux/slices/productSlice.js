import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import _ from 'lodash'
import { getProducts, getProductById, getProductByCategory, getAllStore } from '../../services/api.js'
import { getCategoryIds, isOriginalProduct, isRealStore } from '../../utils/format.js'

const onlyOriginal = (products) => (products ?? []).filter(isOriginalProduct)

export const fetchProducts = createAsyncThunk('product/fetchAll', () => getProducts())

export const fetchProductById = createAsyncThunk('product/fetchById', (id) => getProductById(id))

export const searchProducts = createAsyncThunk('product/search', (keyword) => getProducts(keyword))

export const fetchProductsByCategory = createAsyncThunk('product/fetchByCategory', (categoryId) =>
  categoryId ? getProductByCategory(categoryId) : getProducts(),
)

export const fetchStores = createAsyncThunk('product/fetchStores', () => getAllStore())

const productSlice = createSlice({
  name: 'product',
  initialState: {
    list: [],
    detail: null,
    searchResults: [],
    categoryProducts: [],
    categoryRequestId: null,
    stores: [],
    storesLoading: false,
    storesError: null,
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
      .addCase(fetchStores.pending, (state) => {
        state.storesLoading = true
        state.storesError = null
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.storesLoading = false
        state.stores = (action.payload ?? []).filter(isRealStore)
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.storesLoading = false
        state.storesError = action.error.message
      })
  },
})

export const selectRecommendations = createSelector(
  [(state) => state.product.list, (state) => state.user.favorites],
  (products, favorites) => {
    const likedIds = new Set(favorites.map((f) => String(f.id)))
    const liked = products.filter((p) => likedIds.has(String(p.id)))
    const weights = _.countBy(liked.flatMap(getCategoryIds))
    const categories = _.orderBy(Object.keys(weights), (c) => weights[c], 'desc')

    const candidates = products
      .filter((p) => !likedIds.has(String(p.id)))
      .map((p) => ({ product: p, score: _.sumBy(getCategoryIds(p), (c) => weights[c] ?? 0) }))
      .filter((c) => c.score > 0)

    return {
      categories,
      products: _.orderBy(candidates, ['score', 'product.price'], ['desc', 'desc'])
        .slice(0, 4)
        .map((c) => c.product),
    }
  },
)

export default productSlice.reducer
