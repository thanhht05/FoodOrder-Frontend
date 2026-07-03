import React, { useState, useRef, useEffect } from "react";
import { Input, Button } from "antd";
import { MessageOutlined, CloseOutlined, SendOutlined } from "@ant-design/icons";
import "./chat.scss";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "agent",
      text: "Xin chào! Cảm ơn bạn đã ghé thăm. Tôi có thể giúp gì cho bạn hôm nay? (VD: Hỗ trợ thanh toán, Kiểm tra đơn hàng...)",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      sender: "user",
      text: inputValue,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    // Mock API delay for response
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "agent",
          text: "Cảm ơn bạn đã liên hệ. Nhân viên hỗ trợ của chúng tôi sẽ phản hồi lại ngay trong giây lát!",
        },
      ]);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-widget-container">
      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? "open" : ""}`}>
        <div className="chat-header">
          <div className="header-title">
            <span className="status-indicator"></span>
            Hỗ Trợ Trực Tuyến
          </div>
          <CloseOutlined className="close-btn" onClick={() => setIsOpen(false)} />
        </div>

        <div className="chat-body">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="typing-indicator">
              Nhân viên đang gõ...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-footer">
          <div className="input-wrapper">
            <Input
              placeholder="Nhập tin nhắn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              bordered={false}
              className="chat-input"
            />
            <button className="send-btn" onClick={handleSend}>
              <SendOutlined />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div
        className="chat-fab"
        onClick={() => setIsOpen(!isOpen)}
        title="Trò chuyện với chúng tôi"
      >
        {isOpen ? <CloseOutlined /> : <MessageOutlined />}
      </div>
    </div>
  );
};

export default ChatWidget;
