import api from './axios.js'

export const getProducts = (keyword = '') => api.get('/Product', { params: { keyword } })
export const getProductById = (id) => api.get('/Product/getbyid', { params: { id } })
export const getProductByCategory = (categoryId) =>
  api.get('/Product/getProductByCategory', { params: { categoryId } })
export const getAllCategory = () => api.get('/Product/getAllCategory')

export const signup = (body) => api.post('/Users/signup', body)
export const signin = (body) => api.post('/Users/signin', body)
export const facebookLogin = (facebookToken) => api.post('/Users/facebooklogin', { facebookToken })
export const getProfile = () => api.post('/Users/getProfile')
export const updateProfile = (body) => api.post('/Users/updateProfile', body)
export const order = (body) => api.post('/Users/order', body)

export const getFavorite = () => api.get('/Users/getproductfavorite')
export const like = (productId) => api.get('/Users/like', { params: { productId } })
export const unlike = (productId) => api.get('/Users/unlike', { params: { productId } })
