import React, { useState } from "react";
import {
  Row,
  Col,
  Button,
  InputNumber,
  Divider,
  Steps,
  Empty,
  Typography,
  Card,
  message,
} from "antd";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./cartPage.scss";
import { useDispatch, useSelector } from "react-redux";
import CartSteps from "../../components/Cart/CartSteps";
import { updateCartAPI } from "../../redux/thunk/updateCartAPI";
import { useTranslation } from "../../i18n";

const { Title, Text } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const cartItems = useSelector((state) => state.cart.items);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const handleIncrease = (item) => {

    dispatch(
      updateCartAPI({
        productId: item.id,
        quantity: item.quantity + 1,
      }),
    );

  };

  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      return;
    }
    dispatch(
      updateCartAPI({
        productId: item.id,
        quantity: item.quantity - 1,
      }),
    );

  };
  const handleRemoveItem = (item) => {

    dispatch(
      updateCartAPI({
        productId: item.id,
        quantity: 0,
      }),
    );

    message.success(t("cart.deletedItemSuccess"));
  };

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/checkout");
      setLoading(false);
    }, 500); // Add a small delay to show the spinner
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t("cart.emptyCartText")}
        >
          <Button type="primary" onClick={() => navigate("/")}>
            {t("cart.buyNowBtn")}
          </Button>
        </Empty>
      </div>
    );
  }
  return (
    <div className="cart-page-container">
      <div className="cart-wrapper">
        {/* Checkout steps */}
        <div className="cart-steps">
          <CartSteps />
        </div>

        <Title level={3} className="page-title">
          {t("cart.yourCartTitle")}
        </Title>

        <Row gutter={[24, 24]}>
          {/* Left column: Cart items */}
          <Col xs={24} lg={16}>
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <Card className="cart-item-card" key={item.id} hoverable>
                  <Row align="middle" gutter={[16, 16]}>
                    <Col xs={8} sm={4}>
                      <img
                        src={item.img}
                        alt={item.name}
                        className="product-img"
                      />
                    </Col>

                    <Col xs={16} sm={8}>
                      <div className="product-info">
                        <Text strong className="product-name">
                          {item.name}
                        </Text>
                        <div className="product-price">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.price)}
                        </div>
                      </div>
                    </Col>

                    <Col xs={12} sm={6}>
                      <div className="quantity-control">
                        <Button
                          onClick={() => handleDecrease(item)}
                          size="small"
                        >
                          -
                        </Button>
                        <span className="qty-value">{item.quantity}</span>
                        <Button
                          onClick={() => handleIncrease(item)}
                          size="small"
                        >
                          +
                        </Button>
                      </div>
                    </Col>

                    <Col xs={10} sm={4}>
                      <Text strong className="total-item-price">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price * item.quantity)}
                      </Text>
                    </Col>

                    <Col xs={2} sm={2} style={{ textAlign: "right" }}>
                      <Button
                        onClick={() => handleRemoveItem(item)}
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        className="delete-btn"
                      />
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          </Col>

          {/* Right column: Order summary */}
          <Col xs={24} lg={8}>
            <Card className="cart-summary-card">
              <Title level={4}>{t("cart.orderSummaryTitle")}</Title>
              <Divider />

              <div className="summary-row">
                <Text type="secondary">{t("cart.subtotal")}</Text>
                <Text strong>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(total)}
                </Text>
              </div>

              <div className="summary-row">
                <Text type="secondary">{t("checkout.shippingFee")}</Text>
                <Text strong>0₫</Text>
              </div>

              <Divider />

              <div className="summary-row total">
                <Text size="large">{t("cart.totalPayment")}</Text>
                <Text className="final-price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(total)}
                </Text>
              </div>

              <Button
                type="primary"
                block
                size="large"
                className="checkout-btn"
                onClick={handleCheckout}
                loading={loading}
              >
                {t("cart.checkoutBtn", { count: cartItems.length })}
              </Button>

              <div className="secure-info">
                <Text
                  onClick={() => navigate("/checkout")}
                  type="secondary"
                  size="small"
                >
                  {t("cart.secureCheckoutNote")}
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CartPage;
