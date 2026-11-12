import "./registerPage.scss";
import googleIcon from "../../assets/icons/googleIcon.png";
import facebookIcon from "../../assets/icons/facebookIcon.svg";
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
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { doLoginAction } from "../../redux/slices/account/accountSlice";
import { callRegister, callGoogleLogin } from "../../services/api";
import { getCartAPI } from "../../redux/thunk/getCartThunk";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values) => {
    const { email, fullName, phone, password } = values;
    setIsSubmit(true);
    try {
      const res = await callRegister(email, fullName, phone, password);
      if (res.data) {
        message.success("Tạo tài khoản thành công!");
        navigate("/login");
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    } catch (error) {
      notification.error({
        message: "Đăng ký thất bại",
        description: error?.response?.data?.message || error.message,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  const handleGoogleLoginCallback = async (response) => {
    try {
      setIsSubmit(true);
      const idToken = response.credential;
      if (!idToken) {
        notification.error({
          message: "Lỗi đăng ký Google",
          description: "Không nhận được token xác thực từ Google",
        });
        return;
      }

      const res = await callGoogleLogin(idToken);

      if (res?.data) {
        localStorage.setItem("access_token", res.data.accessToken);
        dispatch(doLoginAction(res.data));

        try {
          await dispatch(getCartAPI()).unwrap();
        } catch {
          // ignore cart errors if empty
        }

        message.success("Đăng nhập bằng Google thành công!");

        if (res.data.userLogin?.role?.name === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        notification.error({
          message: "Lỗi đăng ký Google",
          description: res.message || "Xác thực tài khoản Google thất bại",
        });
      }
    } catch (error) {
      notification.error({
        message: "Đăng nhập Google thất bại",
        description: error?.response?.data?.message || error.message,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleLoginCallback,
        });

        const btnDiv = document.getElementById("googleRegisterBtn");
        if (btnDiv) {
          window.google.accounts.id.renderButton(btnDiv, {
            theme: "outline",
            size: "large",
            width: btnDiv.offsetWidth || 180,
            text: "signup_with",
            shape: "rectangular",
          });
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGoogle();
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="register-page">
      <Row className="register-container">
        {/* LEFT - HERO SECTION (Hidden on Mobile) */}
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
                Khám phá thế giới <br />
                <span>ẩm thực</span> tuyệt vời.
              </Title>
              <Text className="hero-subtitle">
                Gia nhập cộng đồng 10,000+ người sành ăn ngay hôm nay.
              </Text>
            </div>

            <div className="hero-footer">
              <div className="step-dots">
                <span className="dot"></span>
                <span className="dot active"></span>
                <span className="dot"></span>
              </div>
              <Text className="copyright">
                © 2026 AMU Team. Bảo lưu mọi quyền.
              </Text>
            </div>
          </div>
        </Col>

        {/* RIGHT - FORM SECTION */}
        <Col xs={24} lg={12} className="form-section">
          <div className="form-card">
            <div className="form-header">
              <Title level={2}>Tạo tài khoản</Title>
              <Text type="secondary">
                Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
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
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                  >
                    <Input placeholder="Nguyễn Văn A" size="large" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập Email!" },
                      { type: "email", message: "Email không hợp lệ!" },
                    ]}
                  >
                    <Input placeholder="example@mail.com" size="large" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      { required: true, message: "Vui lòng nhập SĐT!" },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "SĐT phải có 10 chữ số!",
                      },
                    ]}
                  >
                    <Input placeholder="09xx xxx xxx" size="large" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu!" },
                    ]}
                  >
                    <Input.Password placeholder="••••••••" size="large" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>Tôi đồng ý với điều khoản dịch vụ</Checkbox>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={isSubmit}
                    className="submit-btn"
                  >
                    Đăng ký ngay
                  </Button>
                </Col>
              </Row>

              <div className="divider-text">
                <span>Hoặc đăng ký bằng</span>
              </div>

              <div className="social-login">
                <div
                  id="googleRegisterBtn"
                  style={{ flex: 1, minHeight: 44, display: "flex", justifyContent: "center" }}
                >
                  <Button
                    className="social-btn"
                    icon={<img src={googleIcon} width={20} alt="G" />}
                    loading={isSubmit}
                    onClick={() => {
                      if (window.google?.accounts?.id) {
                        window.google.accounts.id.prompt();
                      } else {
                        message.warning("Google Sign-In đang khởi tạo, vui lòng thử lại sau giây lát.");
                      }
                    }}
                  >
                    Google
                  </Button>
                </div>
                <Button
                  className="social-btn"
                  icon={<img src={facebookIcon} width={20} alt="F" />}
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

export default RegisterPage;
