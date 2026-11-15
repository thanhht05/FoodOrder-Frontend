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
  GiftOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import "./layoutAdmin.scss";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "../../i18n";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const location = useLocation();
  const { t, language, i18n } = useTranslation();
  const getSelectedKey = () => {
    if (location.pathname === "/admin") return "1";
    if (location.pathname.startsWith("/admin/user")) return "2";
    if (location.pathname.startsWith("/admin/product")) return "3";
    if (location.pathname.startsWith("/admin/table")) return "4";
    if (location.pathname === "/admin/order") return "5";
    if (location.pathname.startsWith("/admin/voucher")) return "voucher";

    if (location.pathname.startsWith("/admin/chat")) return "chat";
    return "1";
  };
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector((state) => state.account.user);

  const toggleLanguage = () => {
    i18n.changeLanguage(language === "en" ? "vie" : "en");
  };

  const userMenuItems = [
    { key: "1", icon: <UserOutlined />, label: t("header.profile") },
    { key: "2", icon: <SettingOutlined />, label: t("header.settings") },
    { type: "divider" },
    { key: "3", icon: <LogoutOutlined />, label: t("header.logout"), danger: true },
  ];

  return (
    <Layout className="admin-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} width={260}>
        <div className="logo">{collapsed ? t("admin.layout.brandShort") : t("admin.layout.brandFull")}</div>
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: <Link to="/admin">{t("admin.layout.dashboard")}</Link>,
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: <Link to="/admin/user">{t("admin.layout.manageUsers")}</Link>,
            },
            {
              key: "3",
              icon: <UserOutlined />,
              label: <Link to="/admin/product">{t("admin.layout.manageProducts")}</Link>,
            },
            {
              key: "voucher",
              icon: <GiftOutlined />,
              label: <Link to="/admin/voucher">{t("admin.layout.manageVouchers")}</Link>,
            },

            {
              key: "5",
              icon: <ShoppingCartOutlined />,
              label: <Link to="/admin/order">{t("admin.layout.manageOrders")}</Link>,
            },
            {
              key: "chat",
              icon: <MessageOutlined />,
              label: <Link to="/admin/chat">{t("admin.layout.customerChat")}</Link>,
            },
            { key: "6", icon: <SettingOutlined />, label: t("admin.layout.settings") },
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
              size="small"
              icon={<GlobalOutlined />}
              onClick={toggleLanguage}
              style={{ fontWeight: 600 }}
            >
              {language === "en" ? "ENG" : "VIE"}
            </Button>
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
                    <span>{t("admin.layout.breadcrumbList")}</span>
                  </>
                ),
              },
              {
                title: t("admin.layout.breadcrumbApp"),
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
