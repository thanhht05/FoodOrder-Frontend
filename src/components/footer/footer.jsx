import { Row, Col, Typography } from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Logo from "../Logo/Logo";
import { useTranslation } from "../../i18n";
import "./footer.scss";

const { Title, Text, Paragraph } = Typography;

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="storefront-footer">
      <div className="footer-container">
        <Row gutter={[32, 32]}>
          {/* Col 1: Brand */}
          <Col xs={24} sm={24} md={8} lg={8}>
            <div className="footer-brand">
              <Logo />
              <Paragraph className="brand-desc">
                {t("footer.brandDesc")}
              </Paragraph>
            </div>
          </Col>

          {/* Col 2: Explore */}
          <Col xs={12} sm={8} md={5} lg={5}>
            <Title level={5} className="footer-heading">
              {t("footer.exploreTitle")}
            </Title>
            <ul className="footer-links">
              <li>
                <Link to="/">{t("footer.home")}</Link>
              </li>
              <li>
                <Link to="/">{t("footer.todayMenu")}</Link>
              </li>
              <li>
                <Link to="/">{t("footer.promotions")}</Link>
              </li>
              <li>
                <Link to="/contact">{t("footer.aboutUs")}</Link>
              </li>
            </ul>
          </Col>

          {/* Col 3: Support */}
          <Col xs={12} sm={8} md={5} lg={5}>
            <Title level={5} className="footer-heading">
              {t("footer.supportTitle")}
            </Title>
            <ul className="footer-links">
              <li>
                <Link to="/contact">{t("footer.helpCenter")}</Link>
              </li>
              <li>
                <Link to="/contact">{t("footer.privacyPolicy")}</Link>
              </li>
              <li>
                <Link to="/contact">{t("footer.termsOfService")}</Link>
              </li>
              <li>
                <Link to="/contact">{t("footer.PartnerWithUs")}</Link>
              </li>
            </ul>
          </Col>

          {/* Col 4: Contact */}
          <Col xs={24} sm={8} md={6} lg={6}>
            <Title level={5} className="footer-heading">
              {t("footer.contactTitle")}
            </Title>
            <ul className="footer-contact-list">
              <li>
                <EnvironmentOutlined className="contact-icon" />
                <span>{t("footer.address")}</span>
              </li>
              <li>
                <ClockCircleOutlined className="contact-icon" />
                <span>{t("footer.hours")}</span>
              </li>
              <li>
                <PhoneOutlined className="contact-icon" />
                <span>1900 6868</span>
              </li>
            </ul>
          </Col>
        </Row>

        <div className="footer-bottom">
          <Text className="copyright-text">
            © {new Date().getFullYear()} FOOD HUB — {t("footer.copyright")} FOOD HUB.
          </Text>
          <Text className="made-with-text">
            {t("footer.madeWith")} <HeartFilled style={{ color: "#ff4d4f", margin: "0 4px" }} />{" "}
            {t("footer.forFoodLovers")}
          </Text>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
