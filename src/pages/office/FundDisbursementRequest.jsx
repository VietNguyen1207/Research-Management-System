import React, { useState } from "react";
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  Alert,
  message,
  Spin,
  Badge,
  Divider,
  List,
  Avatar,
  Progress,
  Descriptions,
} from "antd";
import {
  SearchOutlined,
  DollarOutlined,
  CalendarOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  BankOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useGetFundDisbursementsQuery,
  useApproveFundDisbursementMutation,
  useRejectFundDisbursementMutation,
} from "../../features/fund-disbursement/fundDisbursementApiSlice";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { TextArea } = Input;

// Project Type enum mapping (assuming similar structure elsewhere)
const PROJECT_TYPE = {
  0: "Research",
  1: "Conference",
  2: "Journal",
};

const FundDisbursementRequest = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [commentForm] = Form.useForm();

  // API queries and mutations
  const {
    data: disbursements,
    isLoading,
    isError,
    error,
  } = useGetFundDisbursementsQuery();

  const [approveFundDisbursement, { isLoading: isApproving }] =
    useApproveFundDisbursementMutation();

  const [rejectFundDisbursement, { isLoading: isRejecting }] =
    useRejectFundDisbursementMutation();

  // Handle approve disbursement
  const handleApprove = async () => {
    try {
      await commentForm.validateFields(["rejectionReason"]);

      await approveFundDisbursement({
        disbursementId: selectedRequest.fundDisbursementId,
        documentFiles: [],
      }).unwrap();

      message.success("Fund disbursement approved successfully");
      setReviewModalVisible(false);
      commentForm.resetFields();
    } catch (err) {
      if (err.errorFields) {
        message.warning("Please fill in the required fields.");
      } else {
        console.error("Failed to approve fund disbursement:", err);
        message.error(
          err?.data?.message || "Failed to approve fund disbursement"
        );
      }
    }
  };

  // Handle reject disbursement
  const handleReject = async () => {
    try {
      const values = await commentForm.validateFields(["rejectionReason"]);

      if (!values.rejectionReason) {
        message.error("Please provide a reason for rejection.");
        return;
      }

      await rejectFundDisbursement({
        disbursementId: selectedRequest.fundDisbursementId,
        rejectionReason: values.rejectionReason,
        documentFiles: [],
      }).unwrap();

      message.success("Fund disbursement rejected");
      setReviewModalVisible(false);
      commentForm.resetFields();
    } catch (err) {
      if (err.errorFields) {
        message.warning("Please provide a reason for rejection.");
      } else {
        console.error("Failed to reject fund disbursement:", err);
        message.error(
          err?.data?.message || "Failed to reject fund disbursement"
        );
      }
    }
  };

  // Handle view request details
  const handleViewDetails = (record) => {
    navigate(`/fund-disbursement-details/${record.fundDisbursementId}`);
  };

  // Handle review request
  const handleReviewRequest = (record) => {
    setSelectedRequest(record);
    setReviewModalVisible(true);
    commentForm.resetFields();
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Table columns
  const columns = [
    {
      title: "Project Information",
      dataIndex: "projectName",
      key: "projectName",
      render: (_, record) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <div className="flex items-center space-x-2">
            <FileTextOutlined className="text-[#F2722B]" />
            <span className="font-semibold">{record.projectName}</span>
          </div>
          <Tag color="purple" className="mt-1">
            {record.projectTypeName || PROJECT_TYPE[record.projectType]}
          </Tag>
          <div className="text-xs text-gray-500 mt-1">
            <div className="flex items-center space-x-1">
              <UserOutlined />
              <span>Requester: {record.requesterName}</span>
            </div>
          </div>
        </motion.div>
      ),
    },
    {
      title: "Phase",
      dataIndex: "projectPhaseTitle",
      key: "projectPhaseTitle",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Requested Amount",
      dataIndex: "fundRequest",
      key: "fundRequest",
      render: (amount) => (
        <div className="font-semibold text-green-600">
          ₫{amount.toLocaleString()}
        </div>
      ),
      sorter: (a, b) => a.fundRequest - b.fundRequest,
    },
    {
      title: "Date Requested",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <div className="flex items-center space-x-1">
          <CalendarOutlined className="text-gray-400" />
          <span>{formatDate(date)}</span>
        </div>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Documents",
      key: "documents",
      render: (_, record) => (
        <div>
          {record.documents.length > 0 ? (
            <Badge count={record.documents.length} color="#1890ff">
              <FilePdfOutlined style={{ fontSize: "18px" }} />
            </Badge>
          ) : (
            <span className="text-gray-400">No documents</span>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "statusName",
      key: "status",
      render: (status) => {
        let color = "default";
        let icon = <ClockCircleOutlined />;

        if (status === "Pending") {
          color = "processing";
          icon = <ClockCircleOutlined />;
        } else if (status === "Approved") {
          color = "success";
          icon = <CheckCircleOutlined />;
        } else if (status === "Rejected") {
          color = "error";
          icon = <CloseCircleOutlined />;
        }

        return <Badge status={color} text={status} />;
      },
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Approved", value: "Approved" },
        { text: "Rejected", value: "Rejected" },
      ],
      onFilter: (value, record) => record.statusName === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            className="bg-blue-500 hover:bg-blue-600 border-blue-500"
          >
            View
          </Button>

          {record.statusName === "Pending" && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleReviewRequest(record)}
              className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
            >
              Review
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Filter data based on search, status, and date
  const filteredData = disbursements
    ? disbursements.filter((item) => {
        const matchesSearch =
          !searchText ||
          item.projectName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.projectPhaseTitle
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          item.requesterName.toLowerCase().includes(searchText.toLowerCase());

        const matchesStatus = !statusFilter || item.statusName === statusFilter;

        // Filter by date
        let matchesDate = true;
        if (dateFilter) {
          const requestDate = new Date(item.createdAt);
          const today = new Date();
          const weekAgo = new Date();
          weekAgo.setDate(today.getDate() - 7);
          const monthAgo = new Date();
          monthAgo.setMonth(today.getMonth() - 1);

          if (dateFilter === "today") {
            matchesDate = requestDate.toDateString() === today.toDateString();
          } else if (dateFilter === "week") {
            matchesDate = requestDate >= weekAgo;
          } else if (dateFilter === "month") {
            matchesDate = requestDate >= monthAgo;
          }
        }

        return matchesSearch && matchesStatus && matchesDate;
      })
    : [];

  // Show loading or error states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Loading fund disbursement requests..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <Alert
          message="Error loading fund disbursement requests"
          description={
            error?.data?.message ||
            "Failed to load fund disbursement requests. Please try again later."
          }
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Calculate statistics
  const pendingRequests =
    disbursements?.filter((r) => r.statusName === "Pending") || [];
  const pendingAmount = pendingRequests.reduce(
    (sum, item) => sum + item.fundRequest,
    0
  );
  const processedRequests =
    disbursements?.filter((r) => r.statusName !== "Pending") || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F2722B] to-[#FFA500] mb-2">
              Fund Disbursement Requests
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#F2722B] to-[#FFA500] rounded-full"></div>
          </motion.div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Review and process fund disbursement requests for completed project
            phases
          </p>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={8}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={<Text className="text-gray-600">Pending Requests</Text>}
                value={pendingRequests.length}
                prefix={<ClockCircleOutlined className="text-[#F2722B]" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={
                  <Text className="text-gray-600">Total Pending Amount</Text>
                }
                value={pendingAmount}
                prefix={<DollarOutlined className="text-[#F2722B]" />}
                suffix="₫"
                formatter={(value) => `${value.toLocaleString()}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={
                  <Text className="text-gray-600">Processed Requests</Text>
                }
                value={processedRequests.length}
                prefix={<CheckCircleOutlined className="text-[#F2722B]" />}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Search
                placeholder="Search by project, phase, or requester..."
                allowClear
                enterButton
                prefix={<SearchOutlined />}
                onSearch={(value) => setSearchText(value)}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <Select
              placeholder="Filter by status"
              allowClear
              style={{ minWidth: 150 }}
              onChange={(value) => setStatusFilter(value)}
              options={[
                { value: "Pending", label: "Pending" },
                { value: "Approved", label: "Approved" },
                { value: "Rejected", label: "Rejected" },
              ]}
            />

            <Select
              placeholder="Filter by date"
              allowClear
              style={{ minWidth: 150 }}
              onChange={(value) => setDateFilter(value)}
              options={[
                { value: "today", label: "Today" },
                { value: "week", label: "This Week" },
                { value: "month", label: "This Month" },
              ]}
            />
          </div>
        </Card>

        {/* Request Table */}
        <Card className="shadow-lg rounded-xl border-0">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="fundDisbursementId"
            pagination={{
              pageSize: 10,
              position: ["bottomCenter"],
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
            }}
            rowClassName={(record) =>
              record.statusName === "Pending" ? "bg-blue-50" : ""
            }
          />
        </Card>

        {/* Review Modal */}
        <Modal
          title={
            <div className="flex items-center space-x-2">
              <CheckCircleOutlined className="text-[#F2722B]" />
              <span>Review Disbursement Request</span>
            </div>
          }
          open={reviewModalVisible}
          onCancel={() => setReviewModalVisible(false)}
          footer={null}
          width={700}
        >
          {selectedRequest && (
            <div>
              {/* Summary Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <Row gutter={[16, 8]}>
                  <Col xs={12}>
                    <Text className="text-gray-500 text-sm">Project</Text>
                  </Col>
                  <Col xs={12}>
                    <Text className="font-medium">
                      {selectedRequest.projectName}
                    </Text>
                  </Col>

                  <Col xs={12}>
                    <Text className="text-gray-500 text-sm">Phase</Text>
                  </Col>
                  <Col xs={12}>
                    <Text className="font-medium">
                      {selectedRequest.projectPhaseTitle}
                    </Text>
                  </Col>

                  <Col xs={12}>
                    <Text className="text-gray-500 text-sm">Requester</Text>
                  </Col>
                  <Col xs={12}>
                    <Text className="font-medium">
                      {selectedRequest.requesterName}
                    </Text>
                  </Col>

                  <Col xs={12}>
                    <Text className="text-gray-500 text-sm">Project Type</Text>
                  </Col>
                  <Col xs={12}>
                    <Tag color="purple">
                      {selectedRequest.projectTypeName ||
                        PROJECT_TYPE[selectedRequest.projectType]}
                    </Tag>
                  </Col>
                </Row>
              </div>

              {/* Budget Info in Review Modal */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} md={8}>
                    <Statistic
                      title="Requested Amount"
                      value={selectedRequest.fundRequest}
                      prefix="₫"
                      formatter={(value) => value.toLocaleString()}
                      valueStyle={{ color: "#3f8600" }}
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <Statistic
                      title="Project Budget"
                      value={selectedRequest.projectApprovedBudget}
                      prefix="₫"
                      formatter={(value) => value.toLocaleString()}
                      valueStyle={{ color: "#1677ff" }}
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <Statistic
                      title="Already Disbursed"
                      value={selectedRequest.projectDisbursedAmount}
                      prefix="₫"
                      formatter={(value) => value.toLocaleString()}
                      valueStyle={{ color: "#faad14" }}
                    />
                  </Col>
                </Row>
                <Progress
                  percent={
                    selectedRequest.projectApprovedBudget > 0
                      ? ((selectedRequest.projectDisbursedAmount +
                          selectedRequest.fundRequest) /
                          selectedRequest.projectApprovedBudget) *
                        100
                      : 0
                  }
                  status="active"
                  strokeColor={{ from: "#faad14", to: "#3f8600" }}
                  showInfo={true}
                  format={(percent) =>
                    `Total After Approval: ${percent?.toFixed(1)}%`
                  }
                  className="mt-3"
                />
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <InfoCircleOutlined className="mr-1" />
                  <span>
                    Percentage of total project budget if this request is
                    approved.
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="bg-gray-50 p-3 rounded whitespace-pre-line">
                  {selectedRequest.description}
                </p>
              </div>

              {selectedRequest.documents.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Documents</h3>
                  <List
                    itemLayout="horizontal"
                    dataSource={selectedRequest.documents}
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
                          title={doc.fileName}
                          description={`Uploaded: ${formatDate(doc.uploadAt)}`}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              )}

              <Form form={commentForm} layout="vertical">
                <Form.Item
                  name="rejectionReason"
                  label="Reason / Comments"
                  rules={[
                    {
                      required: true,
                      message: "Please provide a reason for this decision",
                    },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Add rejection reason or approval comments..."
                  />
                </Form.Item>

                <div className="flex justify-end space-x-3 mt-4">
                  <Button onClick={() => setReviewModalVisible(false)}>
                    Cancel
                  </Button>
                  <Button danger onClick={handleReject} loading={isRejecting}>
                    Reject Request
                  </Button>
                  <Button
                    type="primary"
                    className="bg-green-600 border-none hover:bg-green-700"
                    onClick={handleApprove}
                    loading={isApproving}
                  >
                    Approve Disbursement
                  </Button>
                </div>
              </Form>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default FundDisbursementRequest;
