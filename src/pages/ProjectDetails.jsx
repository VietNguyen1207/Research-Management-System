import React, { useState, useEffect } from "react";
import {
  Card,
  Tag,
  Timeline,
  Button,
  Modal,
  Form,
  DatePicker,
  Input,
  message,
  Dropdown,
  Space,
  Upload,
  Progress,
  List,
  Avatar,
  Tabs,
  Statistic,
  Row,
  Col,
  Tooltip,
  InputNumber,
  Typography,
  Select,
  Collapse,
  Descriptions,
  Spin,
  Empty,
  Divider,
  Badge,
  Steps,
  Drawer,
} from "antd";
import {
  ProjectOutlined,
  TeamOutlined,
  CalendarOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  UserOutlined,
  EditOutlined,
  MoreOutlined,
  UploadOutlined,
  DollarOutlined,
  FileTextOutlined,
  PlusOutlined,
  InboxOutlined,
  FileOutlined,
  DownloadOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PaperClipOutlined,
  BankOutlined,
  MailOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useGetProjectDetailsQuery } from "../features/project/projectApiSlice";

const { Text, Title, Paragraph } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Step } = Steps;

// Define role mapping
const MEMBER_ROLE = {
  0: "Leader",
  1: "Member",
  2: "Supervisor",
  3: "Member",
};

// Define status mapping
const MEMBER_STATUS = {
  0: "Pending",
  1: "Active",
  2: "Inactive",
  3: "Rejected",
};

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

