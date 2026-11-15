import React, { useState, useEffect, useMemo } from "react";
import { Typography, Empty, Spin, Tabs } from "antd";
import "./OrderHistory.scss";
import OrderCard from "../../components/Order/OrderCard";
import OrderDetailDrawer from "../../components/Order/OrderDetailDrawer";
import { callFetchOrderHistory } from "../../services/api";
import { useTranslation } from "../../i18n";

const { Title } = Typography;

const OrderHistory = () => {
  const { t } = useTranslation();
  const [orderData, setOrderData] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleShowDetail = (order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

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

  const tabItems = [
    { key: "ALL", label: t("orderHistory.tabAll") },
    { key: "PENDING", label: t("orderHistory.tabPending") },
    { key: "DELIVERING", label: t("orderHistory.tabShipping") },
    { key: "COMPLETED", label: t("orderHistory.tabDelivered") },
    { key: "CANCELLED", label: t("orderHistory.tabCancelled") },
  ];

  const filteredOrders = useMemo(() => {
    if (!orderData?.orderInfo) return [];
    let orders = orderData.orderInfo;


    // Filter by tab
    if (activeTab === "PENDING") {
      orders = orders.filter((o) => o.orderStatus === "PENDING");
    } else if (activeTab === "DELIVERING") {
      orders = orders.filter((o) => o.orderStatus === "DELIVERING");
    } else if (activeTab === "COMPLETED") {
      orders = orders.filter((o) => o.orderStatus === "COMPLETED");
    } else if (activeTab === "CANCELLED") {
      orders = orders.filter((o) => o.orderStatus === "CANCELLED");
    }

    // Sort: If "ALL" tab, push PENDING to the top
    if (activeTab === "ALL") {
      orders = [...orders].sort((a, b) => {
        const isAPending = a.orderStatus === "PENDING";
        const isBPending = b.orderStatus === "PENDING";
        if (isAPending && !isBPending) return -1;
        if (!isAPending && isBPending) return 1;
        return 0; // Maintain original order otherwise
      });
    }

    return orders;
  }, [orderData, activeTab]);

  return (
    <>
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <div className="order-history-container">
          <Title level={4} className="section-title">
            {t("orderHistory.pageTitle")}
          </Title>

          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            items={tabItems}
            className="order-tabs"
          />

          {/* Orders Map list section */}
          {filteredOrders && filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard key={order.orderId} order={order} onShowDetail={handleShowDetail} />
            ))
          ) : (
            <Empty description={t("orderHistory.emptyOrders")} style={{ marginTop: 40 }} />
          )}
        </div>
      )}

      <OrderDetailDrawer
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        order={selectedOrder}
      />
    </>
  );
};

export default OrderHistory;
