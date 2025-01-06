import axiosInstance from "./axiosInstance";

export const privateMessage = async (message) => {
    console.log('kkkk',message);
    
    const response = await axiosInstance.post('/api/messages/send', message,{
    headers: {
        'Content-Type': 'multipart/form-data', // Ensure proper headers for FormData
      },
    });
    return response.data;
  };

  export const getMessage = async (sender,receiver) => {
    // console.log('ids',id);
    console.log(sender);
    console.log(receiver);

    
    const response = await axiosInstance.get(`/api/messages/${sender}/${receiver}`);
    return response.data;
  };