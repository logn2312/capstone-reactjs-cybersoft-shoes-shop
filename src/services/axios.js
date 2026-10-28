import axios from 'axios'

const api = axios.create({
  baseURL: 'https://shop.cyberlearn.vn/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res.data.content,
  (err) => {
    const data = err.response?.data
    const detail = data?.statusCode === 500 && typeof data.content === 'string' ? data.content : null
    return Promise.reject(new Error(detail || data?.message || err.message))
  },
)

export default api
