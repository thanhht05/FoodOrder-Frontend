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
  callCreatePaymentLink,
  callApplyVoucher,
} from "../../services/api";
import { clearCart } from "../../redux/slices/cart/CartSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "../../i18n";

const { Title, Text } = Typography;
const { TextArea } = Input;

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState("QR");
  const [loading, setLoading] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);

  const dispatch = useDispatch();

  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  // Voucher states
  const [voucherCodeInput, setVoucherCodeInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [voucherError, setVoucherError] = useState("");
  const [voucherSuccessMsg, setVoucherSuccessMsg] = useState("");

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/v2/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error(err));
  }, []);

  const handleProvinceChange = (value, option) => {


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

  const handleApplyVoucher = async () => {
    if (!voucherCodeInput.trim()) {
      setVoucherError(t("checkout.pleaseEnterVoucher"));
      setVoucherSuccessMsg("");
      return;
    }
    setIsApplyingVoucher(true);
    setVoucherError("");
    setVoucherSuccessMsg("");
    try {

      const res = await callApplyVoucher({ orderId: 0, code: voucherCodeInput.trim() });
      if (res && res.data) {
        setAppliedVoucher(res.data);
        setVoucherSuccessMsg(t("checkout.voucherValid"));
        setVoucherError("");
      }
    } catch (e) {
      setAppliedVoucher(null);
      setVoucherError(
        e?.response?.data?.message || t("checkout.voucherInvalid")
      );
    } finally {
      setIsApplyingVoucher(false);
    }
  };


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

      resOrder = await callPlaceAnOrder(
        cartDetailIds,
        paymentMethod,
        values.note,
        shippingAddress,
        appliedVoucher?.code || null
      );
      if (resOrder?.data) {
        message.success(resOrder.message || t("checkout.orderPlacedSuccess"));
        const newOrderId = resOrder.data?.orderId;
        if (paymentMethod === "QR") {
          dispatch(clearCart());
          const returnUrl = window.location.origin + "/payment/success";
          const cancelUrl = window.location.origin + "/payment/cancel?paymentLinkId=" + resOrder.paymentLinkId;

          try {
            const payLinkRes = await callCreatePaymentLink({
              orderId: newOrderId,
              returnUrl,
              cancelUrl
            });
            if (payLinkRes?.data?.checkoutUrl) {
              window.location.href = payLinkRes.data.checkoutUrl;
            } else {
              message.error(t("checkout.createPaymentLinkFailed"));
              navigate("/order-history");
            }
          } catch (err) {
            console.error("Create payment link error:", err);
            message.error(t("checkout.createPaymentLinkError"));
            navigate("/order-history");
          }
        } else {
          dispatch(clearCart());
          navigate("/order-history");
        }
      }
    } catch (e) {
      notification.error({
        message:
          e?.response?.data?.message || e.message || t("common.errorTitle"),
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
                    label={t("checkout.recipientNameLabel")}
                    rules={[
                      { required: true, message: t("checkout.recipientNameRequired") },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder={t("checkout.recipientNamePlaceholder")}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="phone"
                    label={t("checkout.phoneLabel")}
                    rules={[
                      { required: true, message: t("checkout.phoneRequired") },
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      placeholder={t("checkout.phonePlaceholder")}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="province"
                    label={t("checkout.provinceLabel")}
                    rules={[{ required: true, message: t("checkout.provinceRequired") }]}
                  >
                    <Select
                      size="large"
                      placeholder={t("checkout.provincePlaceholder")}
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
                    label={t("checkout.wardLabel")}
                    rules={[{ required: true, message: t("checkout.wardRequired") }]}
                  >
                    <Select
                      size="large"
                      placeholder={t("checkout.wardPlaceholder")}
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
                label={t("checkout.addressDetailLabel")}
                rules={[{ required: true, message: t("checkout.addressDetailRequired") }]}
              >
                <Input
                  prefix={<EnvironmentOutlined />}
                  placeholder={t("checkout.addressDetailPlaceholder")}
                  size="large"
                />
              </Form.Item>

              <Form.Item name="note" label={t("checkout.noteLabel")}>
                <TextArea
                  rows={3}
                  placeholder={t("checkout.notePlaceholder")}
                />
              </Form.Item>
            </Card>

            <Card className="checkout-card mt-24" bordered={false}>
              <Title level={4} className="section-title">
                {t("checkout.paymentMethodSection")}
              </Title>
              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
                className="payment-methods"
              >
                <Radio value="QR" className="payment-option">
                  <span className="option-title">
                    {t("checkout.qrOptionTitle")}
                  </span>
                  <Text type="secondary" className="option-desc">
                    {t("checkout.qrOptionDesc")}
                  </Text>
                </Radio>
                <Radio value="COD" className="payment-option">
                  <span className="option-title">{t("checkout.codOptionTitle")}</span>
                  <Text type="secondary" className="option-desc">
                    {t("checkout.codOptionDesc")}
                  </Text>
                </Radio>
              </Radio.Group>
            </Card>
          </Col>

          {/* CỘT PHẢI: TỔNG QUAN & MÃ QR */}
          <Col xs={24} lg={10} className="summary-section">
            <Card className="summary-card" bordered={false}>
              <Title level={4} className="section-title">
                {t("cart.orderSummaryTitle")}
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
                      <Badge count={item.quantity || 1} color="#ff4d4f">
                        <img
                          src={
                            item.img?.startsWith("http")
                              ? item.img
                              : `${import.meta.env.VITE_BACKEND_URL}/upload/${item.img}`
                          }
                          alt={item.name}
                          className="item-img-mock"
                          style={{ objectFit: "cover" }}
                        />
                      </Badge>

                      <div>
                        {/* Tên sản phẩm */}
                        <Text strong>{item.name}</Text>
                      </div>
                    </Space>

                    {/* Hiển thị giá tiền (Nhân với số lượng nếu cần và format chuẩn VNĐ) */}
                    <Text strong>
                      {item.price
                        ? (item.price * (item.quantity || 1)).toLocaleString(
                          "vi-VN",
                        ) + "₫"
                        : "0₫"}
                    </Text>
                  </div>
                ))}
              </div>

              <div className="voucher-section" style={{ marginTop: 24, marginBottom: 24 }}>
                <Text strong>{t("checkout.voucherTitle")}</Text>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <Input
                    placeholder={t("checkout.voucherInputPlaceholder")}
                    value={voucherCodeInput}
                    onChange={(e) => setVoucherCodeInput(e.target.value)}
                    disabled={isApplyingVoucher || loading}
                  />
                  <Button
                    type="primary"
                    onClick={handleApplyVoucher}
                    loading={isApplyingVoucher}
                    disabled={loading || !voucherCodeInput.trim()}
                  >
                    {t("checkout.applyBtn")}
                  </Button>
                </div>
                {voucherSuccessMsg && (
                  <div style={{ color: '#52c41a', marginTop: 8, fontSize: 14 }}>
                    ✓ {voucherSuccessMsg}
                    <br />
                    {t("checkout.voucherDiscount")}: -{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(appliedVoucher?.discountAmount || 0)}
                  </div>
                )}
                {voucherError && (
                  <div style={{ color: '#ff4d4f', marginTop: 8, fontSize: 14 }}>
                    {voucherError}
                  </div>
                )}
              </div>

              <Divider dashed />

              <div className="price-row">
                <Text type="secondary">{t("checkout.merchandiseSubtotal")}</Text>
                <Text strong>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(total)}
                </Text>
              </div>

              {appliedVoucher && (
                <div className="price-row">
                  <Text type="secondary">{t("checkout.voucherDiscount")}</Text>
                  <Text type="danger" strong>
                    -{new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(appliedVoucher.discountAmount)}
                  </Text>
                </div>
              )}

              <div className="price-row">
                <Text type="secondary">{t("checkout.shippingFee")}</Text>
                <Text type="success">{t("checkout.freeShipping")}</Text>
              </div>

              <Divider />

              <div className="price-row total-row">
                <Text strong>{t("checkout.totalPayment")}</Text>
                <Text className="total-amount" strong>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(appliedVoucher ? appliedVoucher.finalTotal : total)}
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
                {t("checkout.completeOrderBtn")}
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CheckoutPage;
