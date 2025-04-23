import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Modal,
  Tag,
  Space,
  Divider,
  Select,
  Collapse,
  Spin,
  Empty,
  Typography,
  Alert,
  Skeleton,
  Input,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  UserOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  DownloadOutlined,
  BankOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useGetUserProjectRequestsQuery } from "../../features/project/projectApiSlice";

const { Title, Text } = Typography;
const { Option } = Select;

// Project Type enum mapping
const PROJECT_TYPE = {
  0: "Research",
  1: "Conference",
  2: "Journal",
};

// Project Status enum mapping
const PROJECT_STATUS = {
  0: "Pending",
  1: "Approved",
  2: "Work in progress",
  3: "Rejected",
};

// Request Type enum mapping
const REQUEST_TYPE = {
  1: "Research Creation",
  2: "Phase Update",
  3: "Completion",
  4: "Paper Creation",
  5: "Conference Creation",
  6: "Fund Disbursement",
};

const APPROVAL_STATUS = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
};

// Document Type enum mapping
const DOCUMENT_TYPE = {
  0: "Project Document",
  1: "Research Publication",
  2: "Council Document",
  6: "Completion Document",
};

// Status colors
const STATUS_COLORS = {
  0: "gold", // Pending
  1: "green", // Approved
  2: "red", // Rejected
};

// Request options for filter
const REQUEST_OPTIONS = [
  { value: "all", label: "All Type" },
  { value: "1", label: "Research Creation" },
  { value: "2", label: "Phase Update" },
  { value: "3", label: "Completion" },
  { value: "4", label: "Paper Creation" },
  { value: "5", label: "Conference Creation" },
  { value: "6", label: "Fund Disbursement" },
];

// Status options for filter
const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "0", label: "Pending" },
  { value: "1", label: "Approved" },
  { value: "2", label: "Rejected" },
];

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
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

