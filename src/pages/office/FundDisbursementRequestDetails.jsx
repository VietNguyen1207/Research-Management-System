import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Descriptions,
  Tag,
  Space,
  Divider,
  Timeline,
  Spin,
  Alert,
  Row,
  Col,
  Statistic,
  Tabs,
  Table,
  Image,
  Badge,
  Modal,
  Form,
  Input,
  Upload,
  message,
} from "antd";
import {
  FileTextOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  DownloadOutlined,
  UserOutlined,
  BankOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  InboxOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  useGetFundDisbursementDetailsQuery,
  useApproveFundDisbursementMutation,
  useRejectFundDisbursementMutation,
} from "../../features/fund-disbursement/fundDisbursementApiSlice";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Dragger } = Upload;

// Fund Disbursement Type enum mapping
const FUND_DISBURSEMENT_TYPE = {
  0: "Project Phase",
  1: "Conference Expense",
  2: "Conference Funding",
  3: "Journal Funding",
};

const FundDisbursementRequestDetails = () => {
  const navigate = useNavigate();
  const { disbursementId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("1");

  // Modal states
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [approvalForm] = Form.useForm();
  const [rejectionForm] = Form.useForm();
  const [approvalFile, setApprovalFile] = useState(null);
  const [rejectionFile, setRejectionFile] = useState(null);

  // API query and mutations
  const {
    data: disbursementDetails,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFundDisbursementDetailsQuery(disbursementId);

  const [approveFundDisbursement, { isLoading: isApproving }] =
    useApproveFundDisbursementMutation();

  const [rejectFundDisbursement, { isLoading: isRejecting }] =
    useRejectFundDisbursementMutation();

  // Handle approval
  const showApproveModal = () => {
    setApproveModalVisible(true);
  };

  const handleApproveCancel = () => {
    setApproveModalVisible(false);
    approvalForm.resetFields();
    setApprovalFile(null);
  };

  const handleApproveSubmit = async (values) => {
    if (!approvalFile) {
      message.error("Please upload an approval document");
      return;
    }

    const formData = new FormData();
    formData.append("comments", values.comments);
    formData.append("document", approvalFile);

    try {
      await approveFundDisbursement({
        fundDisbursementId: disbursementId,
        formData,
      }).unwrap();

      message.success("Fund disbursement request approved successfully");
      setApproveModalVisible(false);
      approvalForm.resetFields();
      setApprovalFile(null);
      refetch();
    } catch (err) {
      message.error(
        err.data?.message || "Failed to approve fund disbursement request"
      );
    }
  };

  // Handle rejection
  const showRejectModal = () => {
    setRejectModalVisible(true);
  };

  const handleRejectCancel = () => {
    setRejectModalVisible(false);
    rejectionForm.resetFields();
    setRejectionFile(null);
  };

  const handleRejectSubmit = async (values) => {
    if (!rejectionFile) {
      message.error("Please upload a rejection document");
      return;
    }

    const formData = new FormData();
    formData.append("rejectionReason", values.rejectionReason);
    formData.append("document", rejectionFile);

    try {
      await rejectFundDisbursement({
        fundDisbursementId: disbursementId,
        formData,
      }).unwrap();

      message.success("Fund disbursement request rejected successfully");
      setRejectModalVisible(false);
      rejectionForm.resetFields();
      setRejectionFile(null);
      refetch();
    } catch (err) {
      message.error(
        err.data?.message || "Failed to reject fund disbursement request"
      );
    }
  };

  // Handle file upload
  const handleApprovalUpload = (file) => {
    setApprovalFile(file);
    return false; // Prevent default upload behavior
  };

  const handleRejectionUpload = (file) => {
    setRejectionFile(file);
    return false; // Prevent default upload behavior
  };

  // Navigate back
  const handleGoBack = () => {
    navigate(-1);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format date with time
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₫${amount?.toLocaleString() || 0}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <Spin size="large" />
            <Text className="block mt-4">
              Loading fund disbursement request details...
            </Text>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !disbursementDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Alert
            message="Error Loading Fund Disbursement Request"
            description={
              error?.data?.message ||
              "Failed to load fund disbursement request details. Please try again later."
            }
            type="error"
            showIcon
            action={
              <Space>
                <Button size="small" onClick={refetch}>
                  Retry
                </Button>
                <Button size="small" onClick={handleGoBack}>
                  Go Back
                </Button>
              </Space>
            }
          />
        </div>
      </div>
    );
  }

  // Get status color and icon
  const getStatusDisplay = (status) => {
    if (status === "Pending") {
      return {
        color: "processing",
        icon: <ClockCircleOutlined />,
        text: "Pending",
      };
    } else if (status === "Approved") {
      return {
        color: "success",
        icon: <CheckCircleOutlined />,
        text: "Approved",
      };
    } else if (status === "Rejected") {
      return {
        color: "error",
        icon: <CloseCircleOutlined />,
        text: "Rejected",
      };
    }

    return {
      color: "default",
      icon: <ExclamationCircleOutlined />,
      text: status,
    };
  };

  const statusDisplay = getStatusDisplay(disbursementDetails.statusName);
  const isDecided = disbursementDetails.statusName !== "Pending";
  const canTakeAction = !isDecided && user?.role === "office";

  // Documents table columns
  const documentsColumns = [
    {
      title: "Document Name",
      dataIndex: "documentName",
      key: "documentName",
      render: (name) => (
        <div className="flex items-center">
          <FileTextOutlined className="mr-2 text-[#F2722B]" />
          <Text>{name}</Text>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "documentType",
      key: "documentType",
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Uploaded By",
      dataIndex: "uploadedBy",
      key: "uploadedBy",
      render: (user) => (
        <div className="flex items-center">
          <UserOutlined className="mr-2" />
          <Text>{user}</Text>
        </div>
      ),
    },
    {
      title: "Upload Date",
      dataIndex: "uploadDate",
      key: "uploadDate",
      render: (date) => (
        <div className="flex items-center">
          <CalendarOutlined className="mr-2" />
          <Text>{formatDate(date)}</Text>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          size="small"
          onClick={() => window.open(record.fileUrl, "_blank")}
          className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
        >
          Download
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={handleGoBack}
            className="mb-4"
            icon={<ArrowLeftOutlined />}
          >
            Back to Disbursement Requests
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <Title level={2} className="mb-0 text-gray-800">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2722B] to-[#FFA500]">
                Fund Disbursement Request
              </span>
            </Title>

            <div className="mt-4 md:mt-0">
              <Badge
                status={statusDisplay.color}
                text={
                  <span className="text-lg font-medium">
                    {statusDisplay.icon} {statusDisplay.text}
                  </span>
                }
              />
            </div>
          </div>

          <Text type="secondary" className="text-base">
            Request ID: {disbursementId}
          </Text>
        </motion.div>

        {/* Action Buttons for Office Role */}
        {canTakeAction && (
          <Card className="mb-8 shadow-md border-0 rounded-xl">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div>
                <Title level={5} className="mb-1">
                  Review Decision
                </Title>
                <Text type="secondary">
                  Approve or reject this fund disbursement request
                </Text>
              </div>
              <div className="flex gap-4">
                <Button
                  type="primary"
                  size="large"
                  icon={<CheckCircleOutlined />}
                  onClick={showApproveModal}
                  className="bg-green-500 hover:bg-green-600 border-none"
                  disabled={isApproving || isRejecting}
                >
                  Approve Request
                </Button>
                <Button
                  danger
                  size="large"
                  icon={<CloseCircleOutlined />}
                  onClick={showRejectModal}
                  disabled={isApproving || isRejecting}
                >
                  Reject Request
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Decision Information (if already approved/rejected) */}
        {isDecided && (
          <Card className="mb-8 shadow-md border-0 rounded-xl">
            <div
              className={`p-4 rounded-lg ${
                disbursementDetails.statusName === "Approved"
                  ? "bg-green-50"
                  : "bg-red-50"
              }`}
            >
              <Title level={5} className="mb-1">
                {disbursementDetails.statusName === "Approved"
                  ? "Approval Information"
                  : "Rejection Information"}
              </Title>

              <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered={false}>
                <Descriptions.Item label="Decision By">
                  <div className="flex items-center">
                    <UserOutlined className="mr-2" />
                    {disbursementDetails.approverName || "N/A"}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Decision Date">
                  <div className="flex items-center">
                    <CalendarOutlined className="mr-2" />
                    {formatDateTime(disbursementDetails.approvedAt) || "N/A"}
                  </div>
                </Descriptions.Item>
                {disbursementDetails.statusName === "Rejected" && (
                  <Descriptions.Item label="Rejection Reason" span={3}>
                    {disbursementDetails.rejectionReason ||
                      "No reason provided"}
                  </Descriptions.Item>
                )}
                {disbursementDetails.statusName === "Approved" && (
                  <Descriptions.Item label="Approval Comments" span={3}>
                    {disbursementDetails.comments || "No comments provided"}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>
          </Card>
        )}

        <Row gutter={[16, 16]}>
          {/* Left Column: Project Information */}
          <Col xs={24} lg={16}>
            <Card className="shadow-md border-0 rounded-xl mb-6">
              <Title level={4} className="mb-6 flex items-center">
                <FileTextOutlined className="mr-2 text-[#F2722B]" />
                Project Information
              </Title>

              <Descriptions
                bordered
                column={{ xs: 1, sm: 1, md: 2 }}
                className="mb-6"
              >
                <Descriptions.Item label="Project Name" span={2}>
                  <Text strong>{disbursementDetails.projectName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Project Type">
                  <Tag color="purple">
                    {disbursementDetails.projectTypeName}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Department">
                  <Tag color="blue">{disbursementDetails.departmentName}</Tag>
                </Descriptions.Item>
                {disbursementDetails.conferenceName && (
                  <Descriptions.Item label="Conference Name" span={2}>
                    <div className="flex items-center">
                      <BankOutlined className="mr-2 text-gray-500" />
                      {disbursementDetails.conferenceName}
                    </div>
                  </Descriptions.Item>
                )}
                {disbursementDetails.journalName && (
                  <Descriptions.Item label="Journal Name" span={2}>
                    <div className="flex items-center">
                      <FileTextOutlined className="mr-2 text-gray-500" />
                      {disbursementDetails.journalName}
                    </div>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Requested By">
                  <div className="flex items-center">
                    <UserOutlined className="mr-2" />
                    {disbursementDetails.requesterName}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Requested Date">
                  <div className="flex items-center">
                    <CalendarOutlined className="mr-2" />
                    {formatDate(disbursementDetails.requestedAt)}
                  </div>
                </Descriptions.Item>
                {disbursementDetails.groupName && (
                  <Descriptions.Item label="Research Group" span={2}>
                    <div className="flex items-center">
                      <TeamOutlined className="mr-2 text-gray-500" />
                      {disbursementDetails.groupName}
                    </div>
                  </Descriptions.Item>
                )}
              </Descriptions>

              {/* Disbursement Type Information */}
              <Title level={5} className="mb-3 mt-6">
                <DollarOutlined className="mr-2 text-[#F2722B]" />
                Disbursement Type
              </Title>
              <div className="mb-6">
                {disbursementDetails.fundDisbursementType !== null ? (
                  <Tag color="cyan" className="text-base px-3 py-1">
                    {
                      FUND_DISBURSEMENT_TYPE[
                        disbursementDetails.fundDisbursementType
                      ]
                    }
                  </Tag>
                ) : (
                  <Text type="secondary">Not specified</Text>
                )}
              </div>

              {/* Request Description */}
              {disbursementDetails.description && (
                <>
                  <Title level={5} className="mb-3">
                    Request Description
                  </Title>
                  <Paragraph className="mb-6 bg-gray-50 p-4 rounded-lg">
                    {disbursementDetails.description}
                  </Paragraph>
                </>
              )}
            </Card>

            {/* Documents */}
            <Card className="shadow-md border-0 rounded-xl">
              <Title level={4} className="mb-6 flex items-center">
                <FileTextOutlined className="mr-2 text-[#F2722B]" />
                Supporting Documents
              </Title>

              {disbursementDetails.documents &&
              disbursementDetails.documents.length > 0 ? (
                <Table
                  dataSource={disbursementDetails.documents}
                  columns={documentsColumns}
                  rowKey="documentId"
                  pagination={false}
                />
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <FileTextOutlined
                    style={{ fontSize: 40 }}
                    className="text-gray-300"
                  />
                  <p className="mt-2 text-gray-500">No documents available</p>
                </div>
              )}
            </Card>
          </Col>

          {/* Right Column: Financial Information and Timeline */}
          <Col xs={24} lg={8}>
            {/* Financial Information */}
            <Card className="shadow-md border-0 rounded-xl mb-6">
              <Title level={4} className="mb-6 flex items-center">
                <DollarOutlined className="mr-2 text-[#F2722B]" />
                Financial Information
              </Title>

              <Statistic
                title="Requested Amount"
                value={disbursementDetails.fundRequestAmount || 0}
                precision={0}
                valueStyle={{ color: "#0b8235" }}
                prefix="₫"
                suffix=""
                formatter={(value) => value.toLocaleString()}
                className="mb-6"
              />

              <Divider />

              <Descriptions
                column={1}
                className="mb-2"
                layout="vertical"
                bordered
              >
                <Descriptions.Item label="Approved Budget">
                  <Text strong className="text-blue-600">
                    {formatCurrency(disbursementDetails.approvedBudget)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Previously Spent">
                  <Text strong className="text-orange-500">
                    {formatCurrency(disbursementDetails.spentBudget)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Remaining Budget">
                  <Text
                    strong
                    className={
                      (disbursementDetails.approvedBudget || 0) -
                        (disbursementDetails.spentBudget || 0) >=
                      (disbursementDetails.fundRequestAmount || 0)
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {formatCurrency(
                      (disbursementDetails.approvedBudget || 0) -
                        (disbursementDetails.spentBudget || 0)
                    )}
                  </Text>
                </Descriptions.Item>
              </Descriptions>

              {/* Budget Alert */}
              {(disbursementDetails.approvedBudget || 0) -
                (disbursementDetails.spentBudget || 0) <
                (disbursementDetails.fundRequestAmount || 0) && (
                <Alert
                  message="Budget Warning"
                  description="The requested amount exceeds the remaining budget."
                  type="warning"
                  showIcon
                  className="mt-4"
                />
              )}
            </Card>

            {/* Request Timeline */}
            <Card className="shadow-md border-0 rounded-xl">
              <Title level={4} className="mb-6 flex items-center">
                <CalendarOutlined className="mr-2 text-[#F2722B]" />
                Request Timeline
              </Title>

              <Timeline mode="left">
                <Timeline.Item
                  dot={<UserOutlined />}
                  color="blue"
                  label={formatDate(disbursementDetails.requestedAt)}
                >
                  <Text strong>Request Submitted</Text>
                  <div>by {disbursementDetails.requesterName}</div>
                </Timeline.Item>

                {disbursementDetails.statusName !== "Pending" ? (
                  <Timeline.Item
                    dot={
                      disbursementDetails.statusName === "Approved" ? (
                        <CheckCircleOutlined />
                      ) : (
                        <CloseCircleOutlined />
                      )
                    }
                    color={
                      disbursementDetails.statusName === "Approved"
                        ? "green"
                        : "red"
                    }
                    label={formatDate(disbursementDetails.approvedAt)}
                  >
                    <Text strong>
                      Request{" "}
                      {disbursementDetails.statusName === "Approved"
                        ? "Approved"
                        : "Rejected"}
                    </Text>
                    <div>by {disbursementDetails.approverName}</div>
                  </Timeline.Item>
                ) : (
                  <Timeline.Item
                    dot={<ClockCircleOutlined />}
                    color="gray"
                    label="Pending"
                  >
                    <Text strong>Waiting for Review</Text>
                    <div>Office approval pending</div>
                  </Timeline.Item>
                )}
              </Timeline>
            </Card>
          </Col>
        </Row>

        {/* Approval Modal */}
        <Modal
          title="Approve Fund Disbursement Request"
          visible={approveModalVisible}
          onCancel={handleApproveCancel}
          footer={null}
          destroyOnClose
        >
          <Form
            form={approvalForm}
            layout="vertical"
            onFinish={handleApproveSubmit}
          >
            <Form.Item
              name="comments"
              label="Approval Comments"
              rules={[
                {
                  required: true,
                  message: "Please enter approval comments",
                },
              ]}
            >
              <TextArea rows={4} placeholder="Enter approval comments" />
            </Form.Item>

            <Form.Item
              name="document"
              label="Approval Document"
              rules={[
                {
                  required: true,
                  message: "Please upload an approval document",
                },
              ]}
            >
              <Dragger
                name="file"
                multiple={false}
                beforeUpload={handleApprovalUpload}
                showUploadList={!!approvalFile}
                fileList={approvalFile ? [approvalFile] : []}
                onRemove={() => setApprovalFile(null)}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single PDF or DOC file upload.
                </p>
              </Dragger>
            </Form.Item>

            <div className="flex justify-end gap-3 mt-4">
              <Button onClick={handleApproveCancel}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isApproving}
                className="bg-green-500 hover:bg-green-600 border-none"
              >
                Approve Request
              </Button>
            </div>
          </Form>
        </Modal>

        {/* Rejection Modal */}
        <Modal
          title="Reject Fund Disbursement Request"
          visible={rejectModalVisible}
          onCancel={handleRejectCancel}
          footer={null}
          destroyOnClose
        >
          <Form
            form={rejectionForm}
            layout="vertical"
            onFinish={handleRejectSubmit}
          >
            <Form.Item
              name="rejectionReason"
              label="Rejection Reason"
              rules={[
                {
                  required: true,
                  message: "Please enter a reason for rejection",
                },
              ]}
            >
              <TextArea rows={4} placeholder="Enter reason for rejection" />
            </Form.Item>

            <Form.Item
              name="document"
              label="Rejection Document"
              rules={[
                {
                  required: true,
                  message: "Please upload a rejection document",
                },
              ]}
            >
              <Dragger
                name="file"
                multiple={false}
                beforeUpload={handleRejectionUpload}
                showUploadList={!!rejectionFile}
                fileList={rejectionFile ? [rejectionFile] : []}
                onRemove={() => setRejectionFile(null)}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single PDF or DOC file upload.
                </p>
              </Dragger>
            </Form.Item>

            <div className="flex justify-end gap-3 mt-4">
              <Button onClick={handleRejectCancel}>Cancel</Button>
              <Button
                type="primary"
                danger
                htmlType="submit"
                loading={isRejecting}
              >
                Reject Request
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default FundDisbursementRequestDetails;
