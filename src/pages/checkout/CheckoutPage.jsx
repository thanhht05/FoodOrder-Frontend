import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Typography,
  Divider,
  Space,
  Radio,
  Card,
  Badge,
  message,
  notification,
  Select,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  MailOutlined,
  TabletOutlined,
} from "@ant-design/icons";
import "./checkoutPage.scss";
import CartSteps from "../../components/Cart/CartSteps";
import { useDispatch, useSelector } from "react-redux";
import {
  callBuyNowItem,
  // callFetchCardetails,
  callPlaceAnOrder,
} from "../../services/api";
import { clearCart } from "../../redux/slices/cart/CartSlice";
import { useLocation, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { TextArea } = Input;

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [loading, setLoading] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);

  const dispatch = useDispatch();

  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/v2/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error(err));
  }, []);

  const handleProvinceChange = (value, option) => {
    debugger

    form.setFieldsValue({ district: undefined, ward: undefined });
    setWards([]);
    fetch(`https://provinces.open-api.vn/api/v2/p/${option.key}?depth=2`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards || []))
      .catch((err) => console.error(err));
  };


  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const cartDetailIds = cartItems.map((item) => item.cartDetailId);


  const onFinish = async (values) => {
    if (loading) return;
    setLoading(true);
    try {
      let resOrder;


      const shippingAddress = {
        recipientName: values.fullName,
        phone: values.phone,
        province: values.province,
        ward: values.ward,
        addressDetail: values.address
      }
      debugger
      resOrder = await callPlaceAnOrder(
        cartDetailIds,
        paymentMethod,
        values.note,
        shippingAddress,

      );
      if (resOrder?.data) {
        message.success("Đặt hàng thành công");
        const newOrderId = resOrder.data?.orderId;
        if (paymentMethod === "qr") {
          dispatch(clearCart());
          navigate(`/payment/${newOrderId}`, { state: { total } });
        } else {
          dispatch(clearCart());
          navigate("/order-history");
        }
      }
    } catch (e) {
      notification.error({
        message:
          e?.response?.data?.message || e.message || "Place order failed",
      });
    } finally {
      setLoading(false);
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
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                      { required: true, message: "Vui lòng nhập số điện thoại!" },
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      placeholder="0912345678"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="province"
                    label="Tỉnh/Thành phố"
                    rules={[{ required: true, message: "Vui lòng chọn Tỉnh/Thành phố!" }]}
                  >
                    <Select
                      size="large"
                      placeholder="Chọn Tỉnh/Thành phố"
                      onChange={handleProvinceChange}
                      showSearch
                      optionFilterProp="children"
                    >
                      {provinces.map((p) => (
                        <Select.Option key={p.code} value={p.name}>
                          {p.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    name="ward"
                    label="Phường/Xã"
                    rules={[{ required: true, message: "Vui lòng chọn Phường/Xã!" }]}
                  >
                    <Select
                      size="large"
                      placeholder="Chọn Phường/Xã"
                      showSearch
                      optionFilterProp="children"
                      disabled={wards.length === 0}
                    >
                      {wards.map((w) => (
                        <Select.Option key={w.code} value={w.name}>
                          {w.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="address"
                label="Địa chỉ cụ thể"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể!" }]}
              >
                <Input
                  prefix={<EnvironmentOutlined />}
                  placeholder="Số nhà, ngõ, ngách, tên đường..."
                  size="large"
                />
              </Form.Item>

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
                <Radio value="CARD" className="payment-option">
                  <span className="option-title">
                    Chuyển khoản qua mã QR (Khuyên dùng)
                  </span>
                  <Text type="secondary" className="option-desc">
                    Thanh toán tự động, nhanh chóng và chính xác.
                  </Text>
                </Radio>
                <Radio value="CASH" className="payment-option">
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
                {cartItems.map((item, index) => (
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

              {/* KHU VỰC HIỂN THỊ MÃ QR ĐÃ ĐƯỢC CHUYỂN SANG TRANG PAYMENT */}

              <Button
                type="primary"
                size="large"
                block
                className="btn-submit-order"
                htmlType="submit"
                loading={loading}
              >
                HOÀN TẤT ĐẶT HÀNG
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CheckoutPage;
