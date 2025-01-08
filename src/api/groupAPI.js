import axiosInstance from "./axiosInstance";

export const createGroupPeople = async (content) => {
    console.log('people',content);
    
    const response = await axiosInstance.post('/api/groups/create_group', content)
    return response.data;
  };

  export const getGroupMessage = async (groupId) => {
    // console.log('ids',id);
    console.log(groupId);
    // console.log(receiver);

    
    const response = await axiosInstance.get(`/api/groups/receieve/${groupId}`);
    return response.data;
  };


  export const SendGroupMessage = async (message) => {
    console.log('kkkk',message);
    
    const response = await axiosInstance.post('/api/groups/send_message', message,{
    headers: {
        'Content-Type': 'multipart/form-data', // Ensure proper headers for FormData
      },
    });
    return response.data;
  };

  export const joinGroup = async (grpdata) => {
    console.log('kkkk',grpdata);
    
    const response = await axiosInstance.post('/api/groups/join_group', grpdata);
    return response.data;
  };

  export const getMembers = async (groupId) => {
    
    const response = await axiosInstance.get(`/api/groups/members/${groupId}`);
    return response.data;
  };