const RequestRecord = () => {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [filteredRequests, setFilteredRequests] = useState([]);

  const {
    data: requestsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUserProjectRequestsQuery();

  // Filter and process the data when it's loaded
  useEffect(() => {
    if (requestsData && requestsData.data) {
      // Apply filters
      const filtered = requestsData.data.filter((request) => {
        const matchesSearch =
          searchText.toLowerCase() === ""
            ? true
            : request.projectName
                ?.toLowerCase()
                .includes(searchText.toLowerCase()) ||
              request.projectDescription
                ?.toLowerCase()
                .includes(searchText.toLowerCase());

        const matchesType =
          typeFilter === "all"
            ? true
            : request.requestType.toString() === typeFilter;

        const matchesStatus =
          statusFilter === "all"
            ? true
            : request.approvalStatus.toString() === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
      });

      setFilteredRequests(filtered);
    }
  }, [requestsData, searchText, typeFilter, statusFilter]);

  const handleViewDetails = (request) => {
    navigate(`/project-request/${request.requestId}`);
  };

  const handleViewDocument = (documentUrl) => {
    window.open(documentUrl, "_blank");
  };

  const columns = [
    {
      title: "Basic Information",
      key: "basic",
      width: "40%",
      render: (_, record) => (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium text-gray-900">
              {record.projectName}
            </h4>
            <p className="text-sm text-gray-500">{record.projectDescription}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Tag color="blue">{record.projectTypeName}</Tag>
            <Tag color="green">{record.departmentName}</Tag>
            <Tag color="purple">{REQUEST_TYPE[record.requestType]}</Tag>
          </div>

          <Divider className="my-3" />

          <div className="space-y-2">
            <div className="flex items-center">
              <UserOutlined className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Requested by: </span>
              <span className="text-sm font-medium ml-1">
                {record.requesterName || "Unknown"}
              </span>
            </div>
            <div className="text-sm text-gray-500 ml-6">
              <div>Requested at: {formatDate(record.requestedAt)}</div>
            </div>
          </div>

          {/* Group Info */}
          <div className="flex items-center mt-2">
            <TeamOutlined className="text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">Group: </span>
            <span className="text-sm font-medium ml-1">
              {record.groupName || "Unknown Group"}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Resource Requests",
      key: "resources",
      width: "30%",
      render: (_, record) => (
        <div className="space-y-4">
          <div className="flex items-center">
            <DollarOutlined className="text-gray-400 mr-2" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Approved Budget</span>
                <span className="text-sm font-medium">
                  ₫{record.approvedBudget?.toLocaleString() || "0"}
                </span>
              </div>
              {record.spentBudget > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Spent Budget</span>
                  <span className="text-sm font-medium">
                    ₫{record.spentBudget?.toLocaleString() || "0"}
                  </span>
                </div>
              )}
              {record.fundRequestAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Requested Funds</span>
                  <span className="text-sm font-medium">
                    ₫{record.fundRequestAmount?.toLocaleString() || "0"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <CalendarOutlined className="text-gray-400 mr-2" />
            <div className="text-sm">
              <span className="text-gray-600">Project Status: </span>
              <span className="font-medium">
                {PROJECT_STATUS[record.projectStatus] || "N/A"}
              </span>
            </div>
          </div>

          {record.approvedAt && (
            <div className="flex items-center">
              <CheckCircleOutlined
                className={`mr-2 ${
                  record.approvalStatus === 1
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              />
              <div className="text-sm">
                <span className="text-gray-600">Processed: </span>
                <span className="font-medium">
                  {formatDate(record.approvedAt)}
                </span>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: "15%",
      render: (_, record) => (
        <div>
          <Tag
            color={STATUS_COLORS[record.approvalStatus]}
            className="px-3 py-1 text-base"
          >
            {record.statusName || APPROVAL_STATUS[record.approvalStatus]}
          </Tag>

          {record.rejectionReason && (
            <div className="mt-2 text-red-500 text-sm">
              <Text type="danger" strong>
                Reason:
              </Text>
              <div className="mt-1 p-2 bg-red-50 rounded-md max-h-20 overflow-y-auto">
                {record.rejectionReason}
              </div>
            </div>
          )}
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
            type="default"
            icon={<InfoCircleOutlined />}
            onClick={() => handleViewDetails(record)}
            className="w-full bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] text-white border-none"
          >
            View Details
          </Button>

          {record.approvalStatus === 1 && (
            <Button
              type="default"
              onClick={() => navigate(`/project-details/${record.projectId}`)}
              className="w-full"
            >
              Manage Project
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // For table skeleton loading
  const skeletonRows = Array(5).fill(null);

  // Table columns for skeleton loading
  const skeletonColumns = [
    {
      title: "Basic Information",
      key: "basic",
      width: "40%",
      render: () => <Skeleton active paragraph={{ rows: 3 }} title={true} />,
    },
    {
      title: "Resource Requests",
      key: "resources",
      width: "30%",
      render: () => <Skeleton active paragraph={{ rows: 2 }} title={false} />,
    },
    {
      title: "Status",
      key: "status",
      width: "15%",
      render: () => <Skeleton.Button active size="small" shape="round" />,
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: () => <Skeleton.Button active size="default" block={true} />,
    },
  ];

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Error loading project requests
          </h2>
          <p className="mt-2 text-gray-600">
            {error?.data?.message ||
              "Failed to load project requests. Please try again later."}
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

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C00] to-[#FFA500] mb-2">
              Project Request Records
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#FF8C00] to-[#FFA500] rounded-full"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            View and manage all your research project requests
          </p>
        </div>

        {/* Add Filter Section - Disabled during loading */}
        <div className="mb-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4 flex-wrap gap-2">
              {/* Search bar */}
              <Input
                placeholder="Search requests..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={(e) => setSearchText(e.target.value)}
                className="max-w-md"
                allowClear
                value={searchText}
                disabled={isLoading}
              />
              <span className="text-gray-700 font-medium">Filter by:</span>
              {/* Request type filter */}
              <Select
                value={typeFilter}
                style={{ width: 180 }}
                onChange={setTypeFilter}
                options={REQUEST_OPTIONS}
                className="rounded-md"
                disabled={isLoading}
                placeholder="Request Type"
              />
              {/* Status filter */}
              <Select
                value={statusFilter}
                style={{ width: 150 }}
                onChange={setStatusFilter}
                options={STATUS_OPTIONS}
                className="rounded-md"
                disabled={isLoading}
                placeholder="Status"
              />
            </div>
          </div>
        </div>

        {/* Table with Skeleton Loading */}
        <Card className="shadow-md">
          {isLoading ? (
            <Table
              columns={skeletonColumns}
              dataSource={skeletonRows}
              rowKey={(_, index) => index}
              pagination={{ pageSize: 5 }}
              className="custom-table"
              rowClassName="align-top"
            />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredRequests}
              rowKey="requestId"
              pagination={{ pageSize: 5 }}
              className="custom-table"
              rowClassName="align-top"
              locale={{ emptyText: "No project requests found" }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default RequestRecord;
