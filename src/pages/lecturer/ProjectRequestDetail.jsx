import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Descriptions,
  Tag,
  Space,
  Divider,
  Button,
  Timeline,
  Collapse,
  List,
  Avatar,
  Row,
  Col,
  Spin,
  Empty,
  Alert,
  message,
  Modal,
  Upload,
  Form,
  Input,
  Checkbox,
  Skeleton,
} from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  DownloadOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
  ArrowLeftOutlined,
  HistoryOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetProjectRequestDetailsQuery,
  useApproveProjectRequestMutation,
  useRejectProjectRequestMutation,
  useApproveCompletionRequestMutation,
  useRejectCompletionRequestMutation,
} from "../../features/project/projectApiSlice";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

// Constants for document types
const DOCUMENT_TYPE = {
  0: "Project Proposal",
  1: "Disbursement",
  2: "Council Decision",
  3: "Conference Proposal",
  4: "Journal Paper",
  5: "Disbursement Confirmation",
  6: "Project Completion",
  7: "Conference Paper",
  8: "Conference Expense",
  9: "Conference Expense Decision",
  10: "Conference Funding",
  11: "Journal Funding",
  12: "Funding Confirmation",
};

// Constants for request types
const REQUEST_TYPE = {
  1: "Research Creation",
  2: "Phase Update",
  3: "Completion",
  4: "Paper Creation",
  5: "Conference Creation",
  6: "Fund Disbursement",
};

// Constants for approval status
const APPROVAL_STATUS = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
};

// Constants for status colors
const STATUS_COLORS = {
  0: "gold", // Pending
  1: "green", // Approved
  2: "red", // Rejected
};

// Constants for group member roles
const GROUP_MEMBER_ROLE = {
  0: "Leader",
  1: "Member",
  2: "Supervisor",
  3: "Council Chairman",
  4: "Secretary",
  5: "Council Member",
  6: "Stakeholder",
};

// Constants for project phase status
const PROJECT_PHASE_STATUS = {
  0: "In Progress",
  1: "Pending",
  2: "Completed",
  3: "Overdue",
};

// Constants for phase status colors
const PHASE_STATUS_COLORS = {
  0: "blue", // In Progress
  1: "gold", // Pending
  2: "green", // Completed
  3: "red", // Overdue
};

// Add the Fund Disbursement Type enum mapping
const FUND_DISBURSEMENT_TYPE = {
  0: "Project Phase",
  1: "Conference Expense",
  2: "Conference Funding",
  3: "Journal Funding",
};

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Format datetime helper
const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format currency helper
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Add a helper function to check if user is authorized to approve/reject
const isUserInCouncil = (user) => {
  // Find council group where user is Chairman or Secretary
  const councilGroup = user?.groups?.find(
    (group) => group.groupType === 1 && (group.role === 3 || group.role === 4)
  );

  return !!councilGroup;
};

