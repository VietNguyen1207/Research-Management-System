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
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  FormOutlined,
  ExperimentOutlined,
  FileSearchOutlined,
  ProjectOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSubItem, setSelectedSubItem] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(true);

  const navItems = [
    {
      icon: <TeamOutlined />,
      label: "Group",
      subItems: [
        { icon: <TeamOutlined />, label: "View Groups" },
        { icon: <FormOutlined />, label: "Create Group" },
        { icon: <UserOutlined />, label: "Manage Members" },
      ],
    },
    {
      icon: <FormOutlined />,
      label: "Register Research",
      subItems: [
        { icon: <FormOutlined />, label: "New Registration" },
        { icon: <FileSearchOutlined />, label: "Draft Registrations" },
        { icon: <ProjectOutlined />, label: "Registration History" },
      ],
    },
    {
      icon: <ExperimentOutlined />,
      label: "Research",
      subItems: [
        { icon: <ExperimentOutlined />, label: "Active Research" },
        { icon: <ProjectOutlined />, label: "Completed Research" },
        { icon: <FileSearchOutlined />, label: "Research Archive" },
      ],
    },
    {
      icon: <FileSearchOutlined />,
      label: "Paper",
      badge: "3",
      subItems: [
        { icon: <FileSearchOutlined />, label: "Pending Approval" },
        { icon: <FormOutlined />, label: "Submit Paper" },
        { icon: <ProjectOutlined />, label: "Paper History" },
      ],
    },
    {
      icon: <ProjectOutlined />,
      label: "Project",
      subItems: [
        { icon: <ProjectOutlined />, label: "Active Projects" },
        { icon: <FormOutlined />, label: "Create Project" },
        { icon: <TeamOutlined />, label: "Project Teams" },
      ],
    },
    {
      icon: <ProjectOutlined />,
      label: "Quotas",
      subItems: [
        { icon: <ProjectOutlined />, label: "Pending Quotas" },
        { icon: <FormOutlined />, label: "Create Project" },
        { icon: <TeamOutlined />, label: "Project Teams" },
      ],
    },
    {
      icon: <UserOutlined />,
      label: "User",
      subItems: [
        { icon: <UserOutlined />, label: "Profile" },
        { icon: <TeamOutlined />, label: "My Groups" },
        { icon: <ProjectOutlined />, label: "My Projects" },
      ],
    },
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

  const handleSubItemClick = (subItem) => {
    switch (subItem.label) {
      case "New Registration":
        navigate("/register-research");
        break;
      case "Pending Approval":
        navigate("/papers");
        break;
      case "Pending Quotas":
        navigate("/quotas");
        break;
      default:
        break;
    }
    setSelectedSubItem(subIndex);
    setSelectedItem(index);
  };

  return (
    <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] z-10">
      <nav
        className={`h-full bg-white shadow-lg border-r border-[#FFA50033] flex flex-col transition-all duration-300 ease-in-out ${
          isNavOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="p-4 border-b border-[#FFA50033] flex justify-end">
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="p-2 rounded-lg hover:bg-[#FFA50015] text-gray-600 hover:text-[#F2722B] transition-all duration-200"
          >
            {isNavOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item, index) => (
              <div key={index}>
                <button
                  className={`w-full flex items-center p-2 hover:bg-[#FFA50010] rounded-lg transition-all duration-300 group ${
                    !isNavOpen ? "justify-center" : ""
                  }`}
                  onClick={() => {
                    if (item.subItems) {
                      setIsMenuOpen(!isMenuOpen);
                    }
                    setSelectedItem(index);
                    if (!isNavOpen) {
                      setIsNavOpen(true);
                    }
                  }}
                >
                  <span className="text-gray-600 text-xl group-hover:text-[#F2722B] transition-colors duration-200">
                    {item.icon}
                  </span>
                  <span
                    className={`ml-3 flex-1 text-gray-600 font-medium group-hover:text-[#F2722B] transition-all duration-300 ${
                      isNavOpen
                        ? "opacity-100"
                        : "opacity-0 w-0 overflow-hidden"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isNavOpen && item.badge && (
                    <span className="bg-[#FFA50020] text-[#F2722B] px-2 py-0.5 rounded-full text-sm font-medium">
                      {item.badge}
                    </span>
                  )}
                </button>

                {item.subItems &&
                  isMenuOpen &&
                  selectedItem === index &&
                  isNavOpen && (
                    <div className="ml-4 mt-2 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <button
                          key={subIndex}
                          className="w-full flex items-center p-2 hover:bg-[#FFA50010] rounded-lg transition-all duration-300 group"
                          onClick={() => {
                            handleSubItemClick(subItem);
                          }}
                        >
                          <span className="text-gray-600 text-lg group-hover:text-[#F2722B] transition-colors duration-200">
                            {subItem.icon}
                          </span>
                          <span className="ml-3 text-gray-600 group-hover:text-[#F2722B] transition-colors duration-200">
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

        <div
          className={`p-4 border-t border-[#FFA50033] bg-[#FFA50005] ${
            !isNavOpen ? "text-center" : ""
          }`}
        >
          <div className="text-xs text-gray-500 hover:text-[#F2722B] transition-colors duration-200">
            {isNavOpen ? "Research Management System" : "RMS"}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
