import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './ChatWindow.css';
import { privateMessage, getMessage } from '../api/chatAPI';
import { getGroupMessage, SendGroupMessage,getMembers } from '../api/groupAPI';
import GroupsIcon from '@mui/icons-material/Groups';

function ChatWindow({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const socket = useRef(null);
  const loginUser = localStorage.getItem('ids');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [grpMembers ,setGrpMembers] = useState([]);
  const [displayMemebers,setDisplayMembers] = useState(false);
  const [dispalyIcon ,setDisplayIcon] = useState(false);
  

  useEffect(() => {
    if (!selectedUser) return;

    if (selectedUser.groupId) {
      setDisplayIcon(true);
      // Group Chat Logic
      socket.current = io(process.env.REACT_APP_BACKEND_API_URL);
      socket.current.emit('join-room', { groupId: selectedUser.groupId });

      socket.current.on('receive-message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      const fetchGroupMessages = async () => {
        try {
          const response = await getGroupMessage(selectedUser.groupId);
          setMessages(response);
        } catch (error) {
          console.error('Error fetching group messages:', error);
        }
      };

      const fetchGroupMembers = async () => {
        try {
          const response = await getMembers(selectedUser.groupId);
          console.log('resssssssssss',response);
          console.log('resssssssssss mmrmrmrmm',response.members);

          setGrpMembers(response.members);
          console.log('members',grpMembers);
          
          
                    // setMessages(response);
        } catch (error) {
          console.error('Error fetching group messages:', error);
        }
      };

      fetchGroupMessages();
      fetchGroupMembers();
    } else {
      setDisplayIcon(false);
      // Private Chat Logic
      const fetchPrivateMessages = async () => {
        try {
          const response = await getMessage(loginUser, selectedUser._id);
          setMessages(response);
        } catch (error) {
          console.error('Error fetching private messages:', error);
        }
      };

      fetchPrivateMessages();

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

  console.log('ooooo',grpMembers);
  

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim() === '' && !file) return;

    setIsLoading(true);

    let formData = new FormData();
    formData.append('senderId', loginUser);
    if (selectedUser.groupId) {
      formData.append('groupId', selectedUser.groupId);
    } else {
      formData.append('receiverId', selectedUser._id);
    }
    formData.append('content', newMessage);
    if (file) formData.append('files', file);

    try {
      const messageData = selectedUser.groupId
        ? await SendGroupMessage(formData)
        : await privateMessage(formData);

      socket.current.emit('send-message', {
        roomId: selectedUser.groupId || [loginUser, selectedUser._id].sort().join('-'),
        message: messageData,
      });

      setNewMessage('');
      setFile('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isSentByLoggedInUser = (message) => {
    const isGroupChat = !!selectedUser.groupId;
    return isGroupChat
      ? message.sender._id === loginUser
      : message.sender === loginUser;
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-pro">
          <img
            src={selectedUser?.mediaUrls || 'https://static.vecteezy.com/system/resources/previews/020/765/399/original/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'}
            alt="profile"
            className="profile-image_chat"
          />
          <div>
            <h3>{selectedUser ? selectedUser.groupName || selectedUser.userName : 'Select a user or group'}</h3>
          </div>
            {dispalyIcon?  <GroupsIcon onClick = {() => setDisplayMembers(!displayMemebers)} /> : null}
            {/* <ul> */}
                {
             
              displayMemebers ? 
              grpMembers.map((members)=>(
                <li className='members'>{members.userName}</li>
              )):
              null
            }
            {/* </ul> */}
            
          
        </div>
      </div>
      <div className="chat-messages">
        {messages?.map((message, index) => {
          const isGroupChat = !!selectedUser.groupId;
          const isSentByLoggedInUser = isGroupChat
            ? message.sender._id === loginUser
            : message.sender === loginUser;

          return (
            <div
              key={message._id || index}
              className={`message ${isSentByLoggedInUser ? 'sent' : 'received'}`}
            >
              <div className="message-bubble">
                {isGroupChat && (
                  <div className="sender-name">{message.sender?.userName || 'Unknown'}</div>
                )}
                <p>{message.content}</p>
                {message.mediaUrls?.map((url, idx) => (
                  url.includes('video') ? (
                    <video key={idx} src={url} controls className="media" />
                  ) : (
                    <img key={idx} src={url} alt="media" className="media" />
                  )
                ))}
                <small className="timestamp">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </small>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])}
          disabled={isLoading}
        />
        <button onClick={sendMessage}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
