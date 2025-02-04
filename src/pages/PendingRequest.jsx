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

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "in review", label: "In Review" },
  { value: "revision needed", label: "Revision Needed" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
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

  // Mock data - replace with actual API call
  const pendingRequests = [
    // research request
    {
      id: 1,
      type: "Research",
      title: "AI Implementation in Healthcare",
      description:
        "Research on implementing AI solutions in healthcare diagnostics",
      objectives: [
        "Develop AI-based diagnostic tools",
        "Validate system accuracy",
        "Implement in test environments",
      ],
      datasets: [
        "Medical imaging datasets",
        "Patient records",
        "Clinical trials data",
      ],
      supervisor: {
        id: 1,
        name: "Dr. Emily Smith",
        email: "emily.smith@university.edu",
        role: "Lecturer",
      },
      group: {
        id: 1,
        name: "AI Research Group",
        members: [
          { name: "Dr. Emily Smith", role: "Leader" },
          { name: "John Doe", role: "Member" },
          { name: "Alice Wong", role: "Member" },
        ],
      },
      category: {
        id: 1,
        name: "AI & Machine Learning",
      },
      department: {
        id: 1,
        name: "Computer Science",
      },
      requestedBudget: 500000000,
      approvedBudget: null,
      projectDuration: {
        startDate: "2024-03-01",
        endDate: "2024-12-31",
      },
      projectMilestones: [
        {
          title: "Literature Review",
          deadline: "2024-04-01",
        },
        {
          title: "Data Collection",
          deadline: "2024-06-01",
        },
        {
          title: "AI Model Development",
          deadline: "2024-08-01",
        },
        {
          title: "Testing Phase",
          deadline: "2024-10-01",
        },
        {
          title: "Final Implementation",
          deadline: "2024-12-01",
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
    // Conference request with travel details
    {
      id: 2,
      type: "Conference",
      title: "Machine Learning Applications in Education",
      abstract:
        "This paper explores innovative applications of machine learning in educational technology, focusing on personalized learning systems and student performance prediction.",
      purpose:
        "To demonstrate the effectiveness of ML algorithms in improving educational outcomes through adaptive learning systems.",
      methodology:
        "Mixed-method approach combining quantitative analysis of student performance data with qualitative assessment of learning outcomes.",
      expectedOutcomes:
        "A framework for implementing ML-based adaptive learning systems in higher education.",
      keywords: [
        "Machine Learning",
        "Education Technology",
        "Adaptive Learning",
        "Student Performance",
      ],
      conferenceDetails: {
        location: "Singapore",
        presentationType: "Oral Presentation",
        publishingJournal: "Journal of Educational Technology",
        travelDetails: {
          mode: "flight",
          accommodation: "hotel",
          departureDate: "2024-04-15",
          returnDate: "2024-04-20",
          estimatedCost: 25000000,
          notes: "Requires early check-in",
        },
      },
      conferenceLead: {
        id: 1,
        name: "Dr. Emily Smith",
        email: "emily.smith@university.edu",
        role: "Lecturer",
      },
      researchTeam: {
        id: 2,
        name: "Machine Learning Lab",
        members: [
          { name: "Dr. Emily Smith", role: "Leader" },
          { name: "John Doe", role: "Member" },
          { name: "Alice Wong", role: "Member" },
        ],
      },
      category: {
        id: 1,
        name: "AI & Machine Learning",
      },
      department: {
        id: 1,
        name: "Computer Science",
      },
      requestedBudget: 150000000,
      approvedBudget: null,
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
          title: "Conference Presentation",
          deadline: "2024-04-17",
        },
        {
          title: "Final Paper Submission",
          deadline: "2024-05-30",
        },
      ],
      supportingFiles: [
        {
          uid: "1",
          name: "conference_paper_draft.pdf",
          status: "done",
          type: "Paper",
        },
        {
          uid: "2",
          name: "presentation_slides.pdf",
          status: "done",
          type: "Presentation",
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
    // Conference request without travel details
    {
      id: 3,
      type: "Conference",
      title: "Blockchain Technology in Supply Chain Management",
      abstract:
        "An analysis of blockchain implementation in modern supply chain systems, focusing on transparency and efficiency improvements.",
      purpose:
        "To present a comprehensive framework for blockchain integration in supply chain operations.",
      methodology:
        "Case study analysis of successful blockchain implementations in global supply chains.",
      expectedOutcomes:
        "A practical roadmap for organizations to implement blockchain in their supply chain operations.",
      keywords: [
        "Blockchain",
        "Supply Chain",
        "Digital Transformation",
        "Logistics",
      ],
      conferenceDetails: {
        location: "Tokyo, Japan",
        presentationType: "Poster Presentation",
        publishingJournal: "International Journal of Supply Chain Management",
      },
      conferenceLead: {
        id: 2,
        name: "Dr. James Wilson",
        email: "james.wilson@university.edu",
        role: "Lecturer",
      },
      researchTeam: {
        id: 3,
        name: "Digital Transformation Group",
        members: [
          { name: "Dr. James Wilson", role: "Leader" },
          { name: "Sarah Chen", role: "Member" },
          { name: "Michael Brown", role: "Member" },
        ],
      },
      category: {
        id: 2,
        name: "Digital Technology",
      },
      department: {
        id: 2,
        name: "Information Systems",
      },
      requestedBudget: 100000000,
      approvedBudget: null,
      projectDuration: {
        startDate: "2024-05-01",
        endDate: "2024-08-31",
      },
      projectMilestones: [
        {
          title: "Literature Review",
          deadline: "2024-05-15",
        },
        {
          title: "Methodology Development",
          deadline: "2024-06-01",
        },
        {
          title: "Data Collection & Analysis",
          deadline: "2024-07-15",
        },
        {
          title: "Poster Preparation",
          deadline: "2024-08-01",
        },
      ],
      supportingFiles: [
        {
          uid: "1",
          name: "research_proposal.pdf",
          status: "done",
          type: "Proposal",
        },
        {
          uid: "2",
          name: "preliminary_findings.pdf",
          status: "pending",
          type: "Research",
        },
      ],
      status: "pending",
      submittedBy: {
        id: 2,
        name: "Dr. James Wilson",
        email: "james.wilson@university.edu",
        role: "Lecturer",
      },
      submissionDate: "2024-02-20",
    },
    // Case Study request with company profile
    {
      id: 4,
      type: "Case Study",
      title: "Digital Transformation in Manufacturing",
      abstract:
        "A comprehensive analysis of Industry 4.0 implementation challenges and solutions in Vietnamese manufacturing sector, focusing on technology adoption and change management.",

      // Company Profile (Optional)
      companyProfile: {
        name: "TechManufacturing Corp",
        industry: "Electronics Manufacturing",
        size: "500+ employees",
        location: "Ho Chi Minh City, Vietnam",
        website: "www.techmanufacturing.com",
        contactPerson: "David Lee",
        contactEmail: "d.lee@techmanufacturing.com",
        contactPhone: "+84 123 456 789",
      },

      // Study Scope
      studyScope: {
        primaryFocus:
          "Digital transformation process and implementation strategies",
        secondaryAreas: [
          "Change management and employee adaptation",
          "Technology infrastructure assessment",
          "ROI analysis and performance metrics",
          "Supply chain integration",
        ],
        dataCollectionMethod: [
          "Semi-structured interviews",
          "Process observation",
          "Document analysis",
          "Employee surveys",
        ],
        expectedDeliverables: [
          "Detailed transformation roadmap",
          "Implementation guidelines",
          "Risk assessment report",
          "ROI projection model",
        ],
        issueDescription:
          "The company faces challenges in modernizing its manufacturing processes while maintaining operational efficiency and managing workforce transition.",
        proposedSolution:
          "A phased implementation approach combining technological upgrades with comprehensive employee training and change management programs.",
      },

      // Project Details
      caseStudyLead: {
        id: 1,
        name: "Prof. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        role: "Lecturer",
      },
      researchTeam: {
        id: 3,
        name: "Digital Transformation Research Unit",
        members: [
          { name: "Prof. Sarah Johnson", role: "Leader" },
          { name: "Dr. Michael Chen", role: "Senior Researcher" },
          { name: "David Lee", role: "Industry Liaison" },
        ],
      },
      category: {
        id: 3,
        name: "Digital Transformation",
      },
      department: {
        id: 3,
        name: "Industrial Engineering",
      },
      requestedBudget: 300000000,
      approvedBudget: null,

      // Authors Information
      authors: [
        {
          name: "Prof. Sarah Johnson",
          role: "Main Author",
          email: "sarah.johnson@university.edu",
          phone: "+84 123 456 789",
        },
        {
          name: "Dr. Michael Chen",
          role: "Co-Author",
          email: "michael.chen@university.edu",
          phone: "+84 987 654 321",
        },
      ],

      // Timeline and Milestones
      projectDuration: {
        startDate: "2024-05-01",
        endDate: "2024-08-31",
      },
      projectMilestones: [
        {
          title: "Initial Assessment and Planning",
          deadline: "2024-05-15",
        },
        {
          title: "Data Collection Phase",
          deadline: "2024-06-15",
        },
        {
          title: "Analysis and Draft Report",
          deadline: "2024-07-15",
        },
        {
          title: "Final Report and Recommendations",
          deadline: "2024-08-15",
        },
      ],

      // Supporting Documents
      supportingDocuments: [
        {
          uid: "1",
          name: "research_proposal.pdf",
          status: "done",
          type: "Proposal",
        },
        {
          uid: "2",
          name: "company_agreement.pdf",
          status: "done",
          type: "Agreement",
        },
      ],

      // Request Status Info
      status: "pending",
      submittedBy: {
        id: 1,
        name: "Prof. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        role: "Principal Investigator",
      },
      submissionDate: "2024-02-20",
    },
    // Case Study request without company profile
    {
      id: 5,
      type: "Case Study",
      title: "Sustainable Practices in Vietnamese Hospitality Industry",
      abstract:
        "An investigation into sustainable practices adoption in Vietnam's hospitality sector, focusing on environmental impact reduction and cost efficiency.",

      // Study Scope
      studyScope: {
        primaryFocus:
          "Sustainable practices implementation in hospitality services",
        secondaryAreas: [
          "Environmental impact assessment",
          "Cost-benefit analysis",
          "Staff training programs",
          "Guest satisfaction metrics",
        ],
        dataCollectionMethod: [
          "Industry surveys",
          "Expert interviews",
          "Environmental data analysis",
          "Customer feedback analysis",
        ],
        expectedDeliverables: [
          "Sustainability implementation guide",
          "Cost reduction strategies",
          "Staff training framework",
          "Performance measurement toolkit",
        ],
        issueDescription:
          "Need to identify and implement cost-effective sustainable practices while maintaining service quality and guest satisfaction.",
        proposedSolution:
          "Development of a comprehensive sustainability framework tailored for Vietnamese hospitality sector.",
      },

      // Project Details
      caseStudyLead: {
        id: 2,
        name: "Dr. Lisa Nguyen",
        email: "lisa.nguyen@university.edu",
        role: "Research Director",
      },
      researchTeam: {
        id: 4,
        name: "Sustainable Hospitality Research Group",
        members: [
          { name: "Dr. Lisa Nguyen", role: "Leader" },
          { name: "Prof. John Smith", role: "Senior Advisor" },
          { name: "Maria Garcia", role: "Research Associate" },
        ],
      },
      category: {
        id: 4,
        name: "Sustainability",
      },
      department: {
        id: 4,
        name: "Hospitality Management",
      },
      requestedBudget: 250000000,
      approvedBudget: null,

      // Authors Information
      authors: [
        {
          name: "Dr. Lisa Nguyen",
          role: "Main Author",
          email: "lisa.nguyen@university.edu",
          phone: "+84 123 789 456",
        },
        {
          name: "Prof. John Smith",
          role: "Co-Author",
          email: "john.smith@university.edu",
          phone: "+84 789 456 123",
        },
        {
          name: "Maria Garcia",
          role: "Contributing Author",
          email: "maria.garcia@university.edu",
          phone: "+84 456 123 789",
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
          title: "Industry Survey and Interviews",
          deadline: "2024-07-31",
        },
        {
          title: "Data Analysis",
          deadline: "2024-09-30",
        },
        {
          title: "Framework Development",
          deadline: "2024-10-31",
        },
        {
          title: "Final Report and Recommendations",
          deadline: "2024-11-15",
        },
      ],

      // Supporting Documents
      supportingDocuments: [
        {
          uid: "1",
          name: "research_methodology.pdf",
          status: "done",
          type: "Methodology",
        },
        {
          uid: "2",
          name: "preliminary_findings.pdf",
          status: "done",
          type: "Research",
        },
      ],

      // Request Status Info
      status: "pending",
      submittedBy: {
        id: 2,
        name: "Dr. Lisa Nguyen",
        email: "lisa.nguyen@university.edu",
        role: "Research Director",
      },
      submissionDate: "2024-02-25",
    },
  ];

  // Add filter function
  useEffect(() => {
    const filtered = pendingRequests.filter((request) =>
      statusFilter === "all" ? true : request.status === statusFilter
    );
    setFilteredRequests(filtered);
  }, [statusFilter]);

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
            <p className="text-sm text-gray-500">{record.description}</p>
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
          <div className="text-sm">
            <span className="text-gray-600">Supervisor: </span>
            <span className="font-medium">
              {record.supervisor?.name ||
                record.conferenceLead?.name ||
                "Not Assigned"}
            </span>
          </div>
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
                  ₫{record.requestedBudget?.toLocaleString() || "0"}
                </span>
              </div>
              {record.approvedBudget && (
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Approved Budget</span>
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
    return (
      <div>
        {/* Group Information */}
        <div className="mt-3 mb-4 bg-gray-50 p-3 rounded-lg">
          <div className="text-sm font-medium mb-2">
            <TeamOutlined className="mr-2 text-blue-500" />
            Research Group: {record.group.name}
          </div>
          <div className="space-y-1">
            {record.group.members.map((member, idx) => (
              <div key={idx} className="text-sm flex items-center space-x-2">
                <UserOutlined className="text-gray-400" />
                <span>{member.name}</span>
                <Tag color={member.role === "Leader" ? "gold" : "default"}>
                  {member.role}
                </Tag>
              </div>
            ))}
          </div>
        </div>

        {/* Type-specific details */}
        {record.type === "Research" && (
          <div className="mt-4 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              Research Details
            </h4>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Objectives:</span>
                <ul className="list-disc list-inside text-sm ml-2">
                  {record.objectives.map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>
              </p>
              <div className="text-sm">
                <span className="font-medium">Datasets:</span>
                <ul className="list-disc list-inside ml-2">
                  {record.datasets.map((dataset, idx) => (
                    <li key={idx}>{dataset}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {record.type === "Conference" && (
          <div className="mt-4 bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">
              Conference Details
            </h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Location:</span>{" "}
                {record.conferenceDetails.location}
              </p>
              <p>
                <span className="font-medium">Presentation Type:</span>{" "}
                {record.conferenceDetails.presentationType}
              </p>
              <div>
                <span className="font-medium">Travel Details:</span>
                <ul className="list-disc list-inside ml-2">
                  <li>
                    Duration: {record.conferenceDetails.travelDetails.duration}
                  </li>
                  <li>
                    Accommodation:{" "}
                    {record.conferenceDetails.travelDetails.accommodation}
                  </li>
                  <li>
                    Transport:{" "}
                    {record.conferenceDetails.travelDetails.transportationType}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {record.type === "Case Study" && (
          <div className="mt-4 bg-amber-50 p-4 rounded-lg">
            <h4 className="font-semibold text-amber-800 mb-2">
              Case Study Details
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Company Profile:</span>
                <ul className="list-disc list-inside ml-2">
                  <li>Name: {record.companyProfile.name}</li>
                  <li>Industry: {record.companyProfile.industry}</li>
                  <li>Size: {record.companyProfile.size}</li>
                </ul>
              </div>
              <div>
                <span className="font-medium">Study Scope:</span>
                <p className="ml-2">
                  Primary: {record.studyScope.primaryFocus}
                </p>
                <ul className="list-disc list-inside ml-2">
                  {record.studyScope.secondaryAreas.map((scope, idx) => (
                    <li key={idx}>{scope}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
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
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Filter:</span>
              <Select
                defaultValue="all"
                style={{ width: 200 }}
                onChange={setStatusFilter}
                options={STATUS_OPTIONS}
                className="rounded-md"
              />
            </div>
            {/* view for all status */}
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
          onOk={handleModalOk}
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
                  <div>
                    <div className="text-sm text-gray-500">Abstract</div>
                    <div className="mt-1">{selectedRequest?.abstract}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Type</div>
                      <Tag color="blue" className="mt-1">
                        {selectedRequest?.type}
                      </Tag>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Status</div>
                      <Tag
                        color={STATUS_COLORS[selectedRequest?.status]}
                        className="mt-1"
                      >
                        {selectedRequest?.status}
                      </Tag>
                    </div>
                  </div>
                </div>
              </Collapse.Panel>
            </Collapse>

            {/* Type Specific Details */}
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
                {selectedRequest?.type === "Conference" && (
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">
                        Conference Details
                      </div>
                      <div className="mt-2 space-y-2">
                        <div>
                          <strong>Location:</strong>{" "}
                          {selectedRequest?.conferenceDetails?.location}
                        </div>
                        <div>
                          <strong>Presentation Type:</strong>{" "}
                          {selectedRequest?.conferenceDetails?.presentationType}
                        </div>
                        <div>
                          <strong>Publishing Journal:</strong>{" "}
                          {
                            selectedRequest?.conferenceDetails
                              ?.publishingJournal
                          }
                        </div>
                      </div>
                    </div>
                    {selectedRequest?.conferenceDetails?.travelDetails && (
                      <div>
                        <div className="text-sm text-gray-500 mt-4">
                          Travel Details
                        </div>
                        <div className="mt-2 space-y-2">
                          <div>
                            <strong>Mode:</strong>{" "}
                            {
                              selectedRequest?.conferenceDetails?.travelDetails
                                ?.mode
                            }
                          </div>
                          <div>
                            <strong>Accommodation:</strong>{" "}
                            {
                              selectedRequest?.conferenceDetails?.travelDetails
                                ?.accommodation
                            }
                          </div>
                          <div>
                            <strong>Travel Dates:</strong>{" "}
                            {formatDate(
                              selectedRequest?.conferenceDetails?.travelDetails
                                ?.departureDate
                            )}{" "}
                            -{" "}
                            {formatDate(
                              selectedRequest?.conferenceDetails?.travelDetails
                                ?.returnDate
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedRequest?.type === "Case Study" && (
                  <div className="space-y-4">
                    {selectedRequest?.companyProfile && (
                      <div>
                        <div className="text-sm text-gray-500">
                          Company Profile
                        </div>
                        <div className="mt-2 space-y-2">
                          <div>
                            <strong>Company:</strong>{" "}
                            {selectedRequest?.companyProfile?.name}
                          </div>
                          <div>
                            <strong>Industry:</strong>{" "}
                            {selectedRequest?.companyProfile?.industry}
                          </div>
                          <div>
                            <strong>Size:</strong>{" "}
                            {selectedRequest?.companyProfile?.size}
                          </div>
                          <div>
                            <strong>Contact:</strong>{" "}
                            {selectedRequest?.companyProfile?.contactPerson}
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-gray-500 mt-4">
                        Study Scope
                      </div>
                      <div className="mt-2 space-y-2">
                        <div>
                          <strong>Primary Focus:</strong>{" "}
                          {selectedRequest?.studyScope?.primaryFocus}
                        </div>
                        <div>
                          <strong>Secondary Areas:</strong>
                          <ul className="list-disc ml-5 mt-1">
                            {selectedRequest?.studyScope?.secondaryAreas?.map(
                              (area, index) => (
                                <li key={index}>{area}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Collapse.Panel>
            </Collapse>

            {/* Team Information */}
            <Collapse className="mb-4">
              <Collapse.Panel
                header={
                  <div className="flex items-center">
                    <TeamOutlined className="text-[#F2722B] mr-2" />
                    <span className="font-medium">Team Information</span>
                  </div>
                }
                key="1"
              >
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Research Team</div>
                    <div className="mt-2">
                      {selectedRequest?.researchTeam?.members?.map(
                        (member, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 mb-2"
                          >
                            <UserOutlined className="text-gray-400" />
                            <span>{member.name}</span>
                            <Tag
                              color={
                                member.role === "Leader" ? "gold" : "default"
                              }
                            >
                              {member.role}
                            </Tag>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Authors</div>
                    <div className="mt-2">
                      {selectedRequest?.authors?.map((author, index) => (
                        <div key={index} className="mb-3">
                          <div className="font-medium">{author.name}</div>
                          <div className="text-sm text-gray-500">
                            <div>{author.role}</div>
                            <div>{author.email}</div>
                            <div>{author.phone}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Collapse.Panel>
            </Collapse>

            {/* Timeline and Milestones */}
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
