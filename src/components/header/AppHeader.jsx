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
// import { useEffect, useState } from "react";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const AppHeader = () => {
  const user = useSelector((state) => state.account.user);
  const cart = useSelector((state) => state.cart.items);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await callLogout();
    if (res?.data) {
      dispatch(doLogoutAction());
      dispatch(clearCart());
      localStorage.removeItem("access_token");
      navigate("/");
    }
  };

  const [value, setValue] = useState("");
  // const [debouncedValue, setDebouncedValue] = useState("");
  const handleSearch = () => {
    if (value) {
      navigate(`/?search=${value}`);
    } else {
      navigate("/");
    }
  };
  // ⏳ debounce 5 giây
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setDebouncedValue(value);
  //   }, 3000);

  //   return () => clearTimeout(timer); // cleanup
  // }, [value]);

  // // 🎯 gọi search khi debounce xong
  // useEffect(() => {
  //   if (debouncedValue) {
  //     handleSearch(debouncedValue);
  //   }
  // }, [debouncedValue]);

  const userMenuItems = [
    {
      key: "1",
      label: <Link to="/profile">Hồ sơ</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: <Link to="/orders">Đơn hàng</Link>,
      icon: <HistoryOutlined />,
    },
    { key: "3", label: "Cài đặt", icon: <SettingOutlined /> },
    { type: "divider" },
    {
      key: "4",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader className="food-header-container">
      <div className="header-wrapper">
        <Row align="middle" justify="space-between">
          {/* Logo: Takes 6/24 on mobile, 4/24 on desktop */}
          <Col xs={6} sm={6} md={4}>
            <Link to="/" className="logo-link">
              <Logo />
            </Link>
          </Col>

          {/* Search: Hidden on mobile (xs=0), shows on desktop (md=12) */}
          <Col xs={0} md={12} lg={13} className="search-col">
            <div style={{ display: "flex" }}>
              <Input
                onChange={(e) => setValue(e.target.value)}
                placeholder="Tìm món ngon..."
                suffix={<SearchOutlined />}
                size="large"
                onPressEnter={handleSearch}
                className="custom-input"
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </Col>

          {/* Actions: Takes 18/24 on mobile to fit cart + avatar */}
          <Col xs={18} sm={18} md={8} lg={7}>
            <div className="header-actions">
              {/* Search Icon for Mobile Only */}
              <div className="mobile-search-icon">
                <SearchOutlined />
              </div>

              <Dropdown
                trigger={["hover"]}
                placement="bottom"
                dropdownRender={() => <CartDropdown />}
              >
                <Badge count={cart?.length || 0} size="small" color="#ff4d4f">
                  <div className="icon-wrapper">
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
                      {/* Note the 'hide-on-mobile' class here */}
                      <div className="user-meta hide-on-mobile">
                        <Text className="welcome">Xin chào,</Text>
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
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </AntHeader>
  );
};

export default AppHeader;
