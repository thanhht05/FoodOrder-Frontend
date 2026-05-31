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
} from "antd";
import {
  ClockCircleOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

const OrderCard = ({ order }) => {
  const { token } = theme.useToken();

  const getStatusTag = (status) => {
    const statusMap = {
      PENDING: { color: "warning", text: "Pending" },
      COMPLETED: { color: "success", text: "Completed" },
      CANCELLED: { color: "error", text: "Cancelled" },
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

  return (
    <Card className="order-card" bordered={false}>
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
                <ShopOutlined /> Table: <strong>{order.tableId}</strong>
              </span>
            </Space>
          </Col>
          <Col>{getStatusTag(order.orderStatus)}</Col>
        </Row>
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
        <Row justify="end">
          <Col>
            <Space size="large">
              <Text type="secondary">Total Amount:</Text>
              <span
                className="grand-total-price"
                style={{ color: token.colorError }}
              >
                {formatCurrency(order.totalPrice)}
              </span>
            </Space>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default OrderCard;
