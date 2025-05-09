import React, { useState } from "react";
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Tag,
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
  Skeleton,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  DollarOutlined,
  CalendarOutlined,
  FileTextOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  BankOutlined,
  UserOutlined,
  DatabaseOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGetPendingFundDisbursementsQuery } from "../../features/fund-disbursement/fundDisbursementApiSlice";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

// Fund Disbursement Type enum mapping
const FUND_DISBURSEMENT_TYPE = {
  0: "Project Phase",
  1: "Conference Expense",
  2: "Conference Funding",
  3: "Journal Funding",
};

const FundDisbursementPendingRequest = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // API query for pending disbursements
  const {
    data: pendingDisbursements,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPendingFundDisbursementsQuery();

  // Handle view request details
  const handleViewDetails = (record) => {
    navigate(`/fund-disbursement-details/${record.fundDisbursementId}`);
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

  // Navigate to all disbursement records
  const handleViewAllRecords = () => {
    navigate("/fund-disbursement");
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
              {FUND_DISBURSEMENT_TYPE[record.fundDisbursementType] || "N/A"}
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
      render: (status) => (
        <Badge status="processing" text="Pending" className="text-blue-500" />
      ),
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

  // Filter data based on search and date
  const filteredData = pendingDisbursements
    ? pendingDisbursements
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

          return matchesSearch && matchesDate;
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
            {[1, 2].map((i) => (
              <Col xs={24} sm={12} key={i}>
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
              <Skeleton.Button active style={{ width: 150, height: 40 }} />
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
                      />
                    </div>
                  </div>
                </div>
              ))}
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
          message="Error loading pending fund disbursement requests"
          description={
            error?.data?.message ||
            "Failed to load pending fund disbursement requests. Please try again later."
          }
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={refetch}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  // Calculate statistics
  const pendingAmount = pendingDisbursements
    ? pendingDisbursements.reduce(
        (sum, item) => sum + item.fundRequestAmount,
        0
      )
    : 0;

  // Filter options
  const filterOptions = (
    <div className="flex flex-col md:flex-row gap-4 items-center">
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

      <Button
        type="primary"
        icon={<DatabaseOutlined />}
        onClick={handleViewAllRecords}
        className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none"
      >
        Disbursement Records
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
              Pending Fund Disbursements
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#F2722B] to-[#FFA500] rounded-full"></div>
          </motion.div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Review and process pending fund disbursement requests that require
            your approval
          </p>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={<Text className="text-gray-600">Pending Requests</Text>}
                value={pendingDisbursements ? pendingDisbursements.length : 0}
                prefix={<ClockCircleOutlined className="text-[#F2722B]" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
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
        </Row>

        {/* Filters */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
          {filterOptions}
        </Card>

        {/* Request Table */}
        <Card
          className="shadow-lg rounded-xl border-0"
          title={
            <div className="flex items-center">
              <ClockCircleOutlined className="text-blue-500 mr-2" />
              <span className="font-medium">Pending Approval Requests</span>
              <Tag color="processing" className="ml-2">
                {pendingDisbursements ? pendingDisbursements.length : 0} Pending
              </Tag>
            </div>
          }
        >
          {!filteredData || filteredData.length === 0 ? (
            <div className="text-center py-8">
              <ClockCircleOutlined
                style={{ fontSize: 48 }}
                className="text-gray-300"
              />
              <p className="mt-4 text-gray-500">
                No pending disbursement requests found
              </p>
              <Button
                type="primary"
                icon={<DatabaseOutlined />}
                onClick={handleViewAllRecords}
                className="mt-4 bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none"
              >
                View All Disbursement Records
              </Button>
            </div>
          ) : (
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
              className="pending-disbursements-table"
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default FundDisbursementPendingRequest;
