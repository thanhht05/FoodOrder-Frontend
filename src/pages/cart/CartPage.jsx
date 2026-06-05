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
import { removeItem, updateQuantity } from "../../redux/slices/cart/CartSlice";
import CartSteps from "../../components/Cart/CartSteps";
import { updateCartAPI } from "../../redux/thunk/updateCartAPI";

const { Title, Text } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

  const cartItems = useSelector((state) => state.cart.items);

  // console.log("cartNotPreview", cartItems);
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const handleIncrease = (item) => {
    if (isAuthenticated) {
      dispatch(
        updateCartAPI({
          productId: item.id,
          quantity: item.quantity + 1,
        }),
      );
    } else {
      dispatch(
        updateQuantity({
          id: item.id,
          quantity: item.quantity + 1,
        }),
      );
    }
  };

  const handleDecrease = (item) => {
    if (item.quantity <= 0) {
      return;
    }

    if (isAuthenticated) {
      dispatch(
        updateCartAPI({
          productId: item.id,
          quantity: item.quantity - 1,
        }),
      );
    } else {
      dispatch(
        updateQuantity({
          id: item.id,
          quantity: item.quantity - 1,
        }),
      );
    }
  };
  const handleRemoveItem = (item) => {
    if (isAuthenticated) {
      dispatch(
        updateCartAPI({
          productId: item.id,
          quantity: 0,
        }),
      );
    } else {
      dispatch(removeItem(item));
    }
    message.success("Delte success");
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Giỏ hàng của bạn đang trống"
        >
          <Button type="primary" onClick={() => navigate("/")}>
            Mua sắm ngay
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-wrapper">
        {/* Bước thanh toán */}
        <div className="cart-steps">
          <CartSteps />
        </div>

        <Title level={3} className="page-title">
          Giỏ hàng của bạn
        </Title>

        <Row gutter={[24, 24]}>
          {/* CỘT TRÁI - DANH SÁCH SẢN PHẨM */}
          <Col xs={24} lg={16}>
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <Card className="cart-item-card" key={item.id} hoverable>
                  <Row align="middle" gutter={[16, 16]}>
                    <Col xs={8} sm={4}>
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/upload/${item.img}`}
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

          {/* CỘT PHẢI - TỔNG KẾT ĐƠN HÀNG */}
          <Col xs={24} lg={8}>
            <Card className="cart-summary-card">
              <Title level={4}>Tổng đơn hàng</Title>
              <Divider />

              <div className="summary-row">
                <Text type="secondary">Tạm tính</Text>
                <Text strong>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(total)}
                </Text>
              </div>

              <div className="summary-row">
                <Text type="secondary">Phí vận chuyển</Text>
                <Text strong>0₫</Text>
              </div>

              <Divider />

              <div className="summary-row total">
                <Text size="large">Tổng cộng</Text>
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
                onClick={() => navigate("/checkout")}
              >
                Tiến hành đặt hàng
              </Button>

              <div className="secure-info">
                <Text
                  onClick={() => navigate("/checkout")}
                  type="secondary"
                  size="small"
                >
                  🔒 Thanh toán an toàn và bảo mật
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
