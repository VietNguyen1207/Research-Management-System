import React, { useState } from "react";
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
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

const PendingRequest = () => {
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.auth);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Mock data - replace with actual API call
  const pendingRequests = [
    {
      id: 1,
      type: "Research",
      title: "AI Implementation in Healthcare",
      requestedBudget: 500000000,
      approvedBudget: null,
      timeline: ["2024-03-01", "2024-12-31"],
      status: "pending",
      department: "Computer Science",
      description:
        "Research on implementing AI solutions in healthcare diagnostics",
      submittedBy: {
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
      researchDetails: {
        objectives: [
          "Develop AI-based diagnostic tools",
          "Validate system accuracy",
          "Implement in test environments",
        ],
        expectedOutcomes: "Improved diagnostic accuracy by 40%",
        datasets: [
          "Medical imaging datasets",
          "Patient records",
          "Clinical trials data",
        ],
      },
    },
    {
      id: 2,
      type: "Conference",
      title: "Machine Learning Applications in Education",
      requestedBudget: 150000000,
      approvedBudget: null,
      timeline: ["2024-04-01", "2024-05-31"],
      status: "pending",
      department: "Education Technology",
      description:
        "Conference paper on ML applications in educational settings",
      submittedBy: {
        name: "John Doe",
        email: "john.doe@university.edu",
        role: "Student",
      },
      group: {
        id: 2,
        name: "Machine Learning Lab",
        members: [
          { name: "Prof. Sarah Johnson", role: "Leader" },
          { name: "John Doe", role: "Member" },
          { name: "Michael Chen", role: "Member" },
        ],
      },
      authors: [
        {
          name: "John Doe",
          role: "Main Author",
          email: "john.doe@university.edu",
          phone: "+84 123 456 789",
        },
      ],
      // Conference-specific attributes
      conferenceDetails: {
        location: "Singapore",
        presentationType: "Oral Presentation",
        publishingJournal: "Journal of Educational Technology",
        travelDetails: {
          duration: "5 days",
          accommodation: "Conference Hotel",
          transportationType: "International Flight",
          notes: "Requires early check-in",
        },
      },
    },
    {
      id: 3,
      type: "Case Study",
      title: "Digital Transformation in Manufacturing",
      requestedBudget: 300000000,
      approvedBudget: null,
      timeline: ["2024-05-01", "2024-08-31"],
      status: "pending",
      department: "Industrial Engineering",
      description:
        "Analysis of Industry 4.0 implementation in Vietnamese manufacturing",
      submittedBy: {
        name: "Prof. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        role: "Lecturer",
      },
      group: {
        id: 3,
        name: "Digital Transformation Research Unit",
        members: [
          { name: "Prof. Sarah Johnson", role: "Leader" },
          { name: "Dr. Michael Chen", role: "Member" },
          { name: "David Lee", role: "Member" },
        ],
      },
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
      // Case Study-specific attributes
      caseStudyDetails: {
        companyProfile: {
          name: "TechManufacturing Corp",
          industry: "Electronics Manufacturing",
          size: "500+ employees",
          website: "www.techmanufacturing.com",
          contactPerson: "David Lee",
          contactEmail: "d.lee@techmanufacturing.com",
        },
        studyScope: {
          primary: "Digital transformation process",
          secondary: [
            "Change management",
            "Technology adoption",
            "ROI analysis",
          ],
        },
      },
    },
  ];

  const columns = [
    {
      title: "Request Information",
      dataIndex: "title",
      key: "title",
      width: "50%",
      render: (text, record) => (
        <div>
          <div className="text-lg font-semibold text-gray-800">{text}</div>
          <div className="text-sm text-gray-500 mt-1">
            <Tag color="blue">{record.type}</Tag>
            <Tag color="cyan">{record.department}</Tag>
          </div>
          <div className="text-sm text-gray-600 mt-2">{record.description}</div>
          <div className="mt-2 text-sm">
            <UserOutlined className="mr-1" />
            Submitted by: {record.submittedBy.name} ({record.submittedBy.role})
          </div>

          {/* Authors Section - Only for Conference and Case Study */}
          {record.type !== "Research" && record.authors && (
            <div className="mt-3 bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium mb-2">
                <TeamOutlined className="mr-1" /> Project Team
              </div>
              <div className="space-y-2">
                {record.authors.map((author, idx) => (
                  <div
                    key={idx}
                    className="flex items-center text-sm space-x-3"
                  >
                    <div className="flex items-center space-x-2">
                      <UserOutlined className="text-gray-400" />
                      <span>{author.name}</span>
                    </div>
                    <Tag
                      color={author.role === "Main Author" ? "gold" : "blue"}
                    >
                      {author.role}
                    </Tag>
                    <Tooltip title={`${author.email} | ${author.phone}`}>
                      <InfoCircleOutlined className="text-gray-400 cursor-pointer" />
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
          )}

          {renderTypeSpecificDetails(record)}
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
                  ₫{record.requestedBudget.toLocaleString()}
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
                {record.timeline[0]} to {record.timeline[1]}
              </span>
            </div>
          </div>
        </div>
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
                  {record.researchDetails.objectives.map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>
              </p>
              <p className="text-sm">
                <span className="font-medium">Expected Outcomes:</span>{" "}
                {record.researchDetails.expectedOutcomes}
              </p>
              <div className="text-sm">
                <span className="font-medium">Datasets:</span>
                <ul className="list-disc list-inside ml-2">
                  {record.researchDetails.datasets.map((dataset, idx) => (
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
                  <li>Name: {record.caseStudyDetails.companyProfile.name}</li>
                  <li>
                    Industry: {record.caseStudyDetails.companyProfile.industry}
                  </li>
                  <li>Size: {record.caseStudyDetails.companyProfile.size}</li>
                </ul>
              </div>
              <div>
                <span className="font-medium">Study Scope:</span>
                <p className="ml-2">
                  Primary: {record.caseStudyDetails.studyScope.primary}
                </p>
                <ul className="list-disc list-inside ml-2">
                  {record.caseStudyDetails.studyScope.secondary.map(
                    (scope, idx) => (
                      <li key={idx}>{scope}</li>
                    )
                  )}
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

        <Card className="shadow-md">
          <Table
            columns={columns}
            dataSource={pendingRequests}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            className="custom-table"
            rowClassName="align-top"
          />
        </Card>

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
          width={600}
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
          <Form form={form} layout="vertical" className="mt-4">
            <Form.Item
              label="Adjusted Budget (VND)"
              name="budget"
              rules={[{ required: true, message: "Please input the budget!" }]}
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
              label="Timeline"
              name="timeline"
              rules={[{ required: true, message: "Please select timeline!" }]}
            >
              <RangePicker className="w-full" />
            </Form.Item>

            <Form.Item
              label="Feedback Notes"
              name="notes"
              rules={[{ required: true, message: "Please provide feedback!" }]}
            >
              <TextArea
                rows={4}
                placeholder="Provide feedback about the adjustments..."
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default PendingRequest;
