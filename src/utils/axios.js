// // src/utils/axios.js
// import axios from 'axios';

// const instance = axios.create({
//   baseURL: '/api', // thanks to Vite proxy
//   withCredentials: true,
// });

// export default instance;


import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // uses full URL from env
  withCredentials: true,
});

export default instance;
