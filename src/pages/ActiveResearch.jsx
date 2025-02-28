import React, { useState } from "react";
import {
  Card,
  Tag,
  Button,
  Input,
  Select,
  Empty,
  Row,
  Col,
  Statistic,
  Progress,
  Typography,
  Divider,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ProjectOutlined,
  TeamOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Title, Text, Paragraph } = Typography;

const ActiveResearch = () => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const handleViewProject = (project) => {
    navigate(`/active-research-details`);
  };

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

  // Calculate statistics
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    totalResearchers: [
      ...new Set(
        projects.flatMap((p) => p.researchers?.map((r) => r.id) || [])
      ),
    ].length,
    completedMilestones: projects.reduce(
      (acc, p) => acc + (p.completedMilestones || 0),
      0
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F2722B] to-[#FFA500] mb-2">
              Active Research Projects
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#F2722B] to-[#FFA500] rounded-full"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore and manage ongoing research initiatives and collaborations
          </p>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-12">
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={<Text className="text-gray-600">Total Projects</Text>}
                value={stats.totalProjects}
                prefix={<ProjectOutlined className="text-[#F2722B]" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={<Text className="text-gray-600">Active Projects</Text>}
                value={stats.activeProjects}
                prefix={<ClockCircleOutlined className="text-[#F2722B]" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={<Text className="text-gray-600">Total Researchers</Text>}
                value={stats.totalResearchers}
                prefix={<TeamOutlined className="text-[#F2722B]" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={
                  <Text className="text-gray-600">Completed Milestones</Text>
                }
                value={stats.completedMilestones}
                prefix={<CheckCircleOutlined className="text-[#F2722B]" />}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters Section */}
        <Card className="mb-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
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
                prefix={<SearchOutlined className="text-gray-400" />}
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
                suffixIcon={<FilterOutlined className="text-gray-400" />}
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
                suffixIcon={<FilterOutlined className="text-gray-400" />}
              />
            </div>
          </div>
        </Card>

        {/* Projects Grid */}
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
                >
                  <div className="p-6">
                    {/* Project Type & Category */}
                    <div className="flex justify-between items-center mb-4">
                      <Tag color="cyan" className="text-sm">
                        {project.type}
                      </Tag>
                      <Tag color="orange" className="text-sm">
                        {project.category.name}
                      </Tag>
                    </div>

                    {/* Project Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {project.title}
                    </h3>

                    {/* Project Description */}
                    <Paragraph className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {project.description}
                    </Paragraph>

                    {/* Project Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <Text className="text-sm text-gray-500">Progress</Text>
                        <Text className="text-sm font-medium">
                          {project.progress || 0}%
                        </Text>
                      </div>
                      <Progress
                        percent={project.progress || 0}
                        size="small"
                        strokeColor={{
                          "0%": "#F2722B",
                          "100%": "#FFA500",
                        }}
                      />
                    </div>

                    {/* Budget Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <Text className="text-sm text-gray-500">Budget</Text>
                        <Text className="text-sm font-medium">
                          ₫{(project.spentBudget || 0).toLocaleString()} / ₫
                          {(project.totalBudget || 0).toLocaleString()}
                        </Text>
                      </div>
                      <Progress
                        percent={
                          ((project.spentBudget || 0) /
                            (project.totalBudget || 1)) *
                          100
                        }
                        size="small"
                        status={
                          project.spentBudget > project.totalBudget
                            ? "exception"
                            : "active"
                        }
                        strokeColor={{
                          "0%": "#52c41a",
                          "100%": "#1890ff",
                        }}
                      />
                    </div>

                    {/* Project Details */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <TeamOutlined className="mr-2" />
                        <span>
                          {project.researchers?.length || 0} Researchers
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FileTextOutlined className="mr-2" />
                        <span>
                          {project.publications?.length || 0} Publications
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <Button
                      type="primary"
                      icon={<ArrowRightOutlined />}
                      onClick={() => handleViewProject(project)}
                      className="w-full bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none"
                    >
                      View Details
                    </Button>
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
