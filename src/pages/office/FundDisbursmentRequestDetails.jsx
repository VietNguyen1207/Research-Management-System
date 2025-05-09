import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Descriptions,
  Tag,
  List,
  Button,
  Spin,
  Alert,
  Typography,
  Row,
  Col,
  Statistic,
  Progress,
  Divider,
  Timeline,
  Space,
  Empty,
  message,
  Modal,
  Input,
  Upload,
  Form,
  Skeleton,
} from "antd";
import {
  FileTextOutlined,
  DollarOutlined,
  CalendarOutlined,
  FilePdfOutlined,
  DownloadOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  BankOutlined,
  CheckOutlined,
  CloseOutlined,
  UploadOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import {
  useGetFundDisbursementDetailsQuery,
  useApproveFundDisbursementMutation,
  useRejectFundDisbursementMutation,
} from "../../features/fund-disbursement/fundDisbursementApiSlice";
import {
  useApproveConferenceExpenseRequestMutation,
  useRejectConferenceExpenseRequestMutation,
} from "../../features/project/conference/conferenceApiSlice";
import {
  useApproveJournalFundingRequestMutation,
  useRejectJournalFundingRequestMutation,
} from "../../features/project/journal/journalApiSlice";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Project Type enum mapping
const PROJECT_TYPE = {
  0: "Research",
  1: "Conference",
  2: "Journal",
};

// Project Phase Status enum mapping
const PHASE_STATUS = {
  0: "In Progress",
  1: "Pending",
  2: "Completed",
  3: "Overdue",
};

// Add Fund Disbursement Type enum mapping
const FUND_DISBURSEMENT_TYPE = {
  0: "Project Phase",
  1: "Conference Expense",
  2: "Conference Funding",
  3: "Journal Funding",
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", // Use long month name for detail view
    day: "numeric",
    hour: "2-digit", // Add time for detail view
    minute: "2-digit",
  });
};

