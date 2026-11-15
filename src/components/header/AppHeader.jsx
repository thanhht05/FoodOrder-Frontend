import {
  Layout,
  Input,
  Badge,
  Dropdown,
  Avatar,
  Typography,
  Row,
  Col,
  Button,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  HistoryOutlined,
  SettingOutlined,
  SearchOutlined,
  GlobalOutlined,
  DashboardOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./AppHeader.scss";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Logo/Logo";
import { callLogout } from "../../services/api";
import { doLogoutAction } from "../../redux/slices/account/accountSlice";
import { useState } from "react";
import { clearCart } from "../../redux/slices/cart/CartSlice";
import CartDropdown from "../Product/CartDropdown";
import { useTranslation } from "../../i18n";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const AppHeader = () => {
  const user = useSelector((state) => state.account.user);
  const cart = useSelector((state) => state.cart.items);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n, language } = useTranslation();

  const [value, setValue] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleLogout = async () => {
    const res = await callLogout();
    if (res?.data) {
      dispatch(doLogoutAction());
      dispatch(clearCart());
      localStorage.removeItem("access_token");
      navigate("/");
    }
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(language === "en" ? "vie" : "en");
  };

  const handleSearch = () => {
    if (value.trim()) {
      navigate(`/?search=${encodeURIComponent(value.trim())}`);
    } else {
      navigate("/");
    }
    setMobileSearchOpen(false);
  };

  const userMenuItems = [
    ...(user?.role === "ADMIN"
      ? [
          {
            key: "admin",
            label: <Link to="/admin">{t("header.adminDashboard")}</Link>,
            icon: <DashboardOutlined />,
          },
        ]
      : []),
    {
      key: "1",
      label: <Link to="/profile">{t("header.profile")}</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: <Link to="/order-history">{t("header.orders")}</Link>,
      icon: <HistoryOutlined />,
    },
    { key: "3", label: t("header.settings"), icon: <SettingOutlined /> },
    { type: "divider" },
    {
      key: "4",
      label: t("header.logout"),
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader className="food-header-container">
      <div className="header-wrapper">
        <Row align="middle" justify="space-between" wrap={false}>
          {/* Logo */}
          <Col flex="none">
            <Link to="/" className="logo-link">
              <Logo />
            </Link>
          </Col>

          {/* Search: Desktop & Tablet */}
          <Col xs={0} md={11} lg={12} className="search-col">
            <div className="search-bar-box">
              <SearchOutlined className="search-prefix-icon" />
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={t("header.searchPlaceholder")}
                size="large"
                onPressEnter={handleSearch}
                variant="borderless"
                className="custom-input"
                allowClear
              />
              <Button
                type="primary"
                className="search-submit-btn"
                onClick={handleSearch}
              >
                {t("header.searchBtn")}
              </Button>
            </div>
          </Col>

          {/* Actions */}
          <Col flex="none">
            <div className="header-actions">
              {/* Mobile Search Trigger */}
              <button
                type="button"
                className="mobile-search-icon"
                onClick={() => setMobileSearchOpen((prev) => !prev)}
                aria-label="Search"
              >
                {mobileSearchOpen ? <CloseOutlined /> : <SearchOutlined />}
              </button>

              <Button
                size="small"
                icon={<GlobalOutlined />}
                onClick={toggleLanguage}
                className="lang-switch-btn"
              >
                {language === "en" ? "ENG" : "VIE"}
              </Button>

              <Dropdown
                trigger={["hover", "click"]}
                placement="bottomRight"
                dropdownRender={() => <CartDropdown />}
              >
                <Badge
                  count={cart?.length || 0}
                  size="small"
                  color="#ff4d4f"
                  offset={[-2, 4]}
                >
                  <div className="icon-wrapper" onClick={() => navigate("/cart")}>
                    <ShoppingCartOutlined />
                  </div>
                </Badge>
              </Dropdown>

              <div className="user-control">
                {isAuthenticated ? (
                  <Dropdown
                    menu={{ items: userMenuItems }}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <div className="profile-trigger">
                      <div className="user-meta hide-on-mobile">
                        <Text className="welcome">{t("header.welcome")}</Text>
                        <Text strong className="name">
                          {user.fullName}
                        </Text>
                      </div>
                      <Avatar
                        src={user.avatar}
                        icon={<UserOutlined />}
                        className="avatar-glow"
                      />
                    </div>
                  </Dropdown>
                ) : (
                  <Button
                    type="primary"
                    shape="round"
                    className="login-cta-btn"
                    onClick={() => navigate("/login")}
                  >
                    {t("header.login")}
                  </Button>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Expandable Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="mobile-search-bar">
          <div className="search-bar-box mobile">
            <SearchOutlined className="search-prefix-icon" />
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("header.searchPlaceholder")}
              onPressEnter={handleSearch}
              variant="borderless"
              className="custom-input"
              autoFocus
              allowClear
            />
            <Button
              type="primary"
              className="search-submit-btn"
              onClick={handleSearch}
            >
              {t("header.searchBtn")}
            </Button>
          </div>
        </div>
      )}
    </AntHeader>
  );
};

export default AppHeader;
