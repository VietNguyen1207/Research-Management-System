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
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

const STATUS_COLORS = {
  pending: "gold",
  approved: "green",
  rejected: "red",
  "in review": "blue",
  "revision needed": "orange",
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
  { value: "research", label: "Research" },
  { value: "conference", label: "Conference" },
  { value: "case study", label: "Case Study" },
  // { value: "approved", label: "Approved" },
  // { value: "rejected", label: "Rejected" },
];

// department
const DEPARTMENT_OPTIONS = [
  { value: "all", label: "All Department" },
  { value: "information technology", label: "Information Technology" },
  { value: "computer science", label: "Computer Science" },
  { value: "software engineering", label: "Software Engineering" },
  // { value: "approved", label: "Approved" },
  // { value: "rejected", label: "Rejected" },
];

// category
const CATEGORY_OPTIONS = [
  { value: "all", label: "All Category" },
  { value: "ai & machine learning", label: "AI & Machine Learning" },
  { value: "data science", label: "Data Science" },
  { value: "cybersecurity", label: "Cybersecurity" },
  // { value: "approved", label: "Approved" },
  // { value: "rejected", label: "Rejected" },
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

const PendingRequest = () => {
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.auth);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Mock data - replace with actual API call
  const pendingRequests = [
    {
      id: 1,
      type: "Research",
      title: "AI-Driven Healthcare Solutions",
      description:
        "A comprehensive study on implementing AI solutions in healthcare systems to improve patient care and operational efficiency.",

      // Project Details
      objectives: [
        "Develop AI algorithms for patient diagnosis",
        "Optimize hospital resource allocation",
        "Improve healthcare data management systems",
      ],
      // methodology:
      //   "The research employs a mixed-methods approach combining quantitative analysis of healthcare data with qualitative assessment of system implementation. Machine learning algorithms will be developed using Python and TensorFlow, followed by rigorous testing in simulated healthcare environments.",
      // innovative_aspects:
      //   "This research introduces novel deep learning architectures specifically designed for healthcare diagnostics, incorporating attention mechanisms for interpretable AI decisions. The system will be the first to integrate real-time patient monitoring with predictive analytics.",
      // research_subjects:
      //   "The study will involve analysis of anonymized patient records, healthcare practitioners' workflow patterns, and hospital resource utilization data. Primary subjects include medical staff, hospital administrators, and healthcare IT systems.",
      // research_scope:
      //   "The research encompasses three major city hospitals in Vietnam, focusing on emergency departments and chronic disease management units. The scope includes data collection, algorithm development, system implementation, and performance evaluation over a 12-month period.",
      // scientific_significance:
      //   "This research advances the field of medical AI by developing new algorithms for healthcare-specific applications, contributing to the broader understanding of AI implementation in critical care settings. The findings will establish new methodologies for integrating AI systems in healthcare environments.",
      // practical_significance:
      //   "The outcomes will directly improve patient care through faster diagnosis, optimized resource allocation, and reduced medical errors. Healthcare institutions can expect improved operational efficiency and cost reduction, while patients benefit from more accurate and timely medical interventions.",
      dataset: {
        type: "Healthcare Records",
        size: "50,000 patient records",
        format: "Structured and unstructured medical data",
        source: "Partner hospitals and medical institutions",
      },
      department: {
        id: 1,
        name: "Computer Science",
      },
      category: {
        id: 1,
        name: "AI & Machine Learning",
      },
      requestedBudget: 500000000,
      approvedBudget: null,

      // Team Members
      supervisor: {
        id: 1,
        name: "Prof. John Smith",
        email: "john.smith@university.edu",
        role: "Research Supervisor",
      },
      researchGroup: {
        id: 1,
        name: "AI Research Group",
        members: [
          { name: "Dr. Emily Smith", role: "Leader" },
          { name: "John Doe", role: "Member" },
        ],
      },

      // Timeline and Milestones
      projectDuration: {
        startDate: "2024-03-01",
        endDate: "2025-02-28",
      },
      projectMilestones: [
        {
          title: "Literature Review",
          deadline: "2024-04-30",
        },
        {
          title: "Data Collection",
          deadline: "2024-07-31",
        },
        {
          title: "Algorithm Development",
          deadline: "2024-11-30",
        },
        {
          title: "Testing and Validation",
          deadline: "2025-01-31",
        },
        {
          title: "Final Report",
          deadline: "2025-02-28",
        },
      ],

      status: "pending",
      submittedBy: {
        id: 1,
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        role: "Lead Researcher",
      },
      submissionDate: "2024-02-15",
    },
    // Simplified Conference request
    {
      id: 2,
      type: "Conference",
      title: "Machine Learning Applications in Education",
      abstract:
        "This paper explores innovative applications of machine learning in educational technology, focusing on personalized learning systems and student performance prediction.",
      publisher: "IEEE Transactions on Education",

      // Project Details
      department: {
        id: 1,
        name: "Computer Science",
      },
      category: {
        id: 1,
        name: "AI & Machine Learning",
      },
      paperType: {
        id: 1,
        name: "Conference",
      },
      requestedBudget: 150000000,
      approvedBudget: null,

      // Author Information
      authors: [
        {
          name: "Dr. Emily Smith",
          role: "Main Author",
          email: "emily.smith@university.edu",
        },
        {
          name: "Dr. Michael Chen",
          role: "Co-Author",
          email: "michael.chen@university.edu",
        },
      ],

      // Timeline and Milestones
      projectDuration: {
        startDate: "2024-03-01",
        endDate: "2024-06-30",
      },
      projectMilestones: [
        {
          title: "Paper Draft Completion",
          deadline: "2024-03-15",
        },
        {
          title: "Internal Review",
          deadline: "2024-04-01",
        },
        {
          title: "Final Paper Submission",
          deadline: "2024-05-30",
        },
      ],

      status: "pending",
      submittedBy: {
        id: 1,
        name: "Dr. Emily Smith",
        email: "emily.smith@university.edu",
        role: "Lecturer",
      },
      submissionDate: "2024-02-15",
    },
    // Simplified Journal request
    {
      id: 3,
      type: "Journal",
      title: "Digital Transformation in Manufacturing",
      abstract:
        "A comprehensive analysis of Industry 4.0 implementation challenges and solutions in Vietnamese manufacturing sector.",
      publisher: "Journal of Manufacturing Technology Management",

      // Project Details
      department: {
        id: 2,
        name: "Information Technology",
      },
      category: {
        id: 5,
        name: "Digital Technology",
      },
      paperType: {
        id: 2,
        name: "Journal",
      },
      requestedBudget: 250000000,
      approvedBudget: null,

      // Author Information
      authors: [
        {
          name: "Prof. Sarah Johnson",
          role: "Main Author",
          email: "sarah.johnson@university.edu",
        },
        {
          name: "Dr. Lisa Nguyen",
          role: "Co-Author",
          email: "lisa.nguyen@university.edu",
        },
      ],

      // Timeline and Milestones
      projectDuration: {
        startDate: "2024-06-01",
        endDate: "2024-11-30",
      },
      projectMilestones: [
        {
          title: "Research Design and Planning",
          deadline: "2024-06-15",
        },
        {
          title: "Data Analysis",
          deadline: "2024-09-30",
        },
        {
          title: "Final Report",
          deadline: "2024-11-15",
        },
      ],

      status: "pending",
      submittedBy: {
        id: 2,
        name: "Prof. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        role: "Research Director",
      },
      submissionDate: "2024-02-25",
    },
  ];

  // Add filter function
  useEffect(() => {
    const filtered = pendingRequests.filter((request) => {
      const matchesStatus =
        statusFilter === "all" ? true : request.status === statusFilter;
      const matchesSearch =
        searchText.toLowerCase() === ""
          ? true
          : request.title?.toLowerCase().includes(searchText.toLowerCase()) ||
            request.description
              ?.toLowerCase()
              .includes(searchText.toLowerCase()) ||
            request.type?.toLowerCase().includes(searchText.toLowerCase()) ||
            request.department?.name
              ?.toLowerCase()
              .includes(searchText.toLowerCase()) ||
            request.category?.name
              ?.toLowerCase()
              .includes(searchText.toLowerCase());
      return matchesStatus && matchesSearch;
    });
    setFilteredRequests(filtered);
  }, [statusFilter, searchText]);

  const columns = [
    {
      title: "Basic Information",
      key: "basic",
      width: "40%",
      render: (_, record) => (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium text-gray-900">
              {record.title}
            </h4>
            <p className="text-sm text-gray-500">{record.abstract}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Tag color="blue">{record.type}</Tag>
            {record.department && (
              <Tag color="green">{record.department.name}</Tag>
            )}
            {record.category && (
              <Tag color="orange">{record.category.name}</Tag>
            )}
          </div>

          {/* Show Supervisor only for Research type */}
          {record.type === "Research" && (
            <div className="text-sm">
              <span className="text-gray-600">Supervisor: </span>
              <span className="font-medium">
                {record.supervisor?.name || "Not Assigned"}
              </span>
            </div>
          )}

          <Divider className="my-3" />

          <div className="space-y-2">
            <div className="flex items-center">
              <UserOutlined className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Submitted by: </span>
              <span className="text-sm font-medium ml-1">
                {record.submittedBy?.name || "Unknown"}
              </span>
            </div>
            <div className="text-sm text-gray-500 ml-6">
              <div>{record.submittedBy?.email}</div>
              <div>{record.submittedBy?.role}</div>
              <div>Submitted on: {formatDate(record.submissionDate)}</div>
            </div>
          </div>

          {/* Show Publisher only for Conference and Journal types */}
          {(record.type === "Conference" || record.type === "Journal") && (
            <div className="flex items-center mt-2">
              <GlobalOutlined className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Publisher: </span>
              <span className="text-sm font-medium ml-1">
                {record.publisher}
              </span>
            </div>
          )}

          {/* Show Authors only for Conference and Journal types */}
          {(record.type === "Conference" || record.type === "Journal") &&
            record.authors && (
              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">Authors:</div>
                <div className="space-y-2">
                  {record.authors.map((author, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <TeamOutlined className="text-gray-400 mt-1" />
                      <div>
                        <div className="text-sm font-medium">{author.name}</div>
                        <div className="text-sm text-gray-500">
                          {author.role}
                        </div>
                        <div className="text-sm text-gray-500">
                          {author.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                <span className="text-sm text-gray-600">
                  {record.type === "Research"
                    ? "Requested Budget"
                    : "Requested Royalties"}
                </span>
                <span className="text-sm font-medium">
                  ₫{record.requestedBudget?.toLocaleString() || "0"}
                </span>
              </div>
              {record.approvedBudget && (
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    {record.type === "Research"
                      ? "Approved Budget"
                      : "Approved Royalties"}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    ₫{record.approvedBudget.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <CalendarOutlined className="text-gray-400 mr-2" />
            <div className="text-sm">
              <span className="text-gray-600">Timeline: </span>
              <span className="font-medium">
                {record.projectDuration
                  ? `${formatDate(
                      record.projectDuration.startDate
                    )} to ${formatDate(record.projectDuration.endDate)}`
                  : "Not specified"}
              </span>
            </div>
          </div>

          {record.projectMilestones && record.projectMilestones.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center mb-2">
                <CheckCircleOutlined className="text-gray-400 mr-2" />
                <span className="text-sm font-medium">Project Milestones</span>
              </div>
              <Timeline className="ml-6">
                {record.projectMilestones.map((milestone, index) => (
                  <Timeline.Item key={index}>
                    <div className="text-sm">
                      <div className="font-medium">{milestone.title}</div>
                      <div className="text-gray-500">
                        Deadline: {formatDate(milestone.deadline)}
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
      render: (_, record) => (
        <Tag color={STATUS_COLORS[record.status.toLowerCase()]}>
          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      render: (_, record) => (
        <Space direction="vertical" className="w-full">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="w-full bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none"
          >
            Review & Adjust
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record)}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none"
          >
            Approve As Is
          </Button>
          <Button
            type="primary"
            danger
            icon={<CloseOutlined />}
            onClick={() => handleDecline(record)}
            className="w-full"
          >
            Decline
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (request) => {
    setSelectedRequest(request);
    form.setFieldsValue({
      budget: request.approvedBudget || request.requestedBudget,
      timeline: request.timeline,
      notes: "",
    });
    setIsModalVisible(true);
  };

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

  const handleApprove = (request) => {
    Modal.confirm({
      title: "Approve Request",
      content: "Are you sure you want to approve this request as is?",
      onOk: () => {
        message.success(
          `${request.type} request "${request.title}" has been approved`
        );
      },
    });
  };

  const handleDecline = (request) => {
    Modal.confirm({
      title: "Decline Request",
      content: "Are you sure you want to decline this request?",
      okType: "danger",
      onOk: () => {
        message.error(
          `${request.type} request "${request.title}" has been declined`
        );
      },
    });
  };

  const renderTypeSpecificDetails = (record) => {
    if (record.type === "Journal") {
      return (
        <div className="mt-4 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Journal Details</h4>
          {/* ... rest of the journal-specific details ... */}
        </div>
      );
    }

    if (record.type === "Conference") {
      return (
        <div className="mt-4 bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">
            Conference Details
          </h4>
          {/* ... rest of the conference-specific details ... */}
        </div>
      );
    }

    return null;
  };

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
              {/* filter status */}
              <Select
                defaultValue="all"
                style={{ width: 200 }}
                onChange={setStatusFilter}
                options={STATUS_OPTIONS}
                className="rounded-md"
              />
              {/* filter request type */}
              <Select
                defaultValue="all"
                style={{ width: 200 }}
                onChange={setStatusFilter}
                options={REQUEST_OPTIONS}
                className="rounded-md"
              />
              {/* filter department */}
              <Select
                defaultValue="all"
                style={{ width: 200 }}
                onChange={setStatusFilter}
                options={DEPARTMENT_OPTIONS}
                className="rounded-md"
              />
              {/* filter category */}
              <Select
                defaultValue="all"
                style={{ width: 200 }}
                onChange={setStatusFilter}
                options={CATEGORY_OPTIONS}
                className="rounded-md"
              />
            </div>

            {/* Status Legend */}
            {/* <div className="flex items-center space-x-2">
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <Tag key={status} color={color} className="capitalize">
                  {status}
                </Tag>
              ))}
            </div> */}
          </div>
        </div>
        <Card className="shadow-md">
          <Table
            columns={columns}
            dataSource={filteredRequests}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            className="custom-table"
            rowClassName="align-top"
          />
        </Card>
        {/* Modals for request details */}
        <Modal
          title={
            <div className="text-lg">
              <div className="font-semibold text-gray-800">
                Review & Adjust Request
              </div>
              <div className="text-sm font-normal text-gray-500 mt-1">
                {selectedRequest?.title}
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
            <Button
              key="submit"
              type="primary"
              onClick={handleModalOk}
              className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] hover:from-[#F2722B] hover:to-[#FFA500] border-none"
            >
              Update & Send Back
            </Button>,
          ]}
        >
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            {selectedRequest?.type === "Research" ? (
              // Original Research Request Modal Content
              <>
                {/* Basic Information Section */}
                <Collapse defaultActiveKey={["1"]} className="mb-4">
                  <Collapse.Panel
                    header={
                      <div className="flex items-center">
                        <InfoCircleOutlined className="text-[#F2722B] mr-2" />
                        <span className="font-medium">Basic Information</span>
                      </div>
                    }
                    key="1"
                  >
                    <div className="space-y-4">
                      {/* Project Title */}
                      <div>
                        <div className="text-sm text-gray-500">
                          Project Title
                        </div>
                        <div className="mt-1 font-medium text-gray-800">
                          {selectedRequest?.title}
                        </div>
                      </div>

                      {/* Project Description */}
                      <div>
                        <div className="text-sm text-gray-500">
                          Project Description
                        </div>
                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                          {selectedRequest?.description}
                        </div>
                      </div>
                    </div>
                  </Collapse.Panel>
                </Collapse>

                {/* Project Details Section */}
                <Collapse className="mb-4">
                  <Collapse.Panel
                    header={
                      <div className="flex items-center">
                        <ProjectOutlined className="text-[#F2722B] mr-2" />
                        <span className="font-medium">Project Details</span>
                      </div>
                    }
                    key="1"
                  >
                    <div className="space-y-4">
                      {/* Project Objectives */}
                      <div>
                        <div className="text-sm text-gray-500">
                          Project Objectives
                        </div>
                        <div className="mt-2 space-y-2">
                          {selectedRequest?.objectives?.map(
                            (objective, index) => (
                              <div
                                key={index}
                                className="flex items-start space-x-3 bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors"
                              >
                                <CheckOutlined className="text-[#F2722B] mt-1" />
                                <span className="text-gray-700">
                                  {objective}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Dataset Information */}
                      <div>
                        <div className="text-sm text-gray-500">Dataset</div>
                      </div>

                      {/* Department and Category */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">
                            Department
                          </div>
                          <Tag color="green" className="mt-1">
                            {selectedRequest?.department?.name}
                          </Tag>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Category</div>
                          <Tag color="orange" className="mt-1">
                            {selectedRequest?.category?.name}
                          </Tag>
                        </div>
                      </div>

                      {/* Budget Information */}
                      <div>
                        <div className="text-sm text-gray-500">
                          Budget Details
                        </div>
                        <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Requested Budget:
                            </span>
                            <span className="font-medium">
                              ₫
                              {selectedRequest?.requestedBudget?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Collapse.Panel>
                </Collapse>

                {/* Team Members Section */}
                <Collapse className="mb-4">
                  <Collapse.Panel
                    header={
                      <div className="flex items-center">
                        <TeamOutlined className="text-[#F2722B] mr-2" />
                        <span className="font-medium">Team Members</span>
                      </div>
                    }
                    key="1"
                  >
                    <div className="space-y-6">
                      {/* Supervisor */}
                      <div>
                        <div className="text-sm text-gray-500 mb-3">
                          Supervisor
                        </div>
                        <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                          <UserOutlined className="text-[#F2722B] mt-1" />
                          <div>
                            <div className="font-medium text-gray-800">
                              {selectedRequest?.supervisor?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {selectedRequest?.supervisor?.role}
                            </div>
                            <div className="text-sm text-gray-500">
                              {selectedRequest?.supervisor?.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Research Group */}
                      <div>
                        <div className="text-sm text-gray-500 mb-3">
                          Research Group
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-4">
                            <TeamOutlined className="text-[#F2722B] mr-2" />
                            <span className="font-medium text-gray-800">
                              {selectedRequest?.researchGroup?.name}
                            </span>
                          </div>

                          <div className="space-y-3 ml-2">
                            {selectedRequest?.researchGroup?.members.map(
                              (member, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-white p-3 rounded-md"
                                >
                                  <div className="flex items-center space-x-3">
                                    {member.role === "Leader" ? (
                                      <CrownOutlined className="text-[#F2722B]" />
                                    ) : (
                                      <UserOutlined className="text-gray-400" />
                                    )}
                                    <span>{member.name}</span>
                                    <Tag
                                      color={
                                        member.role === "Leader"
                                          ? "orange"
                                          : "default"
                                      }
                                      className="rounded-full"
                                    >
                                      {member.role}
                                    </Tag>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Collapse.Panel>
                </Collapse>
                {/* Review Form - Type specific */}
                <Form form={form} layout="vertical" className="mt-4">
                  <Form.Item
                    label="Adjusted Budget (VND)"
                    name="budget"
                    rules={[
                      { required: true, message: "Please input the budget!" },
                    ]}
                  >
                    <InputNumber
                      className="w-full"
                      formatter={(value) =>
                        ` ${value} vn₫`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/₫\s?|(,*)/g, "")}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Timeline Adjustment"
                    name="timeline"
                    rules={[
                      { required: true, message: "Please select timeline!" },
                    ]}
                  >
                    <RangePicker className="w-full" />
                  </Form.Item>

                  <Form.Item
                    label="Feedback Notes"
                    name="notes"
                    rules={[
                      { required: true, message: "Please provide feedback!" },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Provide feedback about the adjustments..."
                    />
                  </Form.Item>
                </Form>
              </>
            ) : (
              // Conference and Journal Modal Content
              <>
                {/* Basic Information Section */}
                <Collapse defaultActiveKey={["1"]} className="mb-4">
                  <Collapse.Panel
                    header={
                      <div className="flex items-center">
                        <InfoCircleOutlined className="text-[#F2722B] mr-2" />
                        <span className="font-medium">Basic Information</span>
                      </div>
                    }
                    key="1"
                  >
                    <div className="space-y-4">
                      {/* Paper Title */}
                      <div>
                        <div className="text-sm text-gray-500">Paper Title</div>
                        <div className="mt-1 font-medium text-gray-800">
                          {selectedRequest?.title}
                        </div>
                      </div>

                      {/* Abstract */}
                      <div>
                        <div className="text-sm text-gray-500">Abstract</div>
                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                          {selectedRequest?.abstract}
                        </div>
                      </div>

                      {/* Publisher */}
                      <div>
                        <div className="text-sm text-gray-500">Publisher</div>
                        <div className="mt-1 font-medium text-gray-800">
                          {selectedRequest?.publisher}
                        </div>
                      </div>
                    </div>
                  </Collapse.Panel>
                </Collapse>

                {/* Project Details Section */}
                <Collapse className="mb-4">
                  <Collapse.Panel
                    header={
                      <div className="flex items-center">
                        <ProjectOutlined className="text-[#F2722B] mr-2" />
                        <span className="font-medium">Project Details</span>
                      </div>
                    }
                    key="1"
                  >
                    <div className="space-y-4">
                      {/* Department and Category */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">
                            Department
                          </div>
                          <Tag color="green" className="mt-1">
                            {selectedRequest?.department?.name}
                          </Tag>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Category</div>
                          <Tag color="orange" className="mt-1">
                            {selectedRequest?.category?.name}
                          </Tag>
                        </div>
                      </div>

                      {/* Paper Type and Royalties */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">
                            Paper Type
                          </div>
                          <Tag color="blue" className="mt-1">
                            {selectedRequest?.paperType?.name}
                          </Tag>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Royalties</div>
                          <div className="mt-1 font-medium text-gray-800">
                            ₫
                            {selectedRequest?.requestedBudget?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Collapse.Panel>
                </Collapse>

                {/* Authors Information Section */}
                <Collapse className="mb-4">
                  <Collapse.Panel
                    header={
                      <div className="flex items-center">
                        <TeamOutlined className="text-[#F2722B] mr-2" />
                        <span className="font-medium">Authors Information</span>
                      </div>
                    }
                    key="1"
                  >
                    <div className="space-y-4">
                      {selectedRequest?.authors?.map((author, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <UserOutlined className="text-gray-400 mt-1" />
                          <div>
                            <div className="font-medium text-gray-800">
                              {author.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {author.role}
                            </div>
                            <div className="text-sm text-gray-500">
                              {author.email}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Collapse.Panel>
                </Collapse>
              </>
            )}

            {/* Timeline and Milestones - Common for all types */}
            <Collapse className="mb-4">
              <Collapse.Panel
                header={
                  <div className="flex items-center">
                    <CalendarOutlined className="text-[#F2722B] mr-2" />
                    <span className="font-medium">Timeline and Milestones</span>
                  </div>
                }
                key="1"
              >
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">
                      Project Duration
                    </div>
                    <div className="mt-2">
                      {formatDate(selectedRequest?.projectDuration?.startDate)}{" "}
                      - {formatDate(selectedRequest?.projectDuration?.endDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Milestones</div>
                    <Timeline className="mt-4">
                      {selectedRequest?.projectMilestones?.map(
                        (milestone, index) => (
                          <Timeline.Item key={index}>
                            <div className="font-medium">{milestone.title}</div>
                            <div className="text-sm text-gray-500">
                              Deadline: {formatDate(milestone.deadline)}
                            </div>
                          </Timeline.Item>
                        )
                      )}
                    </Timeline>
                  </div>
                </div>
              </Collapse.Panel>
            </Collapse>

            {/* Review Form */}
            <Form form={form} layout="vertical" className="mt-4">
              {selectedRequest?.type === "Research" ? (
                <Form.Item
                  label="Adjust Budget (VND)"
                  name="budget"
                  rules={[
                    { required: true, message: "Please input the budget!" },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    formatter={(value) =>
                      ` ${value} vn₫`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/₫\s?|(,*)/g, "")}
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  label="Adjust Royalties (VND)"
                  name="royalties"
                  rules={[
                    { required: true, message: "Please input the royalties!" },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    formatter={(value) =>
                      ` ${value} ₫`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/₫\s?|(,*)/g, "")}
                  />
                </Form.Item>
              )}

              <Form.Item
                label="Timeline Adjustment"
                name="timeline"
                rules={[{ required: true, message: "Please select timeline!" }]}
              >
                <RangePicker className="w-full" />
              </Form.Item>

              <Form.Item
                label="Feedback Notes"
                name="notes"
                rules={[
                  { required: true, message: "Please provide feedback!" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Provide feedback about the adjustments..."
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PendingRequest;
