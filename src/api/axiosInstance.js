import axios from 'axios';
// require('dotenv').config();
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('dd', process.env.REACT_APP_BACKEND_API_URL);

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const { data } = await axios.post(
            process.env.REACT_APP_BACKEND_API_URL + '/api/auth/refresh-token',
            { refreshToken }
          );
          localStorage.setItem('accessToken', data.accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          console.error('Refresh token failed:', err);
  
          // If the refresh token is also expired
          if (err.response?.status === 403 && err.response?.data?.error === 'TokenExpiredError') {
            console.error('Refresh token expired');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/'; // Redirect to login
          }
        }
      }
  
      return Promise.reject(error);
    }
  );
  
export default axiosInstance;
