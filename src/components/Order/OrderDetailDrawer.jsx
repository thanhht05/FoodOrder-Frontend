import React from 'react';
import { Drawer, Typography, Steps, Button, Divider, Tag } from 'antd';
import {
  ArrowLeftOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import './OrderDetail.scss';

const { Text, Title } = Typography;
const { Step } = Steps;

const OrderDetailDrawer = ({ visible, onClose, order }) => {
  const navigate = useNavigate();
  if (!order) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };


  const statusText = {
    PENDING: "Đơn hàng đang chờ xác nhận",
    CONFIRMED: "Đơn hàng đã được xác nhận",
    DELIVERING: "Đang giao hàng",
    COMPLETED: "Đơn hàng đã được hoàn thành",
    CANCELLED: "Đơn hàng đã bị hủy",
  };




  const isCancelled = order.orderStatus === 'CANCELLED';
  const isPendingPayment = order.paymentStatus === 'PENDING';

  const paymentMethod = order.paymentMethod

  return (
    <Drawer
      placement="right"
      closable={false}
      onClose={onClose}
      open={visible}
      width={window.innerWidth > 600 ? 500 : "100%"}
      className="order-detail-drawer"
      bodyStyle={{ padding: 0, backgroundColor: '#f5f5f5' }}
    >
      {/* Header */}
      <div className="drawer-header">
        <ArrowLeftOutlined onClick={onClose} className="back-icon" />
        <span className="header-title">Đơn hàng #{order.orderId}</span>
      </div>

      <div className="drawer-content">
        {/* Status Hero */}
        <div className="status-hero section-card">

          <Title level={4} className="status-text">
            {statusText[order.orderStatus] || ""}
          </Title>
        </div>

        {/* Timeline */}
        <div className="timeline-section section-card">
          <Steps
            status={isCancelled ? "error" : "process"}
            size="small"
            className="custom-steps"
          >
            <Step title="Đặt hàng" description={dayjs(order.orderDate).format("HH:mm")} />
            <Step title="Xác nhận" />
            <Step title="Đang giao" />
            <Step title="Hoàn thành" />
          </Steps>
        </div>

        {/* Order Items */}
        <div className="items-section section-card">
          <div className="section-title">
            <ShopOutlined /> Đơn hàng của bạn
            <span className="items-count">{order.products?.length || 0} món</span>
          </div>

          <div className="product-list">
            {order.products?.map((item, idx) => (
              <div className="product-item" key={idx}>
                <div className="product-info">
                  <div className="product-name">{item.productName}</div>
                </div>
                <div className="product-qty">x{item.quantity}</div>
                <div className="product-price">{formatCurrency(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="delivery-section section-card">
          <div className="section-title">
            <EnvironmentOutlined /> Địa chỉ giao hàng
          </div>
          <div className="delivery-details">
            <div className="recipient-name"><b>Người nhận hàng:</b> {order.recipientName}</div>
            <div className="recipient-phone"><b>Số điện thoại:</b> {order.phone}</div>
            <div className="recipient-address"><b>Địa chỉ:</b> {order.addressDetail + ', ' + order.ward + ', ' + order.province}</div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="payment-section section-card">
          <div className="section-title">
            <CreditCardOutlined /> Thanh toán
          </div>

          <div className="payment-row">
            <Text type="secondary">Phương thức</Text>
            <Text strong>{order.paymentMethod}</Text>
          </div>

          <div className="payment-row">
            <Text type="secondary">Trạng thái</Text>
            {isPendingPayment ? (
              paymentMethod === 'COD' ? (
                <Tag color="warning">🟡 Thanh toán khi nhận hàng</Tag>
              ) : (
                <Tag color="error">⚠ Chưa thanh toán</Tag>
              )
            ) : isCancelled ? (
              <Tag color="default">Đã hủy</Tag>
            ) : (
              <Tag color="success" icon={<CheckCircleOutlined />}>Đã thanh toán</Tag>
            )}
          </div>

          <Divider style={{ margin: '12px 0' }} />

          <div className="payment-row total-row">
            <Text strong style={{ fontSize: '16px' }}>Tổng cộng</Text>
            <Text strong className="total-amount">{formatCurrency(order.totalPrice)}</Text>
          </div>

          {isPendingPayment && paymentMethod !== 'COD' && !isCancelled && (
            <Button
              type="primary"
              block
              size="large"
              className="pay-now-btn"
              onClick={() => {
                onClose();
                navigate(`/payment/${order.orderId}`);
              }}
            >
              💳 THANH TOÁN NGAY
            </Button>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default OrderDetailDrawer;
