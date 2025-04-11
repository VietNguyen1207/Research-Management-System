import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Input,
  Tag,
  Tooltip,
  Space,
  message,
  Divider,
  Progress,
  Select,
  Timeline,
  Collapse,
  Spin,
  Empty,
  Avatar,
  Skeleton,
} from "antd";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ProjectOutlined,
  SearchOutlined,
  GlobalOutlined,
  CrownOutlined,
  DownloadOutlined,
  MailOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import {
  useGetMyPendingProjectsQuery,
  useGetMyProjectsQuery,
} from "../features/project/projectApiSlice";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
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

const STATUS_COLORS = {
  pending: "gold",
  approved: "green",
  rejected: "red",
  "in review": "blue",
  "revision needed": "orange",
  "work in progress": "cyan",
};
// status
const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "in review", label: "In Review" },
  { value: "revision needed", label: "Revision Needed" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

// request
const REQUEST_OPTIONS = [
  { value: "all", label: "All Type" },
  { value: "0", label: "Research" },
  { value: "1", label: "Conference" },
  { value: "2", label: "Journal" },
];

// department
const DEPARTMENT_OPTIONS = [
  { value: "all", label: "All Department" },
  { value: "information technology", label: "Information Technology" },
  { value: "computer science", label: "Computer Science" },
  { value: "software engineering", label: "Software Engineering" },
];

// category
const CATEGORY_OPTIONS = [
  { value: "all", label: "All Category" },
  { value: "ai & machine learning", label: "AI & Machine Learning" },
  { value: "data science", label: "Data Science" },
  { value: "cybersecurity", label: "Cybersecurity" },
];

// Add this constant for document types
const DOCUMENT_TYPE = {
  0: "Project Document",
  1: "Research Publication",
  2: "Council Document",
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

const PendingRequest = () => {
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.auth);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // Fetch pending projects data from the new API
  const {
    data: pendingProjectsData,
    isLoading: isPendingLoading,
    isError: isPendingError,
    error: pendingError,
  } = useGetMyPendingProjectsQuery();

  // Also fetch full project details for when a project is selected
  const { data: fullProjectsData } = useGetMyProjectsQuery();

  // Filter and process the data when it's loaded
  useEffect(() => {
    if (pendingProjectsData && pendingProjectsData.data) {
      // Apply filters
      const filtered = pendingProjectsData.data.filter((project) => {
        const matchesSearch =
          searchText.toLowerCase() === ""
            ? true
            : project.projectName
                ?.toLowerCase()
                .includes(searchText.toLowerCase()) ||
              project.description
                ?.toLowerCase()
                .includes(searchText.toLowerCase());

        const matchesType =
          typeFilter === "all"
            ? true
            : project.projectType?.toString() === typeFilter;

        return matchesSearch && matchesType;
      });

      setFilteredRequests(filtered);
    }
  }, [pendingProjectsData, searchText, typeFilter]);

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
            <p className="text-sm text-gray-500">{record.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Tag color="blue">
              {PROJECT_TYPE[record.projectType] || "Research"}
            </Tag>
            <Tag color="green">{record.departmentName}</Tag>
          </div>

          <Divider className="my-3" />

          <div className="space-y-2">
            <div className="flex items-center">
              <UserOutlined className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Created by: </span>
              <span className="text-sm font-medium ml-1">
                {record.creatorName || "Unknown"}
              </span>
            </div>
            <div className="text-sm text-gray-500 ml-6">
              <div>Created at: {formatDate(record.createdAt)}</div>
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
      width: "40%",
      render: (_, record) => (
        <div className="space-y-4">
          <div className="flex items-center">
            <DollarOutlined className="text-gray-400 mr-2" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Requested Budget</span>
                <span className="text-sm font-medium">
                  ₫{record.approvedBudget?.toLocaleString() || "0"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <CalendarOutlined className="text-gray-400 mr-2" />
            <div className="text-sm">
              <span className="text-gray-600">Timeline: </span>
              <span className="font-medium">
                {formatDate(record.startDate)} to {formatDate(record.endDate)}
              </span>
            </div>
          </div>

          {/* Email Info */}
          <div className="flex items-center mt-2">
            <MailOutlined className="text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">Contact: </span>
            <span className="text-sm font-medium ml-1">
              {record.creatorEmail || "No email provided"}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: "15%",
      render: (_, record) => {
        const statusText = PROJECT_STATUS[record.status].toLowerCase();
        return (
          <Tag color={STATUS_COLORS[statusText] || "default"}>
            {PROJECT_STATUS[record.status]}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
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
        </Space>
      ),
    },
  ];

  const handleViewDetails = (request) => {
    navigate(`/project-details/${request.projectId}`);
  };

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
      width: "40%",
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
      width: "20%",
      render: () => <Skeleton.Button active size="default" block={true} />,
    },
  ];

  if (isPendingError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Error loading projects
          </h2>
          <p className="mt-2 text-gray-600">
            {pendingError?.data?.message ||
              "Failed to load projects. Please try again later."}
          </p>
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
              Pending Requests
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#FF8C00] to-[#FFA500] rounded-full"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Review and manage pending research, conference, and case study
            requests
          </p>
        </div>

        {/* Add Filter Section - Disabled during loading */}
        <div className="mb-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4 flex-1">
              {/* Search bar */}
              <Input
                placeholder="Search requests..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={(e) => setSearchText(e.target.value)}
                className="max-w-md"
                allowClear
                value={searchText}
                disabled={isPendingLoading}
              />
              <span className="text-gray-700 font-medium">Filter:</span>
              {/* filter request type */}
              <Select
                value={typeFilter}
                style={{ width: 200 }}
                onChange={setTypeFilter}
                options={REQUEST_OPTIONS}
                className="rounded-md"
                disabled={isPendingLoading}
              />
            </div>
          </div>
        </div>

        {/* Table with Skeleton Loading */}
        <Card className="shadow-md">
          {isPendingLoading ? (
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
              rowKey="projectId"
              pagination={{ pageSize: 5 }}
              className="custom-table"
              rowClassName="align-top"
              locale={{ emptyText: "No pending requests found" }}
            />
          )}
        </Card>

        {/* Modal for request details */}
        <Modal
          title={
            <div className="text-lg">
              <div className="font-semibold text-gray-800">Project Details</div>
              <div className="text-sm font-normal text-gray-500 mt-1">
                {selectedRequest?.projectName || (
                  <Skeleton.Input active size="small" style={{ width: 200 }} />
                )}
              </div>
            </div>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width={800}
          footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          {selectedRequest ? (
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              {/* Project Status */}
              <div className="mb-4">
                <Tag
                  color={
                    STATUS_COLORS[
                      PROJECT_STATUS[selectedRequest.status].toLowerCase()
                    ] || "default"
                  }
                  className="text-base px-3 py-1"
                >
                  {PROJECT_STATUS[selectedRequest.status]}
                </Tag>
              </div>

              {/* Project Creator Information */}
              <Collapse defaultActiveKey={["1"]} className="mb-4">
                <Collapse.Panel
                  header={
                    <div className="flex items-center">
                      <UserOutlined className="text-[#F2722B] mr-2" />
                      <span className="font-medium">Creator Information</span>
                    </div>
                  }
                  key="1"
                >
                  <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                    <Avatar
                      size={64}
                      icon={<UserOutlined />}
                      className="bg-[#F2722B]"
                    />
                    <div className="ml-4">
                      <h4 className="text-lg font-medium">
                        {selectedRequest.creatorName}
                      </h4>
                      <div className="flex items-center text-gray-500 mt-1">
                        <MailOutlined className="mr-2" />
                        <a href={`mailto:${selectedRequest.creatorEmail}`}>
                          {selectedRequest.creatorEmail}
                        </a>
                      </div>
                      <div className="flex items-center text-gray-500 mt-1">
                        <BankOutlined className="mr-2" />
                        <span>{selectedRequest.departmentName}</span>
                      </div>
                      <div className="flex items-center text-gray-500 mt-1">
                        <TeamOutlined className="mr-2" />
                        <span>{selectedRequest.groupName}</span>
                      </div>
                    </div>
                  </div>
                </Collapse.Panel>
              </Collapse>

              {/* Project Details */}
              <Collapse defaultActiveKey={["1"]} className="mb-4">
                <Collapse.Panel
                  header={
                    <div className="flex items-center">
                      <InfoCircleOutlined className="text-[#F2722B] mr-2" />
                      <span className="font-medium">Project Details</span>
                    </div>
                  }
                  key="1"
                >
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">Description</div>
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        {selectedRequest.description}
                      </div>
                    </div>

                    {selectedRequest.methodology && (
                      <div>
                        <div className="text-sm text-gray-500">Methodology</div>
                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                          {selectedRequest.methodology}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm text-gray-500">Budget</div>
                        <div className="mt-2 p-3 bg-gray-50 rounded-md font-medium">
                          ₫{selectedRequest.approvedBudget?.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Timeline</div>
                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                          {formatDate(selectedRequest.startDate)} to{" "}
                          {formatDate(selectedRequest.endDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Collapse.Panel>
              </Collapse>

              {/* Documents Section - Only shown if available in detailed data */}
              {selectedRequest.documents &&
                selectedRequest.documents.length > 0 && (
                  <Collapse defaultActiveKey={["1"]} className="mb-4">
                    <Collapse.Panel
                      header={
                        <div className="flex items-center">
                          <FileTextOutlined className="text-[#F2722B] mr-2" />
                          <span className="font-medium">Project Documents</span>
                        </div>
                      }
                      key="1"
                    >
                      <div className="space-y-3">
                        {selectedRequest.documents.map((doc) => (
                          <div
                            key={doc.documentId}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center">
                              <FileTextOutlined className="text-gray-500 mr-3 text-lg" />
                              <div>
                                <div className="font-medium text-gray-800 mb-1">
                                  {doc.fileName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  <Tag color="blue">
                                    {DOCUMENT_TYPE[doc.documentType]}
                                  </Tag>
                                  <span className="ml-2">
                                    Uploaded: {formatDate(doc.uploadAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              type="primary"
                              icon={<DownloadOutlined />}
                              onClick={() =>
                                window.open(doc.documentUrl, "_blank")
                              }
                              className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none"
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </Collapse.Panel>
                  </Collapse>
                )}

              {/* Milestones Section - Only shown if available in detailed data */}
              {selectedRequest.milestones &&
                selectedRequest.milestones.length > 0 && (
                  <Collapse defaultActiveKey={["1"]} className="mb-4">
                    <Collapse.Panel
                      header={
                        <div className="flex items-center">
                          <CheckCircleOutlined className="text-[#F2722B] mr-2" />
                          <span className="font-medium">
                            Project Milestones
                          </span>
                        </div>
                      }
                      key="1"
                    >
                      <Timeline>
                        {selectedRequest.milestones.map((milestone) => (
                          <Timeline.Item key={milestone.milestoneId}>
                            <div className="text-base font-medium">
                              {milestone.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(milestone.startDate)} to{" "}
                              {formatDate(milestone.endDate)}
                            </div>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    </Collapse.Panel>
                  </Collapse>
                )}
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <Skeleton active avatar paragraph={{ rows: 3 }} />
              <Divider />
              <Skeleton active paragraph={{ rows: 4 }} />
              <Divider />
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default PendingRequest;
