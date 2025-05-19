import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Form,
  Select,
  Button,
  Table,
  Tag,
  DatePicker,
  Input,
  Space,
  Divider,
  Alert,
  Spin,
  message,
  Tooltip,
  Checkbox,
  Row,
  Col,
  Empty,
  Steps,
} from "antd";
import {
  TeamOutlined,
  CalendarOutlined,
  ProjectOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
// Remove or comment out API imports that don't exist yet
// import { useGetCouncilGroupsQuery } from "../../features/group/groupApiSlice";
// import { useGetProjectsForReviewQuery } from "../../features/project/projectApiSlice";
// import { useAssignCouncilReviewMutation } from "../../features/timeline/timelineApiSlice";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Step } = Steps;

const AssignReview = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedCouncil, setSelectedCouncil] = useState(null);
  const [reviewDate, setReviewDate] = useState(null);
  const [reviewTimeRange, setReviewTimeRange] = useState(null);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [searchText, setSearchText] = useState("");
  const [councilSearchText, setCouncilSearchText] = useState("");

  // Replace API queries with mock data variables
  // Comment out actual API hooks
  /*
  const {
    data: councilsData,
    isLoading: councilsLoading,
    isError: councilsError,
  } = useGetCouncilGroupsQuery();

  const {
    data: projectsData,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useGetProjectsForReviewQuery();

  const [assignCouncilReview, { isLoading: isAssigning }] =
    useAssignCouncilReviewMutation();
  */

  // Mock loading state for the assign action
  const isAssigning = false;

  // Mock data for testing
  const mockCouncils = [
    {
      id: "council1",
      name: "Engineering Project Review Council",
      members: [
        { id: "m1", name: "Dr. John Smith", role: "Council Chairman" },
        { id: "m2", name: "Prof. Jane Doe", role: "Secretary" },
        { id: "m3", name: "Dr. Robert Johnson", role: "Council Member" },
        { id: "m4", name: "Prof. Emily Brown", role: "Council Member" },
      ],
      departmentName: "Engineering",
    },
    {
      id: "council2",
      name: "IT Research Grant Committee",
      members: [
        { id: "m5", name: "Dr. Michael Wilson", role: "Council Chairman" },
        { id: "m6", name: "Prof. Sarah Lee", role: "Secretary" },
        { id: "m7", name: "Dr. David Clark", role: "Council Member" },
      ],
      departmentName: "Information Technology",
    },
    {
      id: "council3",
      name: "University Ethics Committee",
      members: [
        { id: "m8", name: "Dr. Elizabeth Taylor", role: "Council Chairman" },
        { id: "m9", name: "Prof. William Davis", role: "Secretary" },
        { id: "m10", name: "Dr. Jennifer White", role: "Council Member" },
        { id: "m11", name: "Prof. Thomas Brown", role: "Council Member" },
      ],
      departmentName: "University-wide",
    },
  ];

  const mockProjects = [
    {
      id: "P001",
      name: "Sustainable Energy Solutions for Urban Areas",
      leaderName: "Sarah Johnson",
      groupName: "Green Energy Research Team",
      department: "Engineering",
      phase: "Implementation",
      status: "Active",
      submissionDate: "2023-10-15",
    },
    {
      id: "P002",
      name: "AI-Based Medical Diagnostic Systems",
      leaderName: "Michael Chen",
      groupName: "Medical AI Innovation Group",
      department: "Information Technology",
      phase: "Testing",
      status: "Active",
      submissionDate: "2023-09-28",
    },
    {
      id: "P003",
      name: "Climate Change Impact on Local Agriculture",
      leaderName: "Emily Rodriguez",
      groupName: "Environmental Research Collective",
      department: "Agriculture",
      phase: "Data Collection",
      status: "Active",
      submissionDate: "2023-11-05",
    },
    {
      id: "P004",
      name: "Behavioral Economics in Digital Markets",
      leaderName: "David Kim",
      groupName: "Digital Economy Research",
      department: "Economics",
      phase: "Analysis",
      status: "Active",
      submissionDate: "2023-10-10",
    },
    {
      id: "P005",
      name: "Novel Materials for Quantum Computing",
      leaderName: "Lisa Wong",
      groupName: "Quantum Materials Lab",
      department: "Physics",
      phase: "Experimentation",
      status: "Active",
      submissionDate: "2023-09-15",
    },
  ];

  // Use mock data directly
  const councils = mockCouncils;
  const projects = mockProjects;
  const councilsLoadingState = false;
  const projectsLoadingState = false;
  const councilsErrorState = false;
  const projectsErrorState = false;

  // Filter projects based on search text
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchText.toLowerCase()) ||
      project.leaderName.toLowerCase().includes(searchText.toLowerCase()) ||
      project.groupName.toLowerCase().includes(searchText.toLowerCase()) ||
      project.department.toLowerCase().includes(searchText.toLowerCase())
  );

  // Filter councils based on search text
  const filteredCouncils = councils.filter(
    (council) =>
      council.name.toLowerCase().includes(councilSearchText.toLowerCase()) ||
      council.departmentName
        .toLowerCase()
        .includes(councilSearchText.toLowerCase())
  );

  // Project selection table columns
  const projectColumns = [
    {
      title: "Project",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            <ProjectOutlined className="mr-1" /> ID: {record.id}
          </Text>
        </Space>
      ),
    },
    {
      title: "Group",
      dataIndex: "groupName",
      key: "groupName",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text>{text}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Leader: {record.leaderName}
          </Text>
        </Space>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Phase",
      dataIndex: "phase",
      key: "phase",
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: "Submission Date",
      dataIndex: "submissionDate",
      key: "submissionDate",
      render: (date) => (
        <div className="flex items-center">
          <CalendarOutlined className="mr-1" />
          {date}
        </div>
      ),
    },
  ];

  // Council selection table columns
  const councilColumns = [
    {
      title: "Council Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            <TeamOutlined className="mr-1" /> {record.members.length} members
          </Text>
        </Space>
      ),
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      key: "departmentName",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Chairman",
      key: "chairman",
      render: (_, record) => {
        const chairman = record.members.find(
          (m) => m.role === "Council Chairman"
        );
        return chairman ? chairman.name : "N/A";
      },
    },
    {
      title: "Members",
      key: "members",
      render: (_, record) => (
        <Tooltip
          title={
            <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
              {record.members.map((member) => (
                <li key={member.id}>
                  {member.name} - {member.role}
                </li>
              ))}
            </ul>
          }
        >
          <Button size="small" icon={<TeamOutlined />}>
            View Members
          </Button>
        </Tooltip>
      ),
    },
  ];

  // Handle form submission
  const handleSubmit = async () => {
    // Validation logic remains the same
    if (selectedProjects.length === 0) {
      message.error("Please select at least one project to review");
      return;
    }

    if (!selectedCouncil) {
      message.error("Please select a council");
      return;
    }

    if (!reviewDate || !reviewTimeRange) {
      message.error("Please select a review date and time range");
      return;
    }

    if (!location) {
      message.error("Please enter a location for the review");
      return;
    }

    try {
      // Mock successful submission
      message.success("Review session assigned successfully!");

      // Navigate back after success
      setTimeout(() => {
        navigate("/manage-council");
      }, 1500);
    } catch (error) {
      message.error("Failed to assign review session. Please try again.");
    }
  };

  // Move to next step
  const nextStep = () => {
    if (currentStep === 0 && selectedProjects.length === 0) {
      message.error("Please select at least one project to review");
      return;
    }

    if (currentStep === 1 && !selectedCouncil) {
      message.error("Please select a council for review");
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  // Move to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle project selection
  const handleProjectSelection = (record, selected) => {
    if (selected) {
      setSelectedProjects([...selectedProjects, record]);
    } else {
      setSelectedProjects(selectedProjects.filter((p) => p.id !== record.id));
    }
  };

  // Handle council selection
  const handleCouncilSelection = (record) => {
    setSelectedCouncil(record);
  };

  // Loading state
  if (councilsLoadingState || projectsLoadingState) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <Spin size="large" />
            <Text className="block mt-2">Loading data...</Text>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (councilsErrorState || projectsErrorState) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Alert
            message="Error"
            description="Failed to load required data. Please try again later."
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F2722B] to-[#FFA500] mb-2">
              Assign Council Review
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#F2722B] to-[#FFA500] rounded-full"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Assign research projects to council review groups and schedule
            review sessions
          </p>
        </div>

        {/* Steps */}
        <Card className="mb-8 shadow-sm">
          <Steps current={currentStep} className="px-8">
            <Step title="Select Projects" icon={<ProjectOutlined />} />
            <Step title="Select Council" icon={<TeamOutlined />} />
            <Step title="Schedule Review" icon={<CalendarOutlined />} />
            <Step title="Confirm" icon={<CheckCircleOutlined />} />
          </Steps>
        </Card>

        {/* Step 1: Project Selection */}
        {currentStep === 0 && (
          <Card className="shadow-md mb-8">
            <Title level={4} className="mb-6 flex items-center">
              <ProjectOutlined className="mr-2 text-[#F2722B]" />
              Select Projects for Review
            </Title>

            <Input
              placeholder="Search by project name, leader, group, or department"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="mb-4"
              style={{ maxWidth: "500px" }}
            />

            <Table
              rowKey="id"
              dataSource={filteredProjects}
              columns={projectColumns}
              rowSelection={{
                type: "checkbox",
                selectedRowKeys: selectedProjects.map((p) => p.id),
                onSelect: (record, selected) =>
                  handleProjectSelection(record, selected),
              }}
              pagination={{ pageSize: 5 }}
            />

            <div className="flex justify-end mt-6">
              <Button
                type="primary"
                onClick={nextStep}
                className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
              >
                Next: Select Council
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Council Selection */}
        {currentStep === 1 && (
          <Card className="shadow-md mb-8">
            <Title level={4} className="mb-6 flex items-center">
              <TeamOutlined className="mr-2 text-[#F2722B]" />
              Select Review Council
            </Title>

            <Input
              placeholder="Search by council name or department"
              prefix={<SearchOutlined />}
              value={councilSearchText}
              onChange={(e) => setCouncilSearchText(e.target.value)}
              className="mb-4"
              style={{ maxWidth: "500px" }}
            />

            <Table
              rowKey="id"
              dataSource={filteredCouncils}
              columns={councilColumns}
              rowSelection={{
                type: "radio",
                selectedRowKeys: selectedCouncil ? [selectedCouncil.id] : [],
                onSelect: (record) => handleCouncilSelection(record),
              }}
              pagination={{ pageSize: 5 }}
            />

            <div className="flex justify-between mt-6">
              <Button onClick={prevStep}>Previous: Select Projects</Button>
              <Button
                type="primary"
                onClick={nextStep}
                className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
              >
                Next: Schedule Review
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Schedule Review */}
        {currentStep === 2 && (
          <Card className="shadow-md mb-8">
            <Title level={4} className="mb-6 flex items-center">
              <CalendarOutlined className="mr-2 text-[#F2722B]" />
              Schedule Review Session
            </Title>

            <Form form={form} layout="vertical" requiredMark="optional">
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Review Date"
                    name="reviewDate"
                    rules={[
                      { required: true, message: "Please select a date" },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      value={reviewDate}
                      onChange={setReviewDate}
                      disabledDate={(current) =>
                        current && current < moment().startOf("day")
                      }
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Time Range"
                    name="timeRange"
                    rules={[
                      { required: true, message: "Please select a time range" },
                    ]}
                  >
                    <DatePicker.RangePicker
                      style={{ width: "100%" }}
                      value={reviewTimeRange}
                      onChange={setReviewTimeRange}
                      picker="time"
                      format="HH:mm"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: "Please enter a location" }]}
              >
                <Input
                  placeholder="Enter review location (Room number, building, or online meeting link)"
                  prefix={<EnvironmentOutlined />}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Additional Notes" name="notes">
                <TextArea
                  rows={4}
                  placeholder="Enter any additional notes or instructions for the review"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Form.Item>
            </Form>

            <div className="flex justify-between mt-6">
              <Button onClick={prevStep}>Previous: Select Council</Button>
              <Button
                type="primary"
                onClick={nextStep}
                className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
              >
                Next: Confirm Details
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 3 && (
          <Card className="shadow-md mb-8">
            <Title level={4} className="mb-6 flex items-center">
              <CheckCircleOutlined className="mr-2 text-[#F2722B]" />
              Review Assignment Summary
            </Title>

            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Card
                  title="Projects to Review"
                  bordered={false}
                  className="bg-gray-50"
                >
                  {selectedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="mb-2 pb-2 border-b border-gray-200 last:border-b-0"
                    >
                      <Text strong>{project.name}</Text>
                      <div className="text-xs text-gray-500">
                        Group: {project.groupName} | Leader:{" "}
                        {project.leaderName}
                      </div>
                    </div>
                  ))}
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card
                  title="Review Council"
                  bordered={false}
                  className="bg-gray-50"
                >
                  {selectedCouncil && (
                    <div>
                      <Text strong>{selectedCouncil.name}</Text>
                      <div className="text-xs text-gray-500 mb-2">
                        Department: {selectedCouncil.departmentName}
                      </div>
                      <div className="mt-2">
                        <Text type="secondary">Council Members:</Text>
                        <ul className="list-disc pl-5 mt-1">
                          {selectedCouncil.members.map((member) => (
                            <li key={member.id} className="text-sm">
                              {member.name}{" "}
                              <Tag size="small">{member.role}</Tag>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>

            <Card
              title="Review Schedule Details"
              bordered={false}
              className="bg-gray-50 mt-4"
            >
              <Row gutter={[24, 16]}>
                <Col xs={24} md={8}>
                  <div className="flex items-center">
                    <CalendarOutlined className="mr-2 text-[#F2722B]" />
                    <Text strong>Date:</Text>
                    <Text className="ml-2">
                      {reviewDate ? reviewDate.format("YYYY-MM-DD") : "Not set"}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="flex items-center">
                    <ClockCircleOutlined className="mr-2 text-[#F2722B]" />
                    <Text strong>Time:</Text>
                    <Text className="ml-2">
                      {reviewTimeRange
                        ? `${reviewTimeRange[0].format(
                            "HH:mm"
                          )} - ${reviewTimeRange[1].format("HH:mm")}`
                        : "Not set"}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="flex items-center">
                    <EnvironmentOutlined className="mr-2 text-[#F2722B]" />
                    <Text strong>Location:</Text>
                    <Text className="ml-2">{location || "Not set"}</Text>
                  </div>
                </Col>
                {notes && (
                  <Col xs={24}>
                    <Divider style={{ margin: "12px 0" }} />
                    <Text strong>Additional Notes:</Text>
                    <Paragraph className="mt-2 bg-white p-3 rounded">
                      {notes}
                    </Paragraph>
                  </Col>
                )}
              </Row>
            </Card>

            <Alert
              message="Important"
              description="Once you submit, notifications will be sent to all council members and project leaders about the scheduled review."
              type="info"
              showIcon
              className="mt-6"
            />

            <div className="flex justify-between mt-6">
              <Button onClick={prevStep}>Previous: Schedule Review</Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={isAssigning}
                className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
              >
                Assign Review
              </Button>
            </div>
          </Card>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <InfoCircleOutlined className="mr-1" />
          All times are in local timezone. Review sessions will be added to the
          academic calendar.
        </div>
      </div>
    </div>
  );
};

export default AssignReview;
