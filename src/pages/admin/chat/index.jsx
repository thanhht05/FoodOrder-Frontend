import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Input, Button, Spin, message, Avatar } from "antd";
import { SendOutlined, UserOutlined, MessageOutlined } from "@ant-design/icons";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { callFetchAllConversations, callFetchAdminMessages, callMarkMessagesAsRead } from "../../../services/api";
import "./chat.scss";

const AdminChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loadingConv, setLoadingConv] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const adminUser = useSelector((state) => state.account.user);

  const stompClientRef = useRef(null);
  const currentSubscriptionRef = useRef(null);
  const readSubscriptionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoadingConv(true);
    try {
      const res = await callFetchAllConversations();
      if (res && res.data) {
        // Assume data is an array of conversations
        const list = Array.isArray(res.data) ? res.data : (res.data.data || res.data);
        // Sort descending by ID or updated At if present
        setConversations(list.sort((a, b) => b.id - a.id));
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi tải danh sách hội thoại");
    } finally {
      setLoadingConv(false);
    }
  };

  // STOMP Connection Init (Single connection)
  useEffect(() => {
    const token = window.localStorage.getItem("access_token") || "";
    if (token) {

      const socketUrl = import.meta.env.VITE_BACKEND_URL + "/ws";

      const stompClient = new Client({
        webSocketFactory: () => new SockJS(socketUrl),
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        reconnectDelay: 5000,
        onConnect: () => {
          console.log("Admin Chat connected to WebSocket");
          stompClientRef.current = stompClient;
          // Sub to active conversation if already selected
          if (activeConversation) {
            subscribeToConversation(activeConversation, stompClient);
          }
        },
        onStompError: (frame) => {
          console.error("Broker reported error: " + frame.headers["message"]);
        }
      });

      stompClient.activate();
      stompClientRef.current = stompClient;

      return () => {
        if (stompClientRef.current) {
          stompClientRef.current.deactivate();
        }
      };
    }
  }, []); // Run once

  // When active conversation changes
  useEffect(() => {
    if (activeConversation) {
      // 1. Fetch History
      loadHistory(activeConversation.id);

      // 2. subscribe realtime - → bắt đầu nghe message mới của conversation;
      if (stompClientRef.current && stompClientRef.current.connected) {
        subscribeToConversation(activeConversation, stompClientRef.current);
      }
    }
  }, [activeConversation]);

  const loadHistory = async (convId) => {
    setLoadingMessages(true);
    try {
      const res = await callFetchAdminMessages(convId);
      if (res && res.data) {
        // Sort messages by createdAt
        const list = Array.isArray(res.data) ? res.data : (res.data.data || res.data);
        setMessages(list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
        
        // Mark as read after fetching history
        callMarkMessagesAsRead(convId).catch(console.error);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi tải lịch sử tin nhắn");
    } finally {
      setLoadingMessages(false);
    }
  };

  const subscribeToConversation = (conversation, client) => {
    // Unsubscribe from previous if exists
    if (currentSubscriptionRef.current) {
      currentSubscriptionRef.current.unsubscribe();
      currentSubscriptionRef.current = null;
    }
    if (readSubscriptionRef.current) {
      readSubscriptionRef.current.unsubscribe();
      readSubscriptionRef.current = null;
    }

    // Subscribe to new messages
    const sub = client.subscribe(`/topic/chat/${conversation.id}`, (msg) => {
      if (msg.body) {
        const data = JSON.parse(msg.body);
        setMessages(prev => {
          if (prev.find(m => m.id === data.id)) return prev;
          return [...prev, data];
        });
        
        // If received message from user, mark as read
        if (data.senderId !== adminUser.id) {
          callMarkMessagesAsRead(conversation.id).catch(console.error);
        }
      }
    });

    // Subscribe to read receipts
    const readSub = client.subscribe(`/topic/conversations/${conversation.id}/read`, (msg) => {
      setMessages(prev => prev.map(m => ({ ...m, isRead: true })));
    });

    currentSubscriptionRef.current = sub;
    readSubscriptionRef.current = readSub;
  };

  const handleSend = () => {
    if (!inputValue.trim() || !activeConversation || !stompClientRef.current || !stompClientRef.current.connected) return;

    const content = inputValue;
    setInputValue("");

    stompClientRef.current.publish({
      destination: `/app/chat/${activeConversation.id}`,
      body: JSON.stringify({
        conversationId: activeConversation.id,
        content: content
      })
    });
  };

  return (
    <div className="admin-chat-container">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3>Hội thoại</h3>
          <Button type="primary" size="small" onClick={fetchConversations}>Làm mới</Button>
        </div>
        <div className="conversation-list">
          {loadingConv ? (
            <div className="loading-center"><Spin /></div>
          ) : conversations.length === 0 ? (
            <div className="empty-list">Chưa có hội thoại</div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`conversation-item ${activeConversation?.id === conv.id ? 'active' : ''}`}
                onClick={() => setActiveConversation(conv)}
              >
                <Avatar icon={<UserOutlined />} className="avatar" />
                <div className="conv-info">
                  <div className="conv-name">Người dùng: #{conv.userId}</div>
                  <div className="conv-meta">
                    Trạng thái: <span className={`status ${conv.status?.toLowerCase() || 'open'}`}>{conv.status || 'OPEN'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-main">
        {activeConversation ? (
          <>
            <div className="chat-header">
              <h3>Đang chat với Người dùng #{activeConversation.userId}</h3>
            </div>

            <div className="chat-messages">
              {loadingMessages ? (
                <div className="loading-center"><Spin /></div>
              ) : messages.length === 0 ? (
                <div className="empty-messages">Bắt đầu trò chuyện...</div>
              ) : (
                (() => {
                  const lastAdminMsgId = [...messages].reverse().find(m => m.senderId === adminUser.id)?.id;
                  
                  return messages.map((msg) => {
                    const isAdmin = msg.senderId === adminUser.id;
                    const isLastAdminMsg = msg.id === lastAdminMsgId;
                    
                    return (
                      <div key={msg.id} className={`message-row ${isAdmin ? 'admin' : 'user'}`}>
                        <div className="message-container" style={{ display: 'flex', flexDirection: 'column', alignItems: isAdmin ? 'flex-end' : 'flex-start' }}>
                          <div className="message-bubble">
                            {msg.content}
                          </div>
                          {isLastAdminMsg && msg.isRead && (
                            <div className="read-receipt" style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '4px', paddingRight: '4px' }}>
                              Đã xem
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={handleSend}
                placeholder="Nhập tin nhắn..."
                bordered={false}
                className="input-field"
              />
              <Button type="primary" shape="circle" icon={<SendOutlined />} onClick={handleSend} className="send-button" />
            </div>
          </>
        ) : (
          <div className="empty-chat">
            <MessageOutlined className="empty-icon" />
            <p>Chọn một cuộc hội thoại để bắt đầu</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatPage;
