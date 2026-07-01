import React, { useState, useEffect } from "react";
import { Typography, Empty, Spin } from "antd";
import "./OrderHistory.scss";
import OrderCard from "../../components/Order/OrderCard";
import { callFetchOrderHistory } from "../../services/api";
import { isAllOf } from "@reduxjs/toolkit";

const { Title } = Typography;

// Mock API response

const OrderHistory = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    const getOrderHistory = async () => {
      setIsLoading(true);
      try {
        const res = await callFetchOrderHistory();
        if (res && res.data) {
          setOrderData(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getOrderHistory();
  }, []);
  console.log("isLoading", loading);
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
          {orderData?.orderInfo && orderData.orderInfo.length > 0 ? (
            orderData.orderInfo.map((order) => (
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
