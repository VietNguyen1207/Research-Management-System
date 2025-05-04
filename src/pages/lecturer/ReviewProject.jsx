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
  Skeleton,
  Row,
  Col,
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
  CloseCircleOutlined,
  HistoryOutlined,
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
  useApproveCompletionRequestMutation,
  useRejectCompletionRequestMutation,
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

  // Add these new state variables for request type filter
  const [requestTypeFilter, setRequestTypeFilter] = useState("all");

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

  // Add new mutation hooks
  const [approveCompletionRequest, { isLoading: isApprovingCompletion }] =
    useApproveCompletionRequestMutation();
  const [rejectCompletionRequest, { isLoading: isRejectingCompletion }] =
    useRejectCompletionRequestMutation();

  // Filter projects based on search text, project type, and status
  useEffect(() => {
    if (projectRequestsData && projectRequestsData.data) {
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

        const matchesRequestType =
          requestTypeFilter === "all"
            ? true
            : request.requestType.toString() === requestTypeFilter;

        const matchesGroup = groupId
          ? request.groupId.toString() === groupId
          : true;

        return (
          matchesSearch && matchesType && matchesRequestType && matchesGroup
        );
      });

      setFilteredProjects(filtered);
    }
  }, [projectRequestsData, searchText, typeFilter, requestTypeFilter, groupId]);

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

  // Update the handleApprovalSubmit function to check request type
  const handleApprovalSubmit = async (values) => {
    try {
      // File validation code
      if (approvalFileList.length === 0) {
        message.error("Please upload an approval document");
        return;
      }

      const file = approvalFileList[0]?.originFileObj;
      if (!file) {
        message.error("Invalid file selected");
        return;
      }

      const formData = new FormData();
      formData.append("documentFiles", file);

      // Check request type and use appropriate API
      if (currentProject.requestType === 3) {
        // Completion request - use specialized API
        await approveCompletionRequest({
          requestId: currentProject.requestId,
          formData: formData,
        }).unwrap();
      } else {
        // Other request types
        await approveProjectRequest({
          requestId: currentProject.requestId,
          formData: formData,
        }).unwrap();
      }

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

  // Update the handleRejectionSubmit function similarly
  const handleRejectionSubmit = async (values) => {
    try {
      // File validation code
      if (rejectionFileList.length === 0) {
        message.error("Please upload a rejection document");
        return;
      }

      const file = rejectionFileList[0]?.originFileObj;
      if (!file) {
        message.error("Invalid file selected");
        return;
      }

      const formData = new FormData();
      formData.append("documentFiles", file);
      formData.append("rejectionReason", values.rejectionReason || "");

      // Check request type and use appropriate API
      if (currentProject.requestType === 3) {
        // Completion request - use specialized API
        await rejectCompletionRequest({
          requestId: currentProject.requestId,
          formData: formData,
        }).unwrap();
      } else {
        // Other request types
        await rejectProjectRequest({
          requestId: currentProject.requestId,
          formData: formData,
        }).unwrap();
      }

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
          <div className="flex items-center space-x-2 flex-wrap">
            <Tag color="blue">{record.projectTypeName}</Tag>
            <Tag color="green">
              {record.departmentName || `Department ${record.departmentId}`}
            </Tag>
            <Tag
              color={record.requestType === 3 ? "magenta" : "purple"}
              className={record.requestType === 3 ? "border-magenta-300" : ""}
            >
              {REQUEST_TYPE[record.requestType]}
            </Tag>

            {/* Special tag for completion requests - with more specific text */}
            {record.requestType === 3 && (
              <Tag color="gold" icon={<CheckCircleOutlined />}>
                Final Report
              </Tag>
            )}
          </div>

          {/* Render completion-specific information if it's a completion request */}
          {record.requestType === 3 && (
            <div className="mt-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="text-blue-700 font-medium mb-1">
                Completion Summary
              </div>
              <p className="text-sm text-gray-600">
                {record.completionSummary?.substring(0, 100)}
                {record.completionSummary?.length > 100 ? "..." : ""}
              </p>

              <div className="flex items-center mt-2 text-sm">
                <CheckCircleOutlined className="text-green-500 mr-1" />
                <span className="text-gray-700 mr-2">Budget Reconciled:</span>
                <span>{record.budgetReconciled ? "Yes" : "No"}</span>
              </div>
            </div>
          )}

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

              {/* Show remaining budget for completion requests */}
              {record.requestType === 3 && (
                <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-green-600">
                    Remaining Budget
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    ₫
                    {(
                      record.approvedBudget - record.spentBudget
                    )?.toLocaleString() || "0"}
                  </span>
                </div>
              )}

              {/* Show budget variance explanation for completion requests */}
              {record.requestType === 3 && record.budgetVarianceExplanation && (
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">
                    Budget Explanation:
                  </span>
                  <p className="text-sm mt-1 italic text-gray-600">
                    "{record.budgetVarianceExplanation.substring(0, 80)}
                    {record.budgetVarianceExplanation.length > 80 ? "..." : ""}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Show document count for completion requests */}
          {record.requestType === 3 && record.completionDocuments && (
            <div className="flex items-center text-sm">
              <FileTextOutlined className="text-gray-400 mr-2" />
              <span className="text-gray-600 mr-2">Completion Documents:</span>
              <Tag color="blue">{record.completionDocuments.length}</Tag>
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
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section Skeleton */}
          <div className="text-center mb-12">
            <Skeleton.Input
              active
              style={{ width: 250, height: 40 }}
              className="mb-2"
            />
            <div className="h-1 w-24 mx-auto bg-gray-200 rounded-full"></div>
            <Skeleton
              active
              paragraph={{ rows: 1, width: "60%" }}
              title={false}
              className="mt-4"
            />
          </div>

          {/* Filter Section Skeleton */}
          <div className="mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Skeleton.Input
                  active
                  style={{ width: 300 }}
                  className="mr-2"
                />
                <div className="flex flex-wrap gap-4">
                  <Skeleton.Input active style={{ width: 160 }} />
                  <Skeleton.Input active style={{ width: 180 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Table Skeleton */}
          <Card className="shadow-md mb-8">
            {/* Table Header Skeleton */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 hidden md:flex">
              <div className="w-[40%] px-4">
                <Skeleton.Input active style={{ width: 150 }} />
              </div>
              <div className="w-[30%] px-4">
                <Skeleton.Input active style={{ width: 120 }} />
              </div>
              <div className="w-[10%] px-4">
                <Skeleton.Input active style={{ width: 80 }} />
              </div>
              <div className="w-[20%] px-4">
                <Skeleton.Input active style={{ width: 80 }} />
              </div>
            </div>

            {/* Generate 5 skeleton rows for the table */}
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors`}
              >
                <Row gutter={[24, 16]}>
                  {/* Basic Information Column */}
                  <Col xs={24} md={10}>
                    <div className="space-y-3">
                      <Skeleton.Input
                        active
                        style={{ width: "70%", height: 24 }}
                      />
                      <Skeleton
                        active
                        paragraph={{ rows: 1, width: ["60%"] }}
                        title={false}
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Skeleton.Button
                          active
                          size="small"
                          style={{ width: 80, height: 24 }}
                        />
                        <Skeleton.Button
                          active
                          size="small"
                          style={{ width: 120, height: 24 }}
                        />
                        <Skeleton.Button
                          active
                          size="small"
                          style={{ width: 100, height: 24 }}
                        />
                      </div>

                      {/* User information skeleton */}
                      <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
                        <Skeleton.Avatar active size="small" className="mr-2" />
                        <Skeleton.Input active style={{ width: 150 }} />
                      </div>

                      <div className="flex items-center mt-1">
                        <Skeleton.Avatar active size="small" className="mr-2" />
                        <Skeleton.Input active style={{ width: 120 }} />
                      </div>
                    </div>
                  </Col>

                  {/* Resource Requests Column */}
                  <Col xs={24} md={8}>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Skeleton.Avatar active size="small" className="mr-2" />
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <Skeleton.Input active style={{ width: 80 }} />
                            <Skeleton.Input active style={{ width: 60 }} />
                          </div>
                          <div className="flex justify-between mb-1">
                            <Skeleton.Input active style={{ width: 70 }} />
                            <Skeleton.Input active style={{ width: 60 }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>

                  {/* Status Column */}
                  <Col
                    xs={12}
                    md={2}
                    className="flex items-center justify-center"
                  >
                    <Skeleton.Button active style={{ width: 80, height: 24 }} />
                  </Col>

                  {/* Actions Column */}
                  <Col xs={24} sm={12} md={4}>
                    <div className="space-y-2">
                      <Skeleton.Button
                        active
                        style={{ width: "100%", height: 32 }}
                      />
                      <Skeleton.Button
                        active
                        style={{ width: "100%", height: 32 }}
                      />
                      <Skeleton.Button
                        active
                        style={{ width: "100%", height: 32 }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            ))}

            {/* Pagination Skeleton */}
            <div className="p-4 flex justify-end">
              <div className="flex items-center space-x-2">
                <Skeleton.Button active style={{ width: 32, height: 32 }} />
                <Skeleton.Button active style={{ width: 32, height: 32 }} />
                <Skeleton.Button active style={{ width: 32, height: 32 }} />
                <Skeleton.Input active style={{ width: 50, height: 32 }} />
                <Skeleton.Button active style={{ width: 32, height: 32 }} />
                <Skeleton.Button active style={{ width: 32, height: 32 }} />
              </div>
            </div>
          </Card>

          {/* Empty state suggestion skeleton */}
          <div className="flex justify-center">
            <Skeleton.Avatar active size={64} shape="square" />
          </div>
        </div>
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
            <div className="flex items-center space-x-4 flex-1 flex-wrap md:flex-nowrap">
              {/* Search bar */}
              <Input
                placeholder="Search projects..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={(e) => setSearchText(e.target.value)}
                className="max-w-md mb-2 md:mb-0"
                allowClear
                value={searchText}
              />

              {/* Project type filter */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 font-medium whitespace-nowrap">
                  Project type:
                </span>
                <Select
                  value={typeFilter}
                  style={{ width: 160 }}
                  onChange={setTypeFilter}
                  options={REQUEST_OPTIONS}
                  className="rounded-md"
                />
              </div>

              {/* Request type filter - New addition */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 font-medium whitespace-nowrap">
                  Request type:
                </span>
                <Select
                  value={requestTypeFilter}
                  style={{ width: 180 }}
                  onChange={setRequestTypeFilter}
                  options={[
                    { value: "all", label: "All Request Types" },
                    { value: "1", label: "Research Creation" },
                    { value: "3", label: "Project Completion" },
                    { value: "6", label: "Fund Disbursement" },
                  ]}
                  className="rounded-md"
                />
              </div>
            </div>

            {/* Request Record Button */}
            <Button
              type="primary"
              icon={<HistoryOutlined />}
              onClick={() => navigate("/council-request-records")}
              className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F27D28] hover:to-[#F2922B] border-none ml-4 shadow-sm"
            >
              Request Records
            </Button>
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
                  {selectedProject.requestType === 3 &&
                  selectedProject.completionDocuments &&
                  selectedProject.completionDocuments.length > 0 ? (
                    <div className="space-y-5">
                      <div>
                        <div className="font-medium text-gray-700 mb-2">
                          Completion Documents
                        </div>
                        <div className="space-y-3">
                          {selectedProject.completionDocuments.map((doc) => (
                            <div
                              key={doc.documentId}
                              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center">
                                <FileTextOutlined className="text-magenta-500 mr-3 text-lg" />
                                <div>
                                  <div className="font-medium text-gray-800 mb-1">
                                    {doc.fileName}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    <Tag color="magenta">
                                      Completion Document
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
                                  handleViewDocument(doc.documentUrl)
                                }
                                className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none"
                              >
                                View
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Divider />
                    </div>
                  ) : null}

                  {/* Original documents section follows */}
                  {selectedProject.documents &&
                  selectedProject.documents.length > 0 ? (
                    <div>
                      {selectedProject.requestType === 3 && (
                        <div className="font-medium text-gray-700 mb-2">
                          Original Project Documents
                        </div>
                      )}
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
                                handleViewDocument(doc.documentUrl)
                              }
                              className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none"
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
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

              {/* Add this inside the modal content, specifically for completion requests */}
              {selectedProject && selectedProject.requestType === 3 && (
                <Collapse defaultActiveKey={["1"]} className="mb-4">
                  <Collapse.Panel
                    header={
                      <div className="flex items-center">
                        <CheckCircleOutlined className="text-magenta-500 mr-2" />
                        <span className="font-medium">Completion Details</span>
                      </div>
                    }
                    key="1"
                  >
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          Project Outcomes
                        </div>
                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                          {selectedProject.completionSummary}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">
                          Budget Reconciliation
                        </div>
                        <div className="mt-2 p-3 bg-gray-50 rounded-md flex items-center">
                          <Tag
                            color={
                              selectedProject.budgetReconciled
                                ? "success"
                                : "error"
                            }
                            icon={
                              selectedProject.budgetReconciled ? (
                                <CheckCircleOutlined />
                              ) : (
                                <CloseCircleOutlined />
                              )
                            }
                          >
                            {selectedProject.budgetReconciled
                              ? "Budget Reconciled"
                              : "Budget Not Reconciled"}
                          </Tag>

                          <div className="ml-4">
                            <div className="flex items-center">
                              <span className="text-gray-600 mr-2">
                                Approved:
                              </span>
                              <span className="font-medium">
                                ₫
                                {selectedProject.approvedBudget?.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-600 mr-2">Spent:</span>
                              <span className="font-medium">
                                ₫{selectedProject.spentBudget?.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-600 mr-2">
                                Remaining:
                              </span>
                              <span className="font-medium text-green-600">
                                ₫
                                {(
                                  selectedProject.approvedBudget -
                                  selectedProject.spentBudget
                                )?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {selectedProject.budgetVarianceExplanation && (
                        <div>
                          <div className="text-sm text-gray-500">
                            Budget Variance Explanation
                          </div>
                          <div className="mt-2 p-3 bg-gray-50 rounded-md">
                            {selectedProject.budgetVarianceExplanation}
                          </div>
                        </div>
                      )}
                    </div>
                  </Collapse.Panel>
                </Collapse>
              )}
            </div>
          )}
        </Modal>

        {/* Approval Modal */}
        <Modal
          title={
            <div className="flex items-center">
              <CheckOutlined style={{ color: "#52c41a" }} className="mr-2" />
              <span>Approve Project Request</span>
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
          <Form form={form} onFinish={handleApprovalSubmit}>
            <div>
              {/* Approver Information (matched with rejection modal) */}
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

              {/* Project Information (matched with rejection modal) */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                <p className="font-medium text-gray-800">
                  Request Type:{" "}
                  <Tag color="purple">
                    {REQUEST_TYPE[currentProject?.requestType]}
                  </Tag>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Project: {currentProject?.projectName}
                </p>
                {/* Add completion-specific info for consistency */}
                {currentProject?.requestType === 3 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">
                      Project Outcomes:
                    </div>
                    <div className="bg-white p-2 rounded border border-gray-200 text-sm">
                      {currentProject.completionSummary?.substring(0, 100)}
                      {currentProject.completionSummary?.length > 100
                        ? "..."
                        : ""}
                    </div>
                    <div className="flex items-center mt-2">
                      <Tag
                        color={
                          currentProject.budgetReconciled ? "success" : "error"
                        }
                        icon={
                          currentProject.budgetReconciled ? (
                            <CheckCircleOutlined />
                          ) : (
                            <CloseCircleOutlined />
                          )
                        }
                      >
                        {currentProject.budgetReconciled
                          ? "Budget Reconciled"
                          : "Budget Not Reconciled"}
                      </Tag>
                    </div>
                  </div>
                )}
              </div>

              <Divider />

              {/* File Upload (consistent with rejection modal) */}
              <p className="text-sm font-medium mb-2">
                Please upload an approval document:{" "}
                <span className="text-red-500">*</span>
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

              {/* Confirmation Checkbox */}
              <Form.Item
                name="confirmAction"
                valuePropName="checked"
                rules={[
                  { required: true, message: "Please confirm your action" },
                ]}
                className="mt-4"
              >
                <Checkbox onChange={handleApprovalCheckboxChange}>
                  I confirm that I have reviewed this{" "}
                  {currentProject?.requestType === 3 ? "completion" : ""}{" "}
                  request and approve it.{" "}
                  <span className="text-red-500">*</span>
                </Checkbox>
              </Form.Item>
            </div>
          </Form>
        </Modal>

        {/* Rejection Modal */}
        <Modal
          title={
            <div className="flex items-center">
              <CloseOutlined style={{ color: "#f5222d" }} className="mr-2" />
              <span>Reject Project Request</span>
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
              {/* Rejecter Information (matched with approval modal) */}
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

              {/* Project Information (matched with approval modal) */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                <p className="font-medium text-gray-800">
                  Request Type:{" "}
                  <Tag color="purple">
                    {REQUEST_TYPE[currentProject.requestType]}
                  </Tag>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Project: {currentProject.projectName}
                </p>
                {/* Keep completion-specific info for consistency */}
                {currentProject.requestType === 3 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">
                      Project Outcomes:
                    </div>
                    <div className="bg-white p-2 rounded border border-gray-200 text-sm">
                      {currentProject.completionSummary?.substring(0, 100)}
                      {currentProject.completionSummary?.length > 100
                        ? "..."
                        : ""}
                    </div>
                    <div className="flex items-center mt-2">
                      <Tag
                        color={
                          currentProject.budgetReconciled ? "success" : "error"
                        }
                        icon={
                          currentProject.budgetReconciled ? (
                            <CheckCircleOutlined />
                          ) : (
                            <CloseCircleOutlined />
                          )
                        }
                      >
                        {currentProject.budgetReconciled
                          ? "Budget Reconciled"
                          : "Budget Not Reconciled"}
                      </Tag>
                    </div>
                  </div>
                )}
              </div>

              <Divider />

              {/* File Upload (consistent with approval modal) */}
              <p className="text-sm font-medium mb-2">
                Please upload a rejection document:{" "}
                <span className="text-red-500">*</span>
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

              {/* Rejection Reason  */}
              <Form.Item
                name="rejectionReason"
                label={<span>Reason for Rejection</span>}
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

              {/* Confirmation Checkbox */}
              <Form.Item
                name="confirmAction"
                valuePropName="checked"
                rules={[
                  { required: true, message: "Please confirm your action" },
                ]}
              >
                <Checkbox onChange={handleRejectionCheckboxChange}>
                  I confirm that I have reviewed this{" "}
                  {currentProject.requestType === 3 ? "completion" : ""} request
                  and reject it. <span className="text-red-500">*</span>
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
