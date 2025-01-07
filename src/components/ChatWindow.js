
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './ChatWindow.css';
import { privateMessage, getMessage } from '../api/chatAPI'; // Import the privateMessage function
import {getGroupMessage,SendGroupMessage} from '../api/groupAPI'

function ChatWindow({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null); // For handling file uploads
  const socket = useRef(null);
  const loginUser = localStorage.getItem('ids'); 

  console.log('tttttttt',selectedUser);
  

  useEffect(() => {
    if (!selectedUser) return;

    // Check if it's a group or private chat based on the selected user
    if (selectedUser.groupId) {
      // Group Chat
      // Initialize the group message component
      socket.current = io(process.env.REACT_APP_BACKEND_API_URL);
      socket.current.emit('join-room', { groupId: selectedUser.groupId });

      socket.current.on('receive-message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Fetch the initial group messages
      const fetchGroupMessages = async () => {
        try {
          // Replace this with the actual function to fetch group messages
          const response = await getGroupMessage (selectedUser.groupId);
          setMessages(response);
          console.log('grp messssssssss',response);
          
        } catch (error) {
          console.error('Error fetching group messages:', error);
        }
      };

      fetchGroupMessages();

    } else {
      // Private Chat
      const fetchPrivateMessages = async () => {
        try {
          const response = await getMessage(loginUser, selectedUser._id);
          setMessages(response);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchPrivateMessages();

      // Private message socket connection
      socket.current = io(process.env.REACT_APP_BACKEND_API_URL);
      const roomId = [loginUser, selectedUser._id].sort().join('-');
      socket.current.emit('join-room', { userId: loginUser, chatPartnerId: selectedUser._id });

      socket.current.on('receive-message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [selectedUser]);

  const sendMessage = async () => {
    if (newMessage.trim() === '' && !file) return;

    let formData = new FormData();
    formData.append('senderId', loginUser);
    if (selectedUser.groupId) {
      // If it's a group message
      formData.append('groupId', selectedUser.groupId);
    } else {
      // If it's a private message
      formData.append('receiverId', selectedUser._id);
    }
    formData.append('content', newMessage);
    if (file) formData.append('files', file);

    try {
      const messageData = selectedUser.groupId
        ? await SendGroupMessage (formData)
        : await privateMessage(formData);

      socket.current.emit('send-message', {
        roomId: selectedUser.groupId || [loginUser, selectedUser._id].sort().join('-'),
        message: messageData,
      });

      setNewMessage('');
      setFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
      {/* <img
        src={selectedUser.mediaUrls?.[0] || 'https://static.vecteezy.com/system/resources/previews/020/765/399/original/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'} // Use user's image or default
        alt= 'profile'
        className="profile-image_chat"
      /> */}
        <h3>{selectedUser ? selectedUser.groupName || selectedUser.userName : 'Select a user or group'}</h3>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender === loginUser ? 'sent' : 'received'}`}>
            <div className="message-bubble">
            <div className="sender-name">{message.sender.userName}</div>
              <p>{message.content}</p>
              {message.mediaUrls?.map((url, idx) => (
                url.includes('video') ? (
                  <video key={idx} src={url} controls className="media" />
                ) : (
                  <img key={idx} src={url} alt="media" className="media" />
                )
              ))}
              <small className="timestamp">{new Date(message.createdAt).toLocaleTimeString()}</small>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;
