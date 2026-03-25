import {
  Layout,
  Input,
  Badge,
  Dropdown,
  Avatar,
  Typography,
  message,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  HistoryOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "./AppHeader.scss";
import { useDispatch, useSelector } from "react-redux";
import { callLogout } from "../../services/api";
import { doLogoutAction } from "../../redux/slices/account/accountSlice";
import { Link, useNavigate } from "react-router-dom";

const { Header: AntHeader } = Layout;
const { Search } = Input;
const { Text } = Typography;

const AppHeader = () => {
  const user = useSelector((state) => state.account.user);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };

  const items = [
    {
      key: "1",
      label: "Hồ sơ của tôi",
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: "Đơn hàng đã đặt",
      icon: <HistoryOutlined />,
    },
    {
      key: "3",
      label: "Cài đặt",
      icon: <SettingOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "4",
      label: isAuthenticated ? (
        <span onClick={handleLogout}>Đăng xuất</span>
      ) : (
        <Link to="/login">Đăng nhập</Link>
      ),
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  return (
    <AntHeader className="food-header">
      <div className="header-wrapper">
        <div className="logo">
          <span className="logo-brand">FOOD</span>
          <span className="logo-sub">HUB</span>
        </div>

        <div className="search-container">
          <Search
            placeholder="Tìm món ngon ngay..."
            allowClear
            enterButton="Tìm kiếm"
            size="large"
            className="search-input"
            onSearch={(value) => console.log("Searching for:", value)}
          />
        </div>

        <div className="header-actions">
          <Badge count={5} size="small">
            <ShoppingCartOutlined className="cart-icon" />
          </Badge>

          <Dropdown menu={{ items }} placement="bottomRight" arrow>
            <div className="account-dropdown">
              <Avatar
                style={{ backgroundColor: "#ff4d4f" }}
                icon={<UserOutlined />}
              />
              <Text className="user-name">{user.fullName}</Text>
            </div>
          </Dropdown>
        </div>
      </div>
    </AntHeader>
  );
};

export default AppHeader;
