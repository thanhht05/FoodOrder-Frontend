import { Layout, Input, Badge, Dropdown, Avatar, Typography } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  HistoryOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "./AppHeader.scss";
import { useSelector } from "react-redux";
import { callLogout } from "../../services/api";

const { Header: AntHeader } = Layout;
const { Search } = Input;
const { Text } = Typography;

const AppHeader = () => {
  const user = useSelector((state) => state.account.user);

 
  }
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
      label: "Đăng xuất",
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
