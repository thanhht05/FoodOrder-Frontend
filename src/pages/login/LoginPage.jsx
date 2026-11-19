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
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftOutlined,
  GoogleOutlined,
  FacebookFilled,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { doLoginAction } from "../../redux/slices/account/accountSlice";
import { callLogin, callGoogleLogin } from "../../services/api";
import "./loginPage.scss";
import { getCartAPI } from "../../redux/thunk/getCartThunk";
import { useTranslation } from "../../i18n";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const onFinish = async (values) => {
    try {
      setIsSubmit(true); // Bật loading khi bắt đầu submit
      const { username, password } = values;

      const res = await callLogin(username, password);

      // TRƯỜNG HỢP 1: API trả về data thành công
      if (res?.data) {
        localStorage.setItem("access_token", res.data.accessToken);
        dispatch(doLoginAction(res.data));

        try {
          // Luôn gọi lấy giỏ hàng mới từ DB về sau khi đã login (nếu có lỗi giỏ hàng thì bỏ qua không chặn login)
          await dispatch(getCartAPI()).unwrap();
        } catch {
          // ignore cart errors
        }

        // THÔNG BÁO & CHUYỂN TRANG
        message.success(res.message || t("apiSuccess.SUC_LOGIN"));

        const roleName = res.data.userLogin?.role?.name;
        if (roleName === "ADMIN" || roleName === "ROLE_ADMIN") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }

        // TRƯỜNG HỢP 2: API chạy thành công nhưng không có data (Sai mật khẩu/tài khoản do Backend trả về)
      } else {
        notification.error({
          message: t("auth.loginErrorTitle"),
          description:
            res.message || t("apiError.ERR_BAD_CREDENTIALS"),
        });
      }
    } catch (error) {
      notification.error({
        message: t("auth.loginFailedTitle"),
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
          message: t("auth.googleErrorTitle"),
          description: t("auth.googleNoToken"),
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

        
        message.success(res.message || t("apiSuccess.SUC_GOOGLE_LOGIN"));

        const roleName = res.data.userLogin?.role?.name;
        if (roleName === "ADMIN" || roleName === "ROLE_ADMIN") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } else {
        notification.error({
          message: t("auth.googleErrorTitle"),
          description: res.message || t("auth.googleAuthFailed"),
        });
      }
    } catch (error) {
      notification.error({
        message: t("auth.googleLoginFailedTitle"),
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

        const btnDiv = document.getElementById("googleSignInBtn");
        if (btnDiv) {
          window.google.accounts.id.renderButton(btnDiv, {
            theme: "outline",
            size: "large",
            width: btnDiv.offsetWidth || 180,
            text: "signin_with",
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
    <div className="login-page">
      <Row className="login-container">
        {/* LEFT - HERO SECTION */}
        <Col xs={0} lg={12} className="hero-section">
          <div className="hero-content">
            <div className="hero-top">
              <div className="brand-logo">AMU</div>
              <Link to="/" className="back-btn">
                <ArrowLeftOutlined /> {t("auth.backToHome")}
              </Link>
            </div>

            <div className="hero-main">
              <Title level={1} className="hero-title">
                {t("auth.loginTitle")}
              </Title>
              <Text className="hero-subtitle">
                {t("auth.loginHeroDesc")}
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
              <Title level={2}>{t("auth.loginBtn")}</Title>
              <Text type="secondary">
                {t("auth.noAccount")} <Link to="/register">{t("auth.registerNow")}</Link>
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
                label={t("auth.usernameOrEmailLabel")}
                name="username"
                rules={[
                  { required: true, message: t("auth.usernameRequired") },
                ]}
              >
                <Input placeholder="username@example.com" size="large" />
              </Form.Item>

              <Form.Item
                label={t("auth.passwordLabel")}
                name="password"
                rules={[{ required: true, message: t("auth.passwordRequired") }]}
              >
                <Input.Password placeholder="••••••••" size="large" />
              </Form.Item>

              <div className="form-options">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>{t("auth.rememberMe")}</Checkbox>
                </Form.Item>
                <Link className="forgot-link" to="/forgot-password">
                  {t("auth.forgotPassword")}
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
                  {t("auth.loginBtn")}
                </Button>
              </Form.Item>

              <div className="divider-text">
                <span>{t("auth.orLoginWith")}</span>
              </div>

              <div className="social-login">
                <div
                  id="googleSignInBtn"
                  style={{
                    flex: 1,
                    minHeight: 44,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    className="social-btn"
                    icon={<GoogleOutlined style={{ color: "#EA4335" }} />}
                    loading={isSubmit}
                    onClick={() => {
                      if (window.google?.accounts?.id) {
                        window.google.accounts.id.prompt();
                      } else {
                        message.warning(
                          t("auth.googleLoadingWarning"),
                        );
                      }
                    }}
                  >
                    Google
                  </Button>
                </div>
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