// Project Phase Status enum mapping
const PHASE_STATUS = {
  0: "In Progress",
  1: "Pending",
  2: "Completed",
  3: "Overdue",
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

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get projectId from the URL if not provided through params
  const searchParams = new URLSearchParams(location.search);
  const queryProjectId = searchParams.get("projectId");

  const currentProjectId = projectId || queryProjectId;

  const [activeSection, setActiveSection] = useState("overview");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [phasesForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [fundRequestModalVisible, setFundRequestModalVisible] = useState(false);
  const [selectedPhaseForFunding, setSelectedPhaseForFunding] = useState(null);
  const [fundRequestForm] = Form.useForm();

  const {
    data: projectDetailsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProjectDetailsQuery(currentProjectId, {
    skip: !currentProjectId,
  });

  const projectDetails = projectDetailsData?.data;

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleDownloadDocument = (documentUrl) => {
    window.open(documentUrl, "_blank");
  };

  const handleUpdatePhase = (phase) => {
    setSelectedPhase(phase);
    setIsModalVisible(true);
    phasesForm.setFieldsValue({
      title: phase.title,
      startDate: phase.startDate ? new Date(phase.startDate) : null,
      endDate: phase.endDate ? new Date(phase.endDate) : null,
      status: phase.status.toString(),
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await phasesForm.validateFields();
      // Here you would typically make an API call to update the phase
      message.success("Project phase updated successfully");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const showMemberDetails = (member) => {
    setSelectedMember(member);
    setDrawerVisible(true);
  };

  const showFundRequestModal = (phase) => {
    setSelectedPhaseForFunding(phase);
    setFundRequestModalVisible(true);
    fundRequestForm.resetFields();

    // Set default values
    fundRequestForm.setFieldsValue({
      phaseId: phase.projectPhaseId,
      phaseTitle: phase.title,
      requestedAmount: Math.round(projectDetails.approvedBudget * 0.2), // Default to 20% of project budget
      purpose: `Funding for completed phase: ${phase.title}`,
    });
  };

  const handleFundRequestSubmit = async () => {
    try {
      const values = await fundRequestForm.validateFields();
      console.log("Fund request values:", values);

      // Here you would make an API call to submit the fund request
      message.success("Fund disbursement request submitted successfully!");
      setFundRequestModalVisible(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  if (!currentProjectId) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white p-10 rounded-2xl shadow-xl">
              <div className="text-red-500 text-6xl mb-6">
                <InfoCircleOutlined />
              </div>
              <h2 className="text-3xl font-bold text-red-600 mb-4">
                Project Not Found
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                No project ID was provided. Please select a project to view
                details.
              </p>
              <Button
                size="large"
                type="primary"
                onClick={() => navigate("/active-research")}
                className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none rounded-lg h-12 px-8 text-lg"
              >
                Go to Active Projects
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Spin size="large" />
          <p className="mt-4 text-lg text-gray-700 font-medium">
            Loading project details...
          </p>
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-10 rounded-2xl shadow-xl"
          >
            <div className="text-red-500 text-6xl mb-6">
              <CloseOutlined />
            </div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              Error Loading Project
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {error?.data?.message ||
                "Failed to load project details. Please try again later."}
            </p>
            <Button
              size="large"
              type="primary"
              onClick={() => refetch()}
              className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none rounded-lg h-12 px-8 text-lg"
            >
              Try Again
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!projectDetails) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-10 rounded-2xl shadow-xl"
          >
            <div className="text-yellow-500 text-6xl mb-6">
              <InfoCircleOutlined />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              No Project Found
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              The requested project could not be found.
            </p>
            <Button
              size="large"
              type="primary"
              onClick={() => navigate("/active-research")}
              className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none rounded-lg h-12 px-8 text-lg"
            >
              Go Back
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Group members by role for better organization
  const groupedMembers = projectDetails.group?.members?.reduce(
    (acc, member) => {
      const role = MEMBER_ROLE[member.role] || "Member";
      if (!acc[role]) {
        acc[role] = [];
      }
      acc[role].push(member);
      return acc;
    },
    {}
  );

  // Calculate phase progress
  const completedPhases =
    projectDetails.projectPhases?.filter((p) => p.status === 2)?.length || 0;
  const totalPhases = projectDetails.projectPhases?.length || 0;
  const progressPercentage =
    totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="bg-white hover:bg-gray-50 border border-gray-200 shadow-sm rounded-lg"
          >
            Back to Projects
          </Button>
        </div>

        {/* Project Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg rounded-2xl border-0 overflow-hidden mb-8">
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#F2722B] to-[#FFA500]"></div>
              <div className="relative pt-16 px-6 pb-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-orange-100 flex items-center justify-center border-4 border-white shadow-md">
                      <ProjectOutlined className="text-[#F2722B] text-2xl" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {projectDetails.projectName}
                      </h1>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Tag
                          color="blue"
                          className="px-3 py-1 text-sm rounded-full border-0"
                        >
                          {PROJECT_TYPE[projectDetails.projectType]}
                        </Tag>
                        <Tag
                          color={
                            projectDetails.status === 0
                              ? "gold"
                              : projectDetails.status === 1
                              ? "green"
                              : projectDetails.status === 2
                              ? "blue"
                              : "red"
                          }
                          className="px-3 py-1 text-sm rounded-full border-0"
                        >
                          {PROJECT_STATUS[projectDetails.status]}
                        </Tag>
                        <Tag
                          color="cyan"
                          className="px-3 py-1 text-sm rounded-full border-0"
                        >
                          {projectDetails.department?.departmentName}
                        </Tag>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end gap-2"></div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Project Stats Cards */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="hover:shadow-md transition-all duration-300 border-0 rounded-xl h-full flex flex-col">
                <div className="text-center">
                  <DollarOutlined className="text-green-500 text-3xl mb-2" />
                  <Statistic
                    title={<Text className="text-gray-500">Budget</Text>}
                    value={projectDetails.approvedBudget}
                    prefix="₫"
                    valueStyle={{ color: "#22c55e" }}
                    formatter={(value) => `${value.toLocaleString()}`}
                  />
                </div>
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="hover:shadow-md transition-all duration-300 border-0 rounded-xl h-full flex flex-col">
                <div className="text-center">
                  <TeamOutlined className="text-blue-500 text-3xl mb-2" />
                  <Statistic
                    title={<Text className="text-gray-500">Team Members</Text>}
                    value={projectDetails.group?.members?.length || 0}
                    valueStyle={{ color: "#3b82f6" }}
                  />
                </div>
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="hover:shadow-md transition-all duration-300 border-0 rounded-xl h-full flex flex-col">
                <div className="text-center">
                  <CalendarOutlined className="text-[#F2722B] text-3xl mb-2" />
                  <Statistic
                    title={
                      <Text className="text-gray-500">Timeline (Days)</Text>
                    }
                    value={
                      new Date(projectDetails.endDate) -
                      new Date(projectDetails.startDate)
                    }
                    formatter={(value) =>
                      Math.ceil(value / (1000 * 60 * 60 * 24))
                    }
                    valueStyle={{ color: "#F2722B" }}
                  />
                </div>
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="hover:shadow-md transition-all duration-300 border-0 rounded-xl h-full flex flex-col">
                <div className="text-center">
                  <CheckOutlined className="text-[#FFA500] text-3xl mb-2" />
                  <Statistic
                    title={<Text className="text-gray-500">Progress</Text>}
                    value={progressPercentage}
                    suffix="%"
                    valueStyle={{ color: "#FFA500" }}
                  />
                  <Progress
                    percent={progressPercentage}
                    showInfo={false}
                    strokeColor={{
                      "0%": "#F2722B",
                      "100%": "#FFA500",
                    }}
                    className="mt-2"
                  />
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Navigation Tabs */}
        <Tabs
          activeKey={activeSection}
          onChange={setActiveSection}
          type="card"
          size="large"
          className="project-tabs mb-6"
          tabBarStyle={{
            marginBottom: 24,
            backgroundColor: "white",
            padding: "8px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <TabPane
            tab={
              <Space>
                <InfoCircleOutlined />
                Overview
              </Space>
            }
            key="overview"
          />
          <TabPane
            tab={
              <Space>
                <TeamOutlined />
                Group
              </Space>
            }
            key="team"
          />
          <TabPane
            tab={
              <Space>
                <CalendarOutlined />
                Project Phases
              </Space>
            }
            key="phases"
          />
          <TabPane
            tab={
              <Space>
                <FileTextOutlined />
                Documents
              </Space>
            }
            key="documents"
          />
        </Tabs>

        {/* Dynamic Content Based on Active Section */}
        {activeSection === "overview" && (
          <div className="space-y-8">
            {/* Project Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                className="shadow-md rounded-xl border-0 overflow-hidden"
                title={
                  <div className="flex items-center">
                    <InfoCircleOutlined className="text-[#F2722B] mr-2" />
                    <span className="text-lg font-medium">
                      Project Information
                    </span>
                  </div>
                }
              >
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <div className="bg-gray-50 p-5 rounded-xl h-full">
                      <h3 className="text-lg font-medium mb-4 text-gray-800">
                        Description
                      </h3>
                      <p className="text-gray-700 whitespace-pre-line">
                        {projectDetails.description}
                      </p>
                    </div>
                  </Col>
                  <Col xs={24} lg={12}>
                    {projectDetails.methodology && (
                      <div className="bg-gray-50 p-5 rounded-xl h-full">
                        <h3 className="text-lg font-medium mb-4 text-gray-800">
                          Methodology
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">
                          {projectDetails.methodology}
                        </p>
                      </div>
                    )}
                  </Col>
                </Row>

                <Divider />

                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <Descriptions
                      title="Project Details"
                      bordered
                      column={1}
                      size="small"
                      className="rounded-xl overflow-hidden"
                      labelStyle={{ fontWeight: 600 }}
                    >
                      <Descriptions.Item label="Project ID">
                        {projectDetails.projectId}
                      </Descriptions.Item>
                      <Descriptions.Item label="Department">
                        {projectDetails.department?.departmentName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Group">
                        {projectDetails.groupName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Timeline">
                        {formatDate(projectDetails.startDate)} -{" "}
                        {formatDate(projectDetails.endDate)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Budget">
                        ₫{projectDetails.approvedBudget?.toLocaleString()}
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                  <Col xs={24} md={12}>
                    <Descriptions
                      title="Creator Information"
                      bordered
                      column={1}
                      size="small"
                      className="rounded-xl overflow-hidden"
                      labelStyle={{ fontWeight: 600 }}
                    >
                      <Descriptions.Item label="Created By">
                        {projectDetails.createdByUser?.fullName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Username">
                        {projectDetails.createdByUser?.username}
                      </Descriptions.Item>
                      <Descriptions.Item label="Email">
                        <a
                          href={`mailto:${projectDetails.createdByUser?.email}`}
                        >
                          {projectDetails.createdByUser?.email}
                        </a>
                      </Descriptions.Item>
                      <Descriptions.Item label="Created At">
                        {formatDate(projectDetails.createdAt)}
                      </Descriptions.Item>
                      {projectDetails.approvedByUser && (
                        <Descriptions.Item label="Approved By">
                          {projectDetails.approvedByUser.fullName}
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                  </Col>
                </Row>
              </Card>
            </motion.div>

            {/* Project Timeline Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card
                className="shadow-md rounded-xl border-0"
                title={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CalendarOutlined className="text-[#F2722B] mr-2" />
                      <span className="text-lg font-medium">
                        Project Timeline
                      </span>
                    </div>
                    <div>
                      <Badge
                        count={`${completedPhases}/${totalPhases}`}
                        className="site-badge-count-4"
                        style={{ backgroundColor: "#10b981" }}
                      />
                    </div>
                  </div>
                }
              >
                {totalPhases > 0 ? (
                  <div>
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-gray-500">Overall Progress</div>
                        <div className="font-medium">{progressPercentage}%</div>
                      </div>
                      <Progress
                        percent={progressPercentage}
                        status={
                          progressPercentage === 100 ? "success" : "active"
                        }
                        strokeColor={{
                          "0%": "#F2722B",
                          "100%": "#FFA500",
                        }}
                        strokeWidth={10}
                      />
                    </div>
                    <Steps
                      direction="vertical"
                      current={completedPhases}
                      percent={progressPercentage}
                    >
                      {projectDetails.projectPhases.map((phase) => (
                        <Step
                          key={phase.projectPhaseId}
                          title={
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{phase.title}</span>
                              <div className="flex gap-2">
                                <Button
                                  type="link"
                                  icon={<EditOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdatePhase(phase);
                                  }}
                                >
                                  Update
                                </Button>
                                {phase.status === 2 && (
                                  <Button
                                    type="primary"
                                    size="small"
                                    icon={<DollarOutlined />}
                                    onClick={() => showFundRequestModal(phase)}
                                    className="rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] border-none hover:from-[#16a34a] hover:to-[#15803d]"
                                  >
                                    Request Funds
                                  </Button>
                                )}
                              </div>
                            </div>
                          }
                          description={
                            <div className="mt-2">
                              <div className="text-gray-500 mb-2">
                                {formatDate(phase.startDate)} -{" "}
                                {formatDate(phase.endDate)}
                              </div>
                              <Tag
                                color={
                                  phase.status === 2
                                    ? "success"
                                    : phase.status === 3
                                    ? "error"
                                    : phase.status === 1
                                    ? "warning"
                                    : "blue"
                                }
                              >
                                {PHASE_STATUS[phase.status]}
                              </Tag>
                            </div>
                          }
                          status={
                            phase.status === 2
                              ? "finish"
                              : phase.status === 3
                              ? "error"
                              : "process"
                          }
                        />
                      ))}
                    </Steps>
                  </div>
                ) : (
                  <Empty description="No project phases found" />
                )}
              </Card>
            </motion.div>
          </div>
        )}

        {activeSection === "team" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className="shadow-md rounded-xl border-0"
              title={
                <div className="flex items-center">
                  <TeamOutlined className="text-[#F2722B] mr-2" />
                  <span className="text-lg font-medium">Team Members</span>
                </div>
              }
            >
              <Row gutter={[16, 16]} className="mb-8">
                {[
                  { role: "Leader", icon: <CrownOutlined />, color: "#F2722B" },
                  {
                    role: "Member",
                    icon: <UserOutlined />,
                    color: "#3b82f6",
                  },
                  {
                    role: "Supervisor",
                    icon: <UserOutlined />,
                    color: "#8b5cf6",
                  },
                  { role: "Member", icon: <TeamOutlined />, color: "#10b981" },
                ].map((item) => {
                  const members = groupedMembers?.[item.role] || [];
                  return (
                    <Col xs={12} md={6} key={item.role}>
                      <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div
                          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl"
                          style={{
                            backgroundColor: `${item.color}20`,
                            color: item.color,
                          }}
                        >
                          {item.icon}
                        </div>
                        <div className="mt-3 text-gray-800 font-medium">
                          {item.role}s
                        </div>
                        <div
                          className="mt-1 text-3xl font-bold"
                          style={{ color: item.color }}
                        >
                          {members.length}
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>

              {Object.entries(groupedMembers || {}).map(([role, members]) => (
                <div key={role} className="mb-10 last:mb-0">
                  <div
                    className={`
                      flex items-center text-lg font-medium mb-4 pb-2 border-b
                      ${
                        role === "Leader"
                          ? "text-[#F2722B] border-orange-200"
                          : role === "Supervisor"
                          ? "text-purple-500 border-purple-200"
                          : role === "Member"
                          ? "text-blue-500 border-blue-200"
                          : "text-emerald-500 border-emerald-200"
                      }
                    `}
                  >
                    {role === "Leader" ? (
                      <CrownOutlined className="mr-2" />
                    ) : role === "Supervisor" ? (
                      <UserOutlined className="mr-2" />
                    ) : role === "Member" ? (
                      <UserOutlined className="mr-2" />
                    ) : (
                      <TeamOutlined className="mr-2" />
                    )}
                    {role}s ({members.length})
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map((member) => (
                      <motion.div
                        key={member.groupMemberId}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={() => showMemberDetails(member)}
                        className="cursor-pointer"
                      >
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
                          <div className="flex items-center gap-3">
                            <Avatar
                              size={50}
                              icon={<UserOutlined />}
                              style={{
                                backgroundColor:
                                  role === "Leader"
                                    ? "#F2722B"
                                    : role === "Supervisor"
                                    ? "#8b5cf6"
                                    : role === "Members"
                                    ? "#3b82f6"
                                    : "#10b981",
                              }}
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-800 text-lg">
                                {member.memberName}
                              </h3>
                              <div className="text-sm text-gray-500">
                                {member.memberEmail}
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Tag
                                  color={
                                    member.status === 1 ? "success" : "warning"
                                  }
                                  className="rounded-full px-3"
                                >
                                  {MEMBER_STATUS[member.status]}
                                </Tag>
                                <div className="text-xs text-gray-500">
                                  Joined: {formatDate(member.joinDate)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          </motion.div>
        )}

        {activeSection === "phases" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className="shadow-md rounded-xl border-0 mb-6"
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarOutlined className="text-[#F2722B] mr-2" />
                    <span className="text-lg font-medium">
                      Project Timeline
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      count={completedPhases}
                      className="site-badge-count-4"
                      style={{ backgroundColor: "#10b981" }}
                    />
                    <Text>of</Text>
                    <Badge
                      count={totalPhases}
                      className="site-badge-count-4"
                      style={{ backgroundColor: "#F2722B" }}
                    />
                  </div>
                </div>
              }
            >
              <div className="mb-6">
                <Row gutter={[16, 16]} className="mb-6">
                  <Col span={24}>
                    <div className="bg-gray-50 p-5 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <Text className="text-gray-700 font-medium">
                          Project Timeline
                        </Text>
                        <Text className="text-gray-700">
                          {formatDate(projectDetails.startDate)} -{" "}
                          {formatDate(projectDetails.endDate)}
                        </Text>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-2 bg-gradient-to-r from-[#F2722B] to-[#FFA500] rounded-full"
                        />
                      </div>
                      <div className="mt-2 flex justify-between text-sm">
                        <Text className="text-gray-500">Start</Text>
                        <Text className="text-[#F2722B] font-medium">
                          {progressPercentage}% Complete
                        </Text>
                        <Text className="text-gray-500">End</Text>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {projectDetails.projectPhases &&
              projectDetails.projectPhases.length > 0 ? (
                <div className="space-y-6">
                  {projectDetails.projectPhases.map((phase, index) => (
                    <motion.div
                      key={phase.projectPhaseId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card
                        className="border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-xl"
                        bodyStyle={{ padding: "16px" }}
                      >
                        <div className="flex flex-wrap md:flex-nowrap gap-4 items-start">
                          <div className="flex-shrink-0">
                            <div
                              className={`
                              flex items-center justify-center w-12 h-12 rounded-full
                              ${
                                phase.status === 2
                                  ? "bg-green-100 text-green-600"
                                  : phase.status === 3
                                  ? "bg-red-100 text-red-600"
                                  : phase.status === 1
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-orange-100 text-[#F2722B]"
                              }
                            `}
                            >
                              {phase.status === 2 ? (
                                <CheckOutlined />
                              ) : phase.status === 3 ? (
                                <ClockCircleOutlined className="text-red-600" />
                              ) : (
                                <ClockCircleOutlined />
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-4 mb-3">
                              <div>
                                <h3 className="text-lg font-medium text-gray-800">
                                  {phase.title}
                                </h3>
                                <div className="text-sm text-gray-500 mt-1">
                                  <CalendarOutlined className="mr-1" />
                                  {formatDate(phase.startDate)} -{" "}
                                  {formatDate(phase.endDate)}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Tag
                                  color={
                                    phase.status === 2
                                      ? "success"
                                      : phase.status === 3
                                      ? "error"
                                      : phase.status === 1
                                      ? "warning"
                                      : "blue"
                                  }
                                  className="rounded-full px-3"
                                >
                                  {PHASE_STATUS[phase.status]}
                                </Tag>
                                <Button
                                  type="primary"
                                  size="small"
                                  icon={<EditOutlined />}
                                  onClick={() => handleUpdatePhase(phase)}
                                  className="rounded-full bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none hover:from-[#E65D1B] hover:to-[#FF9500]"
                                >
                                  Update
                                </Button>
                              </div>
                            </div>
                            <div className="mt-2">
                              <Progress
                                percent={
                                  phase.status === 2
                                    ? 100
                                    : phase.status === 1
                                    ? 25
                                    : phase.status === 3
                                    ? 100
                                    : 50
                                }
                                showInfo={false}
                                strokeColor={
                                  phase.status === 2
                                    ? "#10b981"
                                    : phase.status === 3
                                    ? "#ef4444"
                                    : "#F2722B"
                                }
                                status={
                                  phase.status === 3 ? "exception" : "normal"
                                }
                                strokeWidth={8}
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Empty
                  description={
                    <span className="text-gray-500">
                      No project phases found
                    </span>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </motion.div>
        )}

        {activeSection === "documents" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className="shadow-md rounded-xl border-0"
              title={
                <div className="flex items-center">
                  <FileTextOutlined className="text-[#F2722B] mr-2" />
                  <span className="text-lg font-medium">Project Documents</span>
                </div>
              }
              extra={
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none rounded-lg"
                >
                  Upload New Document
                </Button>
              }
            >
              {projectDetails.documents &&
              projectDetails.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectDetails.documents.map((doc, index) => (
                    <motion.div
                      key={doc.documentId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card
                        className="border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-xl"
                        bodyStyle={{ padding: "16px" }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div
                              className={`
                              flex items-center justify-center w-12 h-12 rounded-lg
                              ${
                                doc.documentType === 0
                                  ? "bg-blue-100 text-blue-600"
                                  : doc.documentType === 1
                                  ? "bg-green-100 text-green-600"
                                  : "bg-orange-100 text-[#F2722B]"
                              }
                            `}
                            >
                              <FileOutlined />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3
                              className="font-medium text-gray-800 mb-1 line-clamp-1"
                              title={doc.fileName}
                            >
                              {doc.fileName}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Tag
                                color={
                                  doc.documentType === 0
                                    ? "blue"
                                    : doc.documentType === 1
                                    ? "green"
                                    : "orange"
                                }
                                className="rounded-full px-2"
                              >
                                {DOCUMENT_TYPE[doc.documentType]}
                              </Tag>
                              <div className="text-xs text-gray-500">
                                Uploaded: {formatDate(doc.uploadAt)}
                              </div>
                            </div>
                            <Button
                              type="primary"
                              icon={<DownloadOutlined />}
                              onClick={() =>
                                handleDownloadDocument(doc.documentUrl)
                              }
                              className="w-full bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none rounded-lg"
                            >
                              View Document
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Empty
                  description={
                    <span className="text-gray-500">No documents found</span>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    className="mt-4 bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none rounded-lg"
                  >
                    Upload Document
                  </Button>
                </Empty>
              )}
            </Card>
          </motion.div>
        )}
      </div>

      {/* Update Phase Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <CalendarOutlined className="text-[#F2722B] mr-2" />
            <span>Update Project Phase</span>
          </div>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        okButtonProps={{
          className:
            "bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none",
        }}
      >
        <Form form={phasesForm} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label="Phase Title"
            rules={[{ required: true, message: "Please enter phase title" }]}
          >
            <Input size="large" className="rounded-lg" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[
                  { required: true, message: "Please select a start date" },
                ]}
              >
                <DatePicker className="w-full rounded-lg" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="End Date"
                rules={[
                  { required: true, message: "Please select an end date" },
                ]}
              >
                <DatePicker className="w-full rounded-lg" size="large" />
              </Form.Item>
            </Col>
          </Row>

          {/* Enhanced status section with explanations */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <Text strong className="block mb-2">
              Phase Status
            </Text>
            <Text className="text-gray-600 text-sm block mb-3">
              Updating a phase to "Completed" status will allow you to request
              fund disbursement for this phase.
            </Text>

            <Form.Item
              name="status"
              rules={[{ required: true, message: "Please select status" }]}
              className="mb-0"
            >
              <Select size="large" className="rounded-lg">
                <Select.Option value="0">
                  <div className="flex items-center">
                    <ClockCircleOutlined className="text-blue-500 mr-2" />
                    <span>In Progress</span>
                  </div>
                </Select.Option>
                <Select.Option value="1">
                  <div className="flex items-center">
                    <ClockCircleOutlined className="text-yellow-500 mr-2" />
                    <span>Pending</span>
                  </div>
                </Select.Option>
                <Select.Option value="2">
                  <div className="flex items-center">
                    <CheckOutlined className="text-green-500 mr-2" />
                    <span>Completed</span>
                  </div>
                </Select.Option>
                <Select.Option value="3">
                  <div className="flex items-center">
                    <ClockCircleOutlined className="text-red-500 mr-2" />
                    <span>Overdue</span>
                  </div>
                </Select.Option>
              </Select>
            </Form.Item>
          </div>

          {phasesForm.getFieldValue("status") === "2" && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 mb-4">
              <div className="flex items-start">
                <InfoCircleOutlined className="text-green-600 mt-0.5 mr-2" />
                <Text className="text-green-700">
                  Once you mark this phase as completed, you will be able to
                  request fund disbursement.
                </Text>
              </div>
            </div>
          )}
        </Form>
      </Modal>

      {/* Member Details Drawer */}
      <Drawer
        title={
          <div className="flex items-center">
            <UserOutlined className="text-[#F2722B] mr-2" />
            <span className="text-lg font-medium">Member Details</span>
          </div>
        }
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={400}
      >
        {selectedMember && (
          <div>
            <div className="flex flex-col items-center mb-6">
              <Avatar
                size={100}
                icon={<UserOutlined />}
                style={{
                  backgroundColor:
                    MEMBER_ROLE[selectedMember.role] === "Leader"
                      ? "#F2722B"
                      : MEMBER_ROLE[selectedMember.role] === "Supervisor"
                      ? "#8b5cf6"
                      : MEMBER_ROLE[selectedMember.role] === "Member"
                      ? "#3b82f6"
                      : "#10b981",
                }}
              />
              <h3 className="mt-4 text-xl font-medium">
                {selectedMember.memberName}
              </h3>
              <Tag
                color={
                  MEMBER_ROLE[selectedMember.role] === "Leader"
                    ? "orange"
                    : MEMBER_ROLE[selectedMember.role] === "Supervisor"
                    ? "purple"
                    : MEMBER_ROLE[selectedMember.role] === "Members"
                    ? "blue"
                    : "green"
                }
                className="mt-2 rounded-full px-3"
              >
                {MEMBER_ROLE[selectedMember.role]}
              </Tag>
            </div>

            <Descriptions
              title="Member Information"
              bordered
              column={1}
              size="small"
              className="rounded-xl overflow-hidden"
              labelStyle={{ fontWeight: 600 }}
            >
              <Descriptions.Item label="Email">
                <a href={`mailto:${selectedMember.memberEmail}`}>
                  {selectedMember.memberEmail}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={selectedMember.status === 1 ? "success" : "warning"}
                >
                  {MEMBER_STATUS[selectedMember.status]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Joined Date">
                {formatDate(selectedMember.joinDate)}
              </Descriptions.Item>
              <Descriptions.Item label="User ID">
                {selectedMember.userId}
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-6">
              <Button
                type="primary"
                icon={<MailOutlined />}
                className="w-full bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none rounded-lg"
                onClick={() =>
                  (window.location.href = `mailto:${selectedMember.memberEmail}`)
                }
              >
                Contact Member
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Fund Request Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <DollarOutlined className="text-green-500 mr-2" />
            <span>Request Fund Disbursement</span>
          </div>
        }
        open={fundRequestModalVisible}
        onCancel={() => setFundRequestModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
          <div className="flex items-start">
            <CheckOutlined className="text-green-500 text-lg mt-0.5 mr-2" />
            <div>
              <Text strong className="text-green-700">
                Phase Completed
              </Text>
              <Text className="text-green-600 block">
                You are requesting funds for a completed project phase. The
                request will be reviewed by administrators before disbursement.
              </Text>
            </div>
          </div>
        </div>

        <Form
          form={fundRequestForm}
          layout="vertical"
          onFinish={handleFundRequestSubmit}
          className="mt-4"
        >
          <Form.Item name="phaseId" hidden>
            <Input />
          </Form.Item>

          <Form.Item name="phaseTitle" label="Completed Phase">
            <Input disabled className="bg-gray-50" />
          </Form.Item>

          <Form.Item
            name="requestedAmount"
            label="Requested Amount (VND)"
            rules={[
              { required: true, message: "Please enter the requested amount" },
              {
                validator: (_, value) => {
                  if (!value || value <= 0) {
                    return Promise.reject(
                      new Error("Amount must be greater than 0")
                    );
                  }
                  if (value > projectDetails.approvedBudget) {
                    return Promise.reject(
                      new Error(
                        `Amount cannot exceed project budget (₫${projectDetails.approvedBudget.toLocaleString()})`
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              min={1}
              max={projectDetails.approvedBudget}
              formatter={(value) =>
                `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/₫\s?|(,*)/g, "")}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="purpose"
            label="Purpose"
            rules={[
              {
                required: true,
                message: "Please enter the purpose of this fund request",
              },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Describe how the funds will be used"
            />
          </Form.Item>

          <Form.Item name="itemizedExpenses" label="Itemized Expenses">
            <Input.TextArea
              rows={4}
              placeholder="List specific expenses (e.g., Equipment: ₫5,000,000, Materials: ₫3,000,000, etc.)"
            />
          </Form.Item>

          <Form.Item
            name="documentationFiles"
            label="Supporting Documentation"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload.Dragger
              name="files"
              beforeUpload={() => false}
              multiple={true}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="text-gray-400" />
              </p>
              <p className="ant-upload-text">Click or drag files to upload</p>
              <p className="ant-upload-hint text-xs text-gray-500">
                Upload invoices, receipts, quotes, or other supporting documents
              </p>
            </Upload.Dragger>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setFundRequestModalVisible(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] border-none"
              icon={<DollarOutlined />}
            >
              Submit Fund Request
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectDetails;
