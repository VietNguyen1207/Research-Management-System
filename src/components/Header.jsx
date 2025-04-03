import React, { useState } from "react";
import {
  ExperimentOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  BookOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  ClusterOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { Dropdown, Avatar, Space, Badge, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import NotificationDropdown from "./NotificationDropdown";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "invitation",
      sender: "Dr. Sarah Johnson",
      groupName: "AI Research Group",
      groupType: "research",
      role: "Member",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      read: false,
      responded: false,
    },
    {
      id: 2,
      type: "update",
      title: "Project Milestone Reached",
      message:
        "The Machine Learning project has completed Phase 1 successfully",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: false,
    },
    {
      id: 3,
      type: "invitation",
      sender: "Prof. Michael Chen",
      groupName: "Computer Science Department Council",
      groupType: "department",
      role: "Secretary",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      read: true,
      responded: false,
    },
    {
      id: 4,
      type: "response",
      user: "Dr. Emily White",
      groupName: "Data Science Lab",
      accepted: true,
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      read: true,
    },
    {
      id: 5,
      type: "update",
      title: "Timeline Updated",
      message: "Research proposal submission deadline extended to next week",
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      read: true,
    },
    {
      id: 6,
      type: "invitation",
      sender: "Prof. Robert Brown",
      groupName: "Research Ethics Committee",
      groupType: "department",
      role: "Member",
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      read: false,
      responded: false,
    },
  ]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    message.success("Logged out successfully");
    navigate("/login");
  };

  const handleAcceptInvitation = async (notificationId) => {
    // Handle invitation acceptance
  };

  const handleDeclineInvitation = async (notificationId) => {
    // Handle invitation decline
  };

  const handleMarkAllAsRead = async () => {
    // Handle marking all notifications as read
  };

  const items = [
    {
      key: "1",
      label: (
        <div className="flex items-center p-4 bg-[#FFA50010] border-b border-[#FFA50033]">
          <Avatar size={40} icon={<UserOutlined />} className="bg-[#D2691E]" />
          <div className="ml-3">
            <div className="font-semibold">{user?.full_name}</div>
            <div className="text-sm text-gray-500">{user?.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span className="flex items-center px-4 hover:text-[#F2722B]">
          <UserOutlined className="mr-2" />
          My Profile
        </span>
      ),
    },
    {
      key: "3",
      label: (
        <span className="flex items-center px-4 hover:text-[#F2722B]">
          <SettingOutlined className="mr-2" />
          Settings
        </span>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "4",
      label: (
        <span
          className="flex items-center px-4 text-red-500"
          onClick={handleLogout}
        >
          <LogoutOutlined className="mr-2" />
          Logout
        </span>
      ),
      danger: true,
    },
  ];

  return (
    <header className="h-16 bg-gradient-to-r from-[#FF8C00] to-[#FFA500] border-b border-[#FFA50033] shadow-[0_2px_8px_rgba(210,105,30,0.1)] fixed top-0 right-0 left-0 z-20">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center">
          <BankOutlined className="text-3xl text-white" />
          <span className="ml-3 text-2xl font-bold text-white">
            Academic Institution
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {!user ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-white hover:bg-[#FFFFFF15] rounded-lg transition-colors duration-200 font-semibold text-base"
              >
                Login
              </button>
              <button className="px-4 py-2 bg-white text-[#F2722B] hover:bg-[#FFF6E5] font-semibold rounded-lg transition-colors duration-200 text-base">
                Register
              </button>
            </div>
          ) : (
            <>
              <Dropdown
                overlay={
                  <NotificationDropdown
                    notifications={notifications}
                    onAccept={handleAcceptInvitation}
                    onDecline={handleDeclineInvitation}
                    onMarkAsRead={handleMarkAllAsRead}
                  />
                }
                trigger={["click"]}
                placement="bottomRight"
                arrow
              >
                <button className="flex items-center hover:bg-[#FFFFFF15] p-2 rounded-lg transition-colors duration-200">
                  <Badge
                    count={notifications.filter((n) => !n.read).length}
                    offset={[-2, 2]}
                    style={{
                      backgroundColor: "#D2691E",
                      padding: "0 6px",
                      fontWeight: "600",
                      fontSize: "12px",
                      minWidth: "20px",
                      height: "20px",
                      borderColor: "transparent",
                    }}
                  >
                    <BellOutlined
                      className="text-2xl text-white"
                      style={{ fontWeight: 600 }}
                    />
                  </Badge>
                </button>
              </Dropdown>

              <Dropdown
                menu={{ items }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <button className="flex items-center space-x-3 hover:bg-[#FFFFFF15] py-2 px-4 rounded-lg transition-all duration-200 border border-white/30">
                  <Avatar
                    size={32}
                    icon={<UserOutlined />}
                    className="bg-[#D2691E]"
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-white">
                      {user?.full_name}
                    </span>
                    <span className="text-xs text-white/80">
                      {user?.role?.charAt(0).toUpperCase() +
                        user?.role?.slice(1)}
                    </span>
                  </div>
                </button>
              </Dropdown>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
