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
} from "@ant-design/icons";
import "./layoutAdmin.scss";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
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
          defaultSelectedKeys={["1"]}
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
            { key: "3", icon: <SettingOutlined />, label: "Configuration" },
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
