import React, { useState, useEffect } from 'react';
import { Dropdown, message, Spin, Modal, Table, Button } from 'antd';
import { MoreOutlined, FileTextOutlined } from '@ant-design/icons';
import { callFetchOrders, callFetchOrderDetails } from '../../../services/api';
import './order.scss';

const OrderConfirmPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          tableNo: `Table ${order.tableId < 10 ? '0' + order.tableId : order.tableId}`,
          status: order.status,
          customers: 0,
          orderTime: formatTime(order.orderDate),
          total: order.totalPrice,
          paymentStatus: order.paymentStatus
        }));
        setTables(mappedTables);
      } else {
        message.error("Failed to fetch confirmed orders");
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred while fetching confirmed orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (orderId) => {
    setIsModalOpen(true);
    setLoadingDetails(true);
    try {
      const res = await callFetchOrderDetails(orderId);
      if (res && res.data) {
        setSelectedOrder(res.data);
      } else {
        message.error("Failed to fetch order details");
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching order details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusLabel = (status) => 'Confirmed';
  const getStatusClass = (status) => 'status-ready'; // Using green styling for confirmed

  const getActionMenu = (table) => {
    const items = [
      { key: '1', icon: <FileTextOutlined />, label: 'View Order' },
    ];
    return { items };
  };

  return (
    <div className="manage-order-page">
      <div className="header-actions">
        <h2>Confirmed Orders</h2>
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
                  <span className="label">Customers:</span>
                  <span className="value">{table.customers > 0 ? table.customers : '-'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Order Time:</span>
                  <span className="value">{table.orderTime}</span>
                </div>
                <div className="total-amount">
                  <div className="info-row">
                    <span className="label">Total:</span>
                    <span className="amount-value">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(table.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {tables.length === 0 && <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No confirmed orders found.</p>}
        </div>
      )}

      {/* Order Details Modal */}
      <Modal
        title={selectedOrder ? `Order Details - Table ${selectedOrder.tableId}` : 'Order Details'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {loadingDetails ? (
          <div style={{ textAlign: 'center', padding: '30px' }}><Spin /></div>
        ) : selectedOrder ? (
          <div>
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p><strong>Order ID:</strong> #{selectedOrder.orderId}</p>
                <p><strong>Status:</strong> <span className={`status-badge ${getStatusClass(selectedOrder.status)}`} style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid currentColor', fontSize: '12px' }}>{getStatusLabel(selectedOrder.status)}</span></p>
                <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '14px', marginBottom: 4 }}><strong>Total Price:</strong></p>
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
                { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
                { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', align: 'center' },
                { title: 'Unit Price', dataIndex: 'price', key: 'price', align: 'right', render: (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price) },
                { title: 'Total', key: 'total', align: 'right', render: (_, record) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.price * record.quantity) },
              ]}
            />
          </div>
        ) : (
          <p>No details found.</p>
        )}
      </Modal>
    </div>
  );
};

export default OrderConfirmPage;
