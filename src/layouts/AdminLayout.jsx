// import { ProtectedRoutes } from "../routes/ProtectedRoutes";

// const adminNavItems = [
//   "Group",
//   "Registration",
//   "Research",
//   "Paper",
//   "Request",
//   "Quotas",
//   "Menu",
// ];

// export const AdminLayout = () => {
//   return <ProtectedRoutes allowedRoles={["admin"]} navItems={adminNavItems} />;
// };

import { useState } from "react";
import { Layout, Menu, Button, theme, Drawer } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  FormOutlined,
  ExperimentOutlined,
  FileSearchOutlined,
  ProjectOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../auth/authSlice";

const { Header, Sider, Content } = Layout;

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: "/group",
      icon: <TeamOutlined />,
      label: "Group",
    },
    {
      key: "/register-research",
      icon: <FormOutlined />,
      label: "Registration",
    },
    {
      key: "/research",
      icon: <ExperimentOutlined />,
      label: "Research",
    },
    {
      key: "/papers",
      icon: <FileSearchOutlined />,
      label: "Paper",
    },
    {
      key: "/request",
      icon: <ProjectOutlined />,
      label: "Request",
    },
    {
      key: "/quotas",
      icon: <BarChartOutlined />,
      label: "Quotas",
    },
    {
      key: "/menu",
      icon: <AppstoreOutlined />,
      label: "Menu",
    },
  ];

  const handleMenuClick = (key) => {
    navigate(key);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const sideMenu = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={({ key }) => handleMenuClick(key)}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Desktop Sider */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        style={{
          display: { xs: "none", lg: "block" },
          background: "#2f7a39",
        }}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
          }}
        />
        {sideMenu}
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        styles={{
          body: {
            padding: 0,
            background: "#2f7a39",
          },
        }}
      >
        {sideMenu}
      </Drawer>

      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setMobileOpen(true)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              display: { lg: "none" },
            }}
          />
          <div style={{ marginRight: 16 }}>
            <span style={{ marginRight: 16 }}>{user?.name}</span>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
