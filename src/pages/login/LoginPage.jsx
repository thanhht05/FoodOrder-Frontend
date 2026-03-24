import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  notification,
  Row,
} from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./loginPage.scss";
import { callLogin } from "../../services/api";
import { useDispatch } from "react-redux";
import { doLoginAction } from "../../redux/slices/account/accountSlice";

const LoginPage = () => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    const { username, password } = values;
    setIsSubmit(true);
    try {
      const res = await callLogin(username, password);
      if (res.data) {
        localStorage.setItem("access_token", res.data.accessToken);
        dispatch(doLoginAction(res.data.userLogin));
        message.success("Login successfully!");

        navigate("/");
      } else {
        notification.error({
          message: "Occur error",
          description: res.message,
          duration: 5,
        });
      }
    } catch (error) {
      notification.error({
        message: "Register failed",
        description: error?.response?.data?.message || error.message,
        duration: 5,
      });
    } finally {
      setIsSubmit(false);
    }
  };
  return (
    <>
      <Row className="login-container">
        {/* LEFT - HERO (Giữ nguyên phong cách trang Register) */}
        <Col xs={0} md={12} className="hero-section">
          <div className="overlay">
            <div className="hero-header">
              <div className="logo">AMU</div>
              <Link className="back-link" to="/">
                Back to website →
              </Link>
            </div>

            <div className="hero-footer">
              <h1>
                Welcome Back,
                <br />
                Please Login
              </h1>
              <div className="pagination">
                <span className="dot active"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        </Col>

        {/* RIGHT - LOGIN FORM */}
        <Col xs={24} md={12} className="form-section">
          <div className="form-wrapper">
            <h2>Login</h2>
            <p className="subtitle">
              Don't have an account?
              <Link to="/register"> Register</Link>
            </p>

            <Form
              className="form"
              form={form}
              name="login_form"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                  {
                    type: "username",
                    message: "Please enter a valid username!",
                  },
                ]}
              >
                <Input className="input" placeholder="Enter your username" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  className="input"
                  placeholder="Enter your password"
                />
              </Form.Item>

              <div className="form-options">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Link className="forgot-password" to="/forgot-password">
                  Forgot password?
                </Link>
              </div>

              <Form.Item style={{ marginTop: "24px" }}>
                <Button
                  loading={isSubmit}
                  className="btn-primary"
                  htmlType="submit"
                  block
                >
                  Sign In
                </Button>
              </Form.Item>

              <div className="separator">
                <span>Or login with</span>
              </div>

              <div className="social-row">
                <button type="button" className="btn-social">
                  {/* <img src={googleIcon} alt="Google" /> */}
                  Google
                </button>
                <button type="button" className="btn-social">
                  {/* <img src={facebookIcon} alt="Facebook" /> */}
                  Facebook
                </button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  );
};
export default LoginPage;
