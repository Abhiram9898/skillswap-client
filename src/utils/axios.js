// src/utils/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // thanks to Vite proxy
  withCredentials: true,
});

export default instance;
