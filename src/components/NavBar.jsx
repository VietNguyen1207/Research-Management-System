import React, { useState } from "react";
import {
  SearchOutlined,
  InboxOutlined,
  BellOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  LineChartOutlined,
  FileOutlined,
  FileDoneOutlined,
  BuildOutlined,
  DeleteOutlined,
  ExperimentOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSubItem, setSelectedSubItem] = useState(null);

  const navItems = [
    { icon: <SearchOutlined />, label: "Quick search" },
    { icon: <InboxOutlined />, label: "Inbox", badge: "12" },
    {
      icon: <AppstoreOutlined />,
      label: "Menu",
      subItems: [
        { icon: <AppstoreOutlined />, label: "Dashboard" },
        { icon: <BarChartOutlined />, label: "Product analytics" },
        { icon: <LineChartOutlined />, label: "Reporting" },
        { icon: <FileOutlined />, label: "Order summary" },
        { icon: <FileDoneOutlined />, label: "Invoices" },
        { icon: <BuildOutlined />, label: "Manufactures" },
        { icon: <DeleteOutlined />, label: "Trash" },
      ],
    },
  ];

  return (
    <nav className="h-[calc(100vh-4rem)] w-64 bg-white shadow-lg fixed left-0 top-16 border-r border-[#FFA50033] flex flex-col">
      <div className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item, index) => (
            <div key={index}>
              <button
                className={`w-full flex items-center p-2 rounded-lg transition-colors duration-200 group
                  ${
                    selectedItem === index
                      ? "bg-[#FFA50015] text-[#F2722B]"
                      : "hover:bg-[#FFA50010]"
                  }`}
                onClick={() => {
                  if (item.subItems) {
                    setIsMenuOpen(!isMenuOpen);
                  }
                  setSelectedItem(index);
                  setSelectedSubItem(null);
                }}
              >
                <span
                  className={`text-xl transition-colors duration-200
                  ${
                    selectedItem === index
                      ? "text-[#F2722B]"
                      : "text-gray-600 group-hover:text-[#F2722B]"
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`ml-3 flex-1 font-medium transition-colors duration-200
                  ${
                    selectedItem === index
                      ? "text-[#F2722B]"
                      : "text-gray-600 group-hover:text-[#F2722B]"
                  }`}
                >
                  {item.label}
                </span>
                {item.badge && (
                  <span className="bg-[#FFA50020] text-[#F2722B] px-2 py-0.5 rounded-full text-sm font-medium">
                    {item.badge}
                  </span>
                )}
              </button>

              {item.subItems && isMenuOpen && selectedItem === index && (
                <div className="ml-4 mt-2 space-y-1">
                  {item.subItems.map((subItem, subIndex) => (
                    <button
                      key={subIndex}
                      className={`w-full flex items-center p-2 rounded-lg transition-colors duration-200 group
                        ${
                          selectedSubItem === subIndex && selectedItem === index
                            ? "bg-[#FFA50015] text-[#F2722B]"
                            : "hover:bg-[#FFA50010]"
                        }`}
                      onClick={() => {
                        setSelectedSubItem(subIndex);
                        setSelectedItem(index);
                      }}
                    >
                      <span
                        className={`text-lg transition-colors duration-200
                        ${
                          selectedSubItem === subIndex && selectedItem === index
                            ? "text-[#F2722B]"
                            : "text-gray-600 group-hover:text-[#F2722B]"
                        }`}
                      >
                        {subItem.icon}
                      </span>
                      <span
                        className={`ml-3 transition-colors duration-200
                        ${
                          selectedSubItem === subIndex && selectedItem === index
                            ? "text-[#F2722B]"
                            : "text-gray-600 group-hover:text-[#F2722B]"
                        }`}
                      >
                        {subItem.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-[#FFA50033] bg-[#FFA50005]">
        <div className="text-xs text-gray-500 text-center hover:text-[#F2722B] transition-colors duration-200">
          Research Management System
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
