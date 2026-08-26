import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const { productId, otherUserId } = useParams();
  const { user } = useAuth() || {};
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const loadMessages = async () => {
    try {
      const { data } = await api.get(`/chat/${productId}/${otherUserId}`);
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000); // poll every 3s
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, otherUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post('/chat', { productId, receiverId: otherUserId, text });
      setText('');
      loadMessages();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="page"><p>Loading chat...</p></div>;

  return (
    <div className="page">
      <h1>Chat</h1>
      <div className="chat-box">
        {messages.length === 0 ? (
          <p>No messages yet. Say hello!</p>
        ) : (
          messages.map((m) => (
            <div key={m._id} className={`chat-bubble ${m.sender === user?.id ? 'sent' : 'received'}`}>
              {m.text}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="chat-input-form">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;