import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // now works in production too
  withCredentials: true,
});

export default instance;
