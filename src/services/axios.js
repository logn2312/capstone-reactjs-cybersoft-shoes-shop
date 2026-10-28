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
  (err) => Promise.reject(new Error(err.response?.data?.message || err.message)),
)

export default api
