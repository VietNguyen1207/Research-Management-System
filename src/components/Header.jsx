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
import { Dropdown, Avatar, Space, Badge } from "antd";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const dropdownStyle = {
    dropdownRender: (menu) => (
      <div className="bg-white rounded-lg shadow-lg border border-[#FFA50033] min-w-[240px] overflow-hidden">
        {menu}
      </div>
    ),
  };

  const items = [
    {
      key: "1",
      label: (
        <div className="flex items-center p-4 bg-[#FFA50010] border-b border-[#FFA50033]">
          <Avatar size={40} icon={<UserOutlined />} className="bg-[#D2691E]" />
          <div className="ml-3">
            <div className="font-semibold">John Doe</div>
            <div className="text-sm text-gray-500">john.doe@example.com</div>
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
        <span className="flex items-center px-4 text-red-500">
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

          <button className="flex items-center hover:bg-[#FFFFFF15] p-2 rounded-lg transition-colors duration-200">
            <Badge
              count="15+"
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

          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            placement="bottomRight"
            {...dropdownStyle}
          >
            <button className="flex items-center space-x-3 hover:bg-[#FFFFFF15] py-2 px-4 rounded-lg transition-all duration-200 border border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.15)] backdrop-blur-sm">
              <Avatar
                size={32}
                icon={<UserOutlined />}
                className="bg-[#D2691E]"
              />
              <div className="flex flex-col items-start">
                <span className="font-medium text-white">John Doe</span>
                <span className="text-xs text-white/80">Administrator</span>
              </div>
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;
