import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';
import botAvatar from '../../assets/chatbot.webp'; 
import userAvatar from '../../assets/userimg.png';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/ask', {
        question: input
      });      
      
      const botMessage = { 
        text: response.data.answer, 
        isUser: false 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { 
        text: "Sorry, I couldn't process your request. Please try again later.", 
        isUser: false 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat">
      <div className="chat-header">
        <h2>Capillary Tech Documentation ChatBot</h2>
        <p>Ask questions about our APIs and documentation</p>
      </div>

      <div className="messages-container">
        <div className="messages">
          {messages.length === 0 && (
            <div className="welcome-message">
              <div className="avatar">
                <img src={botAvatar} alt="Bot" />
              </div>
              <p>How can I help you with Capillary's documentation today?</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}
            >
              <div className="avatar">
                <img 
                  src={msg.isUser ? userAvatar : botAvatar} 
                  alt={msg.isUser ? "User" : "Bot"} 
                />
              </div>
              <div className="message-content">
                {msg.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message bot-message">
              <div className="avatar">
                <img src={botAvatar} alt="Bot" />
              </div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about Capillary docs..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="send-button"
        >
          Send
        </button>
      </div>
    </div>
  );
}