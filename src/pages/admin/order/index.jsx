import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, message, Spin, Drawer, Table, Button, Switch, Tabs } from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import { callFetchOrders, callFetchOrderDetails, callUpdateOrderStatus } from '../../../services/api';
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import './order.scss';
import { useTranslation } from '../../../i18n';

const { TabPane } = Tabs;

const ManageOrderPage = () => {
  const { t } = useTranslation();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING');

  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const isSoundEnabledRef = useRef(true);

  const handleToggleSound = (checked) => {
    setIsSoundEnabled(checked);
    isSoundEnabledRef.current = checked;
    if (checked) {
      new Audio('/notification.mp3').play().catch(e => console.log("Audio play blocked", e));
    }
  };

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

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
              if (data.status === "PAID" || data.paymentStatus === "PAID" || data.message || data.paymentStatus === "UNPAID") {
                message.info(t("admin.order.newOrderUpdateInfo"));
                if (isSoundEnabledRef.current) {
                  const audio = new Audio('/notification.mp3');
                  audio.play().catch(e => console.log("Audio play blocked", e));
                }
                fetchOrders(activeTab);
              } else {
                fetchOrders(activeTab);
              }
            } catch (error) {
              fetchOrders(activeTab);
            }
          } else {
            fetchOrders(activeTab);
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
  }, [activeTab]);

  const fetchOrders = async (status) => {
    try {
      setLoading(true);
      const res = await callFetchOrders(`?status=${status}`);
      if (res && res.data) {
        const orderData = Array.isArray(res.data) ? res.data : (res.data.data || res.data);



        const mappedTables = orderData.map(order => ({
          id: order.orderId,
          customerName: order.innerUserOrder?.fullName,
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

        console.log("selected order", res.data)
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

  const handleUpdateStatus = async (status) => {
    if (!selectedOrder) return;
    try {
      const res = await callUpdateOrderStatus(selectedOrder.orderId, status);
      if (res && res.data) {
        message.success(res.message || t("admin.order.updateStatusSuccess"));
        setIsDrawerOpen(false);
        fetchOrders(activeTab);
      } else {
        message.error(t("admin.order.updateStatusError"));
      }
    } catch (error) {
      console.error(error);
      message.error(t("admin.order.updateStatusError"));
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
      case 'PENDING': return t('admin.order.tabPending');
      case 'CONFIRMED': return t('admin.order.tabConfirmed');
      case 'DELIVERING': return t('admin.order.tabDelivering');
      case 'COMPLETED': return t('admin.order.tabDelivered');
      case 'PREPARING': return t('admin.order.statusPreparing');
      case 'READY': return t('admin.order.statusReady');
      case 'CANCELLED': return t('admin.order.tabCancelled');
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {


      case 'PENDING': return 'status-preparing';
      case 'CONFIRMED': return 'status-ready';
      case 'DELIVERING': return 'status-preparing';
      case 'COMPLETED': return 'status-available';
      case 'PAID': return 'status-paid';
      case 'CANCELLED': return 'status-occupied';
    }
  };

  const columns = [
    {
      title: t('admin.order.colOrderId'),
      dataIndex: 'id',
      key: 'id',
      render: (text) => <strong>#{text}</strong>,
    },
    {
      title: t('admin.order.colCustomer'),
      dataIndex: 'customerName',
      key: 'customerName',
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
      <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>{t('admin.order.pageTitle')}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SoundOutlined style={{ fontSize: '18px', color: isSoundEnabled ? '#1890ff' : '#999' }} />
          <Switch
            checked={isSoundEnabled}
            onChange={handleToggleSound}
            checkedChildren={t('admin.order.soundOn')}
            unCheckedChildren={t('admin.order.soundOff')}
          />
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        style={{ marginBottom: 16 }}
      >
        <TabPane tab={t('admin.order.tabPending')} key="PENDING" />
        <TabPane tab={t('admin.order.tabConfirmed')} key="CONFIRMED" />
        <TabPane tab={t('admin.order.tabDelivering')} key="DELIVERING" />
        <TabPane tab={t('admin.order.tabDelivered')} key="COMPLETED" />
        <TabPane tab={t('admin.order.tabCancelled')} key="CANCELLED" />
      </Tabs>

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
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button onClick={() => setIsDrawerOpen(false)}>{t('common.close')}</Button>
            {selectedOrder &&
              ['PENDING', 'CONFIRMED'].includes(selectedOrder.status) && (
                <>
                  <Button
                    danger
                    onClick={() => handleUpdateStatus('CANCELLED')}
                  >
                    {t('admin.order.cancelBtn')}
                  </Button>

                  {selectedOrder.status === 'PENDING' && (
                    <Button
                      type="primary"
                      onClick={() => handleUpdateStatus('CONFIRMED')}
                    >
                      {t('common.confirm')}
                    </Button>
                  )}
                </>
              )}
            {selectedOrder && selectedOrder.status === 'CONFIRMED' && (
              <Button type="primary" onClick={() => handleUpdateStatus('DELIVERING')}>
                {t('admin.order.deliverBtn')}
              </Button>
            )}
            {selectedOrder && selectedOrder.status === 'DELIVERING' && (
              <Button type="primary" onClick={() => handleUpdateStatus('COMPLETED')}>
                {t('admin.order.completeBtn')}
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
              <div className="status-title">{t('common.status')}</div>
              <div className={`status-badge ${getStatusClass(selectedOrder.status)}`} style={{ padding: '4px 10px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', fontSize: '13px', fontWeight: 600, border: '1px solid currentColor' }}>
                <span className="dot" style={{ width: '8px', height: '8px', borderRadius: '50%', marginRight: '6px', background: 'currentColor' }}></span>
                {getStatusLabel(selectedOrder.status)}
              </div>


            </div>

            <div className="info-section">
              <div className="info-block">
                <div className="info-title">{t('admin.order.colCustomer')}</div>
                <div className="info-content">

                  {selectedOrder.user?.phone && <div>📞 {selectedOrder.user.phone}</div>}
                </div>
              </div>
              <div className="info-block">
                <div className="info-title">{t('orderHistory.recipientInfoTitle')}</div>
                <div className="info-content">
                  <p> <strong>{t('admin.order.recipientLabel')}</strong> {selectedOrder.address.recipientName}</p>
                  <p> <strong>{t('admin.order.phoneLabel')}</strong> {selectedOrder.address.phone}</p>
                  <p> <strong>{t('admin.order.addressLabel')}</strong> {selectedOrder.address.addressDetail}  {selectedOrder.address.ward}  {selectedOrder.address.district} {selectedOrder.address.province} </p>
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

export default ManageOrderPage;