const ProjectRequestDetail = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [rejectionForm] = Form.useForm();

  // State for approval/rejection modals
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [approvalFileList, setApprovalFileList] = useState([]);
  const [rejectionFileList, setRejectionFileList] = useState([]);
  const [approvalConfirmed, setApprovalConfirmed] = useState(false);
  const [rejectionConfirmed, setRejectionConfirmed] = useState(false);

  // Fetch project request details
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProjectRequestDetailsQuery(requestId);

  // Mutations for approve/reject
  const [approveProjectRequest, { isLoading: isApproving }] =
    useApproveProjectRequestMutation();
  const [rejectProjectRequest, { isLoading: isRejecting }] =
    useRejectProjectRequestMutation();

  // Add these mutations
  const [approveCompletionRequest, { isLoading: isApprovingCompletion }] =
    useApproveCompletionRequestMutation();
  const [rejectCompletionRequest, { isLoading: isRejectingCompletion }] =
    useRejectCompletionRequestMutation();

  // Extract project request data
  const projectRequest = response?.data;

  // Handle checkbox changes
  const handleApprovalCheckboxChange = (e) => {
    setApprovalConfirmed(e.target.checked);
  };

  const handleRejectionCheckboxChange = (e) => {
    setRejectionConfirmed(e.target.checked);
  };

  // Handle approve button click
  const handleApproveClick = () => {
    setApprovalFileList([]);
    setApprovalConfirmed(false);
    form.resetFields();
    setApprovalModalVisible(true);
  };

  // Handle reject button click
  const handleRejectClick = () => {
    setRejectionFileList([]);
    setRejectionConfirmed(false);
    rejectionForm.resetFields();
    setRejectionModalVisible(true);
  };

  // Handle document view
  const handleViewDocument = (documentUrl) => {
    window.open(documentUrl, "_blank");
  };

  // Handle approve submission
  const handleApprovalSubmit = async (values) => {
    try {
      // Check if user has permission
      if (
        projectRequest.requestType !== 6 &&
        (user?.role === "lecturer" || user?.role === "department") &&
        !isUserInCouncil(user)
      ) {
        message.error("You don't have permission to approve this request");
        return;
      }

      // Check if we have files
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

      // Use different API based on request type
      if (projectRequest.requestType === 3) {
        // Completion request
        await approveCompletionRequest({
          requestId,
          formData: formData,
        }).unwrap();
      } else {
        // Other request types
        await approveProjectRequest({
          requestId,
          formData: formData,
        }).unwrap();
      }

      message.success("Project request has been approved successfully");
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

  // Handle reject submission
  const handleRejectionSubmit = async (values) => {
    try {
      // Check if user has permission
      if (
        projectRequest.requestType !== 6 &&
        (user?.role === "lecturer" || user?.role === "department") &&
        !isUserInCouncil(user)
      ) {
        message.error("You don't have permission to reject this request");
        return;
      }

      // Check if we have files
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
      formData.append("rejectionReason", values.rejectionReason || "");

      // Use different API based on request type
      if (projectRequest.requestType === 3) {
        // Completion request
        await rejectCompletionRequest({
          requestId,
          formData: formData,
        }).unwrap();
      } else {
        // Other request types
        await rejectProjectRequest({
          requestId,
          formData: formData,
        }).unwrap();
      }

      message.success("Project request has been rejected successfully");
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

  // Add a useEffect for debug logging
  useEffect(() => {
    if (projectRequest && user) {
      console.log("Permission debug info:");
      console.log("User role:", user.role);
      console.log("User groups:", user.groups);
      console.log("Is user in council:", isUserInCouncil(user));
      console.log("Request type:", projectRequest.requestType);
      console.log("Request status:", projectRequest.approvalStatus);
    }
  }, [projectRequest, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section Skeleton */}
          <Card className="mb-8 shadow-md rounded-lg border-0 border-l-4 border-[#F2722B]">
            <div className="mb-4">
              <Skeleton.Button active style={{ width: 100 }} />
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <Skeleton
                active
                title={{ width: 300 }}
                paragraph={{ rows: 1, width: ["40%"] }}
              />

              <div className="mt-4 md:mt-0 flex gap-3">
                <Skeleton.Button active style={{ width: 100, height: 40 }} />
                <Skeleton.Button active style={{ width: 100, height: 40 }} />
              </div>
            </div>

            <Divider className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton.Input active style={{ width: "100%", height: 80 }} />
              <Skeleton.Input active style={{ width: "100%", height: 80 }} />
              <Skeleton.Input active style={{ width: "100%", height: 80 }} />
            </div>
          </Card>

          {/* Project Completion Details Skeleton - This might be present depending on request type */}
          <Card
            title={<Skeleton.Input active style={{ width: 220 }} />}
            className="mb-6 shadow-md"
          >
            <div className="grid gap-6">
              <div>
                <Skeleton.Input
                  active
                  style={{ width: 150, marginBottom: 12 }}
                />
                <Skeleton.Input active style={{ width: "100%", height: 100 }} />
              </div>

              <div>
                <Skeleton.Input
                  active
                  style={{ width: 120, marginBottom: 12 }}
                />
                <div className="mb-3">
                  <Skeleton.Button active style={{ width: 150, height: 32 }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Skeleton.Input
                    active
                    style={{ width: "100%", height: 70 }}
                  />
                  <Skeleton.Input
                    active
                    style={{ width: "100%", height: 70 }}
                  />
                  <Skeleton.Input
                    active
                    style={{ width: "100%", height: 70 }}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              {/* Project Details Card Skeleton */}
              <Card
                title={<Skeleton.Input active style={{ width: 200 }} />}
                className="mb-6 shadow-md"
              >
                <Skeleton active paragraph={{ rows: 8 }} />
              </Card>

              {/* Project Phases Skeleton */}
              <Card
                title={<Skeleton.Input active style={{ width: 200 }} />}
                className="mb-6 shadow-md"
              >
                <Skeleton active paragraph={{ rows: 5 }} />
              </Card>

              {/* Documents Section Skeleton */}
              <Card
                title={<Skeleton.Input active style={{ width: 200 }} />}
                className="mb-6 shadow-md"
              >
                <Skeleton.Button
                  active
                  style={{ width: 150, marginBottom: 16 }}
                />

                {/* Document item skeletons */}
                {[1, 2, 3].map((item) => (
                  <div key={item} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Skeleton.Avatar active size="small" className="mr-2" />
                        <Skeleton.Input active style={{ width: 200 }} />
                      </div>
                      <Skeleton.Button active style={{ width: 80 }} />
                    </div>
                    <Skeleton active paragraph={{ rows: 1, width: ["60%"] }} />
                  </div>
                ))}
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              {/* Group Info Skeleton */}
              <Card
                title={<Skeleton.Input active style={{ width: 200 }} />}
                className="mb-6 shadow-md"
              >
                <Skeleton active paragraph={{ rows: 3 }} />

                <Divider orientation="left" className="text-gray-600 my-4">
                  <Skeleton.Input active style={{ width: 120 }} />
                </Divider>

                {/* Group Member skeletons */}
                {[1, 2, 3].map((item) => (
                  <div key={item} className="mb-4 p-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <Skeleton.Avatar active size="default" className="mr-3" />
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Skeleton.Input
                            active
                            style={{ width: 150 }}
                            className="mr-2"
                          />
                          <Skeleton.Button
                            active
                            size="small"
                            style={{ width: 60 }}
                          />
                        </div>
                        <Skeleton
                          active
                          paragraph={{ rows: 1, width: ["80%"] }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </Card>

              {/* Request Timeline Skeleton */}
              <Card
                title={<Skeleton.Input active style={{ width: 200 }} />}
                className="shadow-md"
              >
                <div className="relative">
                  {/* Timeline dot and line */}
                  <div className="absolute left-0 top-0 bottom-0 w-6 flex justify-center">
                    <div className="w-1 bg-gray-200 h-full relative">
                      <Skeleton.Avatar
                        active
                        size="small"
                        className="absolute -top-1"
                      />
                      <Skeleton.Avatar
                        active
                        size="small"
                        className="absolute top-1/2 -translate-y-1/2"
                      />
                    </div>
                  </div>

                  {/* Timeline content */}
                  <div className="ml-10 space-y-6">
                    <div>
                      <Skeleton.Input
                        active
                        style={{ width: 150, marginBottom: 8 }}
                      />
                      <Skeleton
                        active
                        paragraph={{ rows: 2, width: ["90%", "60%"] }}
                      />
                    </div>
                    <div>
                      <Skeleton.Input
                        active
                        style={{ width: 150, marginBottom: 8 }}
                      />
                      <Skeleton
                        active
                        paragraph={{ rows: 2, width: ["90%", "60%"] }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen bg-gray-50">
        <div className="max-w-2xl w-full">
          <Alert
            message={
              <span className="text-lg font-semibold">
                Error Loading Project Request Details
              </span>
            }
            description={
              <div className="mt-2">
                {error?.data?.message ||
                  "Failed to load project request details"}
              </div>
            }
            type="error"
            showIcon
            className="shadow-lg"
            action={
              <Button type="primary" onClick={() => refetch()} size="large">
                Try Again
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  if (!projectRequest) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <Empty
            description={
              <span className="text-lg">Project request not found</span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <div className="mt-6">
            <Button
              type="primary"
              onClick={() => navigate("/review-project")}
              size="large"
              className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none hover:from-[#E65D1B] hover:to-[#FF9500]"
            >
              Back to Project Requests
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-[#F2722B]">
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/review-project")}
            className="px-0 hover:text-[#F2722B] mb-4"
          >
            Back to Project Requests
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <Title level={2} className="mb-2 text-gray-800">
                {projectRequest.projectName}
              </Title>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Tag color="blue" className="px-3 py-1 text-sm">
                  {projectRequest.projectTypeName}
                </Tag>
                <Tag color="purple" className="px-3 py-1 text-sm">
                  {REQUEST_TYPE[projectRequest.requestType]}
                </Tag>
                <Tag
                  color={STATUS_COLORS[projectRequest.approvalStatus]}
                  className="px-3 py-1 text-sm"
                >
                  {APPROVAL_STATUS[projectRequest.approvalStatus]}
                </Tag>

                {/* Add Fund Disbursement Type tag if present */}
                {projectRequest.fundDisbursementType !== null && (
                  <Tag color="cyan" className="px-3 py-1 text-sm">
                    {
                      FUND_DISBURSEMENT_TYPE[
                        projectRequest.fundDisbursementType
                      ]
                    }
                  </Tag>
                )}

                {/* Add Conference tag if present */}
                {projectRequest.conferenceName && (
                  <Tag color="geekblue" className="px-3 py-1 text-sm">
                    Conference: {projectRequest.conferenceName}
                  </Tag>
                )}

                {/* Add Journal tag if present */}
                {projectRequest.journalName && (
                  <Tag color="magenta" className="px-3 py-1 text-sm">
                    Journal: {projectRequest.journalName}
                  </Tag>
                )}
              </div>
            </div>

            {projectRequest.approvalStatus === 0 ? (
              // For fund disbursement requests, only show buttons to office/admin
              // For other request types, show to lecturer/department who are in appropriate council
              (projectRequest.requestType === 6 &&
                (user?.role === "office" || user?.role === "admin")) ||
              (projectRequest.requestType !== 6 &&
                (user?.role === "lecturer" || user?.role === "department") &&
                isUserInCouncil(user)) ? (
                <div className="mt-4 md:mt-0 flex gap-3">
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={handleApproveClick}
                    size="large"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none shadow-md"
                  >
                    Approve
                  </Button>
                  <Button
                    type="primary"
                    danger
                    icon={<CloseOutlined />}
                    onClick={handleRejectClick}
                    size="large"
                    className="shadow-md"
                  >
                    Reject
                  </Button>
                </div>
              ) : // Show informational message for lecturers/department who aren't in council
              (user?.role === "lecturer" || user?.role === "department") &&
                !isUserInCouncil(user) &&
                projectRequest.requestType !== 6 ? (
                <div className="mt-4 md:mt-0">
                  {/* <Alert
                    type="info"
                    showIcon
                    message="You need to be a Council Chairman or Secretary to approve or reject this request."
                    className="border-blue-300 text-blue-700"
                  /> */}
                </div>
              ) : null
            ) : null}
          </div>

          <Divider className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 p-3 rounded-lg">
              <CalendarOutlined className="text-[#F2722B] text-xl mb-1" />
              <div className="text-sm text-gray-500">Timeline</div>
              <div className="font-medium">
                {formatDate(projectRequest.startDate)} -{" "}
                {formatDate(projectRequest.endDate)}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <TeamOutlined className="text-[#F2722B] text-xl mb-1" />
              <div className="text-sm text-gray-500">Department</div>
              <div className="font-medium">
                {projectRequest.department?.departmentName}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <DollarOutlined className="text-[#F2722B] text-xl mb-1" />
              <div className="text-sm text-gray-500">Budget</div>
              <div className="font-medium">
                {formatCurrency(projectRequest.approvedBudget)}
              </div>
              {projectRequest.spentBudget > 0 && (
                <div className="text-xs text-gray-500">
                  Spent: {formatCurrency(projectRequest.spentBudget)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Completion Details Card - Move this up */}
        {projectRequest.requestType === 3 && (
          <Card
            title={
              <div className="flex items-center">
                <CheckCircleOutlined className="text-[#F2722B] mr-2" />
                <span className="font-semibold">
                  Project Completion Details
                </span>
              </div>
            }
            className="mb-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="grid gap-6">
              {/* Completion Summary */}
              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  Project Outcomes
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {projectRequest.completionSummary ||
                    "No completion summary provided"}
                </div>
              </div>

              {/* Budget Reconciliation */}
              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  Budget Status
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-3">
                    <Tag
                      color={
                        projectRequest.budgetReconciled ? "success" : "error"
                      }
                      icon={
                        projectRequest.budgetReconciled ? (
                          <CheckCircleOutlined />
                        ) : (
                          <CloseCircleOutlined />
                        )
                      }
                      className="px-3 py-1 text-base"
                    >
                      {projectRequest.budgetReconciled
                        ? "Budget Reconciled"
                        : "Budget Not Reconciled"}
                    </Tag>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <div className="text-sm text-gray-500">
                        Approved Budget
                      </div>
                      <div className="text-lg font-medium">
                        {formatCurrency(projectRequest.approvedBudget)}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <div className="text-sm text-gray-500">Spent Budget</div>
                      <div className="text-lg font-medium">
                        {formatCurrency(projectRequest.spentBudget)}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border border-green-200">
                      <div className="text-sm text-green-600">
                        Remaining Budget
                      </div>
                      <div className="text-lg font-medium text-green-600">
                        {formatCurrency(projectRequest.budgetRemaining)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Variance Explanation */}
              {projectRequest.budgetVarianceExplanation && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">
                    Budget Variance Explanation
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {projectRequest.budgetVarianceExplanation}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            {/* Project Details Card - Enhanced */}
            <Card
              title={
                <div className="flex items-center">
                  <InfoCircleOutlined className="text-[#F2722B] mr-2" />
                  <span className="font-semibold">Project Request Details</span>
                </div>
              }
              className="mb-6 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              headStyle={{ borderBottom: "2px solid #f0f0f0" }}
            >
              {/* Status banner for rejected requests */}
              {projectRequest.approvalStatus === 2 && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                  <div className="flex">
                    <ExclamationCircleOutlined className="flex-shrink-0 mr-2" />
                    <div>
                      <p className="font-medium">Request was rejected</p>
                      <p>{projectRequest.rejectionReason}</p>
                    </div>
                  </div>
                </div>
              )}

              <Descriptions
                bordered
                column={1}
                size="small"
                labelStyle={{ fontWeight: "500", backgroundColor: "#fafafa" }}
                contentStyle={{ backgroundColor: "white" }}
              >
                <Descriptions.Item label="Project Name">
                  {projectRequest.projectName}
                </Descriptions.Item>
                <Descriptions.Item label="Description">
                  {projectRequest.description}
                </Descriptions.Item>
                {projectRequest.methodology && (
                  <Descriptions.Item label="Methodology">
                    {projectRequest.methodology}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Project Type">
                  {projectRequest.projectTypeName}
                </Descriptions.Item>
                <Descriptions.Item label="Request Type">
                  {REQUEST_TYPE[projectRequest.requestType]}
                </Descriptions.Item>
                <Descriptions.Item label="Department">
                  {projectRequest.department?.departmentName}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={STATUS_COLORS[projectRequest.approvalStatus]}>
                    {APPROVAL_STATUS[projectRequest.approvalStatus]}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Timeline">
                  {formatDate(projectRequest.startDate)} to{" "}
                  {formatDate(projectRequest.endDate)}
                </Descriptions.Item>
                <Descriptions.Item label="Budget">
                  <div>
                    <div>
                      Approved: {formatCurrency(projectRequest.approvedBudget)}
                    </div>
                    {projectRequest.spentBudget > 0 && (
                      <div>
                        Spent: {formatCurrency(projectRequest.spentBudget)}
                      </div>
                    )}
                    {projectRequest.fundRequestAmount > 0 && (
                      <div>
                        Requested:{" "}
                        {formatCurrency(projectRequest.fundRequestAmount)}
                      </div>
                    )}
                  </div>
                </Descriptions.Item>
                {/* Add Fund Disbursement Type if present */}
                {projectRequest.fundDisbursementType !== null && (
                  <Descriptions.Item label="Fund Disbursement Type">
                    <Tag color="cyan">
                      {
                        FUND_DISBURSEMENT_TYPE[
                          projectRequest.fundDisbursementType
                        ]
                      }
                    </Tag>
                  </Descriptions.Item>
                )}
                {/* Add Conference information if present */}
                {projectRequest.conferenceName && (
                  <Descriptions.Item label="Conference">
                    {projectRequest.conferenceName}
                  </Descriptions.Item>
                )}
                {/* Add Journal information if present */}
                {projectRequest.journalName && (
                  <Descriptions.Item label="Journal">
                    {projectRequest.journalName}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Requested By">
                  {projectRequest.requestedBy?.fullName} (
                  {projectRequest.requestedBy?.email})
                </Descriptions.Item>
                <Descriptions.Item label="Requested At">
                  {formatDateTime(projectRequest.requestedAt)}
                </Descriptions.Item>
                {projectRequest.approvedBy && (
                  <Descriptions.Item label="Approved By">
                    {projectRequest.approvedBy?.fullName} (
                    {projectRequest.approvedBy?.email})
                  </Descriptions.Item>
                )}
                {projectRequest.approvedAt && (
                  <Descriptions.Item label="Approved At">
                    {formatDateTime(projectRequest.approvedAt)}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            {/* Project Phases - Enhanced */}
            {projectRequest.projectPhases &&
              projectRequest.projectPhases.length > 0 && (
                <Card
                  title={
                    <div className="flex items-center">
                      <ClockCircleOutlined className="text-[#F2722B] mr-2" />
                      <span className="font-semibold">Project Phases</span>
                    </div>
                  }
                  className="mb-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <Timeline>
                    {projectRequest.projectPhases.map((phase) => (
                      <Timeline.Item
                        key={phase.projectPhaseId}
                        color={PHASE_STATUS_COLORS[phase.status]}
                        dot={
                          phase.status === 2 ? (
                            <CheckCircleOutlined className="text-green-500" />
                          ) : phase.status === 3 ? (
                            <ExclamationCircleOutlined className="text-red-500" />
                          ) : phase.status === 1 ? (
                            <ClockCircleOutlined className="text-gold" />
                          ) : (
                            <ClockCircleOutlined className="text-blue-500" />
                          )
                        }
                      >
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                          <Text strong className="text-lg">
                            {phase.title}
                          </Text>
                          <div className="flex items-center mt-1 text-gray-500">
                            <CalendarOutlined className="mr-1" />
                            {formatDate(phase.startDate)} -{" "}
                            {formatDate(phase.endDate)}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <Tag
                              color={PHASE_STATUS_COLORS[phase.status]}
                              className="px-2 py-1"
                            >
                              {PROJECT_PHASE_STATUS[phase.status]}
                            </Tag>
                            {phase.spentBudget > 0 && (
                              <div className="text-gray-700">
                                <DollarOutlined />{" "}
                                {formatCurrency(phase.spentBudget)}
                              </div>
                            )}
                          </div>
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Card>
              )}

            {/* Documents Section - Enhanced and Grouped by Type */}
            <Card
              title={
                <div className="flex items-center">
                  <FileTextOutlined className="text-[#F2722B] mr-2" />
                  <span className="font-semibold">Project Documents</span>
                </div>
              }
              className="mb-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {projectRequest.documents &&
              projectRequest.documents.length > 0 ? (
                <Collapse defaultActiveKey={["0"]} className="border-0">
                  {Object.entries(
                    projectRequest.documents.reduce((acc, doc) => {
                      const type = doc.documentType;
                      if (!acc[type]) acc[type] = [];
                      acc[type].push(doc);
                      return acc;
                    }, {})
                  ).map(([docType, docs]) => (
                    <Collapse.Panel
                      key={docType}
                      header={
                        <div className="flex items-center">
                          <FileTextOutlined className="mr-2 text-[#F2722B]" />
                          <span className="font-medium">
                            {DOCUMENT_TYPE[docType]} ({docs.length})
                          </span>
                        </div>
                      }
                      className="bg-white mb-3 rounded-lg shadow-sm overflow-hidden border border-gray-100"
                    >
                      <List
                        itemLayout="horizontal"
                        dataSource={docs}
                        renderItem={(doc) => (
                          <List.Item
                            className="hover:bg-gray-50 rounded-lg transition-colors p-1"
                            actions={[
                              <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={() =>
                                  handleViewDocument(doc.documentUrl)
                                }
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none"
                              >
                                View
                              </Button>,
                            ]}
                          >
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  icon={<FileTextOutlined />}
                                  className="bg-gradient-to-r from-[#F2722B] to-[#FFA500]"
                                />
                              }
                              title={
                                <span className="font-medium">
                                  {doc.fileName}
                                </span>
                              }
                              description={
                                <Text type="secondary">
                                  Uploaded: {formatDateTime(doc.uploadAt)}
                                </Text>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </Collapse.Panel>
                  ))}
                </Collapse>
              ) : (
                <Empty description="No documents available" />
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            {/* Group & Members Info - Enhanced */}
            <Card
              title={
                <div className="flex items-center">
                  <TeamOutlined className="text-[#F2722B] mr-2" />
                  <span className="font-semibold">
                    Research Group Information
                  </span>
                </div>
              }
              className="mb-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {projectRequest.group ? (
                <>
                  <Descriptions
                    column={1}
                    size="small"
                    bordered
                    labelStyle={{
                      fontWeight: "500",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <Descriptions.Item label="Group Name">
                      {projectRequest.group.groupName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Group Type">
                      {projectRequest.group.groupType === 0
                        ? "Student Group"
                        : projectRequest.group.groupType === 1
                        ? "Council Group"
                        : "Research Group"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Department">
                      {projectRequest.department?.departmentName}
                    </Descriptions.Item>
                  </Descriptions>

                  <Divider orientation="left" className="text-gray-600">
                    Group Members
                  </Divider>
                  <List
                    itemLayout="horizontal"
                    dataSource={projectRequest.group.members}
                    renderItem={(member) => (
                      <List.Item className="hover:bg-gray-50 rounded-lg transition-colors">
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              icon={<UserOutlined />}
                              className={
                                member.role === 0
                                  ? "bg-blue-500"
                                  : member.role === 3
                                  ? "bg-purple-500"
                                  : member.role === 4
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }
                            />
                          }
                          title={
                            <div className="flex items-center">
                              {member.memberName}
                              <Tag
                                color={
                                  member.role === 0
                                    ? "blue"
                                    : member.role === 2
                                    ? "orange"
                                    : member.role === 3
                                    ? "purple"
                                    : member.role === 4
                                    ? "green"
                                    : member.role === 5
                                    ? "magenta"
                                    : "default"
                                }
                                className="ml-2"
                              >
                                {GROUP_MEMBER_ROLE[member.role]}
                              </Tag>
                            </div>
                          }
                          description={
                            <div className="space-y-1">
                              <div>{member.memberEmail}</div>
                              <div className="text-xs text-gray-500">
                                Joined: {formatDate(member.joinDate)}
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </>
              ) : (
                <Empty description="No group information available" />
              )}
            </Card>

            {/* Request Timeline Card - Enhanced */}
            <Card
              title={
                <div className="flex items-center">
                  <HistoryOutlined className="text-[#F2722B] mr-2" />
                  <span className="font-semibold">Request Timeline</span>
                </div>
              }
              className="shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <Timeline>
                <Timeline.Item
                  color="blue"
                  dot={
                    <div className="bg-blue-500 p-2 rounded-full flex items-center justify-center">
                      <CalendarOutlined style={{ color: "white" }} />
                    </div>
                  }
                >
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <Text strong className="text-blue-700">
                      Request Created
                    </Text>
                    <div className="mt-1 text-gray-700">
                      {formatDateTime(projectRequest.requestedAt)}
                    </div>
                    <div className="flex items-center mt-1 text-gray-600">
                      <UserOutlined className="mr-1" />{" "}
                      {projectRequest.requestedBy?.fullName}
                    </div>
                  </div>
                </Timeline.Item>

                {projectRequest.approvalStatus !== 0 && (
                  <Timeline.Item
                    color={
                      projectRequest.approvalStatus === 1 ? "green" : "red"
                    }
                    dot={
                      <div
                        className={`${
                          projectRequest.approvalStatus === 1
                            ? "bg-green-500"
                            : "bg-red-500"
                        } p-2 rounded-full flex items-center justify-center`}
                      >
                        {projectRequest.approvalStatus === 1 ? (
                          <CheckCircleOutlined style={{ color: "white" }} />
                        ) : (
                          <CloseOutlined style={{ color: "white" }} />
                        )}
                      </div>
                    }
                  >
                    <div
                      className={`${
                        projectRequest.approvalStatus === 1
                          ? "bg-green-50 border-green-100"
                          : "bg-red-50 border-red-100"
                      } p-3 rounded-lg border`}
                    >
                      <Text
                        strong
                        className={
                          projectRequest.approvalStatus === 1
                            ? "text-green-700"
                            : "text-red-700"
                        }
                      >
                        {projectRequest.approvalStatus === 1
                          ? "Approved"
                          : "Rejected"}
                      </Text>
                      <div className="mt-1 text-gray-700">
                        {formatDateTime(projectRequest.approvedAt)}
                      </div>
                      <div className="flex items-center mt-1 text-gray-600">
                        <UserOutlined className="mr-1" />{" "}
                        {projectRequest.approvedBy?.fullName}
                      </div>
                      {projectRequest.rejectionReason && (
                        <div className="mt-2 p-2 bg-white rounded border border-red-200">
                          <Text type="danger">
                            Reason: {projectRequest.rejectionReason}
                          </Text>
                        </div>
                      )}
                    </div>
                  </Timeline.Item>
                )}
              </Timeline>
            </Card>
          </Col>
        </Row>

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
                    {REQUEST_TYPE[projectRequest?.requestType]}
                  </Tag>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Project: {projectRequest?.projectName}
                </p>
                {/* Add completion-specific info for consistency */}
                {projectRequest?.requestType === 3 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">
                      Project Outcomes:
                    </div>
                    <div className="bg-white p-2 rounded border border-gray-200 text-sm">
                      {projectRequest.completionSummary?.substring(0, 100)}
                      {projectRequest.completionSummary?.length > 100
                        ? "..."
                        : ""}
                    </div>
                    <div className="flex items-center mt-2">
                      <Tag
                        color={
                          projectRequest.budgetReconciled ? "success" : "error"
                        }
                        icon={
                          projectRequest.budgetReconciled ? (
                            <CheckCircleOutlined />
                          ) : (
                            <CloseCircleOutlined />
                          )
                        }
                      >
                        {projectRequest.budgetReconciled
                          ? "Budget Reconciled"
                          : "Budget Not Reconciled"}
                      </Tag>
                    </div>
                  </div>
                )}
              </div>

              <Divider />

              {/* File Upload - add asterisk */}
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
                  {projectRequest?.requestType === 3 ? "completion" : ""}{" "}
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
                  {REQUEST_TYPE[projectRequest?.requestType]}
                </Tag>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Project: {projectRequest?.projectName}
              </p>
              {/* Keep completion-specific info for consistency */}
              {projectRequest?.requestType === 3 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">
                    Project Outcomes:
                  </div>
                  <div className="bg-white p-2 rounded border border-gray-200 text-sm">
                    {projectRequest.completionSummary?.substring(0, 100)}
                    {projectRequest.completionSummary?.length > 100
                      ? "..."
                      : ""}
                  </div>
                  <div className="flex items-center mt-2">
                    <Tag
                      color={
                        projectRequest.budgetReconciled ? "success" : "error"
                      }
                      icon={
                        projectRequest.budgetReconciled ? (
                          <CheckCircleOutlined />
                        ) : (
                          <CloseCircleOutlined />
                        )
                      }
                    >
                      {projectRequest.budgetReconciled
                        ? "Budget Reconciled"
                        : "Budget Not Reconciled"}
                    </Tag>
                  </div>
                </div>
              )}
            </div>

            <Divider />

            {/* File Upload - add asterisk */}
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

            {/* Rejection Reason already has required rule in Form.Item */}
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
                {projectRequest?.requestType === 3 ? "completion" : ""} request
                and reject it. <span className="text-red-500">*</span>
              </Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ProjectRequestDetail;
