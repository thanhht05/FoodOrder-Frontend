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
import { useTranslation } from "../../i18n";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmit, setIsSubmit] = useState(false);
  const { t } = useTranslation();

  const onFinish = async (values) => {
    const { email, fullName, phone, password } = values;
    setIsSubmit(true);
    try {
      const res = await callRegister(email, fullName, phone, password);
      if (res.data) {
        message.success(res.message || t("apiSuccess.SUC_REGISTER"));
        navigate("/login");
      } else {
        notification.error({
          message: t("common.errorTitle"),
          description: res.message,
        });
      }
    } catch (error) {
      notification.error({
        message: t("auth.registerErrorTitle"),
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

        if (res.data.userLogin?.role?.name === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
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
                <ArrowLeftOutlined /> {t("auth.backToHome")}
              </Link>
            </div>

            <div className="hero-main">
              <Title level={1} className="hero-title">
                {t("auth.registerHeroTitle")}
              </Title>
              <Text className="hero-subtitle">
                {t("auth.registerHeroDesc")}
              </Text>
            </div>

            <div className="hero-footer">
              <div className="step-dots">
                <span className="dot"></span>
                <span className="dot active"></span>
                <span className="dot"></span>
              </div>
              <Text className="copyright">
                © 2026 AMU Team. All rights reserved.
              </Text>
            </div>
          </div>
        </Col>

        {/* RIGHT - FORM SECTION */}
        <Col xs={24} lg={12} className="form-section">
          <div className="form-card">
            <div className="form-header">
              <Title level={2}>{t("auth.registerTitle")}</Title>
              <Text type="secondary">
                {t("auth.alreadyHaveAccount")} <Link to="/login">{t("auth.loginNow")}</Link>
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
                    label={t("auth.fullNameLabel")}
                    name="fullName"
                    rules={[{ required: true, message: t("auth.fullNameRequired") }]}
                  >
                    <Input placeholder={t("auth.fullNamePlaceholder")} size="large" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label={t("auth.emailLabel")}
                    name="email"
                    rules={[
                      { required: true, message: t("auth.emailRequired") },
                      { type: "email", message: t("auth.emailInvalid") },
                    ]}
                  >
                    <Input placeholder="example@mail.com" size="large" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label={t("auth.phoneLabel")}
                    name="phone"
                    rules={[
                      { required: true, message: t("auth.phoneRequired") },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: t("auth.phoneTenDigits"),
                      },
                    ]}
                  >
                    <Input placeholder="09xx xxx xxx" size="large" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label={t("auth.passwordLabel")}
                    name="password"
                    rules={[
                      { required: true, message: t("auth.passwordRequired") },
                    ]}
                  >
                    <Input.Password placeholder="••••••••" size="large" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>{t("auth.agreeTerms")}</Checkbox>
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
                    {t("auth.registerNow")}
                  </Button>
                </Col>
              </Row>

              <div className="divider-text">
                <span>{t("auth.orRegisterWith")}</span>
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
                        message.warning(t("auth.googleLoadingWarning"));
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
