import React, { useState, useEffect } from 'react';
import { message, Spin, Drawer, Table, Button } from 'antd';
import { callFetchOrders, callFetchOrderDetails } from '../../../services/api';
import './order.scss';
import { useTranslation } from '../../../i18n';

const OrderCancelPage = () => {
  const { t } = useTranslation();
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
      const res = await callFetchOrders("?status=CANCELLED");
      if (res && res.data) {
        const orderData = Array.isArray(res.data) ? res.data : (res.data.data || res.data);
        const mappedTables = orderData.map(order => ({
          id: order.orderId,
          customer: order.user ? order.user.fullName : t('admin.order.tablePrefix', { id: order.tableId < 10 ? '0' + order.tableId : order.tableId }),
          status: order.status,
          orderTime: formatTime(order.orderDate),
          date: formatDate(order.orderDate),
          total: order.totalPrice,
          paymentStatus: order.paymentStatus
        }));
        setTables(mappedTables);
      } else {
        message.error(t("admin.order.fetchOrdersError"));
      }
    } catch (error) {
      console.error(error);
      message.error(t("admin.order.fetchOrdersError"));
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
        message.error(t("admin.order.fetchOrderDetailsError"));
      }
    } catch (error) {
      console.error(error);
      message.error(t("admin.order.fetchOrderDetailsError"));
    } finally {
      setLoadingDetails(false);
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

  const getStatusLabel = (status) => t('admin.order.tabCancelled');
  const getStatusClass = (status) => 'status-occupied'; // Red style for cancelled

  const columns = [
    {
      title: t('admin.order.colOrderId'),
      dataIndex: 'id',
      key: 'id',
      render: (text) => <strong>#{text}</strong>,
    },
    {
      title: t('admin.order.colCustomer'),
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: t('admin.order.colCreatedAt'),
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: t('admin.order.colTotalPrice'),
      dataIndex: 'total',
      key: 'total',
      render: (total) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total),
    },
    {
      title: t('admin.order.colOrderStatus'),
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
      title: t('admin.order.colActions'),
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleCardClick(record.id)}>{t('admin.order.detailBtn')}</Button>
      ),
    },
  ];

  return (
    <div className="manage-order-page">
      <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>{t('admin.order.cancelledOrdersTitle')}</h2>
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
        title={selectedOrder ? t('admin.order.modalDetailTitle', { id: selectedOrder.orderId }) : t('admin.order.detailBtn')}
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={500}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsDrawerOpen(false)}>{t('common.close')}</Button>
          </div>
        }
      >
        {loadingDetails ? (
          <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
        ) : selectedOrder ? (
          <div className="order-drawer-content">
            <div className="drawer-status">
              <div className="status-title">{t('common.status')}</div>
              <div className={`status-badge ${getStatusClass(selectedOrder.status)}`} style={{ padding: '4px 10px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', fontSize: '13px', fontWeight: 600, border: '1px solid currentColor' }}>
                <span className="dot" style={{ width: '8px', height: '8px', borderRadius: '50%', marginRight: '6px', background: 'currentColor' }}></span>
                {getStatusLabel(selectedOrder.status)}
              </div>
              
              <div className="timeline-container">
                <div className={`timeline-step cancelled`}>
                  🟡 {t('admin.order.tabPending')}
                </div>
                <div className={`timeline-step cancelled`}>
                  🔴 {t('admin.order.tabCancelled')}
                </div>
              </div>
            </div>

            <div className="info-section">
              <div className="info-block">
                <div className="info-title">{t('admin.order.colCustomer')}</div>
                <div className="info-content">
                  {selectedOrder.user ? selectedOrder.user.fullName : t('admin.order.tablePrefix', { id: selectedOrder.tableId })}
                  {selectedOrder.user?.phone && <div>📞 {selectedOrder.user.phone}</div>}
                </div>
              </div>
              <div className="info-block">
                <div className="info-title">{t('orderHistory.recipientInfoTitle')}</div>
                <div className="info-content">
                  {selectedOrder.user?.address || t('admin.order.dineIn')}
                </div>
              </div>
              <div className="info-block">
                <div className="info-title">{t('admin.order.colPayment')}</div>
                <div className="info-content">
                  {selectedOrder.paymentStatus}
                </div>
              </div>
            </div>

            <div className="products-section">
              <div className="products-title">{t('admin.order.colProduct')}</div>
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
                <span>{t('admin.order.subtotalLabel')}</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.totalPrice)}</span>
              </div>
              <div className="summary-row total">
                <span>{t('admin.order.totalLabel')}</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.totalPrice)}</span>
              </div>
            </div>
          </div>
        ) : (
          <p>{t('admin.order.noDetails')}</p>
        )}
      </Drawer>
    </div>
  );
};

export default OrderCancelPage;
