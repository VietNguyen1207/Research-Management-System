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
} from "@ant-design/icons";
import { motion } from "framer-motion";
import {
  useGetFundDisbursementDetailsQuery,
  useApproveFundDisbursementMutation,
  useRejectFundDisbursementMutation,
} from "../../features/fund-disbursement/fundDisbursementApiSlice";

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
    if (approveFileList.length === 0) {
      message.error("Please attach at least one supporting document");
      return;
    }

    const documentFiles = extractFiles(approveFileList);
    console.log(
      "Attempting to approve request:",
      disbursementId,
      "with files:",
      documentFiles
    );

    try {
      // Create FormData directly in the component
      const formData = new FormData();
      formData.append("FundDisbursementId", disbursementId);

      // Append each file to the FormData
      if (documentFiles && documentFiles.length > 0) {
        documentFiles.forEach((file) => {
          formData.append("documentFiles", file);
        });
      }

      // Pass the disbursementId for URL and the formData as the body
      await approveRequest({
        disbursementId,
        formData, // Pass formData instead of documentFiles
      }).unwrap();

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
    if (!rejectionReason.trim()) {
      message.warning("Please provide a reason for rejection.");
      return;
    }
    if (rejectFileList.length === 0) {
      message.error("Please attach at least one supporting document");
      return;
    }
    const documentFiles = extractFiles(rejectFileList);
    console.log(
      "Attempting to reject request:",
      disbursementId,
      "Reason:",
      rejectionReason,
      "with files:",
      documentFiles
    );

    try {
      // Create FormData directly in the component
      const formData = new FormData();
      formData.append("FundDisbursementId", disbursementId);
      formData.append("RejectionReason", rejectionReason);

      // Append each file to the FormData
      if (documentFiles && documentFiles.length > 0) {
        documentFiles.forEach((file) => {
          formData.append("documentFiles", file);
        });
      }

      // Pass the disbursementId for URL and the formData as the body
      await rejectRequest({
        disbursementId,
        formData, // Pass formData instead of rejectionReason and documentFiles
      }).unwrap();

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
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Loading request details..." />
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
                    {details.projectPhaseTitle}
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
                      ID: {details.fundDisbursementId}
                    </Tag>
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
                      size="small"
                    >
                      Reject
                    </Button>
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={showApproveModal}
                      loading={isApprovingMutation && isApproveModalVisible}
                      disabled={isRejectingMutation || isLoading}
                      size="small"
                      style={{
                        backgroundColor: "#52c41a",
                        borderColor: "#52c41a",
                      }}
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
                  <Descriptions.Item label="Project Phase">
                    {details.projectPhaseTitle}
                  </Descriptions.Item>
                  <Descriptions.Item label="Description" span={1}>
                    <Paragraph className="whitespace-pre-line mb-0">
                      {details.description || (
                        <Text type="secondary">No description provided.</Text>
                      )}
                    </Paragraph>
                  </Descriptions.Item>
                </Descriptions>
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
                            phase.projectPhaseId === details.projectPhaseId
                              ? "text-[#F2722B]"
                              : ""
                          }`}
                        >
                          {phase.title}{" "}
                          {phase.projectPhaseId === details.projectPhaseId
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
                    <Text strong>Disbursed %</Text>
                    <Progress
                      percent={
                        details.projectApprovedBudget > 0
                          ? (details.projectDisbursedAmount /
                              details.projectApprovedBudget) *
                            100
                          : 0
                      }
                      strokeColor={{ from: "#108ee9", to: "#87d068" }}
                      format={(percent) => `${percent?.toFixed(1)}%`}
                    />
                  </div>
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
                      format={(percent) => `${percent?.toFixed(1)}%`}
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

        <Modal
          title="Confirm Rejection"
          visible={isRejectModalVisible}
          onOk={handleRejectConfirm}
          onCancel={handleRejectCancel}
          confirmLoading={isRejectingMutation}
          okText="Confirm Reject"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
          destroyOnClose
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <p>Please provide a reason for rejecting this request:</p>
            <TextArea
              rows={3}
              placeholder="Rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <p className="mt-3">Attach supporting documents (optional):</p>
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
              className="rounded-lg"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="text-[#F2722B]" />
              </p>
              <p className="ant-upload-text">Click or drag files to upload</p>
              <p className="ant-upload-hint">
                Support for single or multiple file uploads.
              </p>
            </Upload.Dragger>
          </Space>
        </Modal>

        <Modal
          title="Confirm Approval"
          visible={isApproveModalVisible}
          onOk={handleApproveConfirm}
          onCancel={handleApproveCancel}
          confirmLoading={isApprovingMutation}
          okText="Confirm Approve"
          cancelText="Cancel"
          okButtonProps={{
            style: { backgroundColor: "#52c41a", borderColor: "#52c41a" },
          }}
          destroyOnClose
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <p>Attach any relevant documents for approval (optional):</p>
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
              className="rounded-lg"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="text-[#F2722B]" />
              </p>
              <p className="ant-upload-text">Click or drag files to upload</p>
              <p className="ant-upload-hint">
                Support for single or multiple file uploads.
              </p>
            </Upload.Dragger>
          </Space>
        </Modal>
      </div>
    </div>
  );
};

export default FundDisbursementRequestDetails;
