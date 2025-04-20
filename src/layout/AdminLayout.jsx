import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  TeamOutlined,
  ProjectOutlined,
  FieldTimeOutlined,
  SettingOutlined,
  DashboardOutlined,
  LogoutOutlined,
  BellOutlined,
  GlobalOutlined,
  FundOutlined,
  AppstoreOutlined,
  PieChartOutlined,
  BarChartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  Avatar,
  Dropdown,
  Badge,
  Input,
  Card,
  Row,
  Col,
  Typography,
  Breadcrumb,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Helper to get the active menu key based on current path
  const getActiveMenuKey = () => {
    const path = location.pathname;
    if (path.includes("/admin/dashboard")) return ["dashboard"];
    if (path.includes("/admin/users")) return ["users"];
    if (path.includes("/admin/projects")) return ["projects"];
    if (path.includes("/admin/quotas")) return ["quotas"];
    if (path.includes("/admin/timelines")) return ["timelines"];
    if (path.includes("/admin/settings")) return ["settings"];
    return ["dashboard"];
  };

  // User dropdown menu
  const userMenu = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
      onClick: () => navigate("/admin/profile"),
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
      onClick: () => navigate("/admin/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => dispatch(logout()),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          background: "#001529",
        }}
      >
        <div className={collapsed ? "p-4 text-center" : "p-4"}>
          <div className="flex items-center justify-center h-12">
            {collapsed ? (
              <AppstoreOutlined style={{ fontSize: 24, color: "#F2722B" }} />
            ) : (
              <div className="flex items-center">
                <AppstoreOutlined style={{ fontSize: 24, color: "#F2722B" }} />
                <span className="ml-3 text-xl font-bold text-white">
                  Admin Panel
                </span>
              </div>
            )}
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={getActiveMenuKey()}
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
              onClick: () => navigate("/admin/dashboard"),
            },
            {
              key: "users",
              icon: <TeamOutlined />,
              label: "User Management",
              onClick: () => navigate("/admin/users"),
            },
            {
              key: "projects",
              icon: <ProjectOutlined />,
              label: "Project Management",
              onClick: () => navigate("/admin/projects"),
            },
            {
              key: "quotas",
              icon: <FundOutlined />,
              label: "Quota Management",
              onClick: () => navigate("/admin/quotas"),
            },
            {
              key: "timelines",
              icon: <FieldTimeOutlined />,
              label: "Timeline Management",
              onClick: () => navigate("/admin/timelines"),
            },
            {
              key: "reports",
              icon: <BarChartOutlined />,
              label: "Reports",
              children: [
                {
                  key: "overview",
                  label: "Overview",
                  onClick: () => navigate("/admin/reports/overview"),
                },
                {
                  key: "budget",
                  label: "Budget Reports",
                  onClick: () => navigate("/admin/reports/budget"),
                },
                {
                  key: "performance",
                  label: "Performance",
                  onClick: () => navigate("/admin/reports/performance"),
                },
              ],
            },
            {
              key: "settings",
              icon: <SettingOutlined />,
              label: "Settings",
              onClick: () => navigate("/admin/settings"),
            },
          ]}
        />

        <div
          className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700"
          style={{ background: "#001529" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar
                style={{ backgroundColor: "#F2722B" }}
                icon={<UserOutlined />}
                src={user?.avatar}
              />
              {!collapsed && (
                <div className="ml-3">
                  <div className="text-white font-medium text-sm">
                    {user?.fullName || "Admin User"}
                  </div>
                  <div className="text-gray-400 text-xs">Administrator</div>
                </div>
              )}
            </div>
            {!collapsed && (
              <Button
                type="link"
                icon={<LogoutOutlined />}
                size="small"
                onClick={() => dispatch(logout())}
                style={{ color: "rgba(255, 255, 255, 0.65)" }}
              />
            )}
          </div>
        </div>
      </Sider>

      <Layout
        style={{ marginLeft: collapsed ? 80 : 260, transition: "all 0.2s" }}
      >
        {/* Header */}
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            position: "sticky",
            top: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "16px", width: 64, height: 64 }}
            />
            <Breadcrumb style={{ margin: "0 16px" }}>
              <Breadcrumb.Item>Admin</Breadcrumb.Item>
              <Breadcrumb.Item>
                {location.pathname.split("/").pop()}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className="flex items-center pr-6">
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              style={{ width: 250, marginRight: 16 }}
            />
            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: 16 }} />}
                style={{ marginRight: 16 }}
              />
            </Badge>
            <Dropdown menu={{ items: userMenu }} placement="bottomRight" arrow>
              <div className="flex items-center cursor-pointer">
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  src={user?.avatar}
                  style={{ marginRight: 8 }}
                />
                <span>{user?.fullName || "Admin User"}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Main Content */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "auto",
          }}
        >
          {/* Dashboard Overview Cards (example for dashboard) */}
          {location.pathname === "/admin/dashboard" && (
            <>
              <Title level={3} style={{ marginBottom: 24 }}>
                Dashboard Overview
              </Title>
              <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} md={6}>
                  <Card bordered={false} className="dashboard-card">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-500 mb-1">Total Users</p>
                        <Title level={3} style={{ margin: 0 }}>
                          248
                        </Title>
                        <Text type="success">
                          +12% <small>from last month</small>
                        </Text>
                      </div>
                      <Avatar
                        size={48}
                        style={{ backgroundColor: "#e6f7ff" }}
                        icon={<TeamOutlined style={{ color: "#1890ff" }} />}
                      />
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card bordered={false} className="dashboard-card">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-500 mb-1">Active Projects</p>
                        <Title level={3} style={{ margin: 0 }}>
                          56
                        </Title>
                        <Text type="success">
                          +8% <small>from last month</small>
                        </Text>
                      </div>
                      <Avatar
                        size={48}
                        style={{ backgroundColor: "#f6ffed" }}
                        icon={<ProjectOutlined style={{ color: "#52c41a" }} />}
                      />
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card bordered={false} className="dashboard-card">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-500 mb-1">Total Budget</p>
                        <Title level={3} style={{ margin: 0 }}>
                          $1.2M
                        </Title>
                        <Text type="success">
                          +15% <small>from last month</small>
                        </Text>
                      </div>
                      <Avatar
                        size={48}
                        style={{ backgroundColor: "#fff2e8" }}
                        icon={<FundOutlined style={{ color: "#fa8c16" }} />}
                      />
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card bordered={false} className="dashboard-card">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-500 mb-1">Pending Approvals</p>
                        <Title level={3} style={{ margin: 0 }}>
                          12
                        </Title>
                        <Text type="warning">
                          +3 <small>new requests</small>
                        </Text>
                      </div>
                      <Avatar
                        size={48}
                        style={{ backgroundColor: "#fff0f6" }}
                        icon={
                          <FieldTimeOutlined style={{ color: "#eb2f96" }} />
                        }
                      />
                    </div>
                  </Card>
                </Col>
              </Row>
            </>
          )}

          {/* Main Content Area */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
