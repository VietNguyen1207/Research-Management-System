import React, { useState, useMemo, useEffect, useRef } from "react";
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
  DollarOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Menu, Tooltip } from "antd";

// Define route mappings
const ROUTE_MAPPINGS = {
  "Create Group": "/create-group",
  "View Group": "/view-group",
  "Create Council": "/create-council",
  "Manage Group": "/manage-group",
  "Manage Council": "/manage-council",
  "Research Project": "/register-research-project",
  "Paper Project": "/register-paper",
  "Active Research": "/active-research",
  "Research Archive": "/research-archive",
  "Active Paper": "/active-paper",
  "Pending Request": "/pending-request",
  "Department Quota": "/department-quota",
  "Quota Management": "/quota-management",
  "Fund Disbursement": "/pending-disbursements",
  "Request Record": "/request-record",
  "Timeline Management": "/timeline-management",
  "User Management": "/admin/users",
  "Project Management": "/admin/projects",
  "Academic Calendar": "/timeline-schedule",
  "Assign Review": "/assign-review",
};

// Define navItems outside of component
const navItems = [
  {
    icon: <TeamOutlined />,
    label: "Group",
    subItems: [
      { icon: <TeamOutlined />, label: "View Group" },
      { icon: <FormOutlined />, label: "Create Group" },
      { icon: <FormOutlined />, label: "Create Council" },
      { icon: <UserOutlined />, label: "Manage Council" },
      { icon: <AuditOutlined />, label: "Assign Review" },
    ],
  },
  {
    icon: <FormOutlined />,
    label: "Registration",
    subItems: [{ icon: <FormOutlined />, label: "Research Project" }],
  },
  {
    icon: <ExperimentOutlined />,
    label: "Research Project",
    subItems: [{ icon: <ExperimentOutlined />, label: "Active Research" }],
  },
  {
    icon: <FileTextOutlined />,
    label: "Paper Project",
    badge: "3",
    subItems: [
      { icon: <FileTextOutlined />, label: "Active Paper" },
      { icon: <ProjectOutlined />, label: "Paper Archived" },
    ],
  },
  {
    icon: <AuditOutlined />,
    label: "Request",
    subItems: [
      { icon: <AuditOutlined />, label: "Pending Request" },
      { icon: <TeamOutlined />, label: "Request Record" },
    ],
  },
  {
    icon: <FundOutlined />,
    label: "Quotas",
    subItems: [
      { icon: <FundOutlined />, label: "Department Quota" },
      { icon: <FormOutlined />, label: "Quota Management" },
      { icon: <DollarOutlined />, label: "Fund Disbursement" },
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
  {
    key: "timeline-schedule",
    icon: <FieldTimeOutlined />,
    label: "Academic Calendar",
  },
];

// Update the adminSpecificNavItems to remove subItems
const adminSpecificNavItems = [
  {
    icon: <TeamOutlined />,
    label: "User Management",
  },
  // {
  //   icon: <ProjectOutlined />,
  //   label: "Project Management",
  // },
  // {
  //   icon: <FundOutlined />,
  //   label: "Quota Management",
  // },
  // {
  //   icon: <FieldTimeOutlined />,
  //   label: "Timeline Management",
  // },
];

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  // Track open state for each menu section
  const [openSections, setOpenSections] = useState({});
  const [activeRoute, setActiveRoute] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(() => {
    // Get saved preference from localStorage, default to true if not found
    const savedState = localStorage.getItem("navbarOpen");
    return savedState === null ? true : savedState === "true";
  });
  // For hover preview of menu items
  const [hoverItem, setHoverItem] = useState(null);
  // For touch gesture support
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);

  //Get user
  const { user } = useSelector((state) => state.auth);
  const studentNavItems = [
    "Group",
    // "Registration",
    "Research Project",
    // "Paper Project",
    "Academic Calendar",
  ];
  const lecturerNavItems = [
    "Group",
    "Registration",
    "Research Project",
    "Paper Project",
    "Request",
    "Academic Calendar",
  ];
  const researcherNavItems = [
    "Group",
    "Registration",
    "Research Project",
    "Paper Project",
    "Request",
    "Academic Calendar",
  ];
  const deptHeadNavItems = [
    "Research Project",
    "Paper Project",
    "Request",
    "Quotas",
  ];
  const officeNavItems = [
    "Group",
    // "Research Project",
    // "Paper Project",
    // "Request",
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

  // Find currently active route and section
  useEffect(() => {
    const currentPath = location.pathname;
    setActiveRoute(currentPath);

    // Find which section contains the active route
    let foundSection = false;

    navItems.forEach((item, index) => {
      if (item.subItems) {
        item.subItems.forEach((subItem) => {
          const route = ROUTE_MAPPINGS[subItem.label];
          if (route && currentPath === route) {
            // Auto-expand the section containing the active route
            setOpenSections((prev) => ({ ...prev, [item.label]: true }));
            foundSection = true;
          }
        });
      } else if (ROUTE_MAPPINGS[item.label] === currentPath) {
        foundSection = true;
      }
    });

    // For admin specific items
    if (!foundSection && user?.role === 0) {
      adminSpecificNavItems.forEach((item) => {
        const route = ROUTE_MAPPINGS[item.label];
        if (route && currentPath.startsWith(route)) {
          foundSection = true;
        }
      });
    }
  }, [location.pathname, user]);

  // Save nav state to localStorage when changed
  useEffect(() => {
    localStorage.setItem("navbarOpen", isNavOpen);
  }, [isNavOpen]);

  // Auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsNavOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    // Initial check
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        case "researcher":
          allowedItems = researcherNavItems;
          break;
        case "department":
          allowedItems = deptHeadNavItems;
          break;
        case "office":
          allowedItems = officeNavItems;
          break;
        case "admin":
        case 0: // Add numeric check for admin
          // Return admin-specific items instead of filtering from navItems
          return adminSpecificNavItems;
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
                (subItem) =>
                  subItem.label === "Quota Management" ||
                  subItem.label === "Fund Disbursement"
              ),
            };
          }
        }

        //Custom Registration for student and lecturer
        if (item.label === "Registration") {
          if (user.role === "lecturer" || user.role === "researcher") {
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
          if (user.role === "lecturer" || user.role === "researcher") {
            return {
              ...item,
              subItems: item.subItems.filter(
                (subItem) =>
                  subItem.label === "View Group" ||
                  subItem.label === "Create Group"
              ),
            };
          }
          if (user.role === "office") {
            return {
              ...item,
              subItems: item.subItems.filter(
                (subItem) =>
                  subItem.label === "Create Council" ||
                  subItem.label === "Manage Council" ||
                  subItem.label === "Assign Review"
              ),
            };
          }
          if (user.role === "student") {
            return {
              ...item,
              subItems: item.subItems.filter(
                (subItem) =>
                  subItem.label === "View Group" ||
                  subItem.label === "Create Group"
              ),
            };
          }
        }

        return item;
      });
  }, [user]);

  const handleSubItemClick = (subItem) => {
    const route = ROUTE_MAPPINGS[subItem.label];
    if (route) {
      navigate(route);
    }
  };

  const handleItemClick = (item) => {
    if (item.subItems) {
      // Toggle the section state
      setOpenSections((prev) => ({
        ...prev,
        [item.label]: !prev[item.label],
      }));

      // If sidebar is collapsed, open it when expanding a section
      if (!isNavOpen) {
        setIsNavOpen(true);
      }
    } else {
      // Direct navigation for items without subItems
      let route = ROUTE_MAPPINGS[item.label];

      // Special handling for admin routes
      if (user && user.role === 0) {
        if (item.label === "Timeline Management") {
          route = "/admin/timelines";
        } else if (item.label === "Quota Management") {
          route = "/admin/quotas";
        }
      }

      if (route) {
        navigate(route);
      }
    }
  };

  // Check if a route is active
  const isRouteActive = (routeName) => {
    const route = ROUTE_MAPPINGS[routeName];
    return route && activeRoute === route;
  };

  // Check if any subroute in a section is active
  const isSectionActive = (item) => {
    if (!item.subItems) {
      return isRouteActive(item.label);
    }

    return item.subItems.some((subItem) => isRouteActive(subItem.label));
  };

  // Handle touch gestures for the navbar
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    // Calculate horizontal and vertical swipe distances
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Only respond to horizontal swipes (ignore vertical scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) * 2) {
      // Right swipe opens, left swipe closes (when in appropriate states)
      if (deltaX > 70 && !isNavOpen) {
        setIsNavOpen(true);
      } else if (deltaX < -70 && isNavOpen) {
        setIsNavOpen(false);
      }
    }
  };

  // Add a click outside handler to close navbar on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only apply on mobile/tablet screens
      if (
        window.innerWidth < 768 &&
        isNavOpen &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setIsNavOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNavOpen]);

  return (
    <div
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] z-10"
      ref={navRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <nav
        className={`h-full bg-white shadow-lg border-r border-[#FFA50033] flex flex-col transition-all duration-300 ease-in-out ${
          isNavOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="p-4 border-b border-[#FFA50033] flex justify-end">
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="p-2 rounded-lg hover:bg-[#FFA50015] text-gray-600 hover:text-[#F2722B] transition-all duration-200"
            aria-label={isNavOpen ? "Collapse menu" : "Expand menu"}
          >
            {isNavOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {filteredNavItems.map((item, index) => {
              const isActive = isSectionActive(item);
              const isOpen = openSections[item.label];

              return (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => !isNavOpen && setHoverItem(item)}
                  onMouseLeave={() => setHoverItem(null)}
                >
                  {/* Hover preview popup for collapsed state */}
                  {!isNavOpen && hoverItem === item && item.subItems && (
                    <div className="absolute left-full top-0 ml-2 bg-white shadow-lg rounded-md py-2 px-3 z-20 w-48 border border-gray-100">
                      <div className="font-medium text-gray-800 pb-2 mb-1 border-b border-gray-100">
                        {item.label}
                      </div>
                      <div className="space-y-1">
                        {item.subItems.map((subItem, idx) => (
                          <div
                            key={idx}
                            className="py-1.5 px-2 hover:bg-[#FFA50010] rounded-md cursor-pointer flex items-center text-gray-600 hover:text-[#F2722B]"
                            onClick={() => handleSubItemClick(subItem)}
                          >
                            <span className="text-lg mr-2">{subItem.icon}</span>
                            <span>{subItem.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Main button - with Tooltip when collapsed */}
                  {!isNavOpen ? (
                    <Tooltip
                      title={item.label}
                      placement="right"
                      mouseEnterDelay={0.5}
                      overlayClassName="nav-tooltip"
                    >
                      <button
                        className={`w-full flex items-center p-2 rounded-lg transition-all duration-300 group ${
                          !isNavOpen ? "justify-center" : ""
                        } ${
                          isActive
                            ? "bg-[#FFA50020] text-[#F2722B]"
                            : "hover:bg-[#FFA50010] text-gray-600 hover:text-[#F2722B]"
                        }`}
                        onClick={() => handleItemClick(item)}
                        aria-expanded={isOpen}
                        aria-controls={`section-${index}`}
                      >
                        <span
                          className={`text-xl ${
                            isActive
                              ? "text-[#F2722B]"
                              : "text-gray-600 group-hover:text-[#F2722B]"
                          } transition-colors duration-200`}
                        >
                          {item.icon}
                        </span>

                        <span
                          className={`ml-3 flex-1 font-medium transition-all duration-300 ${
                            isActive
                              ? "text-[#F2722B]"
                              : "text-gray-600 group-hover:text-[#F2722B]"
                          } ${
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

                        {isNavOpen && item.subItems && (
                          <span
                            className={`transition-transform duration-200 ml-2 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            <CaretDownOutlined
                              className={
                                isActive ? "text-[#F2722B]" : "text-gray-400"
                              }
                            />
                          </span>
                        )}
                      </button>
                    </Tooltip>
                  ) : (
                    <button
                      className={`w-full flex items-center p-2 rounded-lg transition-all duration-300 group ${
                        !isNavOpen ? "justify-center" : ""
                      } ${
                        isActive
                          ? "bg-[#FFA50020] text-[#F2722B]"
                          : "hover:bg-[#FFA50010] text-gray-600 hover:text-[#F2722B]"
                      }`}
                      onClick={() => handleItemClick(item)}
                      aria-expanded={isOpen}
                      aria-controls={`section-${index}`}
                    >
                      <span
                        className={`text-xl ${
                          isActive
                            ? "text-[#F2722B]"
                            : "text-gray-600 group-hover:text-[#F2722B]"
                        } transition-colors duration-200`}
                      >
                        {item.icon}
                      </span>

                      <span
                        className={`ml-3 flex-1 font-medium transition-all duration-300 ${
                          isActive
                            ? "text-[#F2722B]"
                            : "text-gray-600 group-hover:text-[#F2722B]"
                        } ${
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

                      {isNavOpen && item.subItems && (
                        <span
                          className={`transition-transform duration-200 ml-2 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          <CaretDownOutlined
                            className={
                              isActive ? "text-[#F2722B]" : "text-gray-400"
                            }
                          />
                        </span>
                      )}
                    </button>
                  )}

                  {/* Rest of existing code for expanded submenu */}
                  {item.subItems && isOpen && isNavOpen && (
                    <div
                      id={`section-${index}`}
                      className="ml-4 mt-2 space-y-1 transition-all duration-500 ease-in-out"
                    >
                      {item.subItems.map((subItem, subIndex) => {
                        const isSubActive = isRouteActive(subItem.label);

                        return (
                          <button
                            key={subIndex}
                            className={`w-full flex items-center p-2 rounded-lg transition-all duration-300 group ${
                              isSubActive
                                ? "bg-[#FFA50015] text-[#F2722B]"
                                : "hover:bg-[#FFA50010] text-gray-600 hover:text-[#F2722B]"
                            }`}
                            onClick={() => handleSubItemClick(subItem)}
                            aria-current={isSubActive ? "page" : undefined}
                          >
                            <span
                              className={`text-lg ${
                                isSubActive
                                  ? "text-[#F2722B]"
                                  : "text-gray-600 group-hover:text-[#F2722B]"
                              } transition-colors duration-200`}
                            >
                              {subItem.icon}
                            </span>
                            <span
                              className={`ml-3 ${
                                isSubActive
                                  ? "text-[#F2722B] font-medium"
                                  : "text-gray-600 group-hover:text-[#F2722B]"
                              } transition-colors duration-200`}
                            >
                              {subItem.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
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

      {/* Swipe indicator for mobile - subtle hint for users */}
      {!isNavOpen && window.innerWidth < 768 && (
        <div className="absolute top-1/2 left-16 -translate-y-1/2 bg-[#FFA50010] text-[#F2722B] p-1 rounded-r-full animate-pulse opacity-70">
          <CaretRightOutlined />
        </div>
      )}
    </div>
  );
};

NavBar.propTypes = {
  allowedItems: PropTypes.arrayOf(PropTypes.string),
};

export default NavBar;
