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
  Modal,
  List,
  Avatar,
  Descriptions,
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
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
// Remove or comment out API imports that don't exist yet
import { useGetCouncilGroupsQuery } from "../../features/group/groupApiSlice";
import {
  useAssignProjectsToCouncilMutation,
  useGetAllProjectRequestsQuery,
} from "../../features/project/projectApiSlice";

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
  const [projectDuration, setProjectDuration] = useState(null);

  // New state for members modal
  const [isMembersModalVisible, setIsMembersModalVisible] = useState(false);
  const [membersToShowInModal, setMembersToShowInModal] = useState([]);
  const [currentCouncilForModal, setCurrentCouncilForModal] = useState(null);

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

  const {
    data: allProjectRequestsData,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useGetAllProjectRequestsQuery();

  const [assignProjectsToCouncil, { isLoading: isAssigning }] =
    useAssignProjectsToCouncilMutation();

  // Mock loading state for the assign action
  // const isAssigning = false;

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

  const {
    data: councilsData,
    isLoading: councilsLoading,
    isError: councilsApiError,
  } = useGetCouncilGroupsQuery();

  // Use mock data directly
  const councils = councilsData?.data || [];
  const projects = (allProjectRequestsData?.data || [])
    .slice() // Create a shallow copy to avoid mutating the cached data
    .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)); // Sort by requestedAt descending

  const councilsErrorState = false;

  // Filter projects based on search text
  const filteredProjects = projects.filter(
    (project) =>
      project.projectName?.toLowerCase().includes(searchText.toLowerCase()) ||
      project.requesterName?.toLowerCase().includes(searchText.toLowerCase()) ||
      project.groupName?.toLowerCase().includes(searchText.toLowerCase()) ||
      project.departmentName?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Filter councils based on search text
  const filteredCouncils = councils.filter(
    (council) =>
      (council.name ?? "")
        .toLowerCase()
        .includes(councilSearchText.toLowerCase()) ||
      (council.departmentName ?? "")
        .toLowerCase()
        .includes(councilSearchText.toLowerCase())
  );

  // Project selection table columns
  const projectColumns = [
    {
      title: "Project",
      dataIndex: "projectName",
      key: "projectName",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            <ProjectOutlined className="mr-1" /> ID: {record.requestId}
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
            Requester: {record.requesterName}
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
      title: "Status",
      dataIndex: "statusName",
      key: "statusName",
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      render: (categories) => {
        if (!categories || categories.length === 0) {
          return <Text type="secondary">N/A</Text>;
        }
        // Display categories as Tags
        return (
          <div
            style={{
              maxWidth: 200,
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
            }}
          >
            {categories.map((cat) => (
              <Tag key={cat.categoryId} color="blue">
                {cat.categoryName}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Requested Date",
      dataIndex: "requestedAt",
      key: "requestedAt",
      render: (date) => (
        <div className="flex items-center">
          <CalendarOutlined className="mr-1" />
          {dayjs(date).format("YYYY-MM-DD HH:mm")}
        </div>
      ),
    },
    {
      title: "Council Match",
      key: "councilMatch",
      width: 150, // Adjust width as needed
      render: (text, record) => {
        if (!selectedCouncil) {
          return (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Select council first
            </Text>
          );
        }
        if (
          !record.categories ||
          record.categories.length === 0 ||
          !selectedCouncil.expertises ||
          selectedCouncil.expertises.length === 0
        ) {
          return <Tag color="default">N/A</Tag>;
        }

        const projectCategories = record.categories.map((cat) => ({
          ...cat,
          nameLower: cat.categoryName.toLowerCase(),
        }));
        const councilExpertiseNamesLower = selectedCouncil.expertises.map(
          (exp) => exp.toLowerCase()
        );

        const matchedCategories = projectCategories.filter((cat) =>
          councilExpertiseNamesLower.includes(cat.nameLower)
        );

        if (matchedCategories.length > 0) {
          return (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <Tag
                color="success"
                icon={<CheckCircleOutlined />}
                style={{ marginBottom: "4px" }}
              >
                {matchedCategories.length} Match(es)
              </Tag>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                  maxHeight: "60px",
                  overflowY: "auto",
                }}
              >
                {matchedCategories.map((cat) => (
                  <Tooltip
                    key={cat.categoryId}
                    title={`Matches: ${cat.categoryName}`}
                  >
                    <Tag color="geekblue">{cat.categoryName}</Tag>
                  </Tooltip>
                ))}
              </div>
            </div>
          );
        } else {
          return (
            <Tag color="warning" icon={<InfoCircleOutlined />}>
              No Direct Match
            </Tag>
          );
        }
      },
    },
  ];

  // Council selection table columns
  const councilColumns = [
    {
      title: "Council Name",
      dataIndex: "groupName",
      key: "groupName",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            <TeamOutlined className="mr-1" />{" "}
            {record.currentMember || record.members?.length || 0} /{" "}
            {record.maxMember} members
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
      title: "Expertise",
      key: "expertises",
      dataIndex: "expertises",
      render: (expertises) => {
        if (!expertises || expertises.length === 0) {
          return <Text type="secondary">N/A</Text>;
        }
        // Display expertises as Tags
        return (
          <div
            style={{
              maxWidth: 200,
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
            }}
          >
            {expertises.map((expertise, index) => (
              <Tag key={index} color="purple">
                {" "}
                {/* Using a different color for distinction */}
                {expertise}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Members",
      key: "members",
      render: (_, record) => (
        <Button
          size="small"
          icon={<TeamOutlined />}
          onClick={() => {
            setMembersToShowInModal(record.members || []);
            setCurrentCouncilForModal(record); // Store the council name for the modal title
            setIsMembersModalVisible(true);
          }}
        >
          View Members
        </Button>
      ),
    },
  ];

  // Handle form submission
  const handleSubmit = async () => {
    // Validation logic remains the same for first two steps - already handled by nextStep

    // Ensure all data for submission is available (final check before API call)
    if (
      selectedProjects.length === 0 ||
      !selectedCouncil ||
      !reviewDate ||
      !reviewTimeRange ||
      !reviewTimeRange[0] ||
      !projectDuration ||
      !(
        dayjs(projectDuration).hour() > 0 || dayjs(projectDuration).minute() > 0
      )
    ) {
      message.error("Missing required information. Please complete all steps.");
      return;
    }

    // Prepare the payload for the API
    const assignments = [];
    let currentScheduledDateTime = dayjs(reviewDate)
      .hour(dayjs(reviewTimeRange[0]).hour())
      .minute(dayjs(reviewTimeRange[0]).minute())
      .second(0)
      .millisecond(0);

    const durationHours = dayjs(projectDuration).hour();
    const durationMinutes = dayjs(projectDuration).minute();
    const durationString = `${String(durationHours).padStart(2, "0")}:${String(
      durationMinutes
    ).padStart(2, "0")}:00`;

    for (const project of selectedProjects) {
      assignments.push({
        projectRequestId: project.requestId,
        scheduledDate: currentScheduledDateTime.toISOString(),
        scheduledTime: durationString,
        notes: `${location ? `Location: ${location}. ` : ""}${
          notes || ""
        }`.trim(),
      });
      // Add duration for the next project's start time
      currentScheduledDateTime = currentScheduledDateTime
        .add(durationHours, "hour")
        .add(durationMinutes, "minute");
    }

    const payload = {
      councilGroupId: selectedCouncil.groupId, // Changed from selectedCouncil.id
      assignments: assignments,
    };

    console.log("Submitting payload:", JSON.stringify(payload, null, 2));

    try {
      // Call the new mutation
      await assignProjectsToCouncil(payload).unwrap();
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
    if (currentStep === 0 && !selectedCouncil) {
      message.error("Please select a council for review");
      return;
    }

    if (currentStep === 1 && selectedProjects.length === 0) {
      message.error("Please select at least one project to review");
      return;
    }

    // Validation for Step 2 (Schedule Review)
    if (currentStep === 2) {
      form
        .validateFields() // Validate all fields in Step 2 form
        .then(() => {
          if (
            !reviewDate ||
            !reviewTimeRange ||
            !reviewTimeRange[0] ||
            !projectDuration ||
            !(
              dayjs(projectDuration).hour() > 0 ||
              dayjs(projectDuration).minute() > 0
            )
          ) {
            // This is a fallback, form.validateFields should catch most of it.
            message.error(
              "Please ensure date, start time, and a valid project duration are set."
            );
            return;
          }
          setCurrentStep(currentStep + 1); // Proceed if form validation passes
        })
        .catch((info) => {
          console.log("Validate Failed:", info);
          message.error(
            "Please correct the errors in the schedule information."
          );
          return; // Stay on current step if validation fails
        });
      return; // Important: nextStep logic for step 2 is handled by form validation promise
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
      setSelectedProjects(
        selectedProjects.filter((p) => p.requestId !== record.requestId)
      );
    }
  };

  // Handle council selection
  const handleCouncilSelection = (record) => {
    console.log("Council selected (handleCouncilSelection):", record);
    setSelectedCouncil(record);
  };

  // Loading state
  if (councilsLoading || projectsLoading) {
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
  if (councilsApiError || projectsError) {
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
            <Step title="Select Council" icon={<TeamOutlined />} />
            <Step title="Select Projects" icon={<ProjectOutlined />} />
            <Step title="Schedule Review" icon={<CalendarOutlined />} />
            <Step title="Confirm" icon={<CheckCircleOutlined />} />
          </Steps>
        </Card>

        {/* MODAL FOR DISPLAYING COUNCIL MEMBERS - ADD THIS SECTION */}
        {currentCouncilForModal && (
          <Modal
            title={`Members of "${currentCouncilForModal.groupName}"`}
            open={isMembersModalVisible}
            onCancel={() => setIsMembersModalVisible(false)}
            footer={[
              <Button
                key="close"
                onClick={() => setIsMembersModalVisible(false)}
              >
                Close
              </Button>,
            ]}
            width={600} // Increase width for table
          >
            {membersToShowInModal.length > 0 ? (
              <Table
                dataSource={membersToShowInModal}
                rowKey={(member) => member.groupMemberId || member.userId} // Ensure a unique key
                columns={[
                  {
                    title: "Name",
                    dataIndex: "memberName",
                    key: "memberName",
                  },
                  {
                    title: "Email",
                    dataIndex: "memberEmail",
                    key: "memberEmail",
                    render: (email) =>
                      email || <Text type="secondary">N/A</Text>,
                  },
                  {
                    title: "Role",
                    dataIndex: "roleText",
                    key: "roleText",
                    render: (roleText) =>
                      roleText ? (
                        <Tag color="blue">{roleText}</Tag>
                      ) : (
                        <Text type="secondary">N/A</Text>
                      ),
                  },
                  {
                    title: "Status",
                    dataIndex: "statusText",
                    key: "statusText",
                    render: (statusText) => {
                      let color = "default";
                      if (statusText === "Accepted") color = "success";
                      if (statusText === "Pending") color = "processing";
                      if (
                        statusText === "Rejected" ||
                        statusText === "Inactive"
                      )
                        color = "error";
                      return statusText ? (
                        <Tag color={color}>{statusText}</Tag>
                      ) : (
                        <Text type="secondary">N/A</Text>
                      );
                    },
                  },
                ]}
                pagination={false} // Optional: disable pagination if list is usually short
                size="small"
              />
            ) : (
              <Empty description="No members found for this council." />
            )}
          </Modal>
        )}

        {/* Step 0: Council Selection (Previously Step 1) */}
        {currentStep === 0 && (
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

            {/* Log selectedCouncil and derived selectedRowKeys before Table render */}
            {/* console.log("Rendering councils table. Selected council:", selectedCouncil) */}
            {/* console.log("Derived selectedRowKeys for councils table:", selectedCouncil ? [selectedCouncil.groupId] : []) */}
            <Table
              rowKey="groupId"
              dataSource={filteredCouncils}
              columns={councilColumns}
              rowSelection={{
                type: "radio",
                selectedRowKeys: selectedCouncil
                  ? [selectedCouncil.groupId]
                  : [],
                onSelect: (record) => handleCouncilSelection(record),
              }}
              pagination={{ pageSize: 5 }}
            />

            <div className="flex justify-end mt-6">
              <Button
                type="primary"
                onClick={nextStep}
                className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
              >
                Next: Select Projects
              </Button>
            </div>
          </Card>
        )}

        {/* Step 1: Project Selection (Previously Step 0) */}
        {currentStep === 1 && (
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
              rowKey="requestId"
              dataSource={filteredProjects}
              columns={projectColumns}
              rowSelection={{
                type: "checkbox",
                selectedRowKeys: selectedProjects.map((p) => p.requestId),
                onSelect: (record, selected) =>
                  handleProjectSelection(record, selected),
              }}
              pagination={{ pageSize: 5 }}
            />

            <div className="flex justify-between mt-6">
              <Button onClick={prevStep}>Previous: Select Council</Button>
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

        {/* Step 2: Schedule Review (Previously Step 2) */}
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
                      onChange={(date) => setReviewDate(date)}
                      disabledDate={(current) =>
                        current && current.isBefore(dayjs().startOf("day"))
                      }
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Session Start Time"
                    name="sessionStartTime"
                    rules={[
                      { required: true, message: "Please select a start time" },
                    ]}
                  >
                    <DatePicker.TimePicker
                      style={{ width: "100%" }}
                      onChange={(time) => {
                        if (reviewTimeRange)
                          setReviewTimeRange([time, reviewTimeRange[1]]);
                        else setReviewTimeRange([time, null]);
                      }}
                      format="HH:mm"
                      minuteStep={15}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Duration Per Project (HH:mm)"
                    name="projectDuration"
                    rules={[
                      {
                        required: true,
                        message: "Please set duration per project",
                      },
                      {
                        validator: (_, value) => {
                          if (
                            value &&
                            (dayjs(value).hour() > 0 ||
                              dayjs(value).minute() > 0)
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Duration must be greater than 0 minutes")
                          );
                        },
                      },
                    ]}
                  >
                    <DatePicker.TimePicker
                      style={{ width: "100%" }}
                      onChange={(time) => setProjectDuration(time)}
                      format="HH:mm"
                      showNow={false}
                      placeholder="e.g., 01:30 for 1h 30m"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Location"
                    name="location"
                    rules={[
                      { required: true, message: "Please enter a location" },
                    ]}
                  >
                    <Input
                      placeholder="Room, building, or online meeting link"
                      prefix={<EnvironmentOutlined />}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Overall Session Notes" name="notes">
                <TextArea
                  rows={4}
                  placeholder="Enter any additional notes or instructions for the review"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Form.Item>
            </Form>

            <div className="flex justify-between mt-6">
              <Button onClick={prevStep}>Previous: Select Projects</Button>
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

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <Card className="shadow-md mb-8">
            <Title level={4} className="mb-6 flex items-center">
              <CheckCircleOutlined className="mr-2 text-[#F2722B]" />
              Review Assignment Summary
            </Title>

            <Row gutter={[24, 24]}>
              {/* Projects to Review Card */}
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <Space>
                      <ProjectOutlined /> Projects to Review (
                      {selectedProjects.length})
                    </Space>
                  }
                  bordered={false}
                  className="bg-gray-50 h-full" // Added h-full for consistent height if needed
                  headStyle={{ borderBottom: "1px solid #f0f0f0" }}
                >
                  {selectedProjects.length > 0 ? (
                    <List
                      dataSource={selectedProjects}
                      renderItem={(project) => (
                        <List.Item style={{ padding: "12px 0" }}>
                          <List.Item.Meta
                            title={<Text strong>{project.projectName}</Text>}
                            description={
                              <>
                                <Text
                                  type="secondary"
                                  style={{
                                    display: "block",
                                    marginBottom: "4px",
                                  }}
                                >
                                  Group: {project.groupName || "N/A"} |
                                  Requester: {project.requesterName || "N/A"}
                                </Text>
                                {project.categories &&
                                  project.categories.length > 0 && (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "4px",
                                        marginTop: "4px",
                                      }}
                                    >
                                      {project.categories.map((cat) => (
                                        <Tag key={cat.categoryId} color="cyan">
                                          {cat.categoryName}
                                        </Tag>
                                      ))}
                                    </div>
                                  )}
                              </>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty description="No projects selected" />
                  )}
                </Card>
              </Col>

              {/* Review Council Card */}
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <Space>
                      <TeamOutlined /> Review Council
                    </Space>
                  }
                  bordered={false}
                  className="bg-gray-50 h-full" // Added h-full
                  headStyle={{ borderBottom: "1px solid #f0f0f0" }}
                >
                  {selectedCouncil ? (
                    <>
                      <Title level={5}>{selectedCouncil.groupName}</Title>
                      <Paragraph
                        type="secondary"
                        style={{ marginBottom: "12px" }}
                      >
                        Department: {selectedCouncil.departmentName || "N/A"}
                      </Paragraph>

                      {selectedCouncil.expertises &&
                        selectedCouncil.expertises.length > 0 && (
                          <div style={{ marginBottom: "12px" }}>
                            <Text strong>Expertise: </Text>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "4px",
                                marginTop: "4px",
                              }}
                            >
                              {selectedCouncil.expertises.map((exp, index) => (
                                <Tag key={index} color="purple">
                                  {exp}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        )}

                      <Text strong>
                        Members ({selectedCouncil.members?.length || 0}):
                      </Text>
                      <List
                        size="small"
                        dataSource={selectedCouncil.members || []}
                        renderItem={(member) => (
                          <List.Item style={{ padding: "4px 0" }}>
                            {member.memberName}{" "}
                            <Tag
                              color={
                                member.roleText === "Council Chairman"
                                  ? "gold"
                                  : member.roleText === "Secretary"
                                  ? "geekblue"
                                  : "default"
                              }
                            >
                              {member.roleText || "N/A"}
                            </Tag>
                          </List.Item>
                        )}
                        style={{
                          maxHeight: "150px",
                          overflowY: "auto",
                          marginTop: "4px",
                        }}
                      />
                    </>
                  ) : (
                    <Empty description="No council selected" />
                  )}
                </Card>
              </Col>
            </Row>

            {/* Review Schedule Details Card */}
            <Card
              title={
                <Space>
                  <CalendarOutlined /> Review Schedule Details
                </Space>
              }
              bordered={false}
              className="bg-white mt-6 shadow-md" // Changed bg to white for contrast, added shadow
              headStyle={{ borderBottom: "1px solid #f0f0f0" }}
            >
              <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
                <Descriptions.Item label="Review Date">
                  {reviewDate ? (
                    dayjs(reviewDate).format("YYYY-MM-DD")
                  ) : (
                    <Text type="secondary">Not set</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Session Start Time">
                  {reviewTimeRange && reviewTimeRange[0] ? (
                    dayjs(reviewTimeRange[0]).format("HH:mm")
                  ) : (
                    <Text type="secondary">Not set</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Duration Per Project">
                  {projectDuration ? (
                    dayjs(projectDuration).format("HH:mm")
                  ) : (
                    <Text type="secondary">Not set</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Projects to Schedule">
                  {selectedProjects.length > 0 ? (
                    selectedProjects.length
                  ) : (
                    <Text type="secondary">0</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Estimated End Time"
                  span={selectedProjects.length === 0 ? 2 : 1}
                >
                  {reviewDate &&
                  reviewTimeRange &&
                  reviewTimeRange[0] &&
                  projectDuration &&
                  selectedProjects.length > 0 ? (
                    (() => {
                      let endTime = dayjs(reviewDate)
                        .hour(dayjs(reviewTimeRange[0]).hour())
                        .minute(dayjs(reviewTimeRange[0]).minute())
                        .second(0)
                        .millisecond(0);
                      const totalDurationMinutes =
                        (dayjs(projectDuration).hour() * 60 +
                          dayjs(projectDuration).minute()) *
                        selectedProjects.length;
                      endTime = endTime.add(totalDurationMinutes, "minute");
                      return endTime.format("HH:mm [on] YYYY-MM-DD");
                    })()
                  ) : (
                    <Text type="secondary">N/A</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Scheduling Mode"
                  span={selectedProjects.length > 0 ? 1 : 2}
                >
                  Projects will be scheduled sequentially.
                </Descriptions.Item>
                <Descriptions.Item label="Location" span={2}>
                  {location || <Text type="secondary">Not set</Text>}
                </Descriptions.Item>
                {notes && (
                  <Descriptions.Item label="Overall Session Notes" span={2}>
                    <Paragraph style={{ marginBottom: 0 }}>{notes}</Paragraph>
                  </Descriptions.Item>
                )}
              </Descriptions>
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
