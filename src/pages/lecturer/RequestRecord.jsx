import React, { useState } from "react";
import {
  Table,
  Card,
  Tag,
  Space,
  Button,
  Typography,
  Spin,
  Alert,
  Tabs,
  Statistic,
  Row,
  Col,
  Badge,
  Collapse,
  Empty,
  Divider,
  Modal,
  Timeline,
} from "antd";
import {
  DollarOutlined,
  FileOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  FolderOpenOutlined,
  TeamOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useGetMyProjectsQuery } from "../../features/project/projectApiSlice";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

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
  2: "Work in Progress",
  3: "Rejected",
};

// Document Type enum mapping
const DOCUMENT_TYPE = {
  0: "Project Document",
  1: "Disbursement Document",
  2: "Council Document",
  5: "Approval/Rejection Document",
};

// Status colors
const STATUS_COLORS = {
  0: "gold", // Pending
  1: "green", // Approved
  2: "blue", // Work in Progress
  3: "red", // Rejected
};

// Phase Status mapping
const PHASE_STATUS = {
  0: "Pending",
  1: "Approved",
  2: "In Progress",
  3: "Completed",
};

// Phase Status colors
const PHASE_STATUS_COLORS = {
  0: "gold", // Pending
  1: "blue", // Approved
  2: "processing", // In Progress
  3: "green", // Completed
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

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

const RequestRecord = () => {
  const navigate = useNavigate();
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const {
    data: projectsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMyProjectsQuery();

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setDetailsVisible(true);
  };

  const handleViewDocument = (documentUrl) => {
    window.open(documentUrl, "_blank");
  };

  const filterProjectsByStatus = (projects, status) => {
    if (!projects) return [];
    if (status === "all") return projects;

    return projects.filter((project) => {
      if (status === "pending") return project.status === 0;
      if (status === "approved") return project.status === 1;
      if (status === "rejected") return project.status === 3;
      return true;
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 0:
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      case 1:
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case 2:
        return <HistoryOutlined style={{ color: "#1890ff" }} />;
      case 3:
        return <CloseCircleOutlined style={{ color: "#f5222d" }} />;
      default:
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
    }
  };

  const columns = [
    {
      title: "Project Details",
      dataIndex: "projectName",
      key: "projectName",
      width: "40%",
      render: (_, project) => (
        <div>
          <div className="flex items-center mb-2">
            <FolderOpenOutlined className="mr-2 text-blue-500" />
            <Text strong className="text-lg">
              {project.projectName}
            </Text>
          </div>
          <Tag color="blue" className="mb-2">
            {PROJECT_TYPE[project.projectType]}
          </Tag>
          <Text type="secondary" className="block mb-2">
            {project.description}
          </Text>

          <div className="flex items-center text-sm text-gray-500 mb-1">
            <TeamOutlined className="mr-2" />
            <span>Group: {project.groupName}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <CalendarOutlined className="mr-2" />
            <span>
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
      width: "25%",
      render: (_, project) => (
        <div>
          <div className="mb-3">
            <Text type="secondary">Approved Budget:</Text>
            <div className="text-lg font-semibold">
              {formatCurrency(project.approvedBudget)}
            </div>
          </div>

          <div className="mb-3">
            <Text type="secondary">Spent Budget:</Text>
            <div className="text-lg font-semibold">
              {formatCurrency(project.spentBudget)}
            </div>
          </div>

          <div>
            <Text type="secondary">Remaining:</Text>
            <div className="text-lg font-semibold text-green-600">
              {formatCurrency(project.approvedBudget - project.spentBudget)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: "15%",
      render: (_, project) => (
        <div>
          <Tag
            icon={getStatusIcon(project.status)}
            color={STATUS_COLORS[project.status]}
            className="px-3 py-1 text-base"
          >
            {PROJECT_STATUS[project.status]}
          </Tag>

          {project.rejectionReason && (
            <div className="mt-2 text-red-500 text-sm">
              <Text type="danger" strong>
                Reason for rejection:
              </Text>
              <div className="mt-1 p-2 bg-red-50 rounded-md">
                {project.rejectionReason}
              </div>
            </div>
          )}

          <div className="mt-2 text-gray-500 text-sm">
            Created: {formatDate(project.createdAt)}
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      render: (_, project) => (
        <Space direction="vertical" className="w-full">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewProject(project)}
            className="w-full"
          >
            View Details
          </Button>

          {project.status === 1 && (
            <Button
              type="default"
              onClick={() => navigate(`/project-details/${project.projectId}`)}
              className="w-full"
            >
              Manage Project
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading project records..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert
          message="Error Loading Projects"
          description={
            error?.data?.message ||
            "Failed to load project records. Please try again later."
          }
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={refetch}>
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  const projectCount = projectsData?.data?.length || 0;
  const pendingCount =
    projectsData?.data?.filter((p) => p.status === 0)?.length || 0;
  const approvedCount =
    projectsData?.data?.filter((p) => p.status === 1)?.length || 0;
  const rejectedCount =
    projectsData?.data?.filter((p) => p.status === 3)?.length || 0;

  const filteredProjects = filterProjectsByStatus(
    projectsData?.data,
    activeTab
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Title level={2} className="text-gradient">
            Project Request Records
          </Title>
          <Text className="text-gray-500">
            Manage and track all your project requests
          </Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="shadow-sm">
              <Statistic
                title="Total Projects"
                value={projectCount}
                prefix={<FolderOpenOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="shadow-sm">
              <Statistic
                title="Pending"
                value={pendingCount}
                prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="shadow-sm">
              <Statistic
                title="Approved"
                value={approvedCount}
                prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="shadow-sm">
              <Statistic
                title="Rejected"
                value={rejectedCount}
                prefix={<CloseCircleOutlined style={{ color: "#f5222d" }} />}
                valueStyle={{ color: "#f5222d" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Tab Filter */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="mb-6"
          type="card"
        >
          <TabPane
            tab={
              <span>
                <FolderOpenOutlined />
                All Projects
              </span>
            }
            key="all"
          />
          <TabPane
            tab={
              <span>
                <ClockCircleOutlined style={{ color: "#faad14" }} />
                Pending
                <Badge
                  count={pendingCount}
                  className="ml-2"
                  style={{ backgroundColor: "#faad14" }}
                />
              </span>
            }
            key="pending"
          />
          <TabPane
            tab={
              <span>
                <CheckCircleOutlined style={{ color: "#52c41a" }} />
                Approved
                <Badge
                  count={approvedCount}
                  className="ml-2"
                  style={{ backgroundColor: "#52c41a" }}
                />
              </span>
            }
            key="approved"
          />
          <TabPane
            tab={
              <span>
                <CloseCircleOutlined style={{ color: "#f5222d" }} />
                Rejected
                <Badge
                  count={rejectedCount}
                  className="ml-2"
                  style={{ backgroundColor: "#f5222d" }}
                />
              </span>
            }
            key="rejected"
          />
        </Tabs>

        {/* Projects Table */}
        <Card className="shadow-md mb-10">
          <Table
            columns={columns}
            dataSource={filteredProjects}
            rowKey="projectId"
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty description="No project records found" />,
            }}
          />
        </Card>

        {/* Project Details Modal */}
        <Modal
          title={
            <div className="text-lg">
              <div className="font-semibold">
                {selectedProject?.projectName}
              </div>
              <Tag
                color={STATUS_COLORS[selectedProject?.status]}
                className="mt-1"
              >
                {PROJECT_STATUS[selectedProject?.status]}
              </Tag>
            </div>
          }
          open={detailsVisible}
          onCancel={() => setDetailsVisible(false)}
          width={800}
          footer={[
            <Button key="back" onClick={() => setDetailsVisible(false)}>
              Close
            </Button>,
          ]}
        >
          {selectedProject && (
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              {/* Project Information */}
              <Collapse defaultActiveKey={["1"]} className="mb-4">
                <Panel
                  header={
                    <span className="font-medium">Project Information</span>
                  }
                  key="1"
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="mb-4">
                        <Text type="secondary">Project Type</Text>
                        <div>
                          <Tag color="blue">
                            {PROJECT_TYPE[selectedProject.projectType]}
                          </Tag>
                        </div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="mb-4">
                        <Text type="secondary">Group</Text>
                        <div>{selectedProject.groupName}</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="mb-4">
                        <Text type="secondary">Start Date</Text>
                        <div>{formatDate(selectedProject.startDate)}</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="mb-4">
                        <Text type="secondary">End Date</Text>
                        <div>{formatDate(selectedProject.endDate)}</div>
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="mb-4">
                        <Text type="secondary">Description</Text>
                        <div className="mt-1 p-3 bg-gray-50 rounded-md">
                          {selectedProject.description}
                        </div>
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="mb-4">
                        <Text type="secondary">Methodology</Text>
                        <div className="mt-1 p-3 bg-gray-50 rounded-md">
                          {selectedProject.methodology}
                        </div>
                      </div>
                    </Col>
                    {selectedProject.rejectionReason && (
                      <Col span={24}>
                        <div className="mb-4">
                          <Text type="danger" strong>
                            Reason for Rejection
                          </Text>
                          <div className="mt-1 p-3 bg-red-50 rounded-md border border-red-100">
                            {selectedProject.rejectionReason}
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Panel>
              </Collapse>

              {/* Budget Information */}
              <Collapse defaultActiveKey={["1"]} className="mb-4">
                <Panel
                  header={
                    <span className="font-medium">Budget Information</span>
                  }
                  key="1"
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic
                        title="Approved Budget"
                        value={selectedProject.approvedBudget}
                        precision={0}
                        formatter={(value) => formatCurrency(value)}
                        valueStyle={{ color: "#3f8600" }}
                        prefix={<DollarOutlined />}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Spent Budget"
                        value={selectedProject.spentBudget}
                        precision={0}
                        formatter={(value) => formatCurrency(value)}
                        valueStyle={{ color: "#cf1322" }}
                        prefix={<DollarOutlined />}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Remaining Budget"
                        value={
                          selectedProject.approvedBudget -
                          selectedProject.spentBudget
                        }
                        precision={0}
                        formatter={(value) => formatCurrency(value)}
                        valueStyle={{ color: "#1890ff" }}
                        prefix={<DollarOutlined />}
                      />
                    </Col>
                  </Row>
                </Panel>
              </Collapse>

              {/* Project Phases */}
              <Collapse defaultActiveKey={["1"]} className="mb-4">
                <Panel
                  header={<span className="font-medium">Project Phases</span>}
                  key="1"
                >
                  {selectedProject.projectPhases &&
                  selectedProject.projectPhases.length > 0 ? (
                    <Timeline>
                      {selectedProject.projectPhases.map((phase) => (
                        <Timeline.Item
                          key={phase.projectPhaseId}
                          color={PHASE_STATUS_COLORS[phase.status]}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{phase.title}</div>
                              <div className="text-sm text-gray-500">
                                {formatDate(phase.startDate)} to{" "}
                                {formatDate(phase.endDate)}
                              </div>
                            </div>
                            <div>
                              <Badge
                                status={
                                  PHASE_STATUS_COLORS[phase.status] ===
                                  "processing"
                                    ? "processing"
                                    : "default"
                                }
                                text={
                                  <Tag
                                    color={PHASE_STATUS_COLORS[phase.status]}
                                  >
                                    {PHASE_STATUS[phase.status]}
                                  </Tag>
                                }
                              />
                              {phase.spentBudget > 0 && (
                                <div className="text-sm mt-1">
                                  Budget: {formatCurrency(phase.spentBudget)}
                                </div>
                              )}
                            </div>
                          </div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  ) : (
                    <Empty description="No project phases defined" />
                  )}
                </Panel>
              </Collapse>

              {/* Documents */}
              <Collapse defaultActiveKey={["1"]} className="mb-4">
                <Panel
                  header={
                    <span className="font-medium">Project Documents</span>
                  }
                  key="1"
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
                            <FileOutlined className="text-gray-500 mr-3 text-lg" />
                            <div>
                              <div className="font-medium text-gray-800 mb-1 max-w-md truncate">
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
                            onClick={() => handleViewDocument(doc.documentUrl)}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty description="No documents available" />
                  )}
                </Panel>
              </Collapse>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default RequestRecord;
