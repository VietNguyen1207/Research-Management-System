import React, { useState, useMemo, useEffect } from "react";
import {
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
  FieldTimeOutlined,
  SolutionOutlined,
  FundOutlined,
  FileTextOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Menu } from "antd";

// Define navItems outside of component
const navItems = [
  {
    icon: <TeamOutlined />,
    label: "Group",
    subItems: [
      { icon: <TeamOutlined />, label: "View Group" },
      { icon: <FormOutlined />, label: "Create Group" },
      { icon: <FormOutlined />, label: "Create Council" },
      { icon: <UserOutlined />, label: "Manage Group" },
      { icon: <UserOutlined />, label: "Manage Council" },
    ],
  },
  {
    icon: <FormOutlined />,
    label: "Registration",
    subItems: [
      { icon: <FormOutlined />, label: "Research Project" },
      { icon: <FileSearchOutlined />, label: "Paper Project" },
      // { icon: <ProjectOutlined />, label: "Case Study Project" },
    ],
  },
  {
    icon: <ExperimentOutlined />,
    label: "Research Project",
    subItems: [
      { icon: <ExperimentOutlined />, label: "Active Research" },
      { icon: <ProjectOutlined />, label: "Completed Research" },
      { icon: <FileSearchOutlined />, label: "Research Archive" },
    ],
  },
  {
    icon: <FileTextOutlined />,
    label: "Paper Project",
    badge: "3",
    subItems: [
      { icon: <FileTextOutlined />, label: "Active Paper" },
      { icon: <FormOutlined />, label: "Completed Paper" },
      { icon: <ProjectOutlined />, label: "Paper Archived" },
    ],
  },
  {
    icon: <AuditOutlined />,
    label: "Request",
    subItems: [
      { icon: <AuditOutlined />, label: "Pending Request" },
      { icon: <FormOutlined />, label: "Request Progress" },
      { icon: <TeamOutlined />, label: "Request Record" },
    ],
  },
  {
    icon: <FundOutlined />,
    label: "Quotas",
    subItems: [
      { icon: <FundOutlined />, label: "Department Quota" },
      { icon: <FormOutlined />, label: "Office Quota" },
    ],
  },
  {
    key: "timeline-management",
    icon: <FieldTimeOutlined />,
    label: "Timeline Management",
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

const NavBar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSubItem, setSelectedSubItem] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(true);

  //Get user
  const { user } = useSelector((state) => state.auth);
  const studentNavItems = [
    "Group",
    "Registration",
    "Research Project",
    "Paper Project",
  ];
  const lecturerNavItems = [
    "Group",
    "Registration",
    "Research Project",
    "Paper Project",
    "Request",
  ];
  const deptHeadNavItems = [
    "Research Project",
    "Paper Project",
    "Request",
    "Quotas",
  ];
  const officeNavItems = [
    "Group",
    "Research Project",
    "Paper Project",
    "Request",
    "Timeline Management",
    "Quotas",
  ];
  const adminNavItems = [
    "Group",
    "Registration",
    "Research Project",
    "Paper Project",
    "Request",
    "Quotas",
    "Timeline Management",
    "Menu",
  ];

  const filteredNavItems = useMemo(() => {
    let allowedItems = [];
    if (user) {
      switch (user.role) {
        case "student":
          allowedItems = studentNavItems;
          break;
        case "lecturer":
          allowedItems = lecturerNavItems;
          break;
        case "department":
          allowedItems = deptHeadNavItems;
          break;
        case "office":
          allowedItems = officeNavItems;
          break;
        case "admin":
          allowedItems = adminNavItems;
          break;
      }
    }

    return navItems
      .filter((item) => allowedItems.includes(item.label))
      .map((item) => {
        //Custom Quota for department and office role
        if (item.label === "Quotas") {
          if (user.role === "department") {
            return {
              ...item,
              subItems: item.subItems.filter(
                (subItem) => subItem.label === "Department Quota"
              ),
            };
          }
          if (user.role === "office") {
            return {
              ...item,
              subItems: item.subItems.filter(
                (subItem) => subItem.label === "Office Quota"
              ),
            };
          }
        }

        //Custom Registration for student and lecturer
        if (item.label === "Registration") {
          if (user.role === "lecturer") {
            return {
              ...item,
              subItems: item.subItems,
            };
          }
          if (user.role === "student") {
            return {
              ...item,
              subItems: item.subItems.filter(
                (subItem) => subItem.label === "Research Project"
              ),
            };
          }
        }

        // Custom Group for lecturer and Office
        if (item.label === "Group") {
          if (user.role === "lecturer") {
            return {
              ...item,
              subItems: item.subItems.filter(
                (subItem) =>
                  subItem.label === "View Group" ||
                  subItem.label === "Create Group" ||
                  subItem.label === "Manage Group"
              ),
            };
          }
          if (user.role === "office") {
            return {
              ...item,
              subItems: item.subItems.filter(
                (subItem) =>
                  subItem.label === "Create Council" ||
                  subItem.label === "Manage Council"
              ),
            };
          }
        }

        return item;
      });
  }, [user]);

  // console.log(filteredNavItems);

  const handleSubItemClick = (subItem, index) => {
    console.log("sub", subItem);
    console.log("index", index);

    switch (subItem.label) {
      case "Create Group":
        navigate("/create-group");
        break;
      case "View Group":
        navigate("/view-group");
        break;
      case "Create Council":
        navigate("/create-council");
        break;
      case "Manage Group":
        navigate("/manage-group");
        break;
      case "Manage Council":
        navigate("/manage-council");
        break;
      case "Research Project":
        navigate("/register-research-project");
        break;
      case "Paper Project":
        navigate("/register-paper");
        break;
      case "Active Research":
        navigate("/active-research");
        break;
      case "Active Paper":
        navigate("/active-paper");
        break;
      // case "Case Study Project":
      //   navigate("/register-case-study-paper");
      //   break;
      case "Pending Request":
        navigate("/pending-request");
        break;
      case "Department Quota":
        navigate("/department-quota");
        break;
      case "Office Quota":
        navigate("/office-quota");
        break;
      default:
        break;
    }
    setSelectedSubItem(subItem);
    setSelectedItem(index);
  };

  const handleItemClick = (item) => {
    switch (item.label) {
      case "Timeline Management":
        navigate("/timeline-management");
        break;
      case "Quotas":
        navigate("/quotas");
        break;
      default:
        break;
    }
    setSelectedItem(item);
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
            {filteredNavItems.map((item, index) => (
              <div key={index}>
                <button
                  className={`w-full flex items-center p-2 hover:bg-[#FFA50010] rounded-lg transition-all duration-300 group ${
                    !isNavOpen ? "justify-center" : ""
                  }`}
                  onClick={() => {
                    if (item.subItems) {
                      setIsMenuOpen(!isMenuOpen);
                      setSelectedItem(index);
                    } else {
                      handleItemClick(item);
                    }
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
                            handleSubItemClick(subItem, subIndex);
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
            {isNavOpen ? "Research Management System" : "LRMS"}
          </div>
        </div>
      </nav>
    </div>
  );
};

NavBar.propTypes = {
  allowedItems: PropTypes.arrayOf(PropTypes.string),
};

export default NavBar;
