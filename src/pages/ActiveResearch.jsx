import React, { useState } from "react";
import { Card, Tag, Button, Input, Select, Empty, Tooltip, Badge } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ProjectOutlined,
  TeamOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const ActiveResearch = () => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const handleViewProject = (project) => {
    navigate(`/active-research-details`);
  };
  // const handleViewProject = (project) => {
  //   navigate(`/active-research/${project.id}`);
  // };

  // Enhanced mock data
  const projects = [
    {
      id: 1,
      type: "Research",
      title: "AI-Driven Healthcare Solutions",
      description:
        "A comprehensive study on implementing AI solutions in healthcare systems to improve patient care and operational efficiency.",
      department: {
        id: 1,
        name: "Computer Science",
      },
      category: {
        id: 1,
        name: "AI & Machine Learning",
      },
      status: "active",
    },
    {
      id: 2,
      type: "Research",
      title: "Sustainable Energy Systems",
      description:
        "Investigation of renewable energy integration in urban environments, focusing on solar and wind power optimization.",
      department: {
        id: 2,
        name: "Engineering",
      },
      category: {
        id: 2,
        name: "Renewable Energy",
      },
      status: "active",
    },
    {
      id: 3,
      type: "Research",
      title: "Blockchain in Healthcare Data",
      description:
        "Exploring the implementation of blockchain technology for secure and efficient healthcare data management and sharing.",
      department: {
        id: 1,
        name: "Computer Science",
      },
      category: {
        id: 3,
        name: "Blockchain",
      },
      status: "active",
    },
    {
      id: 4,
      type: "Research",
      title: "Smart City Infrastructure",
      description:
        "Development of intelligent urban infrastructure systems using IoT sensors and real-time data analytics.",
      department: {
        id: 2,
        name: "Engineering",
      },
      category: {
        id: 4,
        name: "IoT & Smart Systems",
      },
      status: "active",
    },
    {
      id: 5,
      type: "Research",
      title: "Quantum Computing Applications",
      description:
        "Research on practical applications of quantum computing in cryptography and complex system simulations.",
      department: {
        id: 1,
        name: "Computer Science",
      },
      category: {
        id: 5,
        name: "Quantum Computing",
      },
      status: "active",
    },
    {
      id: 6,
      type: "Research",
      title: "Advanced Materials Science",
      description:
        "Investigation of novel materials with enhanced properties for sustainable manufacturing and construction.",
      department: {
        id: 2,
        name: "Engineering",
      },
      category: {
        id: 6,
        name: "Materials Science",
      },
      status: "active",
    },
  ];

  const departments = [
    { label: "All Departments", value: "all" },
    { label: "Computer Science", value: "cs" },
    { label: "Engineering", value: "eng" },
    { label: "Medicine", value: "med" },
  ];

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Active", value: "active" },
    { label: "On Hold", value: "on_hold" },
    { label: "Completed", value: "completed" },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchText.toLowerCase()) ||
      project.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || project.status === filterStatus;
    const matchesDepartment =
      selectedDepartment === "all" ||
      project.department.id === selectedDepartment;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Softened Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              Active Research Projects
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#F2722B] to-[#FFA500]/70 rounded-full"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            View and manage your ongoing research projects
          </p>
        </div>

        {/* Filters Section with softer background */}
        <div className="mb-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Projects
              </label>
              <Search
                placeholder="Search by title or description..."
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <Select
                placeholder="Filter by department"
                options={departments}
                onChange={setSelectedDepartment}
                value={selectedDepartment}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                placeholder="Filter by status"
                options={statusOptions}
                onChange={setFilterStatus}
                value={filterStatus}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Projects Grid with softer colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card
                  className="h-full hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-100 overflow-hidden bg-white"
                  bodyStyle={{ padding: 0 }}
                  actions={[
                    <Tooltip title="View Details">
                      <Button
                        type="link"
                        className="text-[#F2722B] hover:text-[#E65D1B]"
                        icon={<ArrowRightOutlined />}
                        onClick={() => handleViewProject(project)}
                      >
                        View Details
                      </Button>
                    </Tooltip>,
                  ]}
                >
                  <div className="flex flex-col h-full">
                    {/* Project Header with softer gradient */}
                    <div className="p-6 bg-gradient-to-r from-slate-50 to-gray-50">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                        {project.title}
                      </h3>
                      <div className="mb-4">
                        <div className="text-sm text-gray-500 mb-1">Type</div>
                        <Tag color="cyan" className="mt-1 text-center">
                          <span className="font-medium">Research:</span>{" "}
                          {project.type}
                        </Tag>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-3 min-h-[4.5em]">
                        {project.description}
                      </p>
                    </div>

                    {/* Tags Section with softer background */}
                    <div className="mt-auto px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                      <div className="text-sm text-gray-500 mb-1">Category</div>
                      <Tag color="gold" className="mt-1">
                        {project.category.name}
                      </Tag>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full">
              <Empty
                description={
                  <span className="text-gray-500">
                    No research projects found
                  </span>
                }
                className="my-8"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveResearch;
