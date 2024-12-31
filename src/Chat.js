import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to the server

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Listen for messages from the server
        const handleMessage = (data) => {
            console.log('Received message:', data);  // For debugging
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        socket.on('message', handleMessage);  // Set up the listener

        // Cleanup function to remove the listener when the component unmounts
        return () => {
            socket.off('message', handleMessage);  // Remove the listener
        };
    }, []);  //

    const sendMessage = () => {
        if (message.trim()) {
            console.log('Sending message:', message); // Debug log
            socket.emit('message', message); // Send a message to the server
            setMessage(''); // Clear the input field
        }
    };

    return (
        <div>
            <h1>Chat Room</h1>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
