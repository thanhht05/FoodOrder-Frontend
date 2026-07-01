import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  notification,
  Row,
  Typography,
} from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  GoogleOutlined,
  FacebookFilled,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { doLoginAction } from "../../redux/slices/account/accountSlice";
import { callLogin } from "../../services/api";
import "./loginPage.scss";
import { mergeCart } from "../../redux/thunk/cartThunk";
import { getCartAPI } from "../../redux/thunk/getCartThunk";
import { clearCart } from "../../redux/slices/cart/CartSlice";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localCart = useSelector((state) => state.cart.items);
  const onFinish = async (values) => {
    try {
      setIsSubmit(true); // Bật loading khi bắt đầu submit
      const { username, password } = values;

      const res = await callLogin(username, password);

      // TRƯỜNG HỢP 1: API trả về data thành công
      if (res?.data) {
        localStorage.setItem("access_token", res.data.accessToken);
        dispatch(doLoginAction(res.data));

        // ---- KHU VỰC XỬ LÝ GIỎ HÀNG (CÔ LẬP) ----
        if (localCart && localCart.length > 0) {
          try {
            await dispatch(mergeCart()).unwrap();
          } catch (cartError) {
            console.error("Lỗi merge giỏ hàng (khác tài khoản):", cartError);
            dispatch(clearCart()); // Giải cứu: Xóa giỏ hàng xung đột của người cũ
          }
        }

        // Luôn gọi lấy giỏ hàng mới từ DB về sau khi đã login (bất kể giỏ trống hay có đồ)

        await dispatch(getCartAPI()).unwrap();

        // THÔNG BÁO & CHUYỂN TRANG (Nằm ngoài khối if giỏ hàng)
        message.success("Đăng nhập thành công!");

        if (res.data.userLogin.role.name === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }

        // TRƯỜNG HỢP 2: API chạy thành công nhưng không có data (Sai mật khẩu/tài khoản do Backend trả về)
      } else {
        notification.error({
          message: "Lỗi đăng nhập",
          description:
            res.message || "Tên đăng nhập hoặc mật khẩu không chính xác",
        });
      }
    } catch (error) {
      // TRƯỜNG HỢP 3: Lỗi kết nối, lỗi 400/500 từ axios/fetch khi gọi callLogin
      notification.error({
        message: "Đăng nhập thất bại",
        description: error?.response?.data?.message || error.message,
      });
    } finally {
      setIsSubmit(false); // SỬA: Tắt loading sau khi mọi thứ đã chạy xong
    }
  };
  return (
    <div className="login-page">
      <Row className="login-container">
        {/* LEFT - HERO SECTION */}
        <Col xs={0} lg={12} className="hero-section">
          <div className="hero-content">
            <div className="hero-top">
              <div className="brand-logo">AMU</div>
              <Link to="/" className="back-btn">
                <ArrowLeftOutlined /> Quay lại trang chủ
              </Link>
            </div>

            <div className="hero-main">
              <Title level={1} className="hero-title">
                Chào mừng bạn <br />
                <span>trở lại.</span>
              </Title>
              <Text className="hero-subtitle">
                Đăng nhập để tiếp tục khám phá những món ngon tuyệt vời nhất
                cùng chúng tôi.
              </Text>
            </div>

            <div className="hero-footer">
              <div className="step-dots">
                <span className="dot active"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
              <Text className="copyright">
                © 2026 AMU Team. All rights reserved.
              </Text>
            </div>
          </div>
        </Col>

        {/* RIGHT - LOGIN FORM SECTION */}
        <Col xs={24} lg={12} className="form-section">
          <div className="form-card">
            <div className="form-header">
              <Title level={2}>Đăng nhập</Title>
              <Text type="secondary">
                Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
              </Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              requiredMark={false}
              className="main-form"
            >
              <Form.Item
                label="Tên đăng nhập / Email"
                name="username"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                ]}
              >
                <Input placeholder="username@example.com" size="large" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password placeholder="••••••••" size="large" />
              </Form.Item>

              <div className="form-options">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>
                <Link className="forgot-link" to="/forgot-password">
                  Quên mật khẩu?
                </Link>
              </div>

              <Form.Item style={{ marginTop: 24 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={isSubmit}
                  className="submit-btn"
                >
                  Đăng nhập
                </Button>
              </Form.Item>

              <div className="divider-text">
                <span>Hoặc đăng nhập với</span>
              </div>

              <div className="social-login">
                <Button
                  className="social-btn"
                  icon={<GoogleOutlined style={{ color: "#EA4335" }} />}
                >
                  Google
                </Button>
                <Button
                  className="social-btn"
                  icon={<FacebookFilled style={{ color: "#1877F2" }} />}
                >
                  Facebook
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
