import axios from 'axios';

const api = axios.create({
  baseURL: 'https://asmit-byt5.onrender.com/api',
  withCredentials: true, // needed later for JWT cookies
});

export default api;
