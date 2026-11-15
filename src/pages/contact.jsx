import { Row, Col, Card, Typography, Button } from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../i18n";

const { Title, Paragraph, Text } = Typography;

const Contact = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const contactItems = [
    {
      icon: <EnvironmentOutlined style={{ fontSize: 22, color: "#ff4d4f" }} />,
      title: t("checkout.addressDetailLabel"),
      desc: t("footer.address"),
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: 22, color: "#ff7a45" }} />,
      title: t("footer.supportTitle"),
      desc: t("footer.hours"),
    },
    {
      icon: <PhoneOutlined style={{ fontSize: 22, color: "#52c41a" }} />,
      title: t("checkout.phoneLabel"),
      desc: "1900 6868 (24/7)",
    },
    {
      icon: <MailOutlined style={{ fontSize: 22, color: "#1677ff" }} />,
      title: t("auth.emailLabel"),
      desc: "support@foodhub.vn",
    },
  ];

  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "calc(100vh - 74px)",
        padding: "36px 20px 64px",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/")}
          style={{ marginBottom: 16, fontWeight: 600, color: "#475569" }}
        >
          {t("auth.backToHome")}
        </Button>

        <Card
          bordered={false}
          style={{
            borderRadius: 24,
            border: "1px solid #e2e8f0",
            boxShadow: "0 12px 36px -6px rgba(15, 23, 42, 0.06)",
            padding: "16px 8px",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 36px" }}>
            <Title level={2} style={{ fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
              {t("contact.pageTitle")}
            </Title>
            <Paragraph style={{ color: "#64748b", fontSize: 15, marginBottom: 0 }}>
              {t("footer.brandDesc")}
            </Paragraph>
          </div>

          <Row gutter={[20, 20]}>
            {contactItems.map((item, idx) => (
              <Col xs={24} sm={12} key={idx}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    padding: 20,
                    borderRadius: 16,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <Text strong style={{ fontSize: 15, color: "#0f172a", display: "block" }}>
                      {item.title}
                    </Text>
                    <Text style={{ color: "#475569", fontSize: 14 }}>{item.desc}</Text>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
