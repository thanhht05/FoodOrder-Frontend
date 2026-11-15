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
import { useTranslation } from '../../i18n';

const { Text, Title } = Typography;

const OrderDetailDrawer = ({ visible, onClose, order }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  if (!order) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const statusConfig = {
    PENDING: {
      text: t("orderHistory.pendingTitle"),
      desc: t("orderHistory.pendingDesc"),
      tag: t("orderHistory.statusPending"),
      tagColor: "success",
      icon: <ClockCircleOutlined />,
      stepIndex: 0
    },
    CONFIRMED: {
      text: t("orderHistory.confirmedTitle"),
      desc: t("orderHistory.confirmedDesc"),
      tag: t("orderHistory.preparingTag"),
      tagColor: "processing",
      icon: <CodeSandboxOutlined />,
      stepIndex: 1
    },
    DELIVERING: {
      text: t("orderHistory.deliveringTitle"),
      desc: t("orderHistory.deliveringDesc"),
      tag: t("orderHistory.statusShipping"),
      tagColor: "processing",
      icon: <CarOutlined />,
      stepIndex: 2
    },
    COMPLETED: {
      text: t("orderHistory.completedTitle"),
      desc: t("orderHistory.completedDesc"),
      tag: t("orderHistory.stepDelivered"),
      tagColor: "success",
      icon: <CheckCircleOutlined />,
      stepIndex: 3
    },
    CANCELLED: {
      text: t("orderHistory.cancelledTitle"),
      desc: t("orderHistory.cancelledDesc"),
      tag: t("orderHistory.statusCancelled"),
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
    currentStatus.text = t("orderHistory.pendingPaymentTitle");
    currentStatus.tag = t("orderHistory.pendingPaymentTag");
  }

  const statusStep = {
    PENDING: 0,
    CONFIRMED: 1,
    DELIVERING: 2,
    COMPLETED: 3,
  };

  const currentStep = statusStep[order.orderStatus] ?? 0;

  const stepsItems = [
    {
      title:
        order.orderStatus === 'PENDING' && isPendingPayment
          ? t("orderHistory.pendingPaymentTag")
          : t("orderHistory.statusPending"),
      icon: <ContainerOutlined />,
      description: currentStep >= 0 ? t("orderHistory.stepDone") : '--:--',
    },
    {
      title: t("orderHistory.preparingTag"),
      icon: <CodeSandboxOutlined />,
      description: currentStep >= 1 ? t("orderHistory.stepDone") : '--:--',
    },
    {
      title: t("orderHistory.statusShipping"),
      icon: <CarOutlined />,
      description: currentStep >= 2 ? t("orderHistory.stepDone") : '--:--',
    },
    {
      title: t("orderHistory.stepDelivered"),
      icon: <CheckCircleOutlined />,
      description: currentStep >= 3 ? t("orderHistory.stepSuccess") : '--:--',
    },
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
          <span className="header-title">{t("orderHistory.orderCodePrefix", { id: order.orderId })}</span>
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
              {t("orderHistory.updatedAtLabel")} {dayjs(order.orderDate || new Date()).format("DD/MM/YYYY - HH:mm")}
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
            current={currentStep}
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
              <ShopOutlined /> {t("orderHistory.yourOrderTitle")}
            </Space>
          </div>

          <div className="product-list">
            {order.products?.map((item, idx) => (
              <div className="product-item" key={idx}>
                <div className="product-image-container">
                  <img
                    src={item.img}
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
            <Text strong>{t("orderHistory.merchandiseTotal")}</Text>
            <Text strong>{formatCurrency(order.totalPrice)}</Text>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="delivery-section section-card">
          <div className="section-title">
            <Space>
              <EnvironmentOutlined /> {t("orderHistory.recipientInfoTitle")}
            </Space>
          </div>
          <div className="delivery-grid">
            <div className="delivery-col">
              <Text type="secondary" className="info-label">{t("orderHistory.fullNameLabel")}</Text>
              <Text strong className="info-value">{order.recipientName}</Text>

              <Text type="secondary" className="info-label" style={{ marginTop: 12 }}>{t("orderHistory.phoneLabel")}</Text>
              <Text strong className="info-value">{order.phone}</Text>
            </div>
            <div className="delivery-col">
              <Text type="secondary" className="info-label">{t("orderHistory.addressLabel")}</Text>
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
              <CreditCardOutlined /> {t("orderHistory.paymentSectionTitle")}
            </Space>
          </div>

          <div className="payment-grid">
            <div className="payment-col">
              <Text type="secondary" className="info-label">{t("orderHistory.paymentMethodLabel")}</Text>
              <Text strong className="info-value">{order.paymentMethod}</Text>
            </div>
            <div className="payment-col">
              <Text type="secondary" className="info-label">{t("common.status")}</Text>
              <div className="info-value">
                {isCancelled ? (
                  <Tag color="default">
                    {t("orderHistory.statusCancelled")}
                  </Tag>
                ) : order.paymentStatus === "UNPAID" && paymentMethod === "COD" ? (
                  <Tag color="warning">
                    {t("orderHistory.paymentCODTag")}
                  </Tag>
                ) : order.paymentStatus === "PENDING" ? (
                  <Tag color="warning">
                    {t("orderHistory.pendingPaymentTag")}
                  </Tag>
                ) : order.paymentStatus === "PAID" ? (
                  <Tag
                    color="success"
                    icon={<CheckCircleOutlined />}
                  >
                    {t("orderHistory.paymentPaid")}
                  </Tag>
                ) : (
                  <Tag color="default">
                    {t("orderHistory.paymentUnknownTag")}
                  </Tag>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Total Section */}
        <div className="total-section">
          <Text strong className="total-label">{t("orderHistory.grandTotal")}</Text>
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
            {t("orderHistory.payNowBtn")}
          </Button>
        )}

        {/* Help Banner */}
        <div className="help-section">
          <div className="help-icon-wrapper">
            <CustomerServiceOutlined className="help-icon" />
          </div>
          <div className="help-text">
            <div className="help-title">{t("orderHistory.needHelpTitle")}</div>
            <div className="help-desc">{t("orderHistory.needHelpDesc")}</div>
          </div>
          <Button className="contact-btn" icon={<MessageOutlined />}>
            {t("orderHistory.contactSupportBtn")}
          </Button>
        </div>

      </div>
    </Drawer>
  );
};

export default OrderDetailDrawer;
