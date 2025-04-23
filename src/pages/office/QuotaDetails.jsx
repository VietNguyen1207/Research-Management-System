import React, { useState } from "react";
import {
  Card,
  Button,
  Table,
  Tag,
  Progress,
  Typography,
  Divider,
  Row,
  Col,
  Statistic,
  Timeline,
  Alert,
  message,
  Spin,
  Descriptions,
  Badge,
  Space,
  Breadcrumb,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import {
  SearchOutlined,
  TeamOutlined,
  DollarOutlined,
  BankOutlined,
  CalendarOutlined,
  FileTextOutlined,
  EyeOutlined,
  WalletOutlined,
  EditOutlined,
  HistoryOutlined,
  BarChartOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useGetQuotaDetailsQuery } from "../../features/quota/quotaApiSlice";
import { useNavigate, useParams } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const QuotaDetails = () => {
  const { quotaId } = useParams();
  const navigate = useNavigate();
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [selectedDisbursement, setSelectedDisbursement] = useState(null);
  const [form] = Form.useForm();

  // Fetch quota details from API
  const {
    data: quotaDetails,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetQuotaDetailsQuery(quotaId);

  // Function to handle disbursement approval
  const handleDisbursementApproval = (disbursement) => {
    setSelectedDisbursement(disbursement);
    form.setFieldsValue({
      amount: disbursement.fundRequest,
      notes: "",
    });
    setApprovalModalVisible(true);
  };

  // Function to handle form submission
  const handleApprovalSubmit = async (values) => {
    try {
      // API call would go here
      message.success("Disbursement request processed successfully");
      setApprovalModalVisible(false);
      form.resetFields();
      refetch();
    } catch (err) {
      message.error("Failed to process disbursement request");
      console.error("Approval error:", err);
    }
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "processing"; // Pending
      case 1:
        return "success"; // Approved
      case 2:
        return "error"; // Rejected
      default:
        return "default";
    }
  };

  // Show loading or error states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Loading quota details..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <Alert
          message="Error loading quota details"
          description={
            error?.data?.message ||
            "Failed to load quota details. Please try again later."
          }
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!quotaDetails) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <Alert
          message="Quota not found"
          description="The requested quota could not be found."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  // Calculate used budget percentage
  const budgetUsagePercentage =
    quotaDetails.projectApprovedBudget === 0
      ? 0
      : (quotaDetails.projectSpentBudget / quotaDetails.projectApprovedBudget) *
        100;

  // Calculate disbursed percentage
  const disbursedPercentage =
    quotaDetails.projectApprovedBudget === 0
      ? 0
      : (quotaDetails.disbursedAmount / quotaDetails.projectApprovedBudget) *
        100;

  // Pending disbursement
  const pendingDisbursement =
    quotaDetails.projectSpentBudget - quotaDetails.disbursedAmount > 0
      ? quotaDetails.projectSpentBudget - quotaDetails.disbursedAmount
      : 0;

  // Columns for disbursement table
  const disbursementColumns = [
    {
      title: "Request Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Requested By",
      dataIndex: "requesterName",
      key: "requesterName",
      render: (text) => (
        <div className="flex items-center gap-2">
          <UserOutlined />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Project Phase",
      dataIndex: "projectPhaseTitle",
      key: "projectPhaseTitle",
    },
    {
      title: "Amount",
      dataIndex: "fundRequest",
      key: "fundRequest",
      render: (amount) => (
        <Text className="font-medium text-green-600">
          ₫{amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Tag color={getStatusColor(status)} className="px-3 py-1">
          {record.statusName}
        </Tag>
      ),
    },
    {
      title: "Reviewed By",
      dataIndex: "approvedByName",
      key: "approvedByName",
      render: (name) => name || "Pending Review",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {record.status === 0 && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                className="bg-green-500 hover:bg-green-600 border-none"
                onClick={() => handleDisbursementApproval(record)}
              >
                Approve
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => handleDisbursementApproval(record)}
              >
                Reject
              </Button>
            </>
          )}
          {record.status !== 0 && (
            <Button type="default" size="small" icon={<EyeOutlined />}>
              Details
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a onClick={() => navigate("/quota-management")}>
                <BankOutlined /> Departments
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a
                onClick={() =>
                  navigate(`/project-quota/${quotaDetails.departmentId}`)
                }
              >
                <TeamOutlined /> {quotaDetails.departmentName} Projects
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span className="text-[#F2722B]">
                <FileTextOutlined /> {quotaDetails.projectName} Quota
              </span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <Button
                type="default"
                icon={<ArrowLeftOutlined />}
                onClick={() =>
                  navigate(`/project-quota/${quotaDetails.departmentId}`)
                }
                className="mb-4"
              >
                Back to Projects
              </Button>
              <div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F2722B] to-[#FFA500]">
                  {quotaDetails.projectName} Quota Details
                </h2>
                <p className="text-gray-600">
                  Manage budget and disbursements for this project
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-12">
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={<Text className="text-gray-600">Approved Budget</Text>}
                value={quotaDetails.projectApprovedBudget}
                prefix={<DollarOutlined className="text-[#F2722B]" />}
                suffix="₫"
                formatter={(value) => `${value.toLocaleString()}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={<Text className="text-gray-600">Spent Budget</Text>}
                value={quotaDetails.projectSpentBudget}
                prefix={<WalletOutlined className="text-[#F2722B]" />}
                suffix="₫"
                formatter={(value) => `${value.toLocaleString()}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={<Text className="text-gray-600">Disbursed Amount</Text>}
                value={quotaDetails.disbursedAmount}
                prefix={<DollarOutlined className="text-green-500" />}
                suffix="₫"
                formatter={(value) => `${value.toLocaleString()}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={
                  <Text className="text-gray-600">Pending Disbursement</Text>
                }
                value={pendingDisbursement}
                prefix={<ClockCircleOutlined className="text-orange-500" />}
                suffix="₫"
                formatter={(value) => `${value.toLocaleString()}`}
              />
            </Card>
          </Col>
        </Row>

        {/* Project Information */}
        <Card
          className="shadow-md rounded-xl border-0 mb-8"
          title={
            <div className="flex items-center">
              <InfoCircleOutlined className="text-[#F2722B] mr-2" />
              <span className="text-lg font-medium">Project Information</span>
            </div>
          }
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Descriptions
                bordered
                column={1}
                size="small"
                labelStyle={{ fontWeight: 600 }}
              >
                <Descriptions.Item label="Project Name">
                  {quotaDetails.projectName}
                </Descriptions.Item>
                <Descriptions.Item label="Project Type">
                  {quotaDetails.projectTypeName}
                </Descriptions.Item>
                <Descriptions.Item label="Department">
                  {quotaDetails.departmentName}
                </Descriptions.Item>
                <Descriptions.Item label="Research Group">
                  {quotaDetails.groupName}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} md={12}>
              <Descriptions
                bordered
                column={1}
                size="small"
                labelStyle={{ fontWeight: 600 }}
              >
                <Descriptions.Item label="Quota ID">
                  {quotaDetails.quotaId}
                </Descriptions.Item>
                <Descriptions.Item label="Allocated By">
                  {quotaDetails.allocatorName}
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                  {new Date(quotaDetails.createdAt).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                  {new Date(quotaDetails.updateAt).toLocaleDateString()}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>

          <Divider />

          <div className="mt-4">
            <h4 className="font-medium mb-2">Budget Usage</h4>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <Text>Spent Budget</Text>
                    <Text>{Math.round(budgetUsagePercentage)}%</Text>
                  </div>
                  <Progress
                    percent={Math.round(budgetUsagePercentage)}
                    strokeColor={{
                      "0%": "#F2722B",
                      "100%": "#ff4d4f",
                    }}
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <Text>Disbursed Amount</Text>
                    <Text>{Math.round(disbursedPercentage)}%</Text>
                  </div>
                  <Progress
                    percent={Math.round(disbursedPercentage)}
                    strokeColor={{
                      "0%": "#1890ff",
                      "100%": "#52c41a",
                    }}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Disbursement Requests */}
        <Card
          className="shadow-md rounded-xl border-0"
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarOutlined className="text-[#F2722B] mr-2" />
                <span className="text-lg font-medium">
                  Fund Disbursement Requests
                </span>
              </div>
              <Badge
                count={
                  quotaDetails.disbursements.filter((d) => d.status === 0)
                    .length
                }
                color="#F2722B"
              />
            </div>
          }
        >
          <Table
            dataSource={quotaDetails.disbursements}
            columns={disbursementColumns}
            rowKey="fundDisbursementId"
            pagination={{ pageSize: 5 }}
            className="mt-4"
          />
        </Card>

        {/* Approval Modal */}
        <Modal
          title={
            <div className="flex items-center">
              <DollarOutlined className="text-green-500 mr-2" />
              <span>Process Disbursement Request</span>
            </div>
          }
          open={approvalModalVisible}
          onCancel={() => {
            setApprovalModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleApprovalSubmit}>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Requested By">
                  {selectedDisbursement?.requesterName}
                </Descriptions.Item>
                <Descriptions.Item label="Project Phase">
                  {selectedDisbursement?.projectPhaseTitle}
                </Descriptions.Item>
                <Descriptions.Item label="Request Date">
                  {selectedDisbursement
                    ? new Date(
                        selectedDisbursement.createdAt
                      ).toLocaleDateString()
                    : ""}
                </Descriptions.Item>
                <Descriptions.Item label="Description">
                  {selectedDisbursement?.description}
                </Descriptions.Item>
              </Descriptions>
            </div>

            <Form.Item
              name="amount"
              label="Disbursement Amount (₫)"
              rules={[{ required: true, message: "Please enter amount" }]}
            >
              <InputNumber
                className="w-full"
                formatter={(value) =>
                  `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/₫\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              name="decision"
              label="Decision"
              rules={[{ required: true, message: "Please select a decision" }]}
            >
              <Select>
                <Select.Option value="approve">Approve</Select.Option>
                <Select.Option value="reject">Reject</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="notes" label="Notes">
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button onClick={() => setApprovalModalVisible(false)}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
                >
                  Submit
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default QuotaDetails;
