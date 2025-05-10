import React from "react";
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
import { useGetUserNotificationsQuery } from "../features/notification/notificationApiSlice";

// Create a shared notification selector hook to avoid duplicate API calls
export const useNotificationCount = (userId) => {
  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useGetUserNotificationsQuery(userId, {
    skip: !userId,
    pollingInterval: 30000, // Poll every 30 seconds
  });

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, isLoading, isError, refetch };
};

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Use the shared hook instead of duplicating the API call
  const { unreadCount } = useNotificationCount(user?.id);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    message.success("Logged out successfully");
    navigate("/login");
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
                overlay={<NotificationDropdown />}
                trigger={["click"]}
                placement="bottomRight"
                arrow
              >
                <button className="flex items-center hover:bg-[#FFFFFF15] p-2 rounded-lg transition-colors duration-200">
                  <Badge
                    count={unreadCount}
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
                <button className="flex items-center space-x-3 hover:bg-[#FFFFFF30] py-2 px-4 rounded-lg transition-all duration-200 border border-white/30 group relative cursor-pointer">
                  <Avatar
                    size={32}
                    src={user?.profileImageUrl || null}
                    icon={!user?.profileImageUrl && <UserOutlined />}
                    className="bg-[#D2691E]"
                  />
                  <div className="flex flex-col items-start ml-2 min-w-[160px]">
                    <span className="font-semibold text-white tracking-wide text-[15px] drop-shadow-sm">
                      {user?.full_name}
                    </span>
                    <div className="flex flex-col w-full">
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-white/95 bg-white/20 px-1.5 py-0.5 rounded-md shadow-sm backdrop-blur-sm">
                          {user?.role?.charAt(0).toUpperCase() +
                            user?.role?.slice(1)}
                        </span>
                        {(user?.role === "lecturer" ||
                          user?.role === "researcher") &&
                          user?.level && (
                            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-50 bg-gradient-to-r from-amber-600/70 to-orange-600/70 px-1.5 py-0.5 rounded-md shadow-sm backdrop-blur-sm">
                              {user.level}
                            </span>
                          )}
                      </div>
                      {user?.department?.departmentName && (
                        <div className="flex items-center mt-1">
                          <div className="w-1 h-1 rounded-full bg-white/40 mr-1.5"></div>
                          <span className="text-[10px] text-white/80 truncate max-w-[180px]">
                            {user.department.departmentName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Dropdown indicator */}
                  <div className="flex items-center ml-1">
                    <svg
                      className="w-4 h-4 text-white/70 group-hover:text-white transition-transform duration-300 group-hover:-rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
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
