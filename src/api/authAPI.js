import axiosInstance from "../api/axiosInstance";

export const loginUser = async (credentials) => {
    const response = await axiosInstance.post('/api/auth/login', credentials);
    return response.data;
  };


  export const registerUser = async (userData) => {
    console.log('userData',userData);
    
    const response = await axiosInstance.post('/api/auth/register', userData);
    return response.data;
  };

  export const userList = async (id) => {
    console.log('ids',id);
    
    const response = await axiosInstance.get(`/api/auth/user-dashBoard/${id}`);
    return response.data;
  };