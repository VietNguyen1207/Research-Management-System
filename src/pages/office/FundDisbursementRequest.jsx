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
  Skeleton,
  Upload,
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
  InboxOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useGetFundDisbursementsQuery,
  useApproveFundDisbursementMutation,
  useRejectFundDisbursementMutation,
} from "../../features/fund-disbursement/fundDisbursementApiSlice";
import { PROJECT_TYPE, FUND_DISBURSEMENT_TYPE } from "../../constants/enums";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const FundDisbursementRequest = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

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

  // Handle view request details
  const handleViewDetails = (request) => {
    navigate(`/project-request/${request.requestId}`);
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
            {record.projectTypeName}
          </Tag>

          {/* Show conference or journal if available */}
          {record.conferenceName && (
            <div className="flex items-center mt-1">
              <BankOutlined className="text-gray-400 mr-2" />
              <span className="text-sm">
                Conference: {record.conferenceName}
              </span>
            </div>
          )}

          {record.journalName && (
            <div className="flex items-center mt-1">
              <FileTextOutlined className="text-gray-400 mr-2" />
              <span className="text-sm">Journal: {record.journalName}</span>
            </div>
          )}

          <div className="text-xs text-gray-500 mt-1">
            <div className="flex items-center space-x-1">
              <UserOutlined />
              <span>Requester: {record.requesterName}</span>
            </div>
          </div>

          {/* Add Group Info */}
          {record.groupName && (
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <TeamOutlined className="mr-1" />
              <span>Group: {record.groupName}</span>
            </div>
          )}
        </motion.div>
      ),
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      key: "departmentName",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Fund Details",
      key: "fundDetails",
      render: (_, record) => (
        <div className="space-y-2">
          <div className="font-semibold text-green-600">
            ₫{record.fundRequestAmount.toLocaleString()}
          </div>

          {/* Display Fund Disbursement Type */}
          {record.fundDisbursementType !== null && (
            <Tag color="cyan">
              {FUND_DISBURSEMENT_TYPE[record.fundDisbursementType]}
            </Tag>
          )}

          {/* Display Budget Information */}
          <div className="text-xs">
            <div>
              <span className="text-gray-500">Approved Budget: </span>
              <span>₫{record.approvedBudget.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-500">Spent Budget: </span>
              <span>₫{record.spentBudget.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Date Requested",
      dataIndex: "requestedAt",
      key: "requestedAt",
      render: (date) => (
        <div className="flex items-center space-x-1">
          <CalendarOutlined className="text-gray-400" />
          <span>{formatDate(date)}</span>
        </div>
      ),
      sorter: (a, b) => new Date(a.requestedAt) - new Date(b.requestedAt),
      defaultSortOrder: "descend",
    },
    {
      title: "Status",
      dataIndex: "statusName",
      key: "statusName",
      render: (status, record) => {
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

        return (
          <div>
            <Badge status={color} text={status} />

            {/* Show approver info if available */}
            {record.approverName && record.approvedAt && (
              <div className="text-xs mt-1 text-gray-500">
                by {record.approverName}
                <br />
                on {formatDate(record.approvedAt)}
              </div>
            )}

            {/* Show rejection reason if rejected */}
            {record.rejectionReason && (
              <div className="mt-1 text-xs text-red-500">
                Reason: {record.rejectionReason}
              </div>
            )}
          </div>
        );
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
            className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  // Filter data based on search, status, and date
  const filteredData = disbursements
    ? disbursements
        .filter((item) => {
          const matchesSearch =
            !searchText ||
            item.projectName.toLowerCase().includes(searchText.toLowerCase()) ||
            item.departmentName
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            item.requesterName
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            (item.conferenceName &&
              item.conferenceName
                .toLowerCase()
                .includes(searchText.toLowerCase())) ||
            (item.journalName &&
              item.journalName
                .toLowerCase()
                .includes(searchText.toLowerCase())) ||
            (item.groupName &&
              item.groupName.toLowerCase().includes(searchText.toLowerCase()));

          const matchesStatus =
            !statusFilter || item.statusName === statusFilter;

          // Add filter for disbursement type
          const matchesType =
            typeFilter === "all" ||
            (item.fundDisbursementType !== null &&
              item.fundDisbursementType.toString() === typeFilter);

          // Filter by date
          let matchesDate = true;
          if (dateFilter) {
            const requestDate = new Date(item.requestedAt);
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

          return matchesSearch && matchesStatus && matchesDate && matchesType;
        })
        // Sort by requestedAt in descending order (newest first)
        .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt))
    : [];

  // Show loading or error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section Skeleton */}
          <div className="text-center mb-12">
            <Skeleton.Input
              active
              style={{ width: 250, height: 40 }}
              className="mb-2"
            />
            <div className="h-1 w-24 mx-auto bg-gray-200 rounded-full"></div>
            <Skeleton.Input
              active
              style={{ width: 500, height: 24 }}
              className="mt-4 mx-auto"
            />
          </div>

          {/* Statistics Cards Skeleton */}
          <Row gutter={[16, 16]} className="mb-8">
            {[1, 2, 3].map((i) => (
              <Col xs={24} sm={8} key={i}>
                <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <Skeleton.Input
                    active
                    style={{ width: 150, height: 24 }}
                    className="mb-2"
                  />
                  <Skeleton.Input active style={{ width: 120, height: 32 }} />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Filters Skeleton */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Skeleton.Input active style={{ width: "100%", height: 40 }} />
              </div>
              <Skeleton.Input active style={{ width: 150, height: 40 }} />
              <Skeleton.Input active style={{ width: 150, height: 40 }} />
            </div>
          </Card>

          {/* Request Table Skeleton */}
          <Card className="shadow-lg rounded-xl border-0">
            <Skeleton active />
            <div className="mt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="my-6 border-b pb-6">
                  <div className="flex justify-between">
                    <div className="w-3/5">
                      <Skeleton.Input
                        active
                        style={{ width: 200, height: 24 }}
                        className="mb-2"
                      />
                      <Skeleton.Input
                        active
                        style={{ width: 100, height: 24 }}
                        className="mb-2"
                      />
                      <Skeleton paragraph={{ rows: 1, width: [250] }} />
                    </div>
                    <div className="w-1/5">
                      <Skeleton.Input
                        active
                        style={{ width: 100, height: 24 }}
                      />
                    </div>
                    <div className="w-1/5 flex justify-end">
                      <Skeleton.Button
                        active
                        style={{ width: 100, height: 35 }}
                        className="mr-2"
                      />
                      <Skeleton.Button
                        active
                        style={{ width: 100, height: 35 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Skeleton.Input active style={{ width: 300, height: 32 }} />
            </div>
          </Card>
        </div>
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
    (sum, item) => sum + item.fundRequestAmount,
    0
  );
  const processedRequests =
    disbursements?.filter((r) => r.statusName !== "Pending") || [];

  // Filter options
  const filterOptions = (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <Search
          placeholder="Search by project, department, or requester..."
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

      {/* Add filter for disbursement type */}
      <Select
        placeholder="Disbursement Type"
        allowClear
        style={{ minWidth: 180 }}
        onChange={(value) => setTypeFilter(value)}
        options={[
          { value: "all", label: "All Types" },
          { value: "0", label: "Project Phase" },
          { value: "1", label: "Conference Expense" },
          { value: "2", label: "Conference Funding" },
          { value: "3", label: "Journal Funding" },
        ]}
      />

      <Button
        type="primary"
        icon={<ClockCircleOutlined />}
        onClick={() => navigate("/pending-disbursements")}
        className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none"
      >
        Pending Disbursements
      </Button>
    </div>
  );

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
          {filterOptions}
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
      </div>
    </div>
  );
};

export default FundDisbursementRequest;
