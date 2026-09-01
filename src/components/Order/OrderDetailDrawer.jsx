import React from 'react';
import { Drawer, Typography, Steps, Button, Divider, Tag, Space } from 'antd';
import {
  ArrowLeftOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  QuestionCircleOutlined,
  ClockCircleOutlined,
  ContainerOutlined,
  CodeSandboxOutlined,
  CarOutlined,
  CustomerServiceOutlined,
  MessageOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import './OrderDetail.scss';

const { Text, Title } = Typography;

const OrderDetailDrawer = ({ visible, onClose, order }) => {
  const navigate = useNavigate();
  if (!order) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const statusConfig = {
    PENDING: {
      text: "Đơn hàng đang chờ xác nhận",
      desc: "Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ xác nhận đơn hàng của bạn trong thời gian sớm nhất.",
      tag: "Chờ xác nhận",
      tagColor: "success",
      icon: <ClockCircleOutlined />,
      stepIndex: 0
    },
    CONFIRMED: {
      text: "Đơn hàng đang được chuẩn bị",
      desc: "Đơn hàng của bạn đã được xác nhận và đang được cửa hàng chuẩn bị.",
      tag: "Đang chuẩn bị",
      tagColor: "processing",
      icon: <CodeSandboxOutlined />,
      stepIndex: 1
    },
    DELIVERING: {
      text: "Đơn hàng đang được giao",
      desc: "Tài xế đang trên đường giao hàng cho bạn. Vui lòng giữ điện thoại.",
      tag: "Đang giao hàng",
      tagColor: "processing",
      icon: <CarOutlined />,
      stepIndex: 2
    },
    COMPLETED: {
      text: "Đơn hàng đã hoàn thành",
      desc: "Đơn hàng đã được giao thành công. Cảm ơn bạn đã mua sắm!",
      tag: "Hoàn thành",
      tagColor: "success",
      icon: <CheckCircleOutlined />,
      stepIndex: 3
    },
    CANCELLED: {
      text: "Đơn hàng đã bị hủy",
      desc: "Đơn hàng của bạn đã bị hủy.",
      tag: "Đã hủy",
      tagColor: "error",
      icon: <CheckCircleOutlined />,
      stepIndex: -1
    },
  };

  const isCancelled = order.orderStatus === 'CANCELLED';
  const isPendingPayment = order.paymentStatus === 'PENDING';
  const paymentMethod = order.paymentMethod;

  let currentStatus = { ...(statusConfig[order.orderStatus] || statusConfig.PENDING) };
  if (order.orderStatus === 'PENDING' && isPendingPayment) {
    currentStatus.text = "Đơn hàng đang chờ thanh toán";
    currentStatus.tag = "Chờ thanh toán";
  }

  const stepsItems = [
    {
      title: (order.orderStatus === 'PENDING' && isPendingPayment) ? 'Chờ thanh toán' : 'Chờ xác nhận',
      icon: <ContainerOutlined />,
      description: (order.orderStatus !== 'PENDING') ? "Hoàn tất" : "--:--"
    },
    {
      title: 'Đang chuẩn bị',
      icon: <CodeSandboxOutlined />,
      description: (order.orderStatus === 'CONFIRMED') ? "Hoàn tất" : "--:--"
    },
    {
      title: 'Đang giao hàng',
      icon: <CarOutlined />,
      description: (order.orderStatus === 'DELIVERING') ? "Đang giao" : "--:--"
    },
    {
      title: 'Hoàn thành',
      icon: <CheckCircleOutlined />,
      description: order.orderStatus === 'COMPLETED' ? "Thành công" : "--:--"
    }
  ];

  return (
    <Drawer
      placement="right"
      closable={false}
      onClose={onClose}
      open={visible}
      width={window.innerWidth > 600 ? 600 : "100%"}
      className="order-detail-drawer"
      bodyStyle={{ padding: 0, backgroundColor: '#f8fafc' }}
    >
      {/* Header */}
      <div className="drawer-header">
        <div className="header-left">
          <ArrowLeftOutlined onClick={onClose} className="back-icon" />
          <span className="header-title">Đơn hàng #{order.orderId}</span>
        </div>

      </div>

      <div className="drawer-content">
        {/* Status Hero */}
        <div className="status-hero section-card">
          <div className="status-content">
            <Tag color={currentStatus.tagColor} icon={currentStatus.icon} className="status-tag">
              {currentStatus.tag}
            </Tag>
            <Title level={4} className="status-title">
              {currentStatus.text}
            </Title>
            <p className="status-desc">
              {currentStatus.desc}
            </p>
            <p className="status-time">
              Cập nhật cuối: {dayjs(order.orderDate || new Date()).format("DD/MM/YYYY - HH:mm")}
            </p>
          </div>
          <div className="status-illustration">
            <div className="illustration-box">
              <CodeSandboxOutlined className="box-icon" />
              <div className="clock-badge">
                <ClockCircleOutlined />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline-section section-card">
          <Steps
            current={currentStatus.stepIndex}
            status={isCancelled ? "error" : "process"}
            labelPlacement="vertical"
            className="custom-steps"
            items={stepsItems}
          />
        </div>

        {/* Order Items */}
        <div className="items-section section-card">
          <div className="section-title">
            <Space>
              <ShopOutlined /> Đơn hàng của bạn
            </Space>
          </div>

          <div className="product-list">
            {order.products?.map((item, idx) => (
              <div className="product-item" key={idx}>
                <div className="product-image-container">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/upload/${item.img}`}
                    alt={item.productName}
                    className="product-image"
                  />
                </div>
                <div className="product-info">
                  <div className="product-name">{item.productName}</div>
                </div>
                <div className="product-qty">x{item.quantity}</div>
                <div className="product-price">{formatCurrency(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>

          <Divider dashed style={{ margin: '16px 0' }} />

          <div className="subtotal-row">
            <Text strong>Tổng tiền hàng</Text>
            <Text strong>{formatCurrency(order.totalPrice)}</Text>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="delivery-section section-card">
          <div className="section-title">
            <Space>
              <EnvironmentOutlined /> Thông tin giao hàng
            </Space>
          </div>
          <div className="delivery-grid">
            <div className="delivery-col">
              <Text type="secondary" className="info-label">Người nhận hàng</Text>
              <Text strong className="info-value">{order.recipientName}</Text>

              <Text type="secondary" className="info-label" style={{ marginTop: 12 }}>Số điện thoại</Text>
              <Text strong className="info-value">{order.phone}</Text>
            </div>
            <div className="delivery-col">
              <Text type="secondary" className="info-label">Địa chỉ giao hàng</Text>
              <Text strong className="info-value address-value">
                {[order.addressDetail, order.ward, order.province].filter(Boolean).join(', ')}
              </Text>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="payment-section section-card">
          <div className="section-title">
            <Space>
              <CreditCardOutlined /> Thanh toán
            </Space>
          </div>

          <div className="payment-grid">
            <div className="payment-col">
              <Text type="secondary" className="info-label">Phương thức thanh toán</Text>
              <Text strong className="info-value">{order.paymentMethod}</Text>
            </div>
            <div className="payment-col">
              <Text type="secondary" className="info-label">Trạng thái</Text>
              <div className="info-value">
                {isCancelled ? (
                  <Tag color="default">
                    Đã hủy
                  </Tag>
                ) : order.paymentStatus === "UNPAID" && paymentMethod === "COD" ? (
                  <Tag color="warning">
                    Thanh toán khi nhận hàng
                  </Tag>
                ) : order.paymentStatus === "PENDING" ? (
                  <Tag color="warning">
                    Chờ thanh toán
                  </Tag>
                ) : order.paymentStatus === "PAID" ? (
                  <Tag
                    color="success"
                    icon={<CheckCircleOutlined />}
                  >
                    Đã thanh toán
                  </Tag>
                ) : (
                  <Tag color="default">
                    Chưa xác định
                  </Tag>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Total Section */}
        <div className="total-section">
          <Text strong className="total-label">Tổng cộng</Text>
          <Text strong className="total-value">{formatCurrency(order.totalPrice)}</Text>
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
            Thanh toán ngay
          </Button>
        )}

        {/* Help Banner */}
        <div className="help-section">
          <div className="help-icon-wrapper">
            <CustomerServiceOutlined className="help-icon" />
          </div>
          <div className="help-text">
            <div className="help-title">Cần hỗ trợ?</div>
            <div className="help-desc">Liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào về đơn hàng.</div>
          </div>
          <Button className="contact-btn" icon={<MessageOutlined />}>
            Liên hệ hỗ trợ
          </Button>
        </div>

      </div>
    </Drawer>
  );
};

export default OrderDetailDrawer;