const FundDisbursementRequestDetails = () => {
  const { disbursementId } = useParams();
  const navigate = useNavigate();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectFileList, setRejectFileList] = useState([]);

  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [approveFileList, setApproveFileList] = useState([]);

  const {
    data: details,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFundDisbursementDetailsQuery(disbursementId, {
    skip: !disbursementId, // Skip query if ID is not available
  });

  const [approveRequest, { isLoading: isApprovingMutation }] =
    useApproveFundDisbursementMutation();
  const [rejectRequest, { isLoading: isRejectingMutation }] =
    useRejectFundDisbursementMutation();

  const [
    approveConferenceExpense,
    { isLoading: isApprovingConferenceExpense },
  ] = useApproveConferenceExpenseRequestMutation();
  const [rejectConferenceExpense, { isLoading: isRejectingConferenceExpense }] =
    useRejectConferenceExpenseRequestMutation();

  const [approveJournalFunding, { isLoading: isApprovingJournalFunding }] =
    useApproveJournalFundingRequestMutation();
  const [rejectJournalFunding, { isLoading: isRejectingJournalFunding }] =
    useRejectJournalFundingRequestMutation();

  const handleFileChange = (info, setFileList) => {
    setFileList(info.fileList);
  };

  const beforeUpload = (file) => {
    return false;
  };

  const extractFiles = (fileList) => {
    return fileList.map((file) => file.originFileObj).filter((file) => file);
  };

  const showApproveModal = () => {
    setApproveFileList([]);
    setIsApproveModalVisible(true);
  };

  const handleApproveConfirm = async () => {
    // Verify we have files
    if (approveFileList.length === 0) {
      message.error("Please attach at least one supporting document");
      return;
    }

    // Make sure we have a valid requestId from the details
    if (!details?.requestId) {
      message.error("Request ID is missing - cannot process approval");
      console.error("Missing requestId in details:", details);
      return;
    }

    try {
      console.log("Approving request with ID:", details.requestId);

      // Create FormData
      const formData = new FormData();

      // Append each file to FormData
      approveFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("documentFiles", file.originFileObj);
        }
      });

      // Check if this is a conference expense (type 1), conference funding (type 2), or journal funding (type 3)
      if (details.fundDisbursementType === 3) {
        // Journal funding - use journal funding approve mutation
        await approveJournalFunding({
          requestId: details.requestId,
          formData,
        }).unwrap();
      } else if (
        details.fundDisbursementType === 1 ||
        details.fundDisbursementType === 2
      ) {
        // Conference expense or funding - use conference expense approve mutation
        await approveConferenceExpense({
          requestId: details.requestId,
          formData,
        }).unwrap();
      } else {
        // Use standard fund disbursement approve mutation
        await approveRequest({
          requestId: details.requestId,
          formData,
        }).unwrap();
      }

      message.success("Request approved successfully!");
      setIsApproveModalVisible(false);
      setApproveFileList([]);
      refetch();
    } catch (err) {
      console.error("Failed to approve request:", err);
      message.error(
        `Failed to approve request: ${
          err?.data?.message || err.error || err.message
        }`
      );
    }
  };

  const handleApproveCancel = () => {
    setIsApproveModalVisible(false);
    setApproveFileList([]);
  };

  const showRejectModal = () => {
    setRejectionReason("");
    setRejectFileList([]);
    setIsRejectModalVisible(true);
  };

  const handleRejectConfirm = async () => {
    // Verify we have a rejection reason
    if (!rejectionReason.trim()) {
      message.warning("Please provide a reason for rejection.");
      return;
    }

    // Verify we have files
    if (rejectFileList.length === 0) {
      message.error("Please attach at least one supporting document");
      return;
    }

    // Make sure we have a valid requestId from the details
    if (!details?.requestId) {
      message.error("Request ID is missing - cannot process rejection");
      console.error("Missing requestId in details:", details);
      return;
    }

    try {
      console.log("Rejecting request with ID:", details.requestId);

      // Create FormData
      const formData = new FormData();

      // Append rejection reason
      formData.append("rejectionReason", rejectionReason);

      // Append each file to FormData
      rejectFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("documentFiles", file.originFileObj);
        }
      });

      // Check if this is a conference expense (type 1), conference funding (type 2), or journal funding (type 3)
      if (details.fundDisbursementType === 3) {
        // Journal funding - use journal funding reject mutation
        await rejectJournalFunding({
          requestId: details.requestId,
          formData,
        }).unwrap();
      } else if (
        details.fundDisbursementType === 1 ||
        details.fundDisbursementType === 2
      ) {
        // Conference expense or funding - use conference expense reject mutation
        await rejectConferenceExpense({
          requestId: details.requestId,
          formData,
        }).unwrap();
      } else {
        // Use standard fund disbursement reject mutation
        await rejectRequest({
          requestId: details.requestId,
          formData,
        }).unwrap();
      }

      message.success("Request rejected successfully!");
      setIsRejectModalVisible(false);
      setRejectionReason("");
      setRejectFileList([]);
      refetch();
    } catch (err) {
      console.error("Failed to reject request:", err);
      message.error(
        `Failed to reject request: ${
          err?.data?.message || err.error || err.message
        }`
      );
    }
  };

  const handleRejectCancel = () => {
    setIsRejectModalVisible(false);
    setRejectionReason("");
    setRejectFileList([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="bg-white hover:bg-gray-50 border border-gray-200 shadow-sm rounded-lg"
              disabled
            >
              Back to Requests List
            </Button>
          </div>

          {/* Header Card Skeleton */}
          <Card className="shadow-lg rounded-2xl border border-gray-100 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 mt-1 rounded-lg bg-orange-100 flex items-center justify-center shadow-sm">
                  <Skeleton.Avatar active size="large" shape="square" />
                </div>
                <div className="w-full sm:w-80">
                  <Skeleton.Input
                    active
                    size="large"
                    style={{ width: "100%" }}
                  />
                  <div className="mt-2">
                    <Skeleton.Button
                      active
                      size="small"
                      style={{ width: 80, marginRight: 8 }}
                    />
                    <Skeleton.Button
                      active
                      size="small"
                      style={{ width: 100, marginRight: 8 }}
                    />
                    <Skeleton.Button
                      active
                      size="small"
                      style={{ width: 60 }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 mt-4 sm:mt-0 w-full sm:w-auto">
                <Space className="w-full flex justify-end sm:justify-start">
                  <Skeleton.Button
                    active
                    size="large"
                    style={{ width: 90, marginRight: 8 }}
                  />
                  <Skeleton.Button active size="large" style={{ width: 90 }} />
                </Space>
              </div>
            </div>
          </Card>

          {/* Main Details Grid Skeleton */}
          <Row gutter={[24, 24]}>
            {/* Left Column Skeleton */}
            <Col xs={24} lg={16}>
              <div className="space-y-6">
                {/* Request Info Card Skeleton */}
                <Card
                  title={<Skeleton.Input active style={{ width: 150 }} />}
                  className="shadow-md rounded-xl border-0"
                >
                  <Skeleton active paragraph={{ rows: 5 }} />
                </Card>

                {/* Project Info Card Skeleton */}
                <Card
                  title={<Skeleton.Input active style={{ width: 150 }} />}
                  className="shadow-md rounded-xl border-0"
                >
                  <Skeleton active paragraph={{ rows: 4 }} />
                </Card>

                {/* Project Phases Skeleton */}
                <Card
                  title={<Skeleton.Input active style={{ width: 180 }} />}
                  className="shadow-md rounded-xl border-0"
                >
                  <Skeleton active paragraph={{ rows: 6 }} />
                </Card>
              </div>
            </Col>

            {/* Right Column Skeleton */}
            <Col xs={24} lg={8}>
              <div className="space-y-6">
                {/* Budget Overview Card Skeleton */}
                <Card
                  title={<Skeleton.Input active style={{ width: 150 }} />}
                  className="shadow-md rounded-xl border-0"
                >
                  <Skeleton active paragraph={{ rows: 4 }} />
                  <div className="mt-4">
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 100, marginBottom: 8 }}
                    />
                    <Skeleton.Input
                      active
                      style={{ width: "100%", height: 15 }}
                    />
                  </div>
                  <div className="mt-4">
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 100, marginBottom: 8 }}
                    />
                    <Skeleton.Input
                      active
                      style={{ width: "100%", height: 15 }}
                    />
                  </div>
                </Card>

                {/* Documents Card Skeleton */}
                <Card
                  title={<Skeleton.Input active style={{ width: 150 }} />}
                  className="shadow-md rounded-xl border-0"
                >
                  <Skeleton
                    active
                    avatar={{ shape: "square" }}
                    paragraph={{ rows: 1 }}
                  />
                  <Skeleton
                    active
                    avatar={{ shape: "square" }}
                    paragraph={{ rows: 1 }}
                  />
                  <Skeleton
                    active
                    avatar={{ shape: "square" }}
                    paragraph={{ rows: 1 }}
                  />
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <Alert
          message="Error Loading Request Details"
          description={
            error?.data?.message ||
            "Failed to load fund disbursement details. Please try again."
          }
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={refetch}>
              Retry
            </Button>
          }
        />
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)} // Go back to the list
          className="mt-4"
        >
          Back to List
        </Button>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <Alert
          message="No data found for this request."
          type="warning"
          showIcon
        />
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)} // Go back to the list
          className="mt-4"
        >
          Back to List
        </Button>
      </div>
    );
  }

  // Helper function to get status color
  const getStatusColor = (statusName) => {
    if (statusName === "Approved") return "success";
    if (statusName === "Rejected") return "error";
    return "processing"; // Pending
  };

  const isPending = details?.statusName === "Pending";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)} // Go back to the list
            className="bg-white hover:bg-gray-50 border border-gray-200 shadow-sm rounded-lg"
          >
            Back to Requests List
          </Button>
        </div>

        {/* === REDESIGNED HEADER CARD START === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg rounded-2xl border border-gray-100 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 mt-1 rounded-lg bg-orange-100 flex items-center justify-center shadow-sm">
                  <DollarOutlined className="text-[#F2722B] text-2xl" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
                    {/* Display appropriate title based on available data */}
                    {details.projectPhaseTitle ||
                      details.conferenceName ||
                      details.journalName ||
                      "Fund Disbursement Request"}
                  </h1>
                  <Space wrap size={[8, 8]} className="mt-2">
                    <Tag
                      color={getStatusColor(details.statusName)}
                      icon={
                        details.statusName === "Approved" ? (
                          <CheckCircleOutlined />
                        ) : details.statusName === "Rejected" ? (
                          <CloseCircleOutlined />
                        ) : (
                          <ClockCircleOutlined />
                        )
                      }
                      className="px-2.5 py-0.5 text-xs rounded-full border-0"
                    >
                      {details.statusName}
                    </Tag>

                    {/* Add Fund Disbursement Type tag */}
                    <Tag
                      color="purple"
                      className="px-2.5 py-0.5 text-xs rounded-full border-0"
                    >
                      {FUND_DISBURSEMENT_TYPE[details.fundDisbursementType]}
                    </Tag>

                    <Tag
                      color="cyan"
                      className="px-2.5 py-0.5 text-xs rounded-full border-0"
                    >
                      Project: {details.projectName}
                    </Tag>
                    <Tag
                      color="geekblue"
                      className="px-2.5 py-0.5 text-xs rounded-full border-0"
                    >
                      Fundisbursement ID: {details.fundDisbursementId}
                    </Tag>

                    {details.requestId && (
                      <Tag
                        color="blue"
                        className="px-2.5 py-0.5 text-xs rounded-full border-0"
                      >
                        Request ID: {details.requestId}
                      </Tag>
                    )}

                    {details.fundDisbursementType === 1 &&
                      details.conferenceExpenseDetail && (
                        <Tag
                          color={
                            details.conferenceExpenseDetail.expenseStatus === 0
                              ? "gold"
                              : details.conferenceExpenseDetail
                                  .expenseStatus === 1
                              ? "green"
                              : "red"
                          }
                          icon={<DollarOutlined />}
                          className="px-2.5 py-0.5 text-xs rounded-full border-0"
                        >
                          Conference Expense:{" "}
                          {details.conferenceExpenseDetail.expenseStatusName}
                        </Tag>
                      )}
                  </Space>
                </div>
              </div>
              {isPending && (
                <div className="flex-shrink-0 mt-4 sm:mt-0 w-full sm:w-auto">
                  <Space className="w-full flex justify-end sm:justify-start">
                    <Button
                      type="primary"
                      danger
                      icon={<CloseOutlined />}
                      onClick={showRejectModal}
                      loading={isRejectingMutation && isRejectModalVisible}
                      disabled={isApprovingMutation || isLoading}
                      size="large"
                      className="shadow-md"
                    >
                      Reject
                    </Button>
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={showApproveModal}
                      loading={
                        details.fundDisbursementType === 3
                          ? isApprovingJournalFunding
                          : details.fundDisbursementType === 1 ||
                            details.fundDisbursementType === 2
                          ? isApprovingConferenceExpense
                          : isApprovingMutation
                      }
                      disabled={isRejectingMutation || isLoading}
                      size="large"
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none shadow-md"
                    >
                      Approve
                    </Button>
                  </Space>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
        {/* === REDESIGNED HEADER CARD END === */}

        {/* Main Details Grid */}
        <Row gutter={[24, 24]}>
          {/* Left Column: Request & Project Info */}
          <Col xs={24} lg={16}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Request Info Card */}
              <Card
                title="Request Details"
                className="shadow-md rounded-xl border-0"
              >
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="Requested Amount">
                    <span className="font-semibold text-green-600">
                      ₫{details.fundRequest.toLocaleString()}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Date Requested">
                    {formatDate(details.createdAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Requester">
                    <UserOutlined className="mr-1" /> {details.requesterName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Disbursement Type">
                    <Tag color="blue">
                      {FUND_DISBURSEMENT_TYPE[details.fundDisbursementType]}
                    </Tag>
                  </Descriptions.Item>
                  {details.projectPhaseTitle && (
                    <Descriptions.Item label="Project Phase">
                      {details.projectPhaseTitle}
                    </Descriptions.Item>
                  )}
                  {details.conferenceName && (
                    <Descriptions.Item label="Conference">
                      {/* <div className="flex items-center"> */}
                      <BankOutlined className="mr-1 text-blue-500" />
                      <span>{details.conferenceName}</span>
                      {/* </div> */}
                    </Descriptions.Item>
                  )}
                  {details.journalName && (
                    <Descriptions.Item label="Journal">
                      {/* <div className="flex items-center"> */}
                      <FileTextOutlined className="mr-1 text-purple-500" />
                      {details.journalName}
                      {/* </div> */}
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="Description" span={1}>
                    <Paragraph className="whitespace-pre-line mb-0">
                      {details.description || (
                        <Text type="secondary">No description provided.</Text>
                      )}
                    </Paragraph>
                  </Descriptions.Item>
                  {details.rejectionReason && (
                    <Descriptions.Item label="Rejection Reason" span={1}>
                      <Paragraph className="whitespace-pre-line mb-0 text-red-500">
                        {details.rejectionReason}
                      </Paragraph>
                    </Descriptions.Item>
                  )}
                </Descriptions>

                {/* Add Conference Expense Details section when it's a conference expense request */}
                {details.fundDisbursementType === 1 &&
                  details.conferenceExpenseDetail && (
                    <>
                      <Divider orientation="left">
                        <Text strong>Conference Expense Details</Text>
                      </Divider>
                      <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Accommodation">
                          {details.conferenceExpenseDetail.accommodation}
                        </Descriptions.Item>
                        <Descriptions.Item label="Accommodation Expense">
                          <span className="font-semibold text-green-600">
                            ₫
                            {details.conferenceExpenseDetail.accommodationExpense.toLocaleString()}
                          </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Travel">
                          {details.conferenceExpenseDetail.travel}
                        </Descriptions.Item>
                        <Descriptions.Item label="Travel Expense">
                          <span className="font-semibold text-green-600">
                            ₫
                            {details.conferenceExpenseDetail.travelExpense.toLocaleString()}
                          </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Expense Status">
                          <Tag
                            color={
                              details.conferenceExpenseDetail.expenseStatus ===
                              0
                                ? "gold"
                                : details.conferenceExpenseDetail
                                    .expenseStatus === 1
                                ? "green"
                                : "red"
                            }
                          >
                            {details.conferenceExpenseDetail.expenseStatusName}
                          </Tag>
                        </Descriptions.Item>
                        {details.conferenceExpenseDetail.rejectionReason && (
                          <Descriptions.Item label="Rejection Reason">
                            <Text type="danger">
                              {details.conferenceExpenseDetail.rejectionReason}
                            </Text>
                          </Descriptions.Item>
                        )}
                      </Descriptions>
                    </>
                  )}

                {/* Add Conference Funding Details section when it's a conference funding request */}
                {details.fundDisbursementType === 2 &&
                  details.conferenceFundingDetail && (
                    <>
                      <Divider orientation="left">
                        <Text strong>Conference Funding Details</Text>
                      </Divider>
                      <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Conference Location">
                          {/* <div className="flex items-center"> */}
                          <EnvironmentOutlined className="mr-1 text-blue-500" />
                          {details.conferenceFundingDetail.location}
                          {/* </div> */}
                        </Descriptions.Item>
                        <Descriptions.Item label="Acceptance Date">
                          {/* <div className="flex items-center"> */}
                          <CheckCircleOutlined className="mr-1 text-green-500" />
                          {formatDate(
                            details.conferenceFundingDetail.acceptanceDate
                          )}
                          {/* </div> */}
                        </Descriptions.Item>
                        <Descriptions.Item label="Presentation Date">
                          {/* <div className="flex items-center"> */}
                          <CalendarOutlined className="mr-1 text-blue-500" />
                          {formatDate(
                            details.conferenceFundingDetail.presentationDate
                          )}
                          {/* </div> */}
                        </Descriptions.Item>
                        {/* <Descriptions.Item label="Conference Funding">
                          <span className="font-semibold text-green-600">
                            ₫
                            {details.conferenceFundingDetail.conferenceFunding.toLocaleString()}
                          </span>
                        </Descriptions.Item> */}
                      </Descriptions>
                    </>
                  )}

                {/* Add Journal Funding Details section when it's a journal funding request */}
                {details.fundDisbursementType === 3 &&
                  details.journalFundingDetail && (
                    <>
                      <Divider orientation="left">
                        <Text strong>Journal Funding Details</Text>
                      </Divider>
                      <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="DOI Number">
                          {details.journalFundingDetail.doiNumber ? (
                            <a
                              href={`https://doi.org/${details.journalFundingDetail.doiNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-800 underline"
                            >
                              <FileTextOutlined className="mr-1" />
                              {details.journalFundingDetail.doiNumber}
                            </a>
                          ) : (
                            <Text type="secondary">Not provided</Text>
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Acceptance Date">
                          <CheckCircleOutlined className="mr-1 text-green-500" />
                          {formatDate(
                            details.journalFundingDetail.acceptanceDate
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Publication Date">
                          <CalendarOutlined className="mr-1 text-blue-500" />
                          {formatDate(
                            details.journalFundingDetail.publicationDate
                          )}
                        </Descriptions.Item>
                        {/* <Descriptions.Item label="Journal Funding">
                          <span className="font-semibold text-green-600">
                            ₫
                            {details.journalFundingDetail.journalFunding.toLocaleString()}
                          </span>
                        </Descriptions.Item> */}
                      </Descriptions>
                    </>
                  )}
              </Card>

              {/* Project Info Card */}
              <Card
                title="Associated Project"
                className="shadow-md rounded-xl border-0"
              >
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="Project Name">
                    {details.projectName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Project Type">
                    <Tag color="purple">
                      {details.projectTypeName ||
                        PROJECT_TYPE[details.projectType]}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Project ID">
                    {details.projectId}
                  </Descriptions.Item>
                  <Descriptions.Item label="Quota ID">
                    {details.quotaId}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Project Phases Timeline */}
              <Card
                title="Project Phases Overview"
                className="shadow-md rounded-xl border-0"
              >
                {details.projectPhases?.length > 0 ? (
                  <Timeline mode="left" className="mt-4">
                    {details.projectPhases.map((phase) => (
                      <Timeline.Item
                        key={phase.projectPhaseId}
                        dot={
                          phase.status === 2 ? (
                            <CheckCircleOutlined style={{ color: "green" }} />
                          ) : (
                            <ClockCircleOutlined
                              style={{
                                color: phase.status === 3 ? "red" : "blue",
                              }}
                            />
                          )
                        }
                        color={
                          phase.status === 2
                            ? "green"
                            : phase.status === 3
                            ? "red"
                            : "blue"
                        }
                        label={`${formatDate(phase.startDate)} - ${formatDate(
                          phase.endDate
                        )}`}
                      >
                        <p
                          className={`font-medium ${
                            details.projectPhaseId &&
                            phase.projectPhaseId === details.projectPhaseId
                              ? "text-[#F2722B]"
                              : ""
                          }`}
                        >
                          {phase.title}{" "}
                          {details.projectPhaseId &&
                          phase.projectPhaseId === details.projectPhaseId
                            ? "(Current Request Phase)"
                            : ""}
                        </p>
                        <Tag
                          color={
                            phase.status === 2
                              ? "success"
                              : phase.status === 3
                              ? "error"
                              : phase.status === 1
                              ? "warning"
                              : "processing"
                          }
                        >
                          {phase.statusName || PHASE_STATUS[phase.status]}
                        </Tag>
                        <Text className="ml-2 text-gray-500">
                          Spent: ₫{phase.spentBudget.toLocaleString()}
                        </Text>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                ) : (
                  <Empty description="No project phase data available." />
                )}
              </Card>
            </motion.div>
          </Col>

          {/* Right Column: Budget & Documents */}
          <Col xs={24} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Budget Overview Card */}
              <Card
                title="Project Budget Context"
                className="shadow-md rounded-xl border-0"
              >
                <Space direction="vertical" size="middle" className="w-full">
                  <Statistic
                    title="Approved Budget"
                    value={details.projectApprovedBudget}
                    prefix="₫"
                    formatter={(v) => v.toLocaleString()}
                    valueStyle={{ color: "#1890ff" }}
                  />
                  <Statistic
                    title="Total Spent"
                    value={details.projectSpentBudget}
                    prefix="₫"
                    formatter={(v) => v.toLocaleString()}
                    valueStyle={{ color: "#faad14" }}
                  />
                  <Statistic
                    title="Total Disbursed"
                    value={details.projectDisbursedAmount}
                    prefix="₫"
                    formatter={(v) => v.toLocaleString()}
                    valueStyle={{ color: "#52c41a" }}
                  />
                  <Divider className="my-1" />
                  <div>
                    <Text strong>Spent %</Text>
                    <Progress
                      percent={
                        details.projectApprovedBudget > 0
                          ? (details.projectSpentBudget /
                              details.projectApprovedBudget) *
                            100
                          : 0
                      }
                      strokeColor="#faad14"
                      format={(percent) => `${Math.round(percent)}%`}
                    />
                  </div>
                </Space>
              </Card>

              {/* Documents Card */}
              <Card
                title="Supporting Documents"
                className="shadow-md rounded-xl border-0"
              >
                {details.documents.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={details.documents}
                    renderItem={(doc) => (
                      <List.Item
                        actions={[
                          <a
                            href={doc.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            key="download"
                          >
                            <Button
                              type="link"
                              icon={<DownloadOutlined />}
                              className="text-[#F2722B]"
                            >
                              Download
                            </Button>
                          </a>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <FilePdfOutlined
                              style={{ fontSize: "24px", color: "#F2722B" }}
                            />
                          }
                          title={<Text ellipsis={true}>{doc.fileName}</Text>}
                          description={`Uploaded: ${formatDate(doc.uploadAt)}`}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="No supporting documents uploaded." />
                )}
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Approval Modal */}
        <Modal
          title={
            <div className="flex items-center">
              <CheckOutlined style={{ color: "#52c41a" }} className="mr-2" />
              <span>Approve Disbursement Request</span>
            </div>
          }
          visible={isApproveModalVisible}
          onCancel={handleApproveCancel}
          footer={[
            <Button key="back" onClick={handleApproveCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={
                details.fundDisbursementType === 3
                  ? isApprovingJournalFunding
                  : details.fundDisbursementType === 1 ||
                    details.fundDisbursementType === 2
                  ? isApprovingConferenceExpense
                  : isApprovingMutation
              }
              onClick={handleApproveConfirm}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve
            </Button>,
          ]}
          width={550}
          destroyOnClose
        >
          <div>
            {/* Disbursement Information */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
              <p className="font-medium text-gray-800">
                Request Type:{" "}
                <Tag color="purple">
                  {FUND_DISBURSEMENT_TYPE[details.fundDisbursementType]}
                </Tag>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Project: {details?.projectName}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Amount:{" "}
                <span className="font-medium">
                  ₫{details?.fundRequest?.toLocaleString()}
                </span>
              </p>
              {details.projectPhaseTitle && (
                <p className="text-sm text-gray-500 mt-1">
                  Phase:{" "}
                  <span className="font-medium">
                    {details?.projectPhaseTitle}
                  </span>
                </p>
              )}
              {details.conferenceName && (
                <p className="text-sm text-gray-500 mt-1">
                  Conference:{" "}
                  <span className="font-medium">{details?.conferenceName}</span>
                </p>
              )}
              {details.fundDisbursementType === 1 &&
                details.conferenceExpenseDetail && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700">
                      Conference Expense Details:
                    </p>
                    <div className="pl-3 mt-1">
                      <p className="text-xs text-gray-500">
                        Accommodation:{" "}
                        <span className="font-medium">
                          {details.conferenceExpenseDetail.accommodation}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Accommodation Expense:{" "}
                        <span className="font-medium">
                          ₫
                          {details.conferenceExpenseDetail.accommodationExpense.toLocaleString()}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Travel:{" "}
                        <span className="font-medium">
                          {details.conferenceExpenseDetail.travel}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Travel Expense:{" "}
                        <span className="font-medium">
                          ₫
                          {details.conferenceExpenseDetail.travelExpense.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

              {/* Update Approval Modal to include Conference Funding details */}
              {details.fundDisbursementType === 2 &&
                details.conferenceFundingDetail && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700">
                      Conference Funding Details:
                    </p>
                    <div className="pl-3 mt-1">
                      <p className="text-xs text-gray-500">
                        Location:{" "}
                        <span className="font-medium">
                          {details.conferenceFundingDetail.location}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Acceptance Date:{" "}
                        <span className="font-medium">
                          {formatDate(
                            details.conferenceFundingDetail.acceptanceDate
                          )}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Presentation Date:{" "}
                        <span className="font-medium">
                          {formatDate(
                            details.conferenceFundingDetail.presentationDate
                          )}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Funding Amount:{" "}
                        <span className="font-medium">
                          ₫
                          {details.conferenceFundingDetail.conferenceFunding.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

              {/* Update Approval Modal to include Journal Funding details */}
              {details.fundDisbursementType === 3 &&
                details.journalFundingDetail && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700">
                      Journal Funding Details:
                    </p>
                    <div className="pl-3 mt-1">
                      <p className="text-xs text-gray-500">
                        DOI Number:{" "}
                        <span className="font-medium">
                          {details.journalFundingDetail.doiNumber ||
                            "Not provided"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Acceptance Date:{" "}
                        <span className="font-medium">
                          {formatDate(
                            details.journalFundingDetail.acceptanceDate
                          )}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Publication Date:{" "}
                        <span className="font-medium">
                          {formatDate(
                            details.journalFundingDetail.publicationDate
                          )}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Funding Amount:{" "}
                        <span className="font-medium">
                          ₫
                          {details.journalFundingDetail.journalFunding.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
            </div>

            <Divider />

            {/* File Upload */}
            <p className="text-sm font-medium mb-2">
              Please upload approval documents:{" "}
              <span className="text-red-500">*</span>
            </p>
            <Upload.Dragger
              fileList={approveFileList}
              onChange={(info) => handleFileChange(info, setApproveFileList)}
              beforeUpload={beforeUpload}
              onRemove={(file) => {
                setApproveFileList((current) =>
                  current.filter((item) => item.uid !== file.uid)
                );
              }}
              multiple
              className="mb-4"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag approval documents to this area
              </p>
              <p className="ant-upload-hint">
                Support for PDF, DOC, DOCX files.
              </p>
            </Upload.Dragger>

            {/* Additional confirmation information */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <InfoCircleOutlined className="mr-2 text-blue-500" />
                <span>
                  By approving this request, you confirm that the funds can be
                  disbursed for this project phase.
                </span>
              </div>
            </div>
          </div>
        </Modal>

        {/* Rejection Modal */}
        <Modal
          title={
            <div className="flex items-center">
              <CloseOutlined style={{ color: "#f5222d" }} className="mr-2" />
              <span>Reject Disbursement Request</span>
            </div>
          }
          visible={isRejectModalVisible}
          onCancel={handleRejectCancel}
          footer={[
            <Button key="back" onClick={handleRejectCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              danger
              loading={
                details.fundDisbursementType === 3
                  ? isRejectingJournalFunding
                  : details.fundDisbursementType === 1 ||
                    details.fundDisbursementType === 2
                  ? isRejectingConferenceExpense
                  : isRejectingMutation
              }
              onClick={handleRejectConfirm}
            >
              Reject
            </Button>,
          ]}
          width={550}
          destroyOnClose
        >
          <div>
            {/* Disbursement Information */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
              <p className="font-medium text-gray-800">
                Request Type:{" "}
                <Tag color="purple">
                  {FUND_DISBURSEMENT_TYPE[details.fundDisbursementType]}
                </Tag>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Project: {details?.projectName}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Amount:{" "}
                <span className="font-medium">
                  ₫{details?.fundRequest?.toLocaleString()}
                </span>
              </p>
              {details.projectPhaseTitle && (
                <p className="text-sm text-gray-500 mt-1">
                  Phase:{" "}
                  <span className="font-medium">
                    {details?.projectPhaseTitle}
                  </span>
                </p>
              )}
              {details.conferenceName && (
                <p className="text-sm text-gray-500 mt-1">
                  Conference:{" "}
                  <span className="font-medium">{details?.conferenceName}</span>
                </p>
              )}
              {details.fundDisbursementType === 1 &&
                details.conferenceExpenseDetail && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700">
                      Conference Expense Details:
                    </p>
                    <div className="pl-3 mt-1">
                      <p className="text-xs text-gray-500">
                        Accommodation:{" "}
                        <span className="font-medium">
                          {details.conferenceExpenseDetail.accommodation}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Accommodation Expense:{" "}
                        <span className="font-medium">
                          ₫
                          {details.conferenceExpenseDetail.accommodationExpense.toLocaleString()}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Travel:{" "}
                        <span className="font-medium">
                          {details.conferenceExpenseDetail.travel}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Travel Expense:{" "}
                        <span className="font-medium">
                          ₫
                          {details.conferenceExpenseDetail.travelExpense.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

              {/* Update Rejection Modal to include Conference Funding details */}
              {details.fundDisbursementType === 2 &&
                details.conferenceFundingDetail && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700">
                      Conference Funding Details:
                    </p>
                    <div className="pl-3 mt-1">
                      <p className="text-xs text-gray-500">
                        Location:{" "}
                        <span className="font-medium">
                          {details.conferenceFundingDetail.location}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Acceptance Date:{" "}
                        <span className="font-medium">
                          {formatDate(
                            details.conferenceFundingDetail.acceptanceDate
                          )}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Presentation Date:{" "}
                        <span className="font-medium">
                          {formatDate(
                            details.conferenceFundingDetail.presentationDate
                          )}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Funding Amount:{" "}
                        <span className="font-medium">
                          ₫
                          {details.conferenceFundingDetail.conferenceFunding.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

              {/* Update Rejection Modal to include Journal Funding details */}
              {details.fundDisbursementType === 3 &&
                details.journalFundingDetail && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700">
                      Journal Funding Details:
                    </p>
                    <div className="pl-3 mt-1">
                      <p className="text-xs text-gray-500">
                        DOI Number:{" "}
                        <span className="font-medium">
                          {details.journalFundingDetail.doiNumber ||
                            "Not provided"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Acceptance Date:{" "}
                        <span className="font-medium">
                          {formatDate(
                            details.journalFundingDetail.acceptanceDate
                          )}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Publication Date:{" "}
                        <span className="font-medium">
                          {formatDate(
                            details.journalFundingDetail.publicationDate
                          )}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Funding Amount:{" "}
                        <span className="font-medium">
                          ₫
                          {details.journalFundingDetail.journalFunding.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
            </div>

            <Divider />

            {/* Rejection Reason */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">
                Reason for Rejection: <span className="text-red-500">*</span>
              </p>
              <TextArea
                rows={3}
                placeholder="Please explain why this disbursement request is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full"
              />
            </div>

            {/* File Upload */}
            <p className="text-sm font-medium mb-2">
              Please upload rejection documents:{" "}
              <span className="text-red-500">*</span>
            </p>
            <Upload.Dragger
              fileList={rejectFileList}
              onChange={(info) => handleFileChange(info, setRejectFileList)}
              beforeUpload={beforeUpload}
              onRemove={(file) => {
                setRejectFileList((current) =>
                  current.filter((item) => item.uid !== file.uid)
                );
              }}
              multiple
              className="mb-4"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag rejection documents to this area
              </p>
              <p className="ant-upload-hint">
                Support for PDF, DOC, DOCX files.
              </p>
            </Upload.Dragger>

            {/* Additional warning information */}
            <div className="bg-red-50 p-3 rounded-lg border border-red-200 mt-4">
              <div className="flex items-center text-sm text-red-600">
                <ExclamationCircleOutlined className="mr-2" />
                <span>
                  Rejecting this request will require the team to resubmit with
                  corrections.
                </span>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default FundDisbursementRequestDetails;
