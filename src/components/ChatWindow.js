import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './ChatWindow.css';
import { privateMessage, getMessage } from '../api/chatAPI';
import { getGroupMessage, SendGroupMessage, getMembers } from '../api/groupAPI';
import GroupsIcon from '@mui/icons-material/Groups';

function ChatWindow({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [files, setFiles] = useState([]); // Updated to store multiple files
  const socket = useRef(null);
  const loginUser = localStorage.getItem('ids');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [grpMembers, setGrpMembers] = useState([]);
  const [displayMembers, setDisplayMembers] = useState(false);
  const [displayIcon, setDisplayIcon] = useState(false);

  useEffect(() => {
    if (!selectedUser) return;

    if (selectedUser.groupId) {
      setDisplayIcon(true);

      // Initialize socket connection for group chat
      socket.current = io(process.env.REACT_APP_BACKEND_API_URL);
      socket.current.emit('join-room', { groupId: selectedUser.groupId });

      // Real-time message listener
      socket.current.on('receive-message', async (message) => {
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
          setGrpMembers(response.members || []);
        } catch (error) {
          console.error('Error fetching group members:', error);
        }
      };

      fetchGroupMessages();
      fetchGroupMembers();
    } else {
      setDisplayIcon(false);
      setGrpMembers([]);

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files)); // Store multiple files in state
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' && files.length === 0) return;

    setIsLoading(true);

    let formData = new FormData();
    formData.append('senderId', loginUser);
    if (selectedUser.groupId) {
      formData.append('groupId', selectedUser.groupId);
    } else {
      formData.append('receiverId', selectedUser._id);
    }
    formData.append('content', newMessage);

    // Append all files to FormData
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const messageData = selectedUser.groupId
        ? await SendGroupMessage(formData)
        : await privateMessage(formData);

      socket.current.emit('send-message', {
        roomId: selectedUser.groupId || [loginUser, selectedUser._id].sort().join('-'),
        message: messageData,
      });

      setNewMessage('');
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
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
          {displayIcon && <GroupsIcon onClick={() => setDisplayMembers(!displayMembers)} />}
          {displayMembers &&
            grpMembers.map((member) => <li className="members" key={member._id}>{member.userName}</li>)}
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={message._id || index}
            className={`message ${message.sender === loginUser ? 'sent' : 'received'}`}
          >
            <div className="message-bubble">
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
        ))}
        <div ref={messagesEndRef} />
      </div>
      {selectedUser && (
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
            onChange={handleFileChange}
            multiple // Allow multiple files
            disabled={isLoading}
          />
          <button onClick={sendMessage} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
