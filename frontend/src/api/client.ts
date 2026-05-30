import axios from 'axios'

const client = axios.create({
  baseURL: 'http://123.57.166.231:3000/api',
})

// 请求拦截器：自动附加 token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('canteen-auth-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：401 时清除 token
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('canteen-auth-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default client
