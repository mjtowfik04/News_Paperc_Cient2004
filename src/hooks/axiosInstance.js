import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://dpi-news.vercel.app/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `JWT ${token}`
  }
  return config
})

export default instance
