import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/get-messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (replyMessage.trim()) {
      try {
        const response = await fetch('/send-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: replyMessage })
        });
        if (response.ok) {
          console.log('Message sent successfully');
          setReplyMessage('');
          fetchMessages();
        } else {
          console.error('Failed to send message');
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div id="messages">
        {messages.map((message, index) => (
          <div key={index}>{message.sender}: {message.text}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} placeholder="Type your message"></textarea>
        <button type="submit">Reply</button>
      </form>
    </div>
  );
}

export default App;
