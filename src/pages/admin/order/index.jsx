import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, message, Spin, Modal, Table, Button, Switch } from 'antd';
import { MoreOutlined, FileTextOutlined, EditOutlined, CheckCircleOutlined, SoundOutlined } from '@ant-design/icons';
import { callFetchOrders, callFetchOrderDetails, callUpdateOrderStatus } from '../../../services/api';
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import './order.scss';
const ManageOrderPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const isSoundEnabledRef = useRef(true);

  const handleToggleSound = (checked) => {
    setIsSoundEnabled(checked);
    isSoundEnabledRef.current = checked;
    if (checked) {
      // Play a short sound to test and request interaction permission
      new Audio('/notification.mp3').play().catch(e => console.log("Audio play blocked", e));
    }
  };

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  // WebSocket connection for admin order updates
  useEffect(() => {
    const token = window.localStorage.getItem("access_token") || "";
    const socketUrl = import.meta.env.VITE_BACKEND_URL + "/ws" + (token ? `?token=${token}&access_token=${token}` : "");

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to WebSocket for admin orders");
        stompClient.subscribe('/topic/admin/orders', (msg) => {
          console.log("Admin orders websocket message:", msg);
          if (msg.body) {
            try {
              const data = JSON.parse(msg.body);
              if (data.status === "PAID" || data.paymentStatus === "PAID" || data.message) {
                message.info(`Có cập nhật đơn hàng mới!`);
                if (isSoundEnabledRef.current) {
                  const audio = new Audio('/notification.mp3');
                  audio.play().catch(e => console.log("Audio play blocked", e));
                }
                fetchOrders();
              } else {
                fetchOrders();
              }
            } catch (error) {
              fetchOrders();
            }
          } else {
            fetchOrders();
          }
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await callFetchOrders();
      if (res && res.data) {
        // If custom interceptor returns payload, res.data is the actual array
        const orderData = Array.isArray(res.data) ? res.data : (res.data.data || res.data);
        // Get orders is peding
        const activeOrders = orderData.filter(
          order => order.status !== 'CONFIRMED' && order.status !== 'CANCELLED'
        );
        const mappedTables = activeOrders.map(order => ({
          id: order.orderId,
          tableNo: `Bàn ${order.tableId < 10 ? '0' + order.tableId : order.tableId}`,
          status: order.status,
          orderTime: formatTime(order.orderDate),
          total: order.totalPrice,
          paymentStatus: order.paymentStatus
        }));
        setTables(mappedTables);
      } else {
        message.error("Không thể lấy danh sách đơn hàng");
      }
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi lấy danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (orderId) => {
    setIsModalOpen(true);
    setLoadingDetails(true);
    try {
      const res = await callFetchOrderDetails(orderId);
      console.log("res", res)
      if (res && res.data) {
        setSelectedOrder(res.data);
      } else {
        message.error("Không thể lấy chi tiết đơn hàng");
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi lấy chi tiết đơn hàng");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedOrder) return;
    try {
      const res = await callUpdateOrderStatus(selectedOrder.orderId, status);
      if (res && res.data) {
        message.success(`Cập nhật trạng thái thành công`);
        setIsModalOpen(false);
        fetchOrders(); // refresh the list
      } else {
        message.error(`Không thể cập nhật trạng thái đơn hàng`);
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi cập nhật trạng thái đơn hàng");
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE': return 'Có sẵn';
      case 'ORDERING': return 'Đang gọi món';
      case 'PENDING': return 'Chờ xử lý';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'PREPARING': return 'Đang chuẩn bị';
      case 'READY': return 'Đã xong';
      case 'OCCUPIED': return 'Đang dùng';
      case 'PAID': return 'Đã thanh toán';
      case 'CANCELLED': return 'Đã hủy';
      default: return status || 'Không rõ';
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE': return 'status-available';
      case 'ORDERING': return 'status-ordering';
      case 'PENDING': return 'status-preparing'; // using preparing color for pending
      case 'CONFIRMED': return 'status-ready';
      case 'PREPARING': return 'status-preparing';
      case 'READY': return 'status-ready';
      case 'OCCUPIED': return 'status-occupied';
      case 'PAID': return 'status-paid';
      case 'CANCELLED': return 'status-occupied'; // using red for cancelled
      default: return 'status-available';
    }
  };

  const getActionMenu = (table) => {
    const items = [
      { key: '1', icon: <FileTextOutlined />, label: 'Xem đơn hàng' },
      { key: '2', icon: <EditOutlined />, label: 'Sửa đơn hàng' },
      { key: '3', icon: <CheckCircleOutlined />, label: 'Hoàn tất TT' },
    ];
    return { items };
  };

  return (
    <div className="manage-order-page">
      <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Quản lý đơn hàng</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SoundOutlined style={{ fontSize: '18px', color: isSoundEnabled ? '#1890ff' : '#999' }} />
          <Switch 
             checked={isSoundEnabled} 
             onChange={handleToggleSound} 
             checkedChildren="Bật âm báo" 
             unCheckedChildren="Tắt âm báo"
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <div className="tables-grid">
          {tables.map(table => (
            <div
              key={table.id}
              className="table-card"
              style={{ cursor: 'pointer' }}
              onClick={() => handleCardClick(table.id)}
            >
              <div className="card-header">
                <div className="table-info">
                  <h3>{table.tableNo}</h3>
                  <div className={`status-badge ${getStatusClass(table.status)}`}>
                    <span className="dot"></span>
                    {getStatusLabel(table.status)}
                  </div>
                </div>
                <Dropdown
                  menu={getActionMenu(table)}
                  trigger={['click']}
                  placement="bottomRight"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="action-menu">
                    <MoreOutlined />
                  </div>
                </Dropdown>
              </div>

              <div className="card-body">

                <div className="info-row">
                  <span className="label">Giờ đặt:</span>
                  <span className="value">{table.orderTime}</span>
                </div>
                <div className="total-amount">
                  <div className="info-row">
                    <span className="label">Tổng:</span>
                    <span className="amount-value">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(table.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      <Modal
        title={selectedOrder ? `Chi tiết đơn hàng - Bàn ${selectedOrder.tableId}` : 'Chi tiết đơn hàng'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" danger onClick={() => handleUpdateStatus('CANCELLED')}>
            Hủy đơn
          </Button>,
          <Button key="confirm" type="primary" onClick={() => handleUpdateStatus('CONFIRMED')}>
            Xác nhận
          </Button>,
        ]}
        width={700}
      >
        {loadingDetails ? (
          <div style={{ textAlign: 'center', padding: '30px' }}><Spin /></div>
        ) : selectedOrder ? (
          <div>
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p><strong>Mã đơn:</strong> #{selectedOrder.orderId}</p>
                <p><strong>Trạng thái:</strong> <span className={`status-badge ${getStatusClass(selectedOrder.status)}`} style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid currentColor', fontSize: '12px' }}>{getStatusLabel(selectedOrder.status)}</span></p>
                <p><strong>TT Thanh toán:</strong> {selectedOrder.paymentStatus}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '14px', marginBottom: 4 }}><strong>Tổng cộng:</strong></p>
                <p style={{ fontSize: '24px', color: '#10b981', fontWeight: 'bold', margin: 0 }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.totalPrice)}
                </p>
              </div>
            </div>

            <Table
              dataSource={selectedOrder.items || []}
              rowKey="productId"
              pagination={false}
              bordered
              columns={[
                { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName' },
                { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', align: 'center' },
                { title: 'Đơn giá', dataIndex: 'price', key: 'price', align: 'right', render: (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price) },
                { title: 'Tổng', key: 'total', align: 'right', render: (_, record) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.price * record.quantity) },
              ]}
            />
          </div>
        ) : (
          <p>Không có chi tiết.</p>
        )}
      </Modal>
    </div>
  );
};

export default ManageOrderPage;
