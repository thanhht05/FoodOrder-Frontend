import React, { useState, useEffect } from 'react';
import { message, Spin, Drawer, Table, Button } from 'antd';
import { callFetchOrders, callFetchOrderDetails, callUpdateOrderStatus } from '../../../services/api';
import './order.scss';

const OrderConfirmPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await callFetchOrders("?status=CONFIRMED");
      if (res && res.data) {
        const orderData = Array.isArray(res.data) ? res.data : (res.data.data || res.data);
        const mappedTables = orderData.map(order => ({
          id: order.orderId,
          customer: order.user ? order.user.fullName : `Bàn ${order.tableId < 10 ? '0' + order.tableId : order.tableId}`,
          status: order.status,
          orderTime: formatTime(order.orderDate),
          date: formatDate(order.orderDate),
          total: order.totalPrice,
          paymentStatus: order.paymentStatus
        }));
        setTables(mappedTables);
      } else {
        message.error("Không thể lấy danh sách đơn hàng đã xác nhận");
      }
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi lấy danh sách đơn hàng đã xác nhận");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (orderId) => {
    setIsDrawerOpen(true);
    setLoadingDetails(true);
    try {
      const res = await callFetchOrderDetails(orderId);
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
        setIsDrawerOpen(false);
        fetchOrders();
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
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE': return 'Có sẵn';
      case 'ORDERING': return 'Đang gọi món';
      case 'PENDING': return 'Chờ xử lý';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'DELIVERING': return 'Đang giao';
      case 'COMPLETED': return 'Hoàn thành';
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
      case 'PENDING': return 'status-preparing'; 
      case 'CONFIRMED': return 'status-ready';
      case 'DELIVERING': return 'status-preparing';
      case 'COMPLETED': return 'status-available';
      case 'PREPARING': return 'status-preparing';
      case 'READY': return 'status-ready';
      case 'OCCUPIED': return 'status-occupied';
      case 'PAID': return 'status-paid';
      case 'CANCELLED': return 'status-occupied';
      default: return 'status-available';
    }
  };

  const columns = [
    {
      title: 'Order',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <strong>#{text}</strong>,
    },
    {
      title: 'Customer / Table',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <div className={`status-badge ${getStatusClass(status)}`} style={{ padding: '4px 10px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', fontSize: '13px', fontWeight: 600 }}>
          <span className="dot" style={{ width: '8px', height: '8px', borderRadius: '50%', marginRight: '6px' }}></span>
          {getStatusLabel(status)}
        </div>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleCardClick(record.id)}>View</Button>
      ),
    },
  ];

  return (
    <div className="manage-order-page">
      <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Đơn hàng đã xác nhận</h2>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table 
          columns={columns} 
          dataSource={tables} 
          rowKey="id" 
          pagination={{ pageSize: 10 }}
          style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
        />
      )}

      {/* Order Details Drawer */}
      <Drawer
        title={selectedOrder ? `Order #${selectedOrder.orderId}` : 'Chi tiết đơn hàng'}
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={500}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button onClick={() => setIsDrawerOpen(false)}>Đóng</Button>
            {selectedOrder && selectedOrder.status === 'CONFIRMED' && (
              <Button type="primary" onClick={() => handleUpdateStatus('DELIVERING')}>
                Giao hàng
              </Button>
            )}
          </div>
        }
      >
        {loadingDetails ? (
          <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
        ) : selectedOrder ? (
          <div className="order-drawer-content">
            <div className="drawer-status">
              <div className="status-title">Trạng thái</div>
              <div className={`status-badge ${getStatusClass(selectedOrder.status)}`} style={{ padding: '4px 10px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', fontSize: '13px', fontWeight: 600, border: '1px solid currentColor' }}>
                <span className="dot" style={{ width: '8px', height: '8px', borderRadius: '50%', marginRight: '6px', background: 'currentColor' }}></span>
                {getStatusLabel(selectedOrder.status)}
              </div>
              
              <div className="timeline-container">
                <div className={`timeline-step ${['CONFIRMED', 'DELIVERING', 'COMPLETED'].includes(selectedOrder.status) ? 'completed' : selectedOrder.status === 'PENDING' ? 'active' : selectedOrder.status === 'CANCELLED' ? 'cancelled' : ''}`}>
                  🟡 Pending
                </div>
                <div className={`timeline-step ${['DELIVERING', 'COMPLETED'].includes(selectedOrder.status) ? 'completed' : selectedOrder.status === 'CONFIRMED' ? 'active' : ''}`}>
                  🔵 Confirmed
                </div>
                <div className={`timeline-step ${selectedOrder.status === 'COMPLETED' ? 'completed' : selectedOrder.status === 'DELIVERING' ? 'active' : ''}`}>
                  🟣 Delivering
                </div>
                <div className={`timeline-step ${selectedOrder.status === 'COMPLETED' ? 'completed' : ''}`}>
                  🟢 Completed
                </div>
              </div>
            </div>

            <div className="info-section">
              <div className="info-block">
                <div className="info-title">Khách hàng / Bàn</div>
                <div className="info-content">
                  {selectedOrder.user ? selectedOrder.user.fullName : `Bàn ${selectedOrder.tableId}`}
                  {selectedOrder.user?.phone && <div>📞 {selectedOrder.user.phone}</div>}
                </div>
              </div>
              <div className="info-block">
                <div className="info-title">Thông tin giao hàng</div>
                <div className="info-content">
                  {selectedOrder.user?.address || 'Tại quán'}
                </div>
              </div>
              <div className="info-block">
                <div className="info-title">Thanh toán</div>
                <div className="info-content">
                  {selectedOrder.paymentStatus}
                </div>
              </div>
            </div>

            <div className="products-section">
              <div className="products-title">Sản phẩm</div>
              {selectedOrder.items?.map(item => (
                <div className="product-item" key={item.productId}>
                  <div className="product-name">{item.productName}</div>
                  <div className="product-qty">x{item.quantity}</div>
                  <div className="product-price">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-section">
              <div className="summary-row">
                <span>Tổng phụ</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.totalPrice)}</span>
              </div>
              <div className="summary-row total">
                <span>Tổng cộng</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.totalPrice)}</span>
              </div>
            </div>
          </div>
        ) : (
          <p>Không có chi tiết.</p>
        )}
      </Drawer>
    </div>
  );
};

export default OrderConfirmPage;
