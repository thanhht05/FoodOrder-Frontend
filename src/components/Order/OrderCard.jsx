import React from "react";
import {
  Card,
  Tag,
  Table,
  Avatar,
  Typography,
  Space,
  Row,
  Col,
  theme,
  Button
} from "antd";
import {
  ClockCircleOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const OrderCard = ({ order }) => {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const getStatusTag = (status) => {
    const statusMap = {
      PENDING: { color: "warning", text: "Chờ thanh toán" },
      PENDING_PAYMENT: { color: "warning", text: "Chờ thanh toán" },
      PAID: { color: "processing", text: "Đã thanh toán" },
      CONFIRMED: { color: "processing", text: "Đã xác nhận" },
      PREPARING: { color: "processing", text: "Đang chuẩn bị" },
      DELIVERING: { color: "blue", text: "Đang giao" },
      COMPLETED: { color: "success", text: "Đã giao" },
      CANCELLED: { color: "error", text: "Đã hủy" },
    };
    const config = statusMap[status] || { color: "default", text: status };
    return (
      <Tag color={config.color} className="status-tag">
        {config.text}
      </Tag>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const productColumns = [
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      render: (text, record) => (
        <Space size="middle">
          <Avatar
            shape="square"
            size={54}
            src={`${import.meta.env.VITE_BACKEND_URL}/upload/${record.img}`}
            icon={<ShoppingCartOutlined />}
          />
          <Text className="product-name" strong>
            {text}
          </Text>
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (price) => formatCurrency(price),
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (qty) => <Text type="secondary">x{qty}</Text>,
    },
    {
      title: "Subtotal",
      responsive: ["md"],
      key: "subtotal",
      align: "right",
      render: (_, record) => (
        <Text strong>{formatCurrency(record.price * record.quantity)}</Text>
      ),
    },
  ];

  const isPending = order.orderStatus === "PENDING" || order.orderStatus === "PENDING_PAYMENT";
  const isDelivering = order.orderStatus === "DELIVERING";

  return (
    <Card 
      className={`order-card ${isPending ? "order-card-pending" : ""}`} 
      bordered={false}
    >
      {/* Order Card Header */}
      <div className="order-card-header">
        <Row justify="space-between" align="middle" gutter={[8, 8]}>
          <Col xs={24} md={12} lg={8}>
            <Space size="middle" wrap>
              <span className="order-id">
                Order ID: <strong>#{order.orderId}</strong>
              </span>
              <span className="order-date">
                <ClockCircleOutlined />{" "}
                {dayjs(order.orderDate).format("MMM DD, YYYY - HH:mm")}
              </span>
              <span className="table-id">
                <ShopOutlined /> Bàn: <strong>{order.tableId}</strong>
              </span>
            </Space>
          </Col>
          <Col>{getStatusTag(order.orderStatus)}</Col>
        </Row>
        
        {isPending && (
          <div style={{ marginTop: 12, color: token.colorWarning }}>
            <Text type="warning">⚠ Đơn hàng chưa thanh toán</Text>
          </div>
        )}
      </div>

      {/* Embedded Table */}
      <Table
        columns={productColumns}
        dataSource={order.products}
        rowKey={(record, index) => `${record.productId}-${index}`}
        pagination={false}
        className="products-table"
        scroll={{ x: "max-content" }}
      />

      {/* Order Card Footer */}
      <div className="order-card-footer">
        <Row justify="space-between" align="middle">
          <Col xs={24} sm={12} style={{ marginBottom: '16px' }}>
            <Space size="large">
              <Text type="secondary">Tổng cộng:</Text>
              <span
                className="grand-total-price"
                style={{ color: token.colorError }}
              >
                {formatCurrency(order.totalPrice)}
              </span>
            </Space>
          </Col>
          <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
            <Space>
              {isPending && (
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => navigate(`/payment/${order.orderId}`)}
                  style={{ backgroundColor: token.colorWarning }}
                >
                  💳 Thanh toán ngay
                </Button>
              )}
              {isDelivering && (
                <Button 
                  type="primary" 
                  size="large"
                >
                  Theo dõi đơn hàng
                </Button>
              )}
              <Button size="large">Xem chi tiết</Button>
            </Space>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default OrderCard;
