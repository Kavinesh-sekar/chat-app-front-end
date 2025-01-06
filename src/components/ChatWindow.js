// import React, { useState, useEffect, useRef } from 'react';
// import { io } from 'socket.io-client';
// import './ChatWindow.css';
// import { privateMessage ,getMessage} from '../api/chatAPI'; // Import the privateMessage function

// function ChatWindow({ selectedUser }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [file, setFile] = useState(null); // For handling file uploads
//   const socket = useRef(null);

//   const loginuser = localStorage.getItem('ids');

//   console.log('selectedUser',selectedUser);
  

//   useEffect(() => {
//     if (!selectedUser) return;


//     const fetchMessages = async () => {
//         debugger
//         if (!selectedUser) return;
    
//         try {
//           const response = await getMessage(loginuser,selectedUser._id);

//           console.log('rrrrrrrrrrrrrrrrrrrr',response);
          
    
//         //   if (!response.ok) {
//         //     throw new Error('Failed to fetch messages');
//         //   }
    
//         //   const data = await response.json();
//         console.log('eeeeeeeeeeeeeee',response.content);
        
//           setMessages(response.content); // Set messages in state
//         } catch (error) {
//             console.log('eeeeeee',error);
            
//           console.error('Error fetching messages:', error);
//         }
//       };
    
//       fetchMessages();
//     // Connect to Socket.IO server
//     socket.current = io(process.env.REACT_APP_API_URL);
//     socket.current.emit('join-room', { userId: loginuser, chatPartnerId: selectedUser._id });

//     socket.current.on('receive-message', (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     return () => {
//       socket.current.disconnect();
//     };
//   }, [selectedUser]);

//   const sendMessage = async () => {
//     debugger
//     if (newMessage.trim() === '' && !file) return;

//     console.log('ioioio');
    

//     let  formData = new FormData();
//     formData.append('senderId', loginuser);
//     formData.append('receiverId', selectedUser._id);
//     formData.append('content', newMessage);
//     if (file) formData.append('files', file);

//     // console.log('FormData contents:',formData.entries);
//     for (let [key, value] of formData.entries()) {
//       console.log(`${key}:`, value);
//     }
//     try {


//         console.log('formdaaaaaaaaaa',formData);
        
//       // Send message using the privateMessage function
//       const data = await privateMessage(formData);

//       // Emit the message in real-time using Socket.IO
//       socket.current.emit('send-message', {
//         roomId: [loginuser, selectedUser._id].sort().join('-'),
//         message: data,
//       });

//       // Update UI
//       setMessages((prev) => [...prev, data]);
//       setNewMessage('');
//       setFile(null); // Clear file input
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   console.log('whole message',messages);
  

//   return (
//     <div className="chat-window">
//       <div className="chat-header">
//         <h3>{selectedUser ? selectedUser.userName : 'Select a user or group'}</h3>
//       </div>
//       <div className="chat-messages">
//         {messages.map((message, index) => (
//           <div key={index} className={`message ${message.sender === loginuser ? 'sent' : 'received'}`}>
//             <p>{message.content}</p>
//             {message.mediaUrls?.map((url, idx) => (
//               url.includes('video') ? (
//                 <video key={idx} src={url} controls className="media" />
//               ) : (
//                 <img key={idx} src={url} alt="media" className="media" />
//               )
//             ))}
//             <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
//           </div>
//         ))}
//       </div>
//       <div className="chat-input">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message"
//         />
//         <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }

// export default ChatWindow;
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './ChatWindow.css';
import { privateMessage, getMessage } from '../api/chatAPI'; // Import the privateMessage function

function ChatWindow({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null); // For handling file uploads
  const socket = useRef(null);

  const loginuser = localStorage.getItem('ids'); // Get the logged-in user ID

  useEffect(() => {
    if (!selectedUser) return;
  
    const fetchMessages = async () => {
      try {
        const response = await getMessage(loginuser, selectedUser._id);
        setMessages(response);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  
    fetchMessages();
  
    // Initialize socket connection
    socket.current = io(process.env.REACT_APP_BACKEND_API_URL);
  
    const roomId = [loginuser, selectedUser._id].sort().join('-');
    socket.current.emit('join-room', {
        userId: loginuser, 
        chatPartnerId: selectedUser._id,
      });
    console.log('Connected to room:', roomId);
  
    socket.current.on('connect', () => {
      console.log('Socket connected:', socket.current.id);
    });
  
    socket.current.on('receive-message', (message) => {
      console.log('Message received:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  
    socket.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  
    // return () => {
    //   socket.current.disconnect();
    //   console.log('Socket disconnected cleanly');
    // };
  }, [selectedUser]);
  


const sendMessage = async () => {
    if (newMessage.trim() === '' && !file) return;

    console.log('tttttttttttttttt',newMessage);
    
  
    let formData = new FormData();
    formData.append('senderId', loginuser);
    formData.append('receiverId', selectedUser._id);
    formData.append('content',  newMessage);
    if (file) formData.append('files', file);
  
    try {
      // Send message using the privateMessage function
      const data = await privateMessage(formData);
  
      // Emit the message in real-time using Socket.IO
      socket.current.emit('send-message', {
        roomId: [loginuser, selectedUser._id].sort().join('-'),
        message: data,
      });
  
      // Clear input fields
      setNewMessage('');
      setFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>{selectedUser ? selectedUser.userName : 'Select a user or group'}</h3>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender === loginuser ? 'sent' : 'received'}`}>
            <div className="message-bubble">
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
