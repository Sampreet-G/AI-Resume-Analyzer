import axios from 'axios'

const API = axios.create({
  baseURL: 'https://ai-resume-analyzer-3-45w2.onrender.com'
})

export default API