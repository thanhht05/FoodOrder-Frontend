import React, { useState, useEffect } from "react";
import { Typography, Empty, Spin } from "antd";
import "./OrderHistory.scss";
import OrderCard from "../../components/Order/OrderCard";
import { callFetchOrderHistory } from "../../services/api";

const { Title } = Typography;

// Mock API response
const mockApiResponse = {
  statusCode: 200,
  error: null,
  message: "Call api success",
  data: {
    userId: 5,
    fullName: "Thanh",
    cartId: 1,
    infoOrders: [
      {
        orderId: 2,
        orderDate: "2026-05-19T14:28:12.866618Z",
        orderStatus: "PENDING",
        tableId: 6,
        totalPrice: 30000.0,
        products: [
          {
            productId: 9,
            productName: "Matchalate 3",
            price: 30000.0,
            quantity: 1,
            img: "36ff2e95-7027-4ff1-949b-9515ef21382e.jpg",
          },
        ],
      },
      {
        orderId: 1,
        orderDate: "2026-05-07T16:51:01.023881Z",
        orderStatus: "PENDING",
        tableId: 1,
        totalPrice: 84000.0,
        products: [
          {
            productId: 9,
            productName: "Matchalate 3",
            price: 30000.0,
            quantity: 2,
            img: "36ff2e95-7027-4ff1-949b-9515ef21382e.jpg",
          },
          {
            productId: 10,
            productName: "Coffe1",
            price: 12000.0,
            quantity: 2,
            img: "9d76710a-61ad-4150-90d7-82310d18cd45.jpg",
          },
          {
            productId: 10,
            productName: "Coffe1",
            price: 12000.0,
            quantity: 2,
            img: "212ea450-37b7-4784-801f-893780dc7cd6.jpg",
          },
        ],
      },
    ],
  },
};

const OrderHistory = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    const getOrderHistory = async () => {
      setIsLoading(true);
      const res = await callFetchOrderHistory();
      if (res && res.data) {
        setOrderData(res.data);
      }
      setIsLoading(false);
    };
    getOrderHistory();
  }, []);
  return (
    <>
      {loading ? (
        <Spin />
      ) : (
        <div className="order-history-container">
          <Title level={4} className="section-title">
            Order History
          </Title>

          {/* Orders Map list section */}
          {orderData?.infoOrders && orderData.infoOrders.length > 0 ? (
            orderData.infoOrders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))
          ) : (
            <Empty description="No orders found" style={{ marginTop: 40 }} />
          )}
        </div>
      )}
    </>
  );
};

export default OrderHistory;
