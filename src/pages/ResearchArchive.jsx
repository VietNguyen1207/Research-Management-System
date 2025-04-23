import React, { useState, useEffect } from "react";
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
  Typography,
  Skeleton,
  Alert,
  Divider,
  Pagination,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ProjectOutlined,
  TeamOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  BankOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGetMyProjectsQuery } from "../features/project/projectApiSlice";

const { Search } = Input;
const { Title, Text, Paragraph } = Typography;

// Project Type enum mapping
const PROJECT_TYPE = {
  0: "Research",
  1: "Conference",
  2: "Journal",
};

// Project Status enum mapping
const PROJECT_STATUS = {
  0: "Pending",
  1: "Approved",
  2: "Closed",
  3: "Rejected",
  4: "Completed",
  5: "Completion Requested",
  6: "Completion Approved",
  7: "Completion Rejected",
};

// Document Type enum mapping
const DOCUMENT_TYPE = {
  0: "Project Document",
  1: "Research Publication",
  2: "Council Document",
  5: "Approval Document", // Added based on documents in data
  6: "Completion Document", // Added based on documents in data
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ResearchArchive = () => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  // Fetch projects data from API using the getMyProjects endpoint
  const {
    data: projectsData,
    isLoading,
    isError,
    error,
  } = useGetMyProjectsQuery();

  // Process the data when it's loaded
  useEffect(() => {
    if (projectsData && projectsData.data) {
      // Apply filters
      const filtered = projectsData.data.filter((project) => {
        const matchesSearch =
          searchText.toLowerCase() === ""
            ? true
            : project.projectName
                ?.toLowerCase()
                .includes(searchText.toLowerCase()) ||
              project.description
                ?.toLowerCase()
                .includes(searchText.toLowerCase());

        const matchesType =
          typeFilter === "all"
            ? true
            : project.projectType?.toString() === typeFilter;

        const matchesStatus =
          statusFilter === "all"
            ? true
            : project.status?.toString() === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
      });

      setFilteredProjects(filtered);
    }
  }, [projectsData, searchText, typeFilter, statusFilter]);

  // Calculate pagination data
  const paginationData = {
    current: currentPage,
    pageSize: pageSize,
    total: filteredProjects.length,
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
      // Scroll to top when page changes
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    showSizeChanger: true,
    pageSizeOptions: ["9", "12", "18", "24"],
    showTotal: (total) => `Total ${total} projects`,
  };

  // Get current projects for the page
  const indexOfLastProject = currentPage * pageSize;
  const indexOfFirstProject = indexOfLastProject - pageSize;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, typeFilter, statusFilter]);

  const handleViewProject = (project) => {
    navigate(`/project-details/${project.projectId}`);
  };

  // Calculate statistics from the projects
  const calculateStats = () => {
    if (!projectsData || !projectsData.data)
      return {
        totalProjects: 0,
        completedProjects: 0,
        totalDepartments: 0,
        totalGroups: 0,
      };

    const allProjects = projectsData.data;
    const completedProjects = allProjects.filter(
      (project) => project.status === 4
    );

    // Get unique departments
    const uniqueDepartments = new Set(
      allProjects.map((project) => project.departmentId)
    );

    // Get unique groups
    const uniqueGroups = new Set(allProjects.map((project) => project.groupId));

    return {
      totalProjects: allProjects.length,
      completedProjects: completedProjects.length,
      totalDepartments: uniqueDepartments.size,
      totalGroups: uniqueGroups.size,
    };
  };

  const stats = calculateStats();

  // Define filter options
  const typeOptions = [
    { label: "All Types", value: "all" },
    { label: "Research", value: "0" },
    { label: "Conference", value: "1" },
    { label: "Journal", value: "2" },
  ];

  const statusOptions = [
    { label: "All Statuses", value: "all" },
    { label: "Pending", value: "0" },
    { label: "Approved", value: "1" },
    { label: "Closed", value: "2" },
    { label: "Rejected", value: "3" },
    { label: "Completed", value: "4" },
    { label: "Completion Requested", value: "5" },
    { label: "Completion Approved", value: "6" },
    { label: "Completion Rejected", value: "7" },
  ];

  // Create a skeleton array for loading state
  const skeletonCards = Array(6).fill(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F2722B] to-[#FFA500] mb-2">
              Research Archive
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#F2722B] to-[#FFA500] rounded-full"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Browse and view all your research projects
          </p>
        </div>

        {/* Show error alert if there's an error */}
        {isError && (
          <Alert
            type="error"
            message="Error loading projects"
            description={
              error?.data?.message ||
              "Failed to load projects. Please try again later."
            }
            className="mb-8"
            showIcon
          />
        )}

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-12">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((item) => (
                <Col xs={24} sm={12} md={6} key={item}>
                  <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
                    <Skeleton active paragraph={false} />
                  </Card>
                </Col>
              ))}
            </>
          ) : (
            <>
              <Col xs={24} sm={12} md={6}>
                <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <Statistic
                    title={
                      <Text className="text-gray-600">Total Projects</Text>
                    }
                    value={stats.totalProjects}
                    prefix={<ProjectOutlined className="text-[#F2722B]" />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <Statistic
                    title={
                      <Text className="text-gray-600">Completed Projects</Text>
                    }
                    value={stats.completedProjects}
                    prefix={<ClockCircleOutlined className="text-[#F2722B]" />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <Statistic
                    title={<Text className="text-gray-600">Departments</Text>}
                    value={stats.totalDepartments}
                    prefix={<BankOutlined className="text-[#F2722B]" />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <Statistic
                    title={
                      <Text className="text-gray-600">Research Groups</Text>
                    }
                    value={stats.totalGroups}
                    prefix={<TeamOutlined className="text-[#F2722B]" />}
                  />
                </Card>
              </Col>
            </>
          )}
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
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Type
              </label>
              <Select
                placeholder="Filter by type"
                options={typeOptions}
                onChange={setTypeFilter}
                value={typeFilter}
                className="w-full"
                suffixIcon={<FilterOutlined className="text-gray-400" />}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Status
              </label>
              <Select
                placeholder="Filter by status"
                options={statusOptions}
                onChange={setStatusFilter}
                value={statusFilter}
                className="w-full"
                suffixIcon={<FilterOutlined className="text-gray-400" />}
                disabled={isLoading}
              />
            </div>
          </div>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            skeletonCards.map((_, index) => (
              <Card
                key={index}
                className="h-full hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-100 overflow-hidden bg-white"
                bodyStyle={{ padding: 0 }}
              >
                <div className="p-6">
                  <Skeleton active paragraph={{ rows: 3 }} />
                  <div className="mt-4">
                    <Skeleton.Button
                      active
                      size="small"
                      shape="round"
                      className="mr-2"
                    />
                    <Skeleton.Button active size="small" shape="round" />
                  </div>
                  <Skeleton active paragraph={{ rows: 2 }} className="mt-4" />
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <Skeleton.Button active size="default" block={true} />
                </div>
              </Card>
            ))
          ) : currentProjects.length > 0 ? (
            currentProjects.map((project, index) => (
              <motion.div
                key={project.projectId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card
                  className="h-full hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-100 overflow-hidden bg-white"
                  bodyStyle={{ padding: 0 }}
                >
                  <div className="p-6">
                    {/* Project Type & Status */}
                    <div className="flex justify-between items-center mb-4">
                      <Tag color="cyan" className="text-sm">
                        {PROJECT_TYPE[project.projectType] || "Research"}
                      </Tag>
                      <Tag
                        color={
                          project.status === 1
                            ? "green"
                            : project.status === 2
                            ? "geekblue"
                            : project.status === 3
                            ? "error"
                            : project.status === 4
                            ? "success"
                            : project.status === 5
                            ? "processing"
                            : project.status === 6
                            ? "success"
                            : project.status === 7
                            ? "error"
                            : "default"
                        }
                        className="text-sm"
                      >
                        {PROJECT_STATUS[project.status] || "Unknown"}
                      </Tag>
                    </div>

                    {/* Project Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {project.projectName}
                    </h3>

                    {/* Project Description */}
                    <Paragraph className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {project.description}
                    </Paragraph>

                    {/* Project Timeline */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <Text className="text-sm text-gray-500">Timeline</Text>
                        <Text className="text-sm font-medium">
                          {formatDate(project.startDate)} -{" "}
                          {formatDate(project.endDate)}
                        </Text>
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <Text className="text-sm text-gray-500">Budget</Text>
                        <Text className="text-sm font-medium">
                          ₫{project.approvedBudget?.toLocaleString()}
                        </Text>
                      </div>
                      {project.spentBudget > 0 && (
                        <div className="flex justify-between items-center mb-2">
                          <Text className="text-sm text-gray-500">Spent</Text>
                          <Text className="text-sm font-medium">
                            ₫{project.spentBudget?.toLocaleString()}
                          </Text>
                        </div>
                      )}
                    </div>

                    {/* Project Details */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <TeamOutlined className="mr-2" />
                        <span>Group: {project.groupName}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <BankOutlined className="mr-2" />
                        <span>Department: {project.departmentName}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarOutlined className="mr-2" />
                        <span>Created: {formatDate(project.createdAt)}</span>
                      </div>
                      {project.documents && (
                        <div className="flex items-center text-sm text-gray-500">
                          <FileTextOutlined className="mr-2" />
                          <span>Documents: {project.documents.length}</span>
                        </div>
                      )}
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
                    No projects match your search criteria
                  </span>
                }
                className="my-8"
              />
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProjects.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Pagination {...paginationData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchArchive;
