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
} from "antd";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { callRegister } from "../../services/api";
const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const onFinish = async (values) => {
    const { email, fullName, phone, password } = values;

    setIsSubmit(true);

    try {
      const res = await callRegister(email, fullName, phone, password);
      console.log(res);

      if (res.data) {
        message.success("Create account success!");
        navigate("/login");
      } else {
        notification.error({
          message: "Has an error while create new account",
          description: res.message,
          duration: 5,
        });
      }
    } catch (error) {
      console.log("API ERROR:", error);

      notification.error({
        message: "Register failed",
        description: error?.response?.data?.message || error.message,
        duration: 5,
      });
    } finally {
      setIsSubmit(false); // 🔥 luôn chạy
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      {/* FORM antd */}
      <Row className="register-container" style={{ minHeight: "100vh" }}>
        {/* LEFT - HERO */}
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
                Capturing Moments,
                <br />
                Creating Memories
              </h1>

              <div className="pagination">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot active"></span>
              </div>
            </div>
          </div>
        </Col>

        {/* RIGHT - FORM */}
        <Col xs={24} md={12} className="form-section">
          <div className="form-wrapper">
            <h2>Create an account</h2>

            <p className="subtitle">
              Already have an account?
              <Link to="/login">Log in</Link>
            </p>

            <Form
              className="form"
              form={form}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
            >
              <Row gutter={10}>
                <Col xs={24}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please input your email!" },
                    ]}
                  >
                    <Input className="input" />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="FullName"
                    name="fullName"
                    rules={[
                      {
                        required: true,
                        message: "Please input your fullName!",
                      },
                    ]}
                  >
                    <Input className="input" />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                      { required: true, message: "Please input your phone!" },
                    ]}
                  >
                    <Input className="input" />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <Input.Password className="input" />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item label={null}>
                    <Button
                      loading={isSubmit}
                      className="btn-primary"
                      htmlType="submit"
                    >
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
              </Row>

              <div className="separator">
                <span>Or register with</span>
              </div>

              <div className="social-row">
                <button type="button" className="btn-social">
                  <img src={googleIcon} alt="Google" />
                  Google
                </button>

                <button type="button" className="btn-social">
                  <img src={facebookIcon} alt="Facebook" />
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

export default RegisterPage;
