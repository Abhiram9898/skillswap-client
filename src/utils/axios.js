// // src/utils/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://skillswap-server-2z5x.onrender.com/api'
    : '/api', // thanks to Vite proxy
  withCredentials: true,
});

export default instance;

