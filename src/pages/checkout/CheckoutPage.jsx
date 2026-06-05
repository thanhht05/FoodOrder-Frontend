import React, { useState } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Typography,
  Divider,
  Space,
  QRCode,
  Radio,
  Card,
  Badge,
  message,
  notification,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  TabletOutlined,
} from "@ant-design/icons";
import "./checkoutPage.scss";
import CartSteps from "../../components/Cart/CartSteps";
import { useDispatch, useSelector } from "react-redux";
import {
  callBuyNowItem,
  // callFetchCardetails,
  callFetchTableByName,
  callPlaceAnOrder,
} from "../../services/api";
import { clearCart } from "../../redux/slices/cart/CartSlice";
import { useLocation } from "react-router-dom";

const { Title, Text } = Typography;
const { TextArea } = Input;

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState("qr");
  const cartItems = useSelector((state) => state.cart.items);
  let buyNowItem = location.state?.buyNowItem;

  // // convert object buynowitem to json seem to cartItem
  // if (buyNowItem) {
  //   buyNowItem = {
  //     id: buyNowItem.productData.id,
  //     name: buyNowItem.productData.name,
  //     price: buyNowItem.productData.price,
  //     categoryName: buyNowItem.productData.productCate.name,
  //     img: buyNowItem.productData.lstImg?.[0]?.name,
  //     quantity: buyNowItem.quantity,
  //   };

  // }
  // console.log("Buy now item", buyNowItem);

  // const checkoutItems = buyNowItem ? [buyNowItem] : cartItems;
  const checkoutItems = buyNowItem
    ? [
        {
          id: buyNowItem.productData.id,
          name: buyNowItem.productData.name,
          price: buyNowItem.productData.price,
          categoryName: buyNowItem.productData.productCate.name,
          img: buyNowItem.productData.lstImg?.[0]?.name,
          quantity: buyNowItem.quantity,
        },
      ]
    : cartItems;

  const total = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // no longer fetch cartDetail from db
  // useEffect(() => {
  //   const fetchCartDetail = async () => {
  //     const res = await callFetchCardetails();
  //     if (res && res.data) {
  //       setCartDetai(res.data);
  //     }
  //   };
  //   fetchCartDetail();
  // }, []);
  const cartDetailIds = buyNowItem
    ? []
    : checkoutItems.map((item) => item.cartDetailId);
  // Giả lập dữ liệu đơn hàng
  const bankInfo = "089817004 - NGUYEN HUU  THANH - MB Bank";
  // Dữ liệu tạo mã QR (Theo chuẩn VietQR hoặc chuỗi bất kỳ)

  const orderTotal = 1250000;
  const qrData = `Chuyen khoan: ${bankInfo} - So tien: ${orderTotal}`;
  const onFinish = async (values) => {
    let table;

    if (values.table) {
      const res = await callFetchTableByName(values.table.trim());
      if (res?.data) {
        table = res.data;
      }
    }

    try {
      let resOrder;

      if (buyNowItem) {
        // API BUY NOW
        resOrder = await callBuyNowItem(
          buyNowItem.productData.id,
          buyNowItem.quantity,
          buyNowItem.productData.price,
          paymentMethod,
          table?.id,
        );
      } else {
        // API CART CHECKOUT
        resOrder = await callPlaceAnOrder(
          cartDetailIds,
          table?.id,
          values.note,
          paymentMethod,
        );
      }

      if (resOrder?.data) {
        message.success("Place an order successfully");

        // chỉ clear cart khi mua từ giỏ
        if (!buyNowItem) {
          dispatch(clearCart());
        }
      }
    } catch (e) {
      notification.error({
        message:
          e?.response?.data?.message || e.message || "Place order failed",
      });
    }
  };

  return (
    <div className="premium-checkout-container">
      <div style={{ marginBottom: "20px" }}>
        <CartSteps />
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="checkout-form"
      >
        <Row gutter={[32, 32]}>
          {/* CỘT TRÁI: THÔNG TIN NHẬN HÀNG */}
          <Col xs={24} lg={14} className="shipping-section">
            <Card className="checkout-card" bordered={false}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="fullName"
                    label="Họ và tên"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên!" },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Nguyễn Văn A"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="table"
                    label="Số bàn"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số bàn!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<TabletOutlined />}
                      placeholder="Nhập số bàn"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="note" label="Ghi chú cho đơn hàng (Tùy chọn)">
                <TextArea
                  rows={3}
                  placeholder="Giao hàng vào giờ hành chính..."
                />
              </Form.Item>
            </Card>

            <Card className="checkout-card mt-24" bordered={false}>
              <Title level={4} className="section-title">
                2. Phương thức thanh toán
              </Title>
              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
                className="payment-methods"
              >
                <Radio value="qr" className="payment-option">
                  <span className="option-title">
                    Chuyển khoản qua mã QR (Khuyên dùng)
                  </span>
                  <Text type="secondary" className="option-desc">
                    Thanh toán tự động, nhanh chóng và chính xác.
                  </Text>
                </Radio>
                <Radio value="cod" className="payment-option">
                  <span className="option-title">Thanh toán tiền mặt</span>
                  <Text type="secondary" className="option-desc">
                    Thanh toán bằng tiền mặt
                  </Text>
                </Radio>
              </Radio.Group>
            </Card>
          </Col>

          {/* CỘT PHẢI: TỔNG QUAN & MÃ QR */}
          <Col xs={24} lg={10} className="summary-section">
            <Card className="summary-card" bordered={false}>
              <Title level={4} className="section-title">
                Tổng quan đơn hàng
              </Title>

              <div className="order-items">
                {checkoutItems.map((item, index) => (
                  // Đưa item-row vào trong vòng lặp và thêm key
                  <div
                    className="item-row"
                    key={item.id || index}
                    style={{ marginBottom: "16px" }}
                  >
                    <Space align="start">
                      {/* Hiển thị số lượng của từng item */}
                      <Badge count={item.quantity || 1} color="#1890ff">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/upload/${item.img}`}
                          alt={item.name}
                          className="item-img-mock"
                          style={{ objectFit: "cover" }}
                        />
                      </Badge>

                      <div>
                        {/* Tên sản phẩm */}
                        <Text strong>{item.name || "Tên sản phẩm"}</Text>
                      </div>
                    </Space>

                    {/* Hiển thị giá tiền (Nhân với số lượng nếu cần và format chuẩn VNĐ) */}
                    <Text strong>
                      {item.price
                        ? (item.price * (item.quantity || 1)).toLocaleString(
                            "vi-VN",
                          ) + "₫"
                        : "1.250.000₫"}
                    </Text>
                  </div>
                ))}
              </div>

              <Divider dashed />

              <div className="price-row">
                <Text type="secondary">Tạm tính</Text>
                <Text strong>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(total)}
                </Text>
              </div>
              <div className="price-row">
                <Text type="secondary">Phí vận chuyển</Text>
                <Text type="success">Miễn phí</Text>
              </div>

              <Divider />

              <div className="price-row total-row">
                <Text strong>Tổng cộng</Text>
                <Text className="total-amount" strong>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(total)}
                </Text>
              </div>

              {/* KHU VỰC HIỂN THỊ MÃ QR - CHỈ HIỆN KHI CHỌN THANH TOÁN QR */}
              {paymentMethod === "qr" && (
                <div className="qr-payment-box">
                  <div className="qr-header">
                    <SafetyCertificateOutlined className="qr-icon" />
                    <Text strong>Quét mã để thanh toán</Text>
                  </div>
                  <div className="qr-code-wrapper">
                    <QRCode value={qrData} size={180} color="#1f1f1f" />
                  </div>
                  <div className="bank-info">
                    <Text type="secondary">Ngân hàng:</Text>{" "}
                    <Text strong>Vietcombank</Text>
                    <br />
                    <Text type="secondary">Chủ TK:</Text>{" "}
                    <Text strong>NGUYEN VAN A</Text>
                    <br />
                    <Text type="secondary">Số TK:</Text>{" "}
                    <Text strong className="highlight">
                      0123456789
                    </Text>
                  </div>
                  <Text className="qr-instruction">
                    Mở ứng dụng ngân hàng và quét mã QR. Đơn hàng sẽ được tự
                    động xác nhận sau khi thanh toán thành công.
                  </Text>
                </div>
              )}

              <Button
                type="primary"
                size="large"
                block
                className="btn-submit-order"
                htmlType="submit"
              >
                {paymentMethod === "qr"
                  ? "TÔI ĐÃ THANH TOÁN"
                  : "HOÀN TẤT ĐẶT HÀNG"}
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CheckoutPage;
