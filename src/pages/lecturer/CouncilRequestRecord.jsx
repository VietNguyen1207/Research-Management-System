import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Input,
  Tag,
  Space,
  Spin,
  Typography,
  Alert,
  Breadcrumb,
  Select,
  Skeleton,
  Tooltip,
  Row,
  Col,
  Divider,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  HistoryOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  BankOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetDepartmentProjectRequestsQuery } from "../../features/project/projectApiSlice";
import { motion } from "framer-motion";
import moment from "moment";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Request type mapping
const REQUEST_TYPE = {
  1: "Research Creation",
  2: "Phase Update",
  3: "Completion",
  4: "Paper Creation",
  5: "Conference Creation",
  6: "Fund Disbursement",
};

// Approval status mapping
const APPROVAL_STATUS = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
};

const STATUS_COLORS = {
  Pending: "gold",
  Approved: "green",
  Rejected: "red",
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

const CouncilRequestRecord = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Get departmentId from user
  const departmentId = user?.department?.departmentId;

  const [searchText, setSearchText] = useState("");
  const [requestTypeFilter, setRequestTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState([]);

  // Fetch all department project requests (including processed ones)
  const {
    data: requestsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetDepartmentProjectRequestsQuery(departmentId, {
    skip: !departmentId,
  });

  // Filter requests based on search, type, status, and date
  useEffect(() => {
    if (requestsData && requestsData.data) {
      let filtered = [...requestsData.data];

      // Apply search filter
      if (searchText) {
        const lowerCaseSearch = searchText.toLowerCase();
        filtered = filtered.filter(
          (request) =>
            request.projectName?.toLowerCase().includes(lowerCaseSearch) ||
            request.projectDescription
              ?.toLowerCase()
              .includes(lowerCaseSearch) ||
            request.requesterName?.toLowerCase().includes(lowerCaseSearch) ||
            request.groupName?.toLowerCase().includes(lowerCaseSearch)
        );
      }

      // Apply request type filter
      if (requestTypeFilter !== "all") {
        filtered = filtered.filter(
          (request) => request.requestType.toString() === requestTypeFilter
        );
      }

      // Apply status filter
      if (statusFilter !== "all") {
        filtered = filtered.filter(
          (request) => request.approvalStatus.toString() === statusFilter
        );
      }

      // Apply date range filter
      if (dateRange && dateRange[0] && dateRange[1]) {
        const startDate = dateRange[0].startOf("day");
        const endDate = dateRange[1].endOf("day");

        filtered = filtered.filter((request) => {
          const requestDate = moment(request.requestedAt);
          return requestDate.isBetween(startDate, endDate, null, "[]");
        });
      }

      // Sort by requestedAt date (newest first)
      filtered = filtered.sort(
        (a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)
      );

      setFilteredRequests(filtered);
    }
  }, [requestsData, searchText, requestTypeFilter, statusFilter, dateRange]);

  const columns = [
    {
      title: "Request Details",
      key: "details",
      width: "35%",
      render: (_, record) => (
        <div className="space-y-3">
          <div>
            <h4 className="text-lg font-medium text-gray-900">
              {record.projectName}
            </h4>
            <p className="text-sm text-gray-500 line-clamp-2">
              {record.projectDescription}
            </p>
          </div>
          <div className="flex items-center space-x-2 flex-wrap">
            <Tag
              color={
                record.projectType === 0
                  ? "blue"
                  : record.projectType === 1
                  ? "purple"
                  : "cyan"
              }
            >
              {record.projectTypeName}
            </Tag>
            <Tag color="orange">{REQUEST_TYPE[record.requestType]}</Tag>
            <Tag color={STATUS_COLORS[record.statusName]}>
              {record.statusName}
            </Tag>
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex items-center">
              <UserOutlined className="text-gray-400 mr-2" />
              <span className="text-gray-600">Requester: </span>
              <span className="font-medium ml-1">{record.requesterName}</span>
            </div>
            <div className="flex items-center">
              <TeamOutlined className="text-gray-400 mr-2" />
              <span className="text-gray-600">Group: </span>
              <span className="font-medium ml-1">{record.groupName}</span>
            </div>
            <div className="flex items-center">
              <CalendarOutlined className="text-gray-400 mr-2" />
              <span className="text-gray-600">Requested: </span>
              <span className="font-medium ml-1">
                {formatDate(record.requestedAt)}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Review Details",
      key: "review",
      width: "35%",
      render: (_, record) => (
        <div className="space-y-3">
          {record.approvalStatus !== 0 && (
            <>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <UserOutlined className="text-gray-400 mr-2" />
                  <span className="text-gray-600">Reviewed by: </span>
                  <span className="font-medium ml-1">
                    {record.approverName || "N/A"}
                  </span>
                </div>
                {record.approvedAt && (
                  <div className="flex items-center">
                    <CalendarOutlined className="text-gray-400 mr-2" />
                    <span className="text-gray-600">Reviewed on: </span>
                    <span className="font-medium ml-1">
                      {formatDate(record.approvedAt)}
                    </span>
                  </div>
                )}
              </div>

              {record.approvalStatus === 2 && record.rejectionReason && (
                <div className="mt-2 bg-red-50 p-3 rounded-lg border border-red-100">
                  <div className="text-sm font-medium text-red-700 mb-1">
                    Rejection Reason:
                  </div>
                  <p className="text-sm text-gray-700">
                    {record.rejectionReason}
                  </p>
                </div>
              )}
            </>
          )}

          {record.requestType === 6 && (
            <div className="mt-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center">
                <DollarOutlined className="text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-700">
                  Fund Request:{" "}
                </span>
                <span className="text-sm font-medium ml-1 text-blue-900">
                  ₫{record.fundRequestAmount?.toLocaleString() || "0"}
                </span>
              </div>
            </div>
          )}

          {record.requestType === 3 && (
            <div className="mt-2 bg-green-50 p-3 rounded-lg border border-green-100">
              <div className="flex items-center">
                <CheckCircleOutlined className="text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-700">
                  Project Completion Request
                </span>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Budget",
      key: "budget",
      width: "15%",
      render: (_, record) => (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Approved:</span>
            <span className="text-sm font-medium">
              ₫{record.approvedBudget?.toLocaleString() || "0"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Spent:</span>
            <span className="text-sm font-medium">
              ₫{record.spentBudget?.toLocaleString() || "0"}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_, record) => (
        <Space direction="vertical" className="w-full">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => {
              // Scroll to top before navigation
              window.scrollTo(0, 0);
              navigate(`/project-request/${record.requestId}`);
            }}
            className="w-full bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F27D28] hover:to-[#F2922B] border-none"
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section Skeleton */}
          <div className="text-center mb-8">
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
          <Card className="mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Skeleton.Input active style={{ width: "100%" }} />
              <Skeleton.Input active style={{ width: "100%" }} />
              <Skeleton.Input active style={{ width: "100%" }} />
              <Skeleton.Input active style={{ width: "100%" }} />
            </div>
          </Card>

          {/* Table Skeleton */}
          <Card className="shadow-md">
            <Skeleton active paragraph={{ rows: 10 }} />
          </Card>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Error loading request records
          </h2>
          <p className="mt-2 text-gray-600">
            {error?.data?.message ||
              "Failed to load request records. Please try again later."}
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

  if (!departmentId) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Alert
            message="No Department Information"
            description="You need to be assigned to a department to view request records."
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a onClick={() => navigate("/review-project")}>
                <FileTextOutlined /> Project Review
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <HistoryOutlined /> Request Records
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C00] to-[#FFA500] mb-2">
              Request Records
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#FF8C00] to-[#FFA500] rounded-full"></div>
          </motion.div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            View and track all project request records for{" "}
            {user?.department?.departmentName || "your department"}
          </p>
        </div>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Text strong>Search</Text>
                <Input
                  placeholder="Search projects or requesters..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                  allowClear
                  className="w-full mt-2"
                />
              </div>

              <div>
                <Text strong>Request Type</Text>
                <Select
                  className="w-full mt-2"
                  value={requestTypeFilter}
                  onChange={setRequestTypeFilter}
                  options={[
                    { value: "all", label: "All Request Types" },
                    { value: "1", label: "Research Creation" },
                    { value: "2", label: "Phase Update" },
                    { value: "3", label: "Project Completion" },
                    { value: "4", label: "Paper Creation" },
                    { value: "5", label: "Conference Creation" },
                    { value: "6", label: "Fund Disbursement" },
                  ]}
                />
              </div>

              <div>
                <Text strong>Status</Text>
                <Select
                  className="w-full mt-2"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { value: "all", label: "All Statuses" },
                    { value: "0", label: "Pending" },
                    { value: "1", label: "Approved" },
                    { value: "2", label: "Rejected" },
                  ]}
                />
              </div>

              <div>
                <Text strong>Date Range</Text>
                <RangePicker className="w-full mt-2" onChange={setDateRange} />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card className="text-center">
                <Text className="text-gray-500">Total</Text>
                <div className="text-2xl font-bold">
                  {filteredRequests.length}
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="text-center">
                <Text className="text-gray-500">Approved</Text>
                <div className="text-2xl font-bold text-green-600">
                  {
                    filteredRequests.filter((r) => r.approvalStatus === 1)
                      .length
                  }
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="text-center">
                <Text className="text-gray-500">Rejected</Text>
                <div className="text-2xl font-bold text-red-600">
                  {
                    filteredRequests.filter((r) => r.approvalStatus === 2)
                      .length
                  }
                </div>
              </Card>
            </Col>
          </Row>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-md">
            <Table
              columns={columns}
              dataSource={filteredRequests}
              rowKey="requestId"
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Total ${total} records`,
                position: ["bottomCenter"],
              }}
              className="custom-table"
              rowClassName="align-top"
              locale={{
                emptyText: "No request records found matching your criteria",
              }}
            />
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CouncilRequestRecord;
