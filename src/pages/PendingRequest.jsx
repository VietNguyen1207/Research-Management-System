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
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useGetMyProjectsQuery } from "../features/project/projectApiSlice";

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
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Fetch projects data from API
  const {
    data: projectsData,
    isLoading,
    isError,
    error,
  } = useGetMyProjectsQuery();

  // Filter only pending projects (status 0)
  useEffect(() => {
    if (projectsData && projectsData.data) {
      const pendingProjects = projectsData.data.filter(
        (project) => project.status === 0
      );

      // Apply additional filters
      const filtered = pendingProjects.filter((project) => {
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
            : project.projectType.toString() === typeFilter;

        // Add more filters as needed
        return matchesSearch && matchesType;
      });

      setFilteredRequests(filtered);
    }
  }, [projectsData, searchText, typeFilter, departmentFilter, categoryFilter]);

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
            <Tag color="blue">{PROJECT_TYPE[record.projectType]}</Tag>
            {record.departmentId && (
              <Tag color="green">Department {record.departmentId}</Tag>
            )}
          </div>

          <Divider className="my-3" />

          <div className="space-y-2">
            <div className="flex items-center">
              <UserOutlined className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Created by ID: </span>
              <span className="text-sm font-medium ml-1">
                {record.createdBy || "Unknown"}
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

          {/* Documents Section */}
          {record.documents && record.documents.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center mb-2">
                <FileTextOutlined className="text-gray-400 mr-2" />
                <span className="text-sm font-medium">Project Documents</span>
              </div>
              <div className="space-y-2 ml-6">
                {record.documents.map((doc) => (
                  <div
                    key={doc.documentId}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <FileTextOutlined className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Tag color="blue" size="small">
                            {DOCUMENT_TYPE[doc.documentType]}
                          </Tag>
                          <span className="ml-2">
                            {formatDate(doc.uploadAt)}
                          </span>
                        </div>
                        <div
                          className="text-sm font-medium truncate max-w-[250px]"
                          title={doc.fileName}
                        >
                          {doc.fileName}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="link"
                      size="small"
                      icon={<DownloadOutlined />}
                      onClick={() => window.open(doc.documentUrl, "_blank")}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {record.milestones && record.milestones.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center mb-2">
                <CheckCircleOutlined className="text-gray-400 mr-2" />
                <span className="text-sm font-medium">Project Milestones</span>
              </div>
              <Timeline className="ml-6">
                {record.milestones.map((milestone) => (
                  <Timeline.Item key={milestone.milestoneId}>
                    <div className="text-sm">
                      <div className="font-medium">{milestone.title}</div>
                      <div className="text-gray-500">
                        Timeline: {formatDate(milestone.startDate)} to{" "}
                        {formatDate(milestone.endDate)}
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          )}
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

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      // Here you would typically make an API call to update the request
      message.success("Request updated and sent back for review");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsModalVisible(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <Spin size="large" tip="Loading projects..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Error loading projects
          </h2>
          <p className="mt-2 text-gray-600">
            {error?.data?.message ||
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
        {/* Add Filter Section */}
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
              />
              <span className="text-gray-700 font-medium">Filter:</span>
              {/* filter request type */}
              <Select
                defaultValue="all"
                style={{ width: 200 }}
                onChange={setTypeFilter}
                options={REQUEST_OPTIONS}
                className="rounded-md"
              />
              {/* Add other filters as needed */}
            </div>
          </div>
        </div>
        <Card className="shadow-md">
          <Table
            columns={columns}
            dataSource={filteredRequests}
            rowKey="projectId"
            pagination={{ pageSize: 5 }}
            className="custom-table"
            rowClassName="align-top"
            locale={{ emptyText: "No pending requests found" }}
          />
        </Card>
        {/* Modal for request details if needed */}
        <Modal
          title={
            <div className="text-lg">
              <div className="font-semibold text-gray-800">Review Request</div>
              <div className="text-sm font-normal text-gray-500 mt-1">
                {selectedRequest?.projectName}
              </div>
            </div>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width={800}
          footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>,
            // <Button
            //   key="submit"
            //   type="primary"
            //   onClick={handleModalOk}
            //   className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none"
            // >
            //   Update & Send Back
            // </Button>,
          ]}
        >
          {selectedRequest && (
            <div className="max-h-[70vh] overflow-y-auto pr-2">
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
                    <div>
                      <div className="text-sm text-gray-500">Methodology</div>
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        {selectedRequest.methodology}
                      </div>
                    </div>
                  </div>
                </Collapse.Panel>
              </Collapse>

              {/* Documents Section */}
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
                  {selectedRequest.documents &&
                  selectedRequest.documents.length > 0 ? (
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
                            onClick={() => handleViewDetails(selectedRequest)}
                            className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none"
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty description="No documents available" />
                  )}
                </Collapse.Panel>
              </Collapse>

              {/* Other modal content */}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default PendingRequest;
