import React, { useState, useEffect } from "react";
import {
  Card,
  Tag,
  Button,
  Input,
  Table,
  Space,
  Badge,
  Avatar,
  Tooltip,
  Dropdown,
  Empty,
  Spin,
  message,
  Statistic,
  Select,
  Row,
  Col,
  Typography,
  Divider,
  Form,
  Modal,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ProjectOutlined,
  GlobalOutlined,
  FileTextOutlined,
  EyeOutlined,
  DownloadOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  CalendarOutlined,
  BookOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  MoreOutlined,
  PlusOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined,
  ExperimentOutlined,
  QuestionOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetUserConferencesQuery,
  useUpdateConferenceSubmissionStatusMutation,
  useCreateConferenceFromResearchMutation,
} from "../../features/project/conference/conferenceApiSlice";

const { Search } = Input;
const { Title, Text } = Typography;

const ProjectPaper = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectInfo, setProjectInfo] = useState(null);
  const [conferencesList, setConferencesList] = useState([]);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedConference, setSelectedConference] = useState(null);
  const [statusForm] = Form.useForm();
  const [createPaperModalVisible, setCreatePaperModalVisible] = useState(false);
  const [createPaperForm] = Form.useForm();
  const [createConferenceFromResearch, { isLoading: isCreatingConference }] =
    useCreateConferenceFromResearchMutation();

  // Fetch conferences data
  const {
    data: conferencesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUserConferencesQuery();

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateConferenceSubmissionStatusMutation();

  useEffect(() => {
    if (conferencesResponse?.data) {
      // Filter conferences by project ID
      const projectConferences = conferencesResponse.data.filter(
        (conference) => conference.projectId.toString() === projectId
      );

      setConferencesList(projectConferences);

      // Set project info from the first conference
      if (projectConferences.length > 0) {
        setProjectInfo({
          projectId: projectConferences[0].projectId,
          projectName: projectConferences[0].projectName,
          totalCount: projectConferences.length,
          pendingCount: projectConferences.filter(
            (c) => c.conferenceSubmissionStatus === 0
          ).length,
          approvedCount: projectConferences.filter(
            (c) => c.conferenceSubmissionStatus === 1
          ).length,
          rejectedCount: projectConferences.filter(
            (c) => c.conferenceSubmissionStatus === 2
          ).length,
        });
      }
    }
  }, [conferencesResponse, projectId]);

  if (isError) {
    message.error(
      `Failed to load conferences: ${error?.data?.message || "Unknown error"}`
    );
  }

  const getStatusTag = (status) => {
    switch (status) {
      case 0: // Pending
        return <Tag color="warning">Pending</Tag>;
      case 1: // Approved
        return <Tag color="success">Approved</Tag>;
      case 2: // Rejected
        return <Tag color="error">Rejected</Tag>;
      default:
        return <Tag color="default">Unknown</Tag>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || new Date(dateString).getFullYear() <= 1)
      return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewPaperDetails = (conference) => {
    navigate(`/active-paper-details/${conference.conferenceId}`);
  };

  // Filter conferences based on search text and status filter
  const filteredConferences = conferencesList.filter((conference) => {
    const matchesSearch =
      searchText === "" ||
      conference.conferenceName
        .toLowerCase()
        .includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" &&
        conference.conferenceSubmissionStatus === 0) ||
      (statusFilter === "approved" &&
        conference.conferenceSubmissionStatus === 1) ||
      (statusFilter === "rejected" &&
        conference.conferenceSubmissionStatus === 2);

    return matchesSearch && matchesStatus;
  });

  const getPresentationTypeLabel = (typeCode) => {
    switch (typeCode) {
      case 0:
        return "Oral Presentation";
      case 1:
        return "Poster Presentation";
      case 2:
        return "Workshop Presentation";
      case 3:
        return "Panel Presentation";
      case 4:
        return "Virtual Presentation";
      case 5:
        return "Demonstration";
      default:
        return "Unknown";
    }
  };

  const getPresentationTypeIcon = (typeCode) => {
    switch (typeCode) {
      case 0: // Oral
        return { icon: <TeamOutlined />, color: "blue" };
      case 1: // Poster
        return { icon: <FileTextOutlined />, color: "purple" };
      case 2: // Workshop
        return { icon: <ToolOutlined />, color: "cyan" };
      case 3: // Panel
        return { icon: <UserOutlined />, color: "magenta" };
      case 4: // Virtual
        return { icon: <GlobalOutlined />, color: "green" };
      case 5: // Demonstration
        return { icon: <ExperimentOutlined />, color: "orange" };
      default:
        return { icon: <QuestionOutlined />, color: "default" };
    }
  };

  const handleUpdateStatus = async (values) => {
    try {
      await updateStatus({
        conferenceId: selectedConference.conferenceId,
        statusData: {
          submissionStatus: values.submissionStatus,
          reviewerComment: values.reviewerComment,
        },
      }).unwrap();

      message.success("Submission status updated successfully");
      setIsStatusModalVisible(false);
      statusForm.resetFields();
      setSelectedConference(null);
    } catch (error) {
      message.error(
        `Failed to update status: ${error?.data?.message || "Unknown error"}`
      );
    }
  };

  const handleCreatePaperSubmit = async () => {
    try {
      const values = await createPaperForm.validateFields();

      // Send the API request
      await createConferenceFromResearch({
        projectId,
        conferenceData: {
          conferenceName: values.conferenceName,
          conferenceRanking: parseInt(values.conferenceRanking),
          presentationType: parseInt(values.presentationType),
        },
      }).unwrap();

      message.success("Conference paper created successfully!");
      setCreatePaperModalVisible(false);
      refetch(); // Refresh the conference data
    } catch (error) {
      if (error.name !== "ValidationError") {
        console.error("Failed to create conference paper:", error);
        message.error(
          error.data?.message ||
            "Failed to create conference paper. Please try again."
        );
      }
    }
  };

  const columns = [
    {
      title: "Conference",
      dataIndex: "conferenceName",
      key: "conferenceName",
      render: (text, record) => (
        <div className="flex items-start space-y-1 flex-col">
          <div className="flex items-center">
            <Avatar
              size="small"
              icon={<GlobalOutlined />}
              className="bg-teal-100 text-teal-600 mr-2"
            />
            <span className="font-medium">{text}</span>
          </div>
          {record.location && (
            <div className="text-xs text-gray-500 flex items-center">
              <EnvironmentOutlined className="mr-1" /> {record.location}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (_, record) => getStatusTag(record.conferenceSubmissionStatus),
    },
    {
      title: "Ranking",
      dataIndex: "conferenceRankingName",
      key: "ranking",
      width: 100,
      render: (text, record) => (
        <Badge
          count={text}
          style={{
            backgroundColor:
              record.conferenceRanking === 4
                ? "#f50"
                : record.conferenceRanking === 3
                ? "#2db7f5"
                : record.conferenceRanking === 2
                ? "#87d068"
                : record.conferenceRanking === 1
                ? "#108ee9"
                : "#d9d9d9",
          }}
        />
      ),
    },
    {
      title: "Presentation Type",
      key: "presentationType",
      render: (_, record) => {
        const { icon, color } = getPresentationTypeIcon(
          record.presentationType
        );
        return (
          <Tag color={color} icon={icon}>
            {getPresentationTypeLabel(record.presentationType)}
          </Tag>
        );
      },
    },
    {
      title: "Dates",
      key: "dates",
      render: (_, record) => (
        <div className="space-y-1">
          {record.acceptanceDate && (
            <div className="text-xs flex items-center">
              <CheckCircleOutlined className="mr-1 text-green-500" />
              Accepted: {formatDate(record.acceptanceDate)}
            </div>
          )}
          {record.presentationDate && (
            <div className="text-xs flex items-center">
              <CalendarOutlined className="mr-1 text-blue-500" />
              Presentation: {formatDate(record.presentationDate)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewPaperDetails(record)}
            className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none"
          >
            View
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Edit Submission",
                  icon: <EditOutlined />,
                },
                ...(record.conferenceSubmissionStatus === 0
                  ? [
                      {
                        key: "3",
                        label: "Update Status",
                        icon: <CheckCircleOutlined />,
                        onClick: () => {
                          setSelectedConference(record);
                          statusForm.resetFields();
                          setIsStatusModalVisible(true);
                        },
                      },
                    ]
                  : []),
              ],
            }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16">
        <Spin size="large" />
        <p className="ml-3 text-gray-600">Loading conference papers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/active-paper")}
          className="mb-6"
        >
          Back to Projects
        </Button>

        {/* Header Card */}
        {projectInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className="shadow-lg rounded-xl border-0 overflow-hidden mb-8"
              bodyStyle={{ padding: 0 }}
            >
              <div className="relative">
                {/* Gradient background */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#F2722B] to-[#FFA500] opacity-90"></div>

                <div className="relative px-6 pb-6">
                  {/* Top section with header content */}
                  <div className="pt-6 pb-4 flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
                        <ProjectOutlined className="text-orange-500 text-3xl" />
                      </div>
                      <div className="ml-4 mt-4">
                        <h1 className="text-3xl font-bold text-white drop-shadow-sm">
                          {projectInfo.projectName}
                        </h1>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="primary"
                        icon={<FileTextOutlined />}
                        onClick={() =>
                          navigate(`/project-details/${projectId}`)
                        }
                        className="bg-white text-orange-500 hover:bg-orange-50 border-white"
                      >
                        View Project Details
                      </Button>
                    </div>
                  </div>

                  {/* Bottom section with additional info */}
                  <div className="bg-white pt-6 px-4 pb-4 rounded-t-2xl shadow-inner">
                    <Row gutter={[24, 16]}>
                      <Col xs={24} sm={12} md={6}>
                        <Statistic
                          title="Total Papers"
                          value={projectInfo.totalCount}
                          prefix={<GlobalOutlined className="text-teal-500" />}
                        />
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <Statistic
                          title="Pending"
                          value={projectInfo.pendingCount}
                          prefix={
                            <ClockCircleOutlined className="text-yellow-500" />
                          }
                        />
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <Statistic
                          title="Approved"
                          value={projectInfo.approvedCount}
                          prefix={
                            <CheckCircleOutlined className="text-green-500" />
                          }
                        />
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <Statistic
                          title="Rejected"
                          value={projectInfo.rejectedCount}
                          prefix={
                            <CloseCircleOutlined className="text-red-500" />
                          }
                        />
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Papers
                </label>
                <Search
                  placeholder="Search by conference name..."
                  allowClear
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full"
                  size="large"
                  prefix={<SearchOutlined className="text-gray-400" />}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <Select
                  placeholder="Filter by status"
                  options={[
                    { label: "All Status", value: "all" },
                    { label: "Pending", value: "pending" },
                    { label: "Approved", value: "approved" },
                    { label: "Rejected", value: "rejected" },
                  ]}
                  onChange={setStatusFilter}
                  value={statusFilter}
                  className="w-full"
                  size="large"
                  suffixIcon={<FilterOutlined className="text-gray-400" />}
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="default"
                  size="large"
                  onClick={() => {
                    setSearchText("");
                    setStatusFilter("all");
                  }}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-md rounded-xl border-0">
            <div className="flex justify-between items-center mb-4">
              <Title level={4} className="m-0 flex items-center">
                <GlobalOutlined className="mr-2 text-teal-500" /> Conference
                Papers
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreatePaperModalVisible(true)}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none"
              >
                New Conference
              </Button>
            </div>

            {filteredConferences.length > 0 ? (
              <Table
                columns={columns}
                dataSource={filteredConferences}
                rowKey="conferenceId"
                pagination={{ pageSize: 10 }}
                className="paper-table"
              />
            ) : (
              <Empty
                description={
                  <span>
                    No conference papers found
                    {searchText || statusFilter !== "all"
                      ? " matching your filters"
                      : ""}
                  </span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="my-12"
              />
            )}
          </Card>
        </motion.div>

        {/* Status Update Modal */}
        <Modal
          title="Update Submission Status"
          open={isStatusModalVisible}
          onCancel={() => {
            setIsStatusModalVisible(false);
            statusForm.resetFields();
          }}
          footer={null}
        >
          {selectedConference && (
            <Form
              form={statusForm}
              onFinish={handleUpdateStatus}
              layout="vertical"
            >
              <Form.Item
                name="submissionStatus"
                label="Submission Status"
                rules={[{ required: true, message: "Please select a status" }]}
              >
                <Select placeholder="Select a status">
                  <Select.Option value={1}>Approved</Select.Option>
                  <Select.Option value={2}>Rejected</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="reviewerComment"
                label="Reviewer Comment"
                rules={[
                  { required: true, message: "Please provide a comment" },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter your review comments here..."
                />
              </Form.Item>

              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      setIsStatusModalVisible(false);
                      statusForm.resetFields();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isUpdating}
                    className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none"
                  >
                    Update Status
                  </Button>
                </div>
              </Form.Item>
            </Form>
          )}
        </Modal>

        {/* Create Paper Modal */}
        <Modal
          title={
            <div className="flex items-center">
              <FileTextOutlined className="text-blue-500 mr-2" />
              <span>Create Conference Paper</span>
            </div>
          }
          open={createPaperModalVisible}
          onCancel={() => setCreatePaperModalVisible(false)}
          footer={null}
          width={600}
        >
          <div className="bg-teal-50 p-4 rounded-lg mb-4 border border-teal-200">
            <div className="flex items-start">
              <InfoCircleOutlined className="text-teal-500 text-lg mt-1 mr-3" />
              <div>
                <Text strong className="text-teal-700">
                  Create New Conference Paper
                </Text>
                <Text className="text-teal-600 block">
                  Creating a conference paper will generate a new submission for
                  this project. You will be able to upload your paper and manage
                  the submission process.
                </Text>
              </div>
            </div>
          </div>

          <Form
            form={createPaperForm}
            layout="vertical"
            onFinish={handleCreatePaperSubmit}
          >
            <Form.Item
              name="conferenceName"
              label="Conference Name"
              rules={[
                { required: true, message: "Please enter the conference name" },
              ]}
            >
              <Input placeholder="Enter the name of the conference" />
            </Form.Item>

            <Form.Item
              name="conferenceRanking"
              label="Conference Ranking"
              rules={[
                {
                  required: true,
                  message: "Please select the conference ranking",
                },
              ]}
            >
              <Select placeholder="Select conference ranking">
                <Select.Option value="0">Not Ranked</Select.Option>
                <Select.Option value="1">C</Select.Option>
                <Select.Option value="2">B</Select.Option>
                <Select.Option value="3">A</Select.Option>
                <Select.Option value="4">A*</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="presentationType"
              label="Presentation Type"
              rules={[
                {
                  required: true,
                  message: "Please select the presentation type",
                },
              ]}
            >
              <Select placeholder="Select presentation type">
                <Select.Option value="0">Oral Presentation</Select.Option>
                <Select.Option value="1">Poster Presentation</Select.Option>
                <Select.Option value="2">Workshop Presentation</Select.Option>
                <Select.Option value="3">Panel Presentation</Select.Option>
                <Select.Option value="4">Virtual Presentation</Select.Option>
                <Select.Option value="5">Demonstration</Select.Option>
              </Select>
            </Form.Item>

            <div className="flex justify-end gap-2 mt-6">
              <Button onClick={() => setCreatePaperModalVisible(false)}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isCreatingConference}
                disabled={isCreatingConference}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none"
              >
                {isCreatingConference
                  ? "Creating..."
                  : "Create Conference Paper"}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ProjectPaper;
