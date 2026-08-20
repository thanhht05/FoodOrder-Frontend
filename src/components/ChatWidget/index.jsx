import { useState, useRef, useEffect } from "react";
import { Input, message, Button } from "antd";
import {
  MessageOutlined,
  CloseOutlined,
  SendOutlined,
  ExpandAltOutlined,
  ShrinkOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { callChatAI, callCreateConversation, callFetchAdminMessages, callMarkMessagesAsRead } from "../../services/api";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./chat.scss";

// Simple markdown formatter to handle **bold** text
const formatText = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("ai"); // 'ai' or 'admin'
  const [inputValue, setInputValue] = useState("");

  // AI Chat State
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      sender: "agent",
      text: "Xin chào! Cảm ơn bạn đã ghé thăm. Tôi có thể giúp gì cho bạn hôm nay? (VD: Hỗ trợ thanh toán, Kiểm tra đơn hàng...)",
    },
  ]);
  const [isTypingAI, setIsTypingAI] = useState(false);

  // Admin Chat State
  const [adminMessages, setAdminMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [conversationStatus, setConversationStatus] = useState("OPEN");
  const stompClientRef = useRef(null);

  const messagesEndRef = useRef(null);
  const widgetRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, adminMessages, isTypingAI, activeTab]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        widgetRef.current &&
        !widgetRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const initAdminChat = async () => {
    const token = window.localStorage.getItem("access_token") || "";
    if (!token) return;

    try {
      debugger
      const res = await callCreateConversation();
      if (res?.data?.id) {
        const convId = res.data.id;
        setConversationId(convId);
        setConversationStatus(res.data.status || "OPEN");

        // Fetch history
        const historyRes = await callFetchAdminMessages(convId);
        if (historyRes?.data) {
          const mappedHistory = historyRes.data.map(msg => ({
            id: msg.id,
            sender: msg.senderId === res.data.userId ? "user" : "agent",
            text: msg.content,
            isRead: msg.isRead || msg.read || false
          }));
          setAdminMessages(mappedHistory);

          // Mark as read after fetching history
          callMarkMessagesAsRead(convId).catch(console.error);
        }

        // Clean old subscription if exists
        if (stompClientRef.current) {
          stompClientRef.current.deactivate();
        }

        // Connect to WebSocket
        const socketUrl = import.meta.env.VITE_BACKEND_URL + "/ws";

        const stompClient = new Client({
          webSocketFactory: () => new SockJS(socketUrl),
          connectHeaders: {
            Authorization: `Bearer ${token}`
          },
          reconnectDelay: 5000,
          onConnect: () => {
            console.log("Connected to Admin Chat WebSocket");
            stompClient.subscribe(`/topic/chat/${convId}`, (msg) => {
              if (msg.body) {
                const data = JSON.parse(msg.body);
                debugger

                if (data.content === "SYSTEM_CONVERSATION_CLOSED") {
                  setConversationStatus("CLOSED");
                  message.info("Admin đã kết thúc cuộc trò chuyện.");
                  return;
                }

                const senderRole = data.senderId === res.data.userId ? "user" : "agent";
                setAdminMessages((prev) => {
                  if (prev.find(m => m.id === data.id)) return prev;
                  return [...prev, {
                    id: data.id,
                    sender: senderRole,
                    text: data.content,
                    isRead: data.isRead || false
                  }];
                });

                if (senderRole === "agent") {
                  callMarkMessagesAsRead(convId).catch(console.error);
                }
              }
            });

            stompClient.subscribe(`/topic/conversations/${convId}/read`, (msg) => {
              setAdminMessages(prev => prev.map(m => ({ ...m, isRead: true })));
            });
          },
        });
        stompClient.activate();
        stompClientRef.current = stompClient;
      }
    } catch (error) {
      console.error("Failed to initialize admin chat", error);
    }
  };

  // STOMP WebSocket Connection for Admin Chat
  useEffect(() => {
    const token = window.localStorage.getItem("access_token") || "";
    // Only init if we are on admin tab, open, and logged in
    if (isOpen && activeTab === "admin" && token) {
      if (!conversationId) {
        initAdminChat();
      }
    } else if (isOpen && activeTab === "admin" && !token) {
      message.warning("Vui lòng đăng nhập để chat với Admin");
      setActiveTab("ai");
    }

    return () => {
      // Cleanup happens when modal closes or switching out of admin (optional: we can keep connection alive, but closing on tab switch saves resources)
      if (!isOpen && stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
        setConversationId(null);
      }
    };
  }, [isOpen, activeTab]);

  const startNewAdminChat = () => {
    setAdminMessages([]);
    initAdminChat();
  };

  const handleSendAI = async (userText) => {
    setAiMessages((prev) => [...prev, { id: Date.now(), sender: "user", text: userText }]);
    setIsTypingAI(true);
    try {
      const res = await callChatAI(userText);
      const aiData = res?.data;
      if (aiData) {
        setAiMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "agent",
            text: aiData.message,
            products: aiData.products || [],
          },
        ]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      setAiMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "agent",
          text: "Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
        },
      ]);
    } finally {
      setIsTypingAI(false);
    }
  };

  const handleSendAdmin = (userText) => {
    if (!conversationId || !stompClientRef.current || !stompClientRef.current.connected) {
      message.error("Đang kết nối đến Admin, vui lòng thử lại sau.");
      return;
    }

    stompClientRef.current.publish({
      destination: `/app/chat/${conversationId}`,
      body: JSON.stringify({
        conversationId: conversationId,
        content: userText
      })
    });
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue("");

    if (activeTab === "ai") {
      handleSendAI(userText);
    } else {
      handleSendAdmin(userText);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Bỏ toàn bộ dấu tiếng Việt.
  const nonAccentVietnamese = (str) => {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  };

  // dùng để tạo URL đẹp (SEO-friendly URL) từ tên sản phẩm
  const convertSlug = (str) => {
    str = nonAccentVietnamese(str);
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from =
      "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
    const to =
      "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  };

  const handleRedirectBook = (product) => {
    const slug = convertSlug(product.name);
    navigate(`/product/${slug}?id=${product.id}`);
  };

  const currentMessages = activeTab === "ai" ? aiMessages : adminMessages;

  return (
    <div className="chat-widget-container" ref={widgetRef}>
      {/* Chat Window */}
      <div
        className={`chat-window ${isOpen ? "open" : ""} ${isExpanded ? "expanded" : ""}`}
      >
        <div className="chat-header">
          <div className="header-title">
            <span className="status-indicator"></span>
            Hỗ Trợ Trực Tuyến
          </div>
          <div className="header-actions">
            {isExpanded ? (
              <ShrinkOutlined
                className="action-btn"
                onClick={() => setIsExpanded(false)}
                title="Thu nhỏ"
              />
            ) : (
              <ExpandAltOutlined
                className="action-btn"
                onClick={() => setIsExpanded(true)}
                title="Phóng to"
              />
            )}
            <CloseOutlined
              className="action-btn close-btn"
              onClick={() => setIsOpen(false)}
              title="Đóng"
            />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="chat-tabs">
          <div
            className={`chat-tab ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            Chat với AI
          </div>
          <div
            className={`chat-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            Chat với Admin
          </div>
        </div>

        <div className="chat-body">
          {(() => {
            const lastUserMsgId = activeTab === "admin"
              ? [...adminMessages].reverse().find(m => m.sender === "user")?.id
              : null;

            return currentMessages.map((msg) => {
              const isLastUserMsg = msg.id === lastUserMsgId;

              return (
                <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                  <div className={`message ${msg.sender}`}>
                    <div style={{ whiteSpace: "pre-wrap" }}>
                      {formatText(msg.text)}
                    </div>
                  </div>

                  {activeTab === "admin" && msg.sender === "user" && isLastUserMsg && msg.isRead && (
                    <div className="read-receipt" style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '2px', textAlign: 'right', width: '100%', paddingRight: '8px' }}>
                      Đã xem
                    </div>
                  )}

                  {msg.products && msg.products.length > 0 && (
                    <div className="recommended-products">
                      {msg.products.map((p) => (
                        <div
                          key={p.id}
                          className="chat-product-card"
                          onClick={() => handleRedirectBook(p)}
                          title="Xem chi tiết"
                        >
                          <img
                            src={`${import.meta.env.VITE_BACKEND_URL}/upload/${p.img}`}
                            alt={p.name}
                          />
                          <div className="info">
                            <div className="name">{p.name}</div>
                            <div className="price">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(p.price)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            });
          })()}
          {activeTab === "ai" && isTypingAI && <div className="typing-indicator">Đang tìm kiếm...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-footer">
          {activeTab === "admin" && conversationStatus === "CLOSED" ? (
            <div className="closed-conversation-actions" style={{ padding: '12px', textAlign: 'center', width: '100%' }}>
              <Button type="primary" onClick={startNewAdminChat} style={{ width: '100%', borderRadius: '20px' }}>Bắt đầu trò chuyện mới</Button>
            </div>
          ) : (
            <div className="input-wrapper">
              <Input
                placeholder={activeTab === "ai" ? "Hỏi AI..." : "Nhắn tin cho Admin..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                bordered={false}
                className="chat-input"
              />
              <button
                className="send-btn"
                onClick={handleSend}
              >
                <SendOutlined />
              </button>
            </div>
          )}
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
