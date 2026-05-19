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
    return "1";
  };
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector((state) => state.account.user);

  const userMenuItems = [
    { key: "1", icon: <UserOutlined />, label: "Profile" },
    { key: "2", icon: <SettingOutlined />, label: "Settings" },
    { type: "divider" },
    { key: "3", icon: <LogoutOutlined />, label: "Logout", danger: true },
  ];

  return (
    <Layout className="admin-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} width={260}>
        <div className="logo">{collapsed ? "GA" : "ADMIN DASHBOARD"}</div>
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: <Link to="/admin">Dashboard</Link>,
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: <Link to="/admin/user">User</Link>,
            },
            {
              key: "3",
              icon: <UserOutlined />,
              label: <Link to="/admin/product">Product</Link>,
            },
            {
              key: "4",
              icon: <TableOutlined />,
              label: <Link to="/admin/table">Table</Link>,
            },
            { key: "5", icon: <SettingOutlined />, label: "Configuration" },
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
                    <span>Application List</span>
                  </>
                ),
              },
              {
                title: "Application",
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
