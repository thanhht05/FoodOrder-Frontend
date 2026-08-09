import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, Typography, Button, message, notification, Skeleton, Alert } from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import { callPayOrder, callFetchOrderDetails } from "../../services/api";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./paymentPage.scss";
import { clearCart } from "../../redux/slices/cart/CartSlice";
import { useDispatch } from "react-redux";
const { Title, Text } = Typography;

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { orderId } = useParams();
  const [orderTotal, setOrderTotal] = useState(location.state?.total || 1250000);
  const dispatch = useDispatch()

  useEffect(() => {
    // If we want to fetch order details to get the exact total amount in case it's not passed via state
    const fetchOrder = async () => {
      try {
        if (!location.state?.total) {
          const res = await callFetchOrderDetails(orderId);
          if (res?.data) {
            // Assuming the order API returns the total or orderDetails array
            // If it returns details array, calculate the total:
            if (Array.isArray(res.data)) {
              const total = res.data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              setOrderTotal(total);
            } else if (res.data.totalPrice) {
              setOrderTotal(res.data.totalPrice);
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch order details", e);
      }
    };
    fetchOrder();
  }, [orderId, location.state]);

  const [qrLoading, setQrLoading] = useState(true);
  const [qrError, setQrError] = useState(false);

  // WebSocket connection for payment status
  useEffect(() => {
    if (!orderId) return;

    const token = window.localStorage.getItem("access_token") || "";
    const socketUrl = import.meta.env.VITE_BACKEND_URL + "/ws" + (token ? `?token=${token}&access_token=${token}` : "");
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(`/topic/order/${orderId}`, (msg) => {
          if (msg.body) {
            try {
              const data = JSON.parse(msg.body);
              if (data.status === "PAID") {
                message.success("Thanh toán thành công");
                dispatch(clearCart())
                navigate("/order-history");
              }
            } catch (error) {
              console.error("Failed to parse websocket message", error);
            }
          }
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [orderId, navigate]);

  // Use the VietQR API for dynamic QR code generation
  const qrUrl = `https://vietqr.app/img?acc=0898173004&bank=MBBank&amount=${Math.round(orderTotal)}&des=order${orderId}&holder=NGUYEN+HUU+THANH&template=compact&showinfo=true`;

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await callPayOrder();
      if (res?.data) {
        message.success("Thanh toán thành công");
        navigate("/order-history");
      } else {
        // Handle case where API might succeed but no data returned
        message.success("Thanh toán thành công");

        navigate("/order-history");
      }
    } catch (error) {
      notification.error({
        message: "Lỗi thanh toán",
        description: error?.response?.data?.message || error.message || "Thanh toán thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-payment-container">
      <Card className="payment-card" bordered={false}>
        <Title level={3} className="section-title">
          Thanh toán đơn hàng #{orderId}
        </Title>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Text type="secondary" style={{ fontSize: "16px" }}>Tổng số tiền cần thanh toán:</Text><br />
          <Text strong style={{ fontSize: "24px", color: "#f5222d" }}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(orderTotal)}
          </Text>
        </div>

        <div className="qr-payment-box">
          <div className="qr-header">
            <SafetyCertificateOutlined className="qr-icon" />
            <Text strong>Quét mã để thanh toán</Text>
          </div>
          <div className="qr-code-wrapper" style={{ minHeight: 220, display: "flex", justifyContent: "center", alignItems: "center" }}>
            {qrLoading && !qrError && (
              <Skeleton.Image style={{ width: 220, height: 220 }} active />
            )}
            {qrError ? (
              <Alert
                message="Không thể tải mã QR"
                description="Vui lòng sử dụng thông tin chuyển khoản bên dưới."
                type="error"
                showIcon
              />
            ) : (
              <img
                src={qrUrl}
                alt="QR thanh toán VietQR"
                style={{ width: "100%", maxWidth: 300, height: "auto", display: qrLoading ? "none" : "block" }}
                onLoad={() => setQrLoading(false)}
                onError={() => {
                  setQrLoading(false);
                  setQrError(true);
                }}
              />
            )}
          </div>
          <div className="bank-info">
            <Text type="secondary">Ngân hàng:</Text> <Text strong>MB Bank</Text>
            <br />
            <Text type="secondary">Chủ TK:</Text> <Text strong>NGUYEN HUU THANH</Text>
            <br />
            <Text type="secondary">Số TK:</Text>{" "}
            <Text strong className="highlight">
              0898173004
            </Text>
            <br />
            <Text type="secondary">Nội dung:</Text>{" "}
            <Text strong className="highlight">order{orderId}</Text>
          </div>
          <Text className="qr-instruction">
            Mở ứng dụng ngân hàng và quét mã QR. Sau khi thanh toán thành công, vui lòng nhấn nút bên dưới.
          </Text>
        </div>

        <Button
          type="primary"
          size="large"
          block
          className="btn-submit-payment"
          onClick={handlePayment}
          loading={loading}
        >
          ĐANG CHỜ THANH TOÁN
        </Button>
      </Card>
    </div>
  );
};

export default PaymentPage;
