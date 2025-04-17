import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Tag,
  Space,
  message,
  Divider,
  Select,
  Timeline,
  Collapse,
  Spin,
  Empty,
  Typography,
  Alert,
  Upload,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  UserOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useGetProjectsByDepartmentQuery,
  useApproveProjectMutation,
  useRejectProjectMutation,
} from "../../features/project/projectApiSlice";

const { Text } = Typography;
const { Option } = Select;

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

const STATUS_COLORS = {
  pending: "gold",
  approved: "green",
  rejected: "red",
  "in review": "blue",
  "revision needed": "orange",
  "work in progress": "cyan",
};

// Document Type enum mapping
const DOCUMENT_TYPE = {
  0: "Project Document",
  1: "Research Publication",
  2: "Council Document",
};

// Request type filter options
const REQUEST_OPTIONS = [
  { value: "all", label: "All Type" },
  { value: "0", label: "Research" },
  { value: "1", label: "Conference" },
  { value: "2", label: "Journal" },
];

// Status filter options
const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "0", label: "Pending" },
  { value: "1", label: "Approved" },
  { value: "2", label: "Work in Progress" },
  { value: "3", label: "Rejected" },
];

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ReviewProject = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  // Get departmentId from user or from query params
  const departmentId = user?.department?.departmentId;
  const queryParams = new URLSearchParams(location.search);
  const groupId = queryParams.get("groupId");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [statusFilter, setStatusFilter] = useState("0"); // Default to pending
  const [typeFilter, setTypeFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Add new state for file uploads
  const [approvalFile, setApprovalFile] = useState(null);
  const [rejectionFile, setRejectionFile] = useState(null);

  // Add these state variables to your component
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [approvalFileList, setApprovalFileList] = useState([]);
  const [rejectionFileList, setRejectionFileList] = useState([]);

  // Fetch projects data
  const {
    data: projectsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProjectsByDepartmentQuery(departmentId, {
    skip: !departmentId,
  });

  // Mutations for approve/reject
  const [approveProject, { isLoading: isApproving }] =
    useApproveProjectMutation();
  const [rejectProject, { isLoading: isRejecting }] =
    useRejectProjectMutation();

  // Filter projects based on search text, project type, and status
  useEffect(() => {
    if (projectsData && projectsData.data) {
      // Filter projects based on selected filters
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
            : project.projectType.toString() === typeFilter;

        const matchesStatus =
          statusFilter === "all"
            ? true
            : project.status.toString() === statusFilter;

        // If groupId is provided, filter to show only projects from that group
        const matchesGroup = groupId
          ? project.groupId.toString() === groupId
          : true;

        return matchesSearch && matchesType && matchesStatus && matchesGroup;
      });

      setFilteredProjects(filtered);
    }
  }, [projectsData, searchText, typeFilter, statusFilter, groupId]);

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedProject(null);
  };

  const handleViewDocument = (documentUrl) => {
    window.open(documentUrl, "_blank");
  };

  const handleApproveProject = (project) => {
    setCurrentProject(project);
    setApprovalFileList([]);
    setApprovalModalVisible(true);
  };

  const handleRejectProject = (project) => {
    setCurrentProject(project);
    setRejectionFileList([]);
    setRejectionModalVisible(true);
  };

  // Add these two new functions for submitting approval/rejection
  const handleApprovalSubmit = async () => {
    if (approvalFileList.length === 0) {
      message.error("Please upload an approval document");
      return;
    }

    try {
      // Get the file from the upload component
      const file = approvalFileList[0]?.originFileObj;
      if (!file) {
        message.error("Invalid file selected");
        return;
      }

      // Create FormData and append the file
      const formData = new FormData();
      formData.append("documentFiles", file);

      // Call the API
      await approveProject({
        projectId: currentProject.projectId,
        formData: formData,
      }).unwrap();

      message.success(
        `Project "${currentProject.projectName}" has been approved`
      );
      setApprovalModalVisible(false);
      refetch();
    } catch (err) {
      console.error("Error approving project:", err);
      message.error(
        err.data?.message || "Failed to approve project. Please try again."
      );
    }
  };

  const handleRejectionSubmit = async () => {
    if (rejectionFileList.length === 0) {
      message.error("Please upload a rejection document");
      return;
    }

    try {
      // Get the file from the upload component
      const file = rejectionFileList[0]?.originFileObj;
      if (!file) {
        message.error("Invalid file selected");
        return;
      }

      // Create FormData and append the file
      const formData = new FormData();
      formData.append("documentFiles", file);

      // Call the API
      await rejectProject({
        projectId: currentProject.projectId,
        formData: formData,
      }).unwrap();

      message.success(
        `Project "${currentProject.projectName}" has been rejected`
      );
      setRejectionModalVisible(false);
      refetch();
    } catch (err) {
      console.error("Error rejecting project:", err);
      message.error(
        err.data?.message || "Failed to reject project. Please try again."
      );
    }
  };

  const columns = [
    {
      title: "Basic Information",
      key: "basic",
      width: "40%",
      render: (_, record) => (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium text-gray-900">
              {record.projectName}
            </h4>
            <p className="text-sm text-gray-500">{record.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Tag color="blue">{PROJECT_TYPE[record.projectType]}</Tag>
            {record.departmentId && (
              <Tag color="green">
                {user?.department?.departmentName ||
                  `Department ${record.departmentId}`}
              </Tag>
            )}
          </div>

          <Divider className="my-3" />

          <div className="space-y-2">
            <div className="flex items-center">
              <UserOutlined className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Created by ID: </span>
              <span className="text-sm font-medium ml-1">
                {record.createdBy || "Unknown"}
              </span>
            </div>
            <div className="text-sm text-gray-500 ml-6">
              <div>Created at: {formatDate(record.createdAt)}</div>
            </div>
          </div>

          {/* Group Info */}
          <div className="flex items-center mt-2">
            <TeamOutlined className="text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">Group: </span>
            <span className="text-sm font-medium ml-1">
              {record.groupName || "Unknown Group"}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Resource Requests",
      key: "resources",
      width: "40%",
      render: (_, record) => (
        <div className="space-y-4">
          <div className="flex items-center">
            <DollarOutlined className="text-gray-400 mr-2" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Requested Budget</span>
                <span className="text-sm font-medium">
                  ₫{record.approvedBudget?.toLocaleString() || "0"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <CalendarOutlined className="text-gray-400 mr-2" />
            <div className="text-sm">
              <span className="text-gray-600">Timeline: </span>
              <span className="font-medium">
                {formatDate(record.startDate)} to {formatDate(record.endDate)}
              </span>
            </div>
          </div>

          {/* Documents Section */}
          {record.documents && record.documents.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center mb-2">
                <FileTextOutlined className="text-gray-400 mr-2" />
                <span className="text-sm font-medium">Project Documents</span>
              </div>
              <div className="space-y-2 ml-6">
                {record.documents.map((doc) => (
                  <div
                    key={doc.documentId}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <FileTextOutlined className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Tag color="blue" size="small">
                            {DOCUMENT_TYPE[doc.documentType]}
                          </Tag>
                          <span className="ml-2">
                            {formatDate(doc.uploadAt)}
                          </span>
                        </div>
                        <div
                          className="text-sm font-medium truncate max-w-[250px]"
                          title={doc.fileName}
                        >
                          {doc.fileName}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="link"
                      size="small"
                      icon={<DownloadOutlined />}
                      onClick={() => handleViewDocument(doc.documentUrl)}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {record.milestones && record.milestones.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center mb-2">
                <CheckCircleOutlined className="text-gray-400 mr-2" />
                <span className="text-sm font-medium">Project Milestones</span>
              </div>
              <Timeline className="ml-6">
                {record.milestones.map((milestone) => (
                  <Timeline.Item key={milestone.milestoneId}>
                    <div className="text-sm">
                      <div className="font-medium">{milestone.title}</div>
                      <div className="text-gray-500">
                        Timeline: {formatDate(milestone.startDate)} to{" "}
                        {formatDate(milestone.endDate)}
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: "10%",
      render: (_, record) => {
        const statusText = PROJECT_STATUS[record.status].toLowerCase();
        return (
          <Tag color={STATUS_COLORS[statusText] || "default"}>
            {PROJECT_STATUS[record.status]}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      render: (_, record) => (
        <Space direction="vertical" className="w-full">
          <Button
            type="default"
            icon={<InfoCircleOutlined />}
            onClick={() => handleViewDetails(record)}
            className="w-full"
          >
            View Details
          </Button>

          {record.status === 0 && ( // Only show Approve/Reject for pending projects
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleApproveProject(record)}
                loading={isApproving}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none"
              >
                Approve
              </Button>
              <Button
                type="primary"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleRejectProject(record)}
                loading={isRejecting}
                className="w-full"
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  if (!departmentId) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Alert
            message="No Department Information"
            description="You need to be assigned to a department to review projects."
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <Spin size="large" tip="Loading projects..." />
      </div>
    );
  }

  if (isError) {
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
          <Button
            type="primary"
            onClick={() => refetch()}
            className="mt-4 bg-[#F2722B]"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C00] to-[#FFA500] mb-2">
              Review Projects
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#FF8C00] to-[#FFA500] rounded-full"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Review and manage research project proposals for your department
          </p>
        </div>

        {groupId && (
          <Alert
            message={`Viewing projects for group ID: ${groupId}`}
            type="info"
            showIcon
            className="mb-6"
            action={
              <Button size="small" onClick={() => navigate("/review-project")}>
                View All
              </Button>
            }
          />
        )}

        {/* Filter Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4 flex-1">
              {/* Search bar */}
              <Input
                placeholder="Search projects..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={(e) => setSearchText(e.target.value)}
                className="max-w-md"
                allowClear
                value={searchText}
              />
              <span className="text-gray-700 font-medium">Filter:</span>
              {/* Status filter */}
              <Select
                value={statusFilter}
                style={{ width: 160 }}
                onChange={setStatusFilter}
                options={STATUS_OPTIONS}
                className="rounded-md"
              />
              {/* Project type filter */}
              <Select
                value={typeFilter}
                style={{ width: 160 }}
                onChange={setTypeFilter}
                options={REQUEST_OPTIONS}
                className="rounded-md"
              />
            </div>
          </div>
        </div>

        <Card className="shadow-md">
          <Table
            columns={columns}
            dataSource={filteredProjects}
            rowKey="projectId"
            pagination={{ pageSize: 5 }}
            className="custom-table"
            rowClassName="align-top"
            locale={{ emptyText: "No projects found matching your criteria" }}
          />
        </Card>

        {/* Project Details Modal */}
        <Modal
          title={
            <div className="text-lg">
              <div className="font-semibold text-gray-800">Project Details</div>
              <div className="text-sm font-normal text-gray-500 mt-1">
                {selectedProject?.projectName}
              </div>
            </div>
          }
          open={isModalVisible}
          onCancel={handleModalClose}
          width={800}
          footer={[
            <Button key="cancel" onClick={handleModalClose}>
              Cancel
            </Button>,
          ]}
        >
          {selectedProject && (
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              {/* Project Status */}
              <div className="mb-4">
                <Tag
                  color={
                    STATUS_COLORS[
                      PROJECT_STATUS[selectedProject.status].toLowerCase()
                    ] || "default"
                  }
                  className="text-base px-3 py-1"
                >
                  {PROJECT_STATUS[selectedProject.status]}
                </Tag>
              </div>

              {/* Project Details */}
              <Collapse defaultActiveKey={["1"]} className="mb-4">
                <Collapse.Panel
                  header={
                    <div className="flex items-center">
                      <InfoCircleOutlined className="text-[#F2722B] mr-2" />
                      <span className="font-medium">Project Details</span>
                    </div>
                  }
                  key="1"
                >
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">Description</div>
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        {selectedProject.description}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Methodology</div>
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        {selectedProject.methodology}
                      </div>
                    </div>
                  </div>
                </Collapse.Panel>
              </Collapse>

              {/* Documents Section */}
              <Collapse defaultActiveKey={["1"]} className="mb-4">
                <Collapse.Panel
                  header={
                    <div className="flex items-center">
                      <FileTextOutlined className="text-[#F2722B] mr-2" />
                      <span className="font-medium">Project Documents</span>
                    </div>
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
                            onClick={() => handleViewDocument(doc.documentUrl)}
                            className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none"
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty description="No documents available" />
                  )}
                </Collapse.Panel>
              </Collapse>

              {/* Milestones Section */}
              <Collapse defaultActiveKey={["1"]} className="mb-4">
                <Collapse.Panel
                  header={
                    <div className="flex items-center">
                      <CheckCircleOutlined className="text-[#F2722B] mr-2" />
                      <span className="font-medium">Project Milestones</span>
                    </div>
                  }
                  key="1"
                >
                  {selectedProject.milestones &&
                  selectedProject.milestones.length > 0 ? (
                    <Timeline>
                      {selectedProject.milestones.map((milestone) => (
                        <Timeline.Item key={milestone.milestoneId}>
                          <div className="text-base font-medium">
                            {milestone.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(milestone.startDate)} to{" "}
                            {formatDate(milestone.endDate)}
                          </div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  ) : (
                    <Empty description="No milestones available" />
                  )}
                </Collapse.Panel>
              </Collapse>

              {/* Action Buttons for Pending Projects */}
              {selectedProject.status === 0 && (
                <div className="flex space-x-4 mt-6">
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => {
                      handleModalClose();
                      handleApproveProject(selectedProject);
                    }}
                    loading={isApproving}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none"
                  >
                    Approve Project
                  </Button>
                  <Button
                    type="primary"
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => {
                      handleModalClose();
                      handleRejectProject(selectedProject);
                    }}
                    loading={isRejecting}
                    className="flex-1"
                  >
                    Reject Project
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Approval Modal */}
        <Modal
          title={
            <div className="flex items-center">
              <CheckOutlined style={{ color: "#52c41a" }} className="mr-2" />
              <span>Approve Project</span>
            </div>
          }
          open={approvalModalVisible}
          onCancel={() => setApprovalModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => setApprovalModalVisible(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={isApproving}
              onClick={handleApprovalSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve
            </Button>,
          ]}
          width={550}
        >
          {currentProject && (
            <div>
              <p>Are you sure you want to approve this project?</p>
              <p className="text-sm text-gray-500 mb-4">
                Project: <strong>{currentProject.projectName}</strong>
              </p>
              <Divider />
              <p className="text-sm font-medium mb-2">
                Please upload an approval document:
              </p>
              <Upload.Dragger
                fileList={approvalFileList}
                onChange={({ fileList }) => setApprovalFileList(fileList)}
                beforeUpload={() => false}
                maxCount={1}
                onRemove={() => setApprovalFileList([])}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag approval document to this area
                </p>
                <p className="ant-upload-hint">
                  Support for PDF, DOC, DOCX files.
                </p>
              </Upload.Dragger>
            </div>
          )}
        </Modal>

        {/* Rejection Modal */}
        <Modal
          title={
            <div className="flex items-center">
              <CloseOutlined style={{ color: "#f5222d" }} className="mr-2" />
              <span>Reject Project</span>
            </div>
          }
          open={rejectionModalVisible}
          onCancel={() => setRejectionModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => setRejectionModalVisible(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              danger
              loading={isRejecting}
              onClick={handleRejectionSubmit}
            >
              Reject
            </Button>,
          ]}
          width={550}
        >
          {currentProject && (
            <div>
              <p>Are you sure you want to reject this project?</p>
              <p className="text-sm text-gray-500 mb-4">
                Project: <strong>{currentProject.projectName}</strong>
              </p>
              <Divider />
              <p className="text-sm font-medium mb-2">
                Please upload a rejection document:
              </p>
              <Upload.Dragger
                fileList={rejectionFileList}
                onChange={({ fileList }) => setRejectionFileList(fileList)}
                beforeUpload={() => false}
                maxCount={1}
                onRemove={() => setRejectionFileList([])}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag rejection document to this area
                </p>
                <p className="ant-upload-hint">
                  Support for PDF, DOC, DOCX files.
                </p>
              </Upload.Dragger>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ReviewProject;
