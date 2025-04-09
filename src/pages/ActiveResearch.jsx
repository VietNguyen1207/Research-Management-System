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
  Progress,
  Typography,
  Divider,
  Spin,
  message,
  Modal,
  Timeline,
  Descriptions,
  Collapse,
  Space,
  Avatar,
  Tooltip,
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
  LoadingOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  BankOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGetMyProjectsQuery } from "../features/project/projectApiSlice";

const { Search } = Input;
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

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
  2: "Work in progress",
  3: "Rejected",
};

// Document Type enum mapping
const DOCUMENT_TYPE = {
  0: "Project Document",
  1: "Research Publication",
  2: "Council Document",
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

const ActiveResearch = () => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch projects data from API
  const {
    data: projectsData,
    isLoading,
    isError,
    error,
  } = useGetMyProjectsQuery();

  // Process the data when it's loaded
  useEffect(() => {
    if (projectsData && projectsData.data) {
      // Filter active projects (status 1 - Approved)
      const activeProjects = projectsData.data.filter(
        (project) => project.status === 1
      );

      // Apply additional filters
      const filtered = activeProjects.filter((project) => {
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
            : project.projectType.toString() === typeFilter;

        return matchesSearch && matchesType;
      });

      setFilteredProjects(filtered);
    }
  }, [projectsData, searchText, typeFilter]);

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setIsModalVisible(true);
  };

  const handleDownloadDocument = (documentUrl) => {
    window.open(documentUrl, "_blank");
  };

  // Calculate statistics from the active projects
  const calculateStats = () => {
    if (!projectsData || !projectsData.data)
      return {
        totalProjects: 0,
        activeProjects: 0,
        totalDocuments: 0,
        completedMilestones: 0,
      };

    const activeProjects = projectsData.data.filter(
      (project) => project.status === 1
    );

    // Calculate completed milestones
    const completedMilestones = activeProjects.reduce((acc, project) => {
      const completedCount =
        project.milestones?.filter((m) => m.status === 1)?.length || 0;
      return acc + completedCount;
    }, 0);

    // Calculate total documents
    const totalDocuments = activeProjects.reduce((acc, project) => {
      return acc + (project.documents?.length || 0);
    }, 0);

    return {
      totalProjects: projectsData.data.length,
      activeProjects: activeProjects.length,
      totalDocuments,
      completedMilestones,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
          tip="Loading projects..."
        />
      </div>
    );
  }

  if (isError) {
    message.error("Failed to load projects");
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Error loading projects
          </h2>
          <p className="mt-2 text-gray-600">
            {error?.data?.message ||
              "Failed to load projects. Please try again later."}
          </p>
        </div>
      </div>
    );
  }

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
                title={<Text className="text-gray-600">Documents</Text>}
                value={stats.totalDocuments}
                prefix={<FileTextOutlined className="text-[#F2722B]" />}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                Project Type
              </label>
              <Select
                placeholder="Filter by type"
                options={typeOptions}
                onChange={setTypeFilter}
                value={typeFilter}
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
                    {/* Project Type & Department */}
                    <div className="flex justify-between items-center mb-4">
                      <Tag color="cyan" className="text-sm">
                        {PROJECT_TYPE[project.projectType]}
                      </Tag>
                      <Tag color="orange" className="text-sm">
                        Department {project.departmentId}
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

                    {/* Project Progress - based on milestones */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <Text className="text-sm text-gray-500">
                          Milestones
                        </Text>
                        <Text className="text-sm font-medium">
                          {project.milestones?.length || 0} Total
                        </Text>
                      </div>
                      <Progress
                        percent={
                          ((project.milestones?.filter((m) => m.status === 1)
                            ?.length || 0) /
                            (project.milestones?.length || 1)) *
                          100
                        }
                        size="small"
                        strokeColor={{
                          "0%": "#F2722B",
                          "100%": "#FFA500",
                        }}
                      />
                    </div>

                    {/* Budget */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <Text className="text-sm text-gray-500">Budget</Text>
                        <Text className="text-sm font-medium">
                          ₫{project.approvedBudget?.toLocaleString()}
                        </Text>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <TeamOutlined className="mr-2" />
                        <span>Group: {project.groupName}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FileTextOutlined className="mr-2" />
                        <span>{project.documents?.length || 0} Documents</span>
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
                    No active research projects found
                  </span>
                }
                className="my-8"
              />
            </div>
          )}
        </div>

        {/* Project Details Modal */}
        <Modal
          title={
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-800">
                {selectedProject?.projectName}
              </span>
              <Tag color="green" className="ml-3">
                {PROJECT_STATUS[selectedProject?.status]}
              </Tag>
              <Tag color="blue" className="ml-2">
                {PROJECT_TYPE[selectedProject?.projectType]}
              </Tag>
            </div>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width={900}
          footer={[
            <Button key="back" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ]}
          className="project-details-modal"
        >
          {selectedProject ? (
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              {/* Project Overview Section */}
              <Collapse
                defaultActiveKey={["1"]}
                expandIconPosition="end"
                className="mb-4 border-0 bg-white"
              >
                <Panel
                  header={
                    <div className="flex items-center">
                      <InfoCircleOutlined className="text-[#F2722B] mr-2" />
                      <span className="text-base font-medium">
                        Project Overview
                      </span>
                    </div>
                  }
                  key="1"
                  className="rounded-lg shadow-sm"
                >
                  <Descriptions
                    bordered
                    column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
                  >
                    <Descriptions.Item label="Project ID">
                      {selectedProject.projectId}
                    </Descriptions.Item>
                    <Descriptions.Item label="Group">
                      {selectedProject.groupName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Department">
                      Department {selectedProject.departmentId}
                    </Descriptions.Item>
                    <Descriptions.Item label="Created By">
                      User ID: {selectedProject.createdBy}
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                      {formatDate(selectedProject.createdAt)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Budget">
                      ₫{selectedProject.approvedBudget.toLocaleString()}
                    </Descriptions.Item>
                  </Descriptions>

                  <div className="mt-4">
                    <h4 className="text-base font-medium mb-2">Description</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {selectedProject.description}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-base font-medium mb-2">Methodology</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {selectedProject.methodology}
                    </div>
                  </div>
                </Panel>
              </Collapse>

              {/* Timeline Section */}
              <Collapse
                defaultActiveKey={["1"]}
                expandIconPosition="end"
                className="mb-4 border-0 bg-white"
              >
                <Panel
                  header={
                    <div className="flex items-center">
                      <CalendarOutlined className="text-[#F2722B] mr-2" />
                      <span className="text-base font-medium">
                        Timeline & Milestones
                      </span>
                    </div>
                  }
                  key="1"
                  className="rounded-lg shadow-sm"
                >
                  <div className="flex items-center mb-4 bg-gray-50 p-3 rounded-lg">
                    <CalendarOutlined className="text-gray-500 mr-2" />
                    <span className="text-gray-700">Project Duration: </span>
                    <span className="ml-2 font-medium">
                      {formatDate(selectedProject.startDate)} -{" "}
                      {formatDate(selectedProject.endDate)}
                    </span>
                  </div>

                  <div className="mb-2">
                    <h4 className="text-base font-medium mb-3">Milestones</h4>
                    {selectedProject.milestones &&
                    selectedProject.milestones.length > 0 ? (
                      <Timeline>
                        {selectedProject.milestones.map((milestone) => (
                          <Timeline.Item
                            key={milestone.milestoneId}
                            color={milestone.status === 1 ? "green" : "blue"}
                            dot={
                              milestone.status === 1 ? (
                                <CheckCircleOutlined />
                              ) : (
                                <ClockCircleOutlined />
                              )
                            }
                          >
                            <div className="mb-1 font-medium">
                              {milestone.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(milestone.startDate)} -{" "}
                              {formatDate(milestone.endDate)}
                            </div>
                            <div className="text-sm">
                              <Tag
                                color={
                                  milestone.status === 1
                                    ? "success"
                                    : "processing"
                                }
                              >
                                {milestone.status === 1
                                  ? "Completed"
                                  : "In Progress"}
                              </Tag>
                            </div>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    ) : (
                      <Empty description="No milestones found" />
                    )}
                  </div>
                </Panel>
              </Collapse>

              {/* Documents Section */}
              <Collapse
                defaultActiveKey={["1"]}
                expandIconPosition="end"
                className="mb-4 border-0 bg-white"
              >
                <Panel
                  header={
                    <div className="flex items-center">
                      <FileOutlined className="text-[#F2722B] mr-2" />
                      <span className="text-base font-medium">
                        Project Documents
                      </span>
                    </div>
                  }
                  key="1"
                  className="rounded-lg shadow-sm"
                >
                  {selectedProject.documents &&
                  selectedProject.documents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedProject.documents.map((doc) => (
                        <div
                          key={doc.documentId}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center">
                            <FileTextOutlined className="text-gray-500 mr-3 text-lg" />
                            <div>
                              <div className="font-medium text-gray-800 mb-1">
                                {doc.fileName}
                              </div>
                              <div className="text-xs text-gray-500">
                                <Tag color="blue">
                                  {DOCUMENT_TYPE[doc.documentType]}
                                </Tag>
                                <span className="ml-2">
                                  Uploaded: {formatDate(doc.uploadAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={() =>
                              handleDownloadDocument(doc.documentUrl)
                            }
                            className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none"
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty description="No documents found" />
                  )}
                </Panel>
              </Collapse>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ActiveResearch;
