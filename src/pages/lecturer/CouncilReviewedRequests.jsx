import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Tag,
  Space,
  Select,
  Spin,
  Empty,
  Typography,
  Alert,
  Skeleton,
  Input,
  Divider,
} from "antd";
import {
  InfoCircleOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  UserOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  BankOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useGetReviewedProjectRequestsByCouncilQuery } from "../../features/project/projectApiSlice"; // Updated hook
// It's good practice to import enums from the central file
import {
  PROJECT_TYPE,
  PROJECT_STATUS,
  REQUEST_TYPE,
  APPROVAL_STATUS,
  STATUS_COLORS,
  FUND_DISBURSEMENT_TYPE,
} from "../../constants/enums";

const { Title, Text } = Typography;
const { Option } = Select;

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

const CouncilReviewedRequests = () => {
  const navigate = useNavigate();
  const { councilGroupId } = useParams(); // Get councilGroupId from URL

  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // May not be needed if API only returns reviewed
  const [searchText, setSearchText] = useState("");
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [councilName, setCouncilName] = useState("");

  const {
    data: requestsData, // This will be an array of requests from the hook
    isLoading,
    isError,
    error,
    refetch,
  } = useGetReviewedProjectRequestsByCouncilQuery(councilGroupId, {
    skip: !councilGroupId, // Skip query if councilGroupId is not available
  });

  useEffect(() => {
    if (requestsData && Array.isArray(requestsData)) {
      if (requestsData.length > 0) {
        // Assuming council name might be consistent across requests for that council
        // Or ideally, fetch council details separately if needed for the title
        setCouncilName(
          requestsData[0].groupName || `Council ID ${councilGroupId}`
        );
      } else {
        setCouncilName(`Council ID ${councilGroupId}`);
      }

      const filtered = requestsData.filter((request) => {
        const matchesSearch =
          searchText.toLowerCase() === ""
            ? true
            : request.projectName
                ?.toLowerCase()
                .includes(searchText.toLowerCase()) ||
              (request.requesterName &&
                request.requesterName
                  ?.toLowerCase()
                  .includes(searchText.toLowerCase()));

        const matchesType =
          typeFilter === "all"
            ? true
            : request.requestType?.toString() === typeFilter;

        // Since the API returns "reviewed" requests, status filter might be less critical
        // but can be kept for consistency or if "reviewed" includes multiple final statuses.
        const matchesStatus =
          statusFilter === "all"
            ? true
            : request.approvalStatus?.toString() === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
      });

      const sortedFiltered = [...filtered].sort(
        (a, b) =>
          new Date(b.approvedAt || b.requestedAt) -
          new Date(a.approvedAt || a.requestedAt) // Sort by approval/request date
      );
      setFilteredRequests(sortedFiltered);
    } else {
      setFilteredRequests([]);
      if (councilGroupId) setCouncilName(`Council ID ${councilGroupId}`);
    }
  }, [requestsData, searchText, typeFilter, statusFilter, councilGroupId]);

  const handleViewDetails = (request) => {
    navigate(`/project-request/${request.requestId}`);
  };

  const requestOptions = Object.entries(REQUEST_TYPE).map(([key, value]) => ({
    value: key,
    label: value,
  }));
  requestOptions.unshift({ value: "all", label: "All Types" });

  const statusOptions = Object.entries(APPROVAL_STATUS).map(([key, value]) => ({
    value: key,
    label: value,
  }));
  statusOptions.unshift({ value: "all", label: "All Statuses" });

  const columns = [
    {
      title: "Project & Requester",
      key: "projectInfo",
      width: "35%",
      render: (_, record) => (
        <div>
          <Text
            strong
            className="block text-base text-blue-600 hover:underline cursor-pointer"
            onClick={() => handleViewDetails(record)}
          >
            {record.projectName || "N/A"}
          </Text>
          <Text type="secondary" className="text-xs block mb-1">
            {record.projectDescription?.substring(0, 100)}
            {record.projectDescription?.length > 100 ? "..." : ""}
          </Text>
          <Space direction="vertical" size={0} className="mt-1">
            <Text className="text-xs">
              <UserOutlined className="mr-1 text-gray-500" />
              Requested by: {record.requesterName || "N/A"}
            </Text>
            <Text className="text-xs">
              <BankOutlined className="mr-1 text-gray-500" />
              Department: {record.departmentName || "N/A"}
            </Text>
            <Text className="text-xs">
              <TeamOutlined className="mr-1 text-gray-500" />
              Research Group: {record.groupName || "N/A"}
            </Text>
          </Space>
        </div>
      ),
    },
    {
      title: "Request Details",
      key: "requestDetails",
      width: "30%",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag
            color={
              record.projectType === 0
                ? "geekblue"
                : record.projectType === 1
                ? "cyan"
                : "purple"
            }
          >
            Type: {PROJECT_TYPE[record.projectType] || "Unknown"}
          </Tag>
          <Tag color="volcano">
            Request: {REQUEST_TYPE[record.requestType] || "Unknown"}
          </Tag>
          {record.fundDisbursementType !== null && (
            <Tag color="magenta">
              Fund Type:{" "}
              {FUND_DISBURSEMENT_TYPE[record.fundDisbursementType] || "N/A"}
            </Tag>
          )}
          <Text className="text-xs">
            <CalendarOutlined className="mr-1" />
            Requested: {formatDate(record.requestedAt)}
          </Text>
          {record.approvedAt && (
            <Text className="text-xs">
              <CheckCircleOutlined className="mr-1" />
              Processed: {formatDate(record.approvedAt)} {""}
              by {record.approverName || "System"}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Financials",
      key: "financials",
      width: "15%",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text className="text-xs">
            Budget: {formatCurrency(record.approvedBudget)}
          </Text>
          {record.spentBudget > 0 && (
            <Text className="text-xs">
              Spent: {formatCurrency(record.spentBudget)}
            </Text>
          )}
          {record.fundRequestAmount > 0 && (
            <Text className="text-xs text-green-600">
              Requested Fund: {formatCurrency(record.fundRequestAmount)}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: "10%",
      render: (_, record) => (
        <Tag
          color={STATUS_COLORS[record.approvalStatus] || "default"}
          className="text-sm"
        >
          {APPROVAL_STATUS[record.approvalStatus] || "Unknown"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <Button
          type="primary"
          ghost
          size="small"
          icon={<InfoCircleOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          Details
        </Button>
      ),
    },
  ];

  const skeletonColumns = columns.map((col) => ({
    ...col,
    render: () => <Skeleton active paragraph={{ rows: 2 }} title={false} />,
  }));

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <Alert
            message="Error Loading Reviewed Requests"
            description={
              error?.data?.message ||
              "Failed to load reviewed project requests for this council. Please try again later."
            }
            type="error"
            showIcon
            action={
              <Space direction="vertical">
                <Button
                  type="primary"
                  onClick={() => refetch()}
                  className="mt-2"
                >
                  Try Again
                </Button>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
              </Space>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <Title level={2} className="mb-0">
                Reviewed Requests:{" "}
                {isLoading ? <Spin size="small" /> : councilName}
              </Title>
              <Text type="secondary">
                Project requests reviewed by this council.
              </Text>
            </div>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              Back to Councils
            </Button>
          </div>
        </Card>

        <Card className="mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Input
              placeholder="Search by project name or requester..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full sm:max-w-md"
              allowClear
              value={searchText}
              disabled={isLoading}
              size="middle"
            />
            <Select
              value={typeFilter}
              style={{ minWidth: 180 }}
              onChange={setTypeFilter}
              options={requestOptions}
              disabled={isLoading}
              placeholder="Filter by Request Type"
              size="middle"
            />
            <Select
              value={statusFilter}
              style={{ minWidth: 150 }}
              onChange={setStatusFilter}
              options={statusOptions}
              disabled={isLoading}
              placeholder="Filter by Status"
              size="middle"
            />
          </div>
        </Card>

        <Card className="shadow-md">
          {isLoading ? (
            <Table
              columns={skeletonColumns}
              dataSource={Array(5)
                .fill({})
                .map((_, i) => ({ key: i }))}
              rowKey="key"
              pagination={false}
              className="custom-table"
            />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredRequests}
              rowKey="requestId"
              pagination={{
                pageSize: 10,
                total: filteredRequests.length,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              className="custom-table"
              locale={{
                emptyText: (
                  <Empty description="No reviewed project requests found for this council." />
                ),
              }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default CouncilReviewedRequests;
