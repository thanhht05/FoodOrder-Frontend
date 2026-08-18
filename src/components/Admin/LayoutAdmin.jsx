import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Breadcrumb,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  HomeOutlined,
  TableOutlined,
  ShoppingCartOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import "./layoutAdmin.scss";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const location = useLocation();
  const getSelectedKey = () => {
    if (location.pathname === "/admin") return "1";
    if (location.pathname.startsWith("/admin/user")) return "2";
    if (location.pathname.startsWith("/admin/product")) return "3";
    if (location.pathname.startsWith("/admin/table")) return "4";
    if (location.pathname === "/admin/order") return "5";
    if (location.pathname === "/admin/order-confirm") return "5-confirm";
    if (location.pathname === "/admin/order-cancel") return "5-cancel";
    if (location.pathname.startsWith("/admin/chat")) return "chat";
    return "1";
  };
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector((state) => state.account.user);

  const userMenuItems = [
    { key: "1", icon: <UserOutlined />, label: "Hồ sơ" },
    { key: "2", icon: <SettingOutlined />, label: "Cài đặt" },
    { type: "divider" },
    { key: "3", icon: <LogoutOutlined />, label: "Đăng xuất", danger: true },
  ];

  return (
    <Layout className="admin-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} width={260}>
        <div className="logo">{collapsed ? "QT" : "BẢNG ĐIỀU KHIỂN"}</div>
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: <Link to="/admin">Bảng điều khiển</Link>,
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: <Link to="/admin/user">Người dùng</Link>,
            },
            {
              key: "3",
              icon: <UserOutlined />,
              label: <Link to="/admin/product">Sản phẩm</Link>,
            },
            {
              key: "4",
              icon: <TableOutlined />,
              label: <Link to="/admin/table">Bàn</Link>,
            },
            {
              key: "5-group",
              icon: <ShoppingCartOutlined />,
              label: "Đơn hàng",
              children: [
                {
                  key: "5",
                  label: <Link to="/admin/order">Đơn hàng hiện tại</Link>,
                },
                {
                  key: "5-confirm",
                  label: <Link to="/admin/order-confirm">Đơn đã xác nhận</Link>,
                },
                {
                  key: "5-cancel",
                  label: <Link to="/admin/order-cancel">Đơn đã hủy</Link>,
                }
              ]
            },
            {
              key: "chat",
              icon: <MessageOutlined />,
              label: <Link to="/admin/chat">Tin nhắn</Link>,
            },
            { key: "6", icon: <SettingOutlined />, label: "Cấu hình" },
          ]}
        />
      </Sider>

      <Layout>
        <Header>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />

          <Space size={20}>
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ fontSize: "18px" }}
            />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: "pointer" }}>
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                <span style={{ fontWeight: 500 }}>{user.fullName}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content>
          <Breadcrumb
            items={[
              {
                href: "",
                title: <HomeOutlined />,
              },
              {
                href: "",
                title: (
                  <>
                    <UserOutlined />
                    <span>Danh sách ứng dụng</span>
                  </>
                ),
              },
              {
                title: "Ứng dụng",
              },
            ]}
          />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
