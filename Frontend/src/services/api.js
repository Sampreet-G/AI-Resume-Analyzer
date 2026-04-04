import axios from 'axios'

const API = axios.create({
  baseURL:
    import.meta.env.MODE === 'development'
      ? 'http://127.0.0.1:8000'
      : 'https://ai-resume-analyzer-3-45w2.onrender.com'
})

export default API