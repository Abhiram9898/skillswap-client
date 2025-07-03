// src/utils/auth.js

// Get user from localStorage
export const getUserInfo = () => {
  const user = localStorage.getItem('userInfo');
  return user ? JSON.parse(user) : null;
};

// Save user to localStorage
export const setUserInfo = (user) => {
  localStorage.setItem('userInfo', JSON.stringify(user));
};

// Clear auth
export const clearUserInfo = () => {
  localStorage.removeItem('userInfo');
};
