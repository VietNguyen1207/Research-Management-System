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
  Checkbox,
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
  useGetPendingDepartmentProjectRequestsQuery,
  useApproveProjectRequestMutation,
  useRejectProjectRequestMutation,
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

// Add these mapping constants for request types
const REQUEST_TYPE = {
  1: "Research Creation",
  2: "Phase Update",
  3: "Completion",
  4: "Paper Creation",
  5: "Conference Creation",
  6: "Fund Disbursement",
};

// Add this mapping for approval status
const APPROVAL_STATUS = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
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

const ReviewProject = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [rejectionForm] = Form.useForm();

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

  // Add these state variables to track checkbox status
  const [approvalConfirmed, setApprovalConfirmed] = useState(false);
  const [rejectionConfirmed, setRejectionConfirmed] = useState(false);

  // Fetch projects data
  const {
    data: projectRequestsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPendingDepartmentProjectRequestsQuery(departmentId, {
    skip: !departmentId,
  });

  // Mutations for approve/reject
  const [approveProjectRequest, { isLoading: isApproving }] =
    useApproveProjectRequestMutation();
  const [rejectProjectRequest, { isLoading: isRejecting }] =
    useRejectProjectRequestMutation();

  // Filter projects based on search text, project type, and status
  useEffect(() => {
    if (projectRequestsData && projectRequestsData.data) {
      // Since we're getting only pending requests now, we only need to filter by search text and type
      const filtered = projectRequestsData.data.filter((request) => {
        const matchesSearch =
          searchText.toLowerCase() === ""
            ? true
            : request.projectName
                ?.toLowerCase()
                .includes(searchText.toLowerCase()) ||
              request.projectDescription
                ?.toLowerCase()
                .includes(searchText.toLowerCase());

        const matchesType =
          typeFilter === "all"
            ? true
            : request.projectType.toString() === typeFilter;

        // If groupId is provided, filter to show only projects from that group
        const matchesGroup = groupId
          ? request.groupId.toString() === groupId
          : true;

        return matchesSearch && matchesType && matchesGroup;
      });

      setFilteredProjects(filtered);
    }
  }, [projectRequestsData, searchText, typeFilter, groupId]);

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

  // Add onChange handlers for the checkboxes
  const handleApprovalCheckboxChange = (e) => {
    setApprovalConfirmed(e.target.checked);
  };

  const handleRejectionCheckboxChange = (e) => {
    setRejectionConfirmed(e.target.checked);
  };

  // Reset the confirmation state when opening the modals
  const handleApproveProject = (project) => {
    setCurrentProject(project);
    setApprovalFileList([]);
    setApprovalConfirmed(false); // Reset checkbox state
    form.resetFields();
    form.setFieldsValue({
      confirmAction: false,
    });
    setApprovalModalVisible(true);
  };

  const handleRejectProject = (project) => {
    setCurrentProject(project);
    setRejectionFileList([]);
    setRejectionConfirmed(false); // Reset checkbox state
    form.resetFields();
    form.setFieldsValue({
      confirmAction: false,
    });
    setRejectionModalVisible(true);
  };

  // Add these two new functions for submitting approval/rejection
  const handleApprovalSubmit = async (values) => {
    try {
      // First check if we have files
      if (approvalFileList.length === 0) {
        message.error("Please upload an approval document");
        return;
      }

      // Get the file from the upload component
      const file = approvalFileList[0]?.originFileObj;
      if (!file) {
        message.error("Invalid file selected");
        return;
      }

      // Create FormData and append the file
      const formData = new FormData();
      formData.append("documentFiles", file);

      // Call the API with requestId instead of projectId
      await approveProjectRequest({
        requestId: currentProject.requestId,
        formData: formData,
      }).unwrap();

      message.success(
        `Request for "${currentProject.projectName}" has been approved`
      );
      setApprovalModalVisible(false);
      form.resetFields();
      refetch();
    } catch (err) {
      console.error("Error approving project request:", err);
      message.error(
        err.data?.message ||
          "Failed to approve project request. Please try again."
      );
    }
  };

  const handleRejectionSubmit = async (values) => {
    try {
      // First check if we have files
      if (rejectionFileList.length === 0) {
        message.error("Please upload a rejection document");
        return;
      }

      // Get the file from the upload component
      const file = rejectionFileList[0]?.originFileObj;
      if (!file) {
        message.error("Invalid file selected");
        return;
      }

      // Create FormData and append the file
      const formData = new FormData();
      formData.append("documentFiles", file);

      // Add the rejection reason to the FormData
      formData.append("rejectionReason", values.rejectionReason || "");

      console.log("Sending rejection with reason:", values.rejectionReason);

      // Call the API with requestId instead of projectId
      await rejectProjectRequest({
        requestId: currentProject.requestId,
        formData: formData,
      }).unwrap();

      message.success(
        `Request for "${currentProject.projectName}" has been rejected`
      );
      setRejectionModalVisible(false);
      rejectionForm.resetFields();
      refetch();
    } catch (err) {
      console.error("Error rejecting project request:", err);
      message.error(
        err.data?.message ||
          "Failed to reject project request. Please try again."
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
            <p className="text-sm text-gray-500">{record.projectDescription}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Tag color="blue">{record.projectTypeName}</Tag>
            <Tag color="green">
              {record.departmentName || `Department ${record.departmentId}`}
            </Tag>
            <Tag color="purple">{REQUEST_TYPE[record.requestType]}</Tag>
          </div>

          <Divider className="my-3" />

          <div className="space-y-2">
            <div className="flex items-center">
              <UserOutlined className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Requested by: </span>
              <span className="text-sm font-medium ml-1">
                {record.requesterName || "Unknown"}
              </span>
            </div>
            <div className="text-sm text-gray-500 ml-6">
              <div>Requested at: {formatDate(record.requestedAt)}</div>
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
      width: "30%",
      render: (_, record) => (
        <div className="space-y-4">
          <div className="flex items-center">
            <DollarOutlined className="text-gray-400 mr-2" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Approved Budget</span>
                <span className="text-sm font-medium">
                  ₫{record.approvedBudget?.toLocaleString() || "0"}
                </span>
              </div>
              {record.spentBudget > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Spent Budget</span>
                  <span className="text-sm font-medium">
                    ₫{record.spentBudget?.toLocaleString() || "0"}
                  </span>
                </div>
              )}
              {record.fundRequestAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Requested Funds</span>
                  <span className="text-sm font-medium">
                    ₫{record.fundRequestAmount?.toLocaleString() || "0"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Documents would be added here if the API returns them */}
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: "10%",
      render: (_, record) => {
        const statusColor =
          record.approvalStatus === 0
            ? "gold"
            : record.approvalStatus === 1
            ? "green"
            : "red";

        return (
          <Tag color={statusColor}>
            {APPROVAL_STATUS[record.approvalStatus]}
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
            onClick={() => navigate(`/project-request/${record.requestId}`)}
            className="w-full"
          >
            View Details
          </Button>

          {record.approvalStatus === 0 && ( // Only show Approve/Reject for pending requests
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleApproveProject(record)}
                loading={isApproving}
                className="bg-green-600 hover:bg-green-700 w-full"
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
              <span className="text-gray-700 font-medium">Filter by type:</span>
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

              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  Approval Record:
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <CheckCircleOutlined className="text-green-500 mr-2" />
                    <span className="text-gray-600">Approver: </span>
                    <span className="ml-1 font-medium">
                      {user?.name || "Current User"}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <TeamOutlined className="text-blue-500 mr-2" />
                    <span className="text-gray-600">Role: </span>
                    <span className="ml-1 font-medium">
                      {(() => {
                        // Find council group where user is Chairman or Secretary
                        const councilGroup = user?.groups?.find(
                          (group) =>
                            group.groupType === 1 &&
                            (group.role === 3 || group.role === 4)
                        );

                        if (councilGroup) {
                          // Map role ID to role name
                          let roleName = "";
                          switch (councilGroup.role) {
                            case 3:
                              roleName = "Council Chairman";
                              break;
                            case 4:
                              roleName = "Secretary";
                              break;
                            default:
                              roleName = "Council Member";
                          }
                          return `${roleName} from ${councilGroup.groupName}`;
                        } else {
                          return "Not Authorized";
                        }
                      })()}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CalendarOutlined className="text-orange-500 mr-2" />
                    <span className="text-gray-600">Date: </span>
                    <span className="ml-1 font-medium">
                      {new Date().toLocaleDateString()}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-700 mb-3">
                  Approval Status:
                </h4>
                <div className="flex items-center justify-around">
                  <div
                    className={`flex flex-col items-center ${
                      isChairmanApproved ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isChairmanApproved ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      <UserOutlined className="text-xl" />
                    </div>
                    <p className="mt-2 font-medium">Chairman</p>
                    <Tag color={isChairmanApproved ? "success" : "default"}>
                      {isChairmanApproved ? "Approved" : "Pending"}
                    </Tag>
                  </div>

                  <div className="w-24 h-0.5 bg-gray-200"></div>

                  <div
                    className={`flex flex-col items-center ${
                      isSecretaryApproved ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isSecretaryApproved ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      <UserOutlined className="text-xl" />
                    </div>
                    <p className="mt-2 font-medium">Secretary</p>
                    <Tag color={isSecretaryApproved ? "success" : "default"}>
                      {isSecretaryApproved ? "Approved" : "Pending"}
                    </Tag>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  Review History:
                </h4>
                <Timeline>
                  {reviewHistory.map((review) => (
                    <Timeline.Item
                      key={review.id}
                      color={
                        review.action === "approve"
                          ? "green"
                          : review.action === "reject"
                          ? "red"
                          : "blue"
                      }
                    >
                      <p className="font-medium">
                        {review.action === "approve" ? "Approved" : "Rejected"}{" "}
                        by {review.reviewer}
                      </p>
                      <p className="text-sm text-gray-500">
                        Role: {review.role}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleString()}
                      </p>
                      {review.comments && (
                        <p className="mt-1 text-gray-700">
                          "{review.comments}"
                        </p>
                      )}
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
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
              onClick={() => form.submit()}
              className="bg-green-600 hover:bg-green-700"
              disabled={!approvalConfirmed}
            >
              Approve
            </Button>,
          ]}
          width={550}
        >
          {currentProject && (
            <Form form={form} onFinish={handleApprovalSubmit}>
              <div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                  <div className="flex items-start">
                    <UserOutlined className="text-blue-500 mt-1 mr-3 text-lg" />
                    <div>
                      <p className="font-medium text-gray-800">
                        You are approving as:{" "}
                        <Tag color="blue">
                          {(() => {
                            // Find council group where user is Chairman or Secretary
                            const councilGroup = user?.groups?.find(
                              (group) =>
                                group.groupType === 1 &&
                                (group.role === 3 || group.role === 4)
                            );

                            if (councilGroup) {
                              // Map role ID to role name
                              let roleName = "";
                              switch (councilGroup.role) {
                                case 3:
                                  roleName = "Council Chairman";
                                  break;
                                case 4:
                                  roleName = "Secretary";
                                  break;
                                default:
                                  roleName = "Council Member";
                              }
                              return `${roleName} from ${councilGroup.groupName}`;
                            } else {
                              return "Not Authorized";
                            }
                          })()}
                        </Tag>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {user?.fullName || "User"} ({user?.email})
                      </p>
                    </div>
                  </div>
                </div>
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
                <Form.Item
                  name="confirmAction"
                  valuePropName="checked"
                  rules={[
                    { required: true, message: "Please confirm your action" },
                  ]}
                >
                  <Checkbox onChange={handleApprovalCheckboxChange}>
                    I,{" "}
                    {(() => {
                      // Find council group where user is Chairman or Secretary
                      const councilGroup = user?.groups?.find(
                        (group) =>
                          group.groupType === 1 &&
                          (group.role === 3 || group.role === 4)
                      );

                      if (councilGroup) {
                        // Map role ID to role name
                        let roleName = "";
                        switch (councilGroup.role) {
                          case 3:
                            roleName = "Council Chairman";
                            break;
                          case 4:
                            roleName = "Secretary";
                            break;
                          default:
                            roleName = "Council Member";
                        }
                        return `${roleName} from ${councilGroup.groupName}`;
                      } else {
                        return "Not Authorized";
                      }
                    })()}
                    , confirm that I have reviewed this project and approve its
                    registration.
                  </Checkbox>
                </Form.Item>
              </div>
            </Form>
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
              onClick={() => rejectionForm.submit()}
              disabled={!rejectionConfirmed}
            >
              Reject
            </Button>,
          ]}
          width={550}
        >
          {currentProject && (
            <Form form={rejectionForm} onFinish={handleRejectionSubmit}>
              <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-4">
                <div className="flex items-start">
                  <UserOutlined className="text-red-500 mt-1 mr-3 text-lg" />
                  <div>
                    <p className="font-medium text-gray-800">
                      You are rejecting as:{" "}
                      <Tag color="red">
                        {(() => {
                          // Find council group where user is Chairman or Secretary
                          const councilGroup = user?.groups?.find(
                            (group) =>
                              group.groupType === 1 &&
                              (group.role === 3 || group.role === 4)
                          );

                          if (councilGroup) {
                            // Map role ID to role name
                            let roleName = "";
                            switch (councilGroup.role) {
                              case 3:
                                roleName = "Council Chairman";
                                break;
                              case 4:
                                roleName = "Secretary";
                                break;
                              default:
                                roleName = "Council Member";
                            }
                            return `${roleName} from ${councilGroup.groupName}`;
                          } else {
                            return "Not Authorized";
                          }
                        })()}
                      </Tag>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {user?.fullName || "User"} ({user?.email})
                    </p>
                  </div>
                </div>
              </div>
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

              <Form.Item
                name="rejectionReason"
                label="Reason for Rejection"
                rules={[
                  {
                    required: true,
                    message: "Please provide a reason for rejection",
                  },
                ]}
                className="mt-4"
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Please explain why this project is being rejected..."
                />
              </Form.Item>

              <Form.Item
                name="confirmAction"
                valuePropName="checked"
                rules={[
                  { required: true, message: "Please confirm your action" },
                ]}
              >
                <Checkbox onChange={handleRejectionCheckboxChange}>
                  I,{" "}
                  {(() => {
                    // Find council group where user is Chairman or Secretary
                    const councilGroup = user?.groups?.find(
                      (group) =>
                        group.groupType === 1 &&
                        (group.role === 3 || group.role === 4)
                    );

                    if (councilGroup) {
                      // Map role ID to role name
                      let roleName = "";
                      switch (councilGroup.role) {
                        case 3:
                          roleName = "Council Chairman";
                          break;
                        case 4:
                          roleName = "Secretary";
                          break;
                        default:
                          roleName = "Council Member";
                      }
                      return `${roleName} from ${councilGroup.groupName}`;
                    } else {
                      return "Not Authorized";
                    }
                  })()}
                  , confirm that I have reviewed this project and reject its
                  registration.
                </Checkbox>
              </Form.Item>
            </Form>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ReviewProject;
