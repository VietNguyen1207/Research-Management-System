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
  Skeleton,
  Tooltip,
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

  // Function to handle navigation to the disbursement details page
  const handleViewDisbursementDetails = (record) => {
    navigate(`/fund-disbursement-details/${record.fundDisbursementId}`);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Skeleton */}
          <div className="mb-6">
            <Skeleton.Button active style={{ width: 300, marginBottom: 8 }} />
          </div>

          {/* Header Section Skeleton */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton.Button
                  active
                  style={{ width: 120, marginBottom: 16 }}
                />
                <div>
                  <Skeleton.Input
                    active
                    size="large"
                    style={{ width: 400, marginBottom: 8 }}
                  />
                  <Skeleton.Input active style={{ width: 250 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards Skeleton */}
          <Row gutter={[16, 16]} className="mb-12">
            {[...Array(4)].map((_, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <Skeleton active paragraph={false} title={{ width: "60%" }} />
                  <Skeleton.Input
                    active
                    size="large"
                    style={{ width: "100%", marginTop: 8 }}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Project Information Skeleton */}
          <Card
            className="shadow-md rounded-xl border-0 mb-8"
            title={
              <div className="flex items-center">
                <Skeleton.Avatar
                  active
                  size="small"
                  style={{ marginRight: 8 }}
                />
                <Skeleton.Input active style={{ width: 180 }} />
              </div>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Skeleton active paragraph={{ rows: 4 }} />
              </Col>
              <Col xs={24} md={12}>
                <Skeleton active paragraph={{ rows: 4 }} />
              </Col>
            </Row>

            <Divider />

            <div className="mt-4">
              <Skeleton.Input active style={{ width: 150, marginBottom: 16 }} />
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ width: 80 }}
                      />
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ width: 30 }}
                      />
                    </div>
                    <Skeleton.Input
                      active
                      style={{ width: "100%", height: 16 }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ width: 100 }}
                      />
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ width: 30 }}
                      />
                    </div>
                    <Skeleton.Input
                      active
                      style={{ width: "100%", height: 16 }}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Card>

          {/* Disbursement Requests Skeleton */}
          <Card
            className="shadow-md rounded-xl border-0"
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton.Avatar
                    active
                    size="small"
                    style={{ marginRight: 8 }}
                  />
                  <Skeleton.Input active style={{ width: 200 }} />
                </div>
                <Skeleton.Avatar active size="small" shape="circle" />
              </div>
            }
          >
            <Skeleton active paragraph={{ rows: 8 }} />
          </Card>
        </div>
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
    quotaDetails.allocatedBudget === 0
      ? 0
      : (quotaDetails.projectSpentBudget / quotaDetails.projectApprovedBudget) *
        100;

  // Calculate the additional allocated budget from approved conference/journal expenses and funding
  const additionalAllocatedBudget = quotaDetails.disbursements
    .filter(
      (disbursement) =>
        // Only include approved (status 1) and conference/journal related types (1, 2, 3)
        disbursement.status === 1 &&
        [1, 2, 3].includes(disbursement.fundDisbursementType)
    )
    .reduce((sum, current) => sum + current.fundRequest, 0);

  // Calculate current total budget
  const currentTotalBudget =
    quotaDetails.projectApprovedBudget + additionalAllocatedBudget;

  // Calculate disbursed percentage using current total budget
  const disbursedPercentage =
    currentTotalBudget === 0
      ? 0
      : (quotaDetails.disbursedAmount / currentTotalBudget) * 100;

  // Calculate pending disbursement - sum of all pending disbursement requests
  const pendingDisbursement = quotaDetails.disbursements
    .filter((disbursement) => disbursement.status === 0)
    .reduce((sum, current) => sum + current.fundRequest, 0);

  // Columns for disbursement table
  const disbursementColumns = [
    {
      title: "Request Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      width: "9%",
      defaultSortOrder: "descend",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Requested By",
      dataIndex: "requesterName",
      key: "requesterName",
      render: (text) => (
        <div className="flex items-center gap-2">
          <UserOutlined />
          <span className="truncate">{text}</span>
        </div>
      ),
      width: "13%",
      ellipsis: true,
    },
    {
      title: "Type",
      dataIndex: "fundDisbursementTypeName",
      key: "fundDisbursementTypeName",
      render: (type, record) => {
        // Set colors based on type
        let color;
        switch (record.fundDisbursementType) {
          case 0: // ProjectPhase
            color = "blue";
            break;
          case 1: // ConferenceExpense
            color = "purple";
            break;
          case 2: // ConferenceFunding
            color = "geekblue";
            break;
          case 3: // JournalFunding
            color = "cyan";
            break;
          default:
            color = "default";
        }

        // Format the display name (add spaces between words)
        const displayName = type
          ? type.replace(/([A-Z])/g, " $1").trim()
          : "Unknown";

        return (
          <Tag color={color} className="px-2 py-1 whitespace-nowrap text-xs">
            {displayName}
          </Tag>
        );
      },
      width: "14%",
    },
    {
      title: "Project Phase",
      dataIndex: "projectPhaseTitle",
      key: "projectPhaseTitle",
      render: (title) => (
        <div className="truncate max-w-[160px]" title={title || "N/A"}>
          {title || "N/A"}
        </div>
      ),
      width: "16%",
      ellipsis: true,
    },
    {
      title: "Amount",
      dataIndex: "fundRequest",
      key: "fundRequest",
      render: (amount, record) => {
        // Determine if this affects the budget positively or negatively
        const isProjectPhase = record.fundDisbursementType === 0; // ProjectPhase
        const isApproved = record.status === 1; // Approved status

        // For approved records, show visual indication of budget impact
        if (isApproved) {
          if (isProjectPhase) {
            // ProjectPhase - reduces available budget (negative)
            return (
              <Tooltip title="This amount reduces the available budget (money spent)">
                <Text className="font-medium text-red-500 whitespace-nowrap">
                  -₫{amount.toLocaleString()}
                </Text>
              </Tooltip>
            );
          } else {
            // Conference/Journal expenses and funding - increases total budget (positive)
            return (
              <Tooltip title="This amount increases the total budget (additional allocation)">
                <Text className="font-medium text-green-500 whitespace-nowrap">
                  +₫{amount.toLocaleString()}
                </Text>
              </Tooltip>
            );
          }
        }

        // For pending or rejected, show neutral formatting
        return (
          <Tooltip title="This request has not affected the budget yet">
            <Text className="font-medium text-yellow-600 whitespace-nowrap">
              ₫{amount.toLocaleString()}
            </Text>
          </Tooltip>
        );
      },
      width: "10%",
      align: "right",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Tag
          color={getStatusColor(status)}
          className="px-2 py-1 whitespace-nowrap text-xs"
        >
          {record.statusName}
        </Tag>
      ),
      width: "9%",
    },
    {
      title: "Reviewed By",
      dataIndex: "approvedByName",
      key: "approvedByName",
      render: (name) => (
        <div
          className="truncate max-w-[120px]"
          title={name || "Pending Review"}
        >
          {name || "Pending Review"}
        </div>
      ),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDisbursementDetails(record)}
          className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none shadow-md transition-all duration-300 flex items-center"
          style={{ padding: "0 8px", height: "30px", fontSize: "12px" }}
        >
          View Details
        </Button>
      ),
      width: "12%",
      align: "center",
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
                title={<Text className="text-gray-600">Project Budget</Text>}
                value={quotaDetails.projectApprovedBudget}
                prefix={<DollarOutlined className="text-blue-500" />}
                suffix="₫"
                formatter={(value) => `${value.toLocaleString()}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={
                  <Text className="text-gray-600">Total Allocated Budget</Text>
                }
                value={quotaDetails.allocatedBudget}
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
                <Descriptions.Item
                  label={
                    <Tooltip title="Additional funding from approved conference expenses and funding requests">
                      <span>
                        Additional Allocated Budget{" "}
                        <InfoCircleOutlined className="text-blue-500 ml-1" />
                      </span>
                    </Tooltip>
                  }
                >
                  {additionalAllocatedBudget > 0 ? (
                    <Text className="text-green-500">
                      ₫{additionalAllocatedBudget.toLocaleString()}
                    </Text>
                  ) : (
                    <Text className="text-gray-500">₫0</Text>
                  )}
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
                  {quotaDetails.updateAt
                    ? new Date(quotaDetails.updateAt).toLocaleDateString()
                    : "Not updated yet"}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>

          <Divider />

          <div className="mt-4">
            <h4 className="font-medium mb-2">Budget Usage</h4>

            {additionalAllocatedBudget > 0 && (
              <Alert
                message="Budget Adjustment"
                description={
                  <div>
                    <p>
                      This project has received additional budget allocation
                      from approved conference and journal expenses/funding.
                    </p>
                    <p className="mt-2">
                      <span className="font-medium">Initial Budget:</span> ₫
                      {quotaDetails.projectApprovedBudget.toLocaleString()}{" "}
                      <br />
                      <span className="font-medium">
                        Additional Funds:
                      </span>{" "}
                      <span className="text-green-600">
                        ₫{additionalAllocatedBudget.toLocaleString()}
                      </span>{" "}
                      <br />
                      <span className="font-medium">
                        Current Total Budget:
                      </span>{" "}
                      ₫
                      {(
                        quotaDetails.projectApprovedBudget +
                        additionalAllocatedBudget
                      ).toLocaleString()}
                    </p>
                  </div>
                }
                type="info"
                showIcon
                className="mb-4"
              />
            )}

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
          <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="font-medium">Budget Impact Legend:</span>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                <span>
                  <Text className="text-red-500 font-medium">-₫</Text>: Reduces
                  available budget (Project Phase)
                </span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                <span>
                  <Text className="text-green-500 font-medium">+₫</Text>:
                  Increases total budget (Conference/Journal)
                </span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
                <span>
                  <Text className="text-yellow-600 font-medium">₫</Text>:
                  Pending requests (no impact yet)
                </span>
              </div>
            </div>
          </div>

          <Table
            dataSource={quotaDetails.disbursements}
            columns={disbursementColumns}
            rowKey="fundDisbursementId"
            pagination={{ pageSize: 5 }}
            className="mt-4 table-fixed"
            tableLayout="fixed"
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
