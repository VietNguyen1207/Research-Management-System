import React, { useState, useEffect } from "react";
import {
  Card,
  Tag,
  Button,
  Steps,
  Form,
  Input,
  DatePicker,
  Select,
  Typography,
  Divider,
  Space,
  Modal,
  message,
  Timeline,
  Row,
  Col,
  Descriptions,
  InputNumber,
  Upload,
  Progress,
  Spin,
  Empty,
  Collapse,
  List,
  Avatar,
  Tooltip,
  Statistic,
} from "antd";
import {
  BookOutlined,
  GlobalOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  SaveOutlined,
  PlusOutlined,
  UserOutlined,
  TagsOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  DownloadOutlined,
  ProjectOutlined,
  CommentOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { motion } from "framer-motion";
import {
  useGetConferenceDetailsQuery,
  useUpdateApprovedConferenceDetailsMutation,
} from "../../features/project/conference/conferenceApiSlice";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

const ActivePaperDetails = () => {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const { conferenceId } = useParams();
  const navigate = useNavigate();
  const [isConferenceModalVisible, setIsConferenceModalVisible] =
    useState(false);
  const [isPublisherModalVisible, setIsPublisherModalVisible] = useState(false);
  const [isTravelExpenseModalVisible, setIsTravelExpenseModalVisible] =
    useState(false);
  const [form] = Form.useForm();
  const [detailsForm] = Form.useForm();
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [updateApprovedDetails, { isLoading: isUpdatingDetails }] =
    useUpdateApprovedConferenceDetailsMutation();

  // Define styles
  const styles = `
    .text-gradient {
      background: linear-gradient(to right, #0d9488, #0f766e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .ant-descriptions-item-label {
      font-weight: 500;
    }

    .ant-timeline-item-head {
      background-color: #fff;
    }

    .timeline-clock-icon {
      font-size: 16px;
    }

    .ant-card {
      transition: all 0.3s ease;
    }

    .ant-tag {
      transition: all 0.3s ease;
    }

    .ant-btn {
      transition: all 0.3s ease;
    }

    .ant-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .ant-descriptions-bordered .ant-descriptions-item-label {
      background-color: rgba(13, 148, 136, 0.05);
    }

    .ant-descriptions-bordered .ant-descriptions-view {
      border-radius: 8px;
      overflow: hidden;
      border-color: rgba(13, 148, 136, 0.2);
    }
  `;

  // Fetch conference details
  const {
    data: conferenceResponse,
    isLoading,
    isError,
    error,
  } = useGetConferenceDetailsQuery(conferenceId);

  const conferenceDetails = conferenceResponse?.data;

  // Add the styles useEffect BEFORE any conditional returns
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Mock data - Replace with API call
  useEffect(() => {
    // Simulating API fetch
    if (id === "1") {
      setPaper({
        id: 1,
        type: "Conference",
        title: "Machine Learning Applications in Education",
        abstract:
          "This paper explores innovative applications of machine learning...",
        status: "accepted",
        publisher: "IEEE Conference on Educational Technology",
        milestones: [
          {
            id: 1,
            title: "Initial Draft",
            deadline: "2024-03-20",
            status: "completed",
            notes: "Completed on time",
          },
          {
            id: 2,
            title: "Internal Review",
            deadline: "2024-04-15",
            status: "in_progress",
            notes: "Under review by department",
          },
        ],
        conferenceDetails: {
          location: "Singapore",
          date: "2024-06-15",
          presentationType: "oral",
          travelExpense: {
            status: "pending",
            amount: 15000000,
            details: "Flight and accommodation for 3 days",
          },
        },
        publisherHistory: [
          {
            name: "IEEE Transactions",
            submissionDate: "2024-02-15",
            status: "approved",
            doi: "10.1109/TLT.2024.123456",
          },
        ],
      });
    } else {
      setPaper({
        id: 2,
        type: "Journal",
        title: "Deep Learning Approaches in Healthcare Data Analytics",
        abstract:
          "This research presents novel deep learning architectures for analyzing healthcare data, focusing on early disease detection and patient outcome prediction. The study demonstrates significant improvements in accuracy and efficiency compared to traditional methods.",
        status: "in_review",
        publisher: "Medical Artificial Intelligence Journal",
        milestones: [
          {
            id: 1,
            title: "Literature Review",
            deadline: "2024-01-15",
            status: "completed",
            notes: "Comprehensive review of existing methodologies completed",
          },
          {
            id: 2,
            title: "Methodology Development",
            deadline: "2024-02-28",
            status: "completed",
            notes: "Novel deep learning architecture designed and implemented",
          },
          {
            id: 3,
            title: "Data Analysis & Results",
            deadline: "2024-03-30",
            status: "completed",
            notes: "Experimental results analyzed and documented",
          },
          {
            id: 4,
            title: "Paper Draft",
            deadline: "2024-04-15",
            status: "in_progress",
            notes: "First draft under internal review",
          },
        ],
        publisherHistory: [
          {
            name: "Nature Digital Medicine",
            submissionDate: "2024-01-10",
            status: "rejected",
            notes:
              "Scope mismatch, suggested to submit to a more specialized journal",
          },
          {
            name: "Medical Artificial Intelligence Journal",
            submissionDate: "2024-03-01",
            status: "under_review",
            notes: "First round of peer review in progress",
            expectedResponseDate: "2024-05-01",
          },
        ],
        authors: [
          {
            name: "Dr. Sarah Johnson",
            role: "Main Author",
            email: "sarah.johnson@university.edu",
            department: "Computer Science",
          },
          {
            name: "Dr. Michael Chen",
            role: "Co-Author",
            email: "michael.chen@university.edu",
            department: "Medical Informatics",
          },
          {
            name: "Prof. Lisa Wong",
            role: "Co-Author",
            email: "lisa.wong@university.edu",
            department: "Healthcare Analytics",
          },
        ],
        department: {
          id: 1,
          name: "Computer Science",
        },
        category: {
          id: 1,
          name: "AI & Machine Learning",
        },
        keywords: [
          "Deep Learning",
          "Healthcare Analytics",
          "Disease Detection",
          "Patient Outcome Prediction",
          "Medical AI",
        ],
        progress: 65,
        submissionHistory: [
          {
            version: "1.0",
            date: "2024-01-10",
            publisher: "Nature Digital Medicine",
            status: "rejected",
            feedback: "Scope mismatch, recommended for specialized journal",
          },
          {
            version: "2.0",
            date: "2024-03-01",
            publisher: "Medical Artificial Intelligence Journal",
            status: "under_review",
            currentStage: "Peer Review",
          },
        ],
        expectedCompletionDate: "2024-06-30",
        fundingSource: "University Research Grant",
        collaborations: [
          {
            institution: "City General Hospital",
            role: "Data Provider",
          },
          {
            institution: "Healthcare Analytics Institute",
            role: "Research Partner",
          },
        ],
      });
    }
  }, [id]);

  const handleMilestoneEdit = (milestone) => {
    setEditingMilestone(milestone);
    form.setFieldsValue({
      title: milestone.title,
      deadline: moment(milestone.deadline),
      status: milestone.status,
      notes: milestone.notes,
    });
  };

  const handleMilestoneSave = async (values) => {
    try {
      // API call to update milestone
      message.success("Milestone updated successfully");
      setEditingMilestone(null);
    } catch (error) {
      message.error("Failed to update milestone");
    }
  };

  const handleConferenceUpdate = async (values) => {
    try {
      // API call to update conference details
      message.success("Conference details updated successfully");
      setIsConferenceModalVisible(false);
    } catch (error) {
      message.error("Failed to update conference details");
    }
  };

  const handlePublisherUpdate = async (values) => {
    try {
      // API call to update publisher status
      message.success("Publisher status updated successfully");
      setIsPublisherModalVisible(false);
    } catch (error) {
      message.error("Failed to update publisher status");
    }
  };

  const handleTravelExpenseSubmit = async (values) => {
    try {
      // API call to submit travel expense
      message.success("Travel expense request submitted successfully");
      setIsTravelExpenseModalVisible(false);
    } catch (error) {
      message.error("Failed to submit travel expense request");
    }
  };

  const formatCurrency = (value) => {
    return value ? `₫${value.toLocaleString()}` : "₫0";
  };

  const formatDate = (dateString) => {
    if (!dateString || new Date(dateString).getFullYear() <= 1)
      return "Not set";
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0: // Pending
        return "warning";
      case 1: // Approved
        return "success";
      case 2: // Rejected
        return "error";
      default:
        return "default";
    }
  };

  const getRankingColor = (ranking) => {
    switch (ranking) {
      case 4: // A*
        return "#f50";
      case 3: // A
        return "#2db7f5";
      case 2: // B
        return "#87d068";
      case 1: // C
        return "#108ee9";
      default:
        return "#d9d9d9";
    }
  };

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

  const handleOpenDetailsModal = () => {
    detailsForm.setFieldsValue({
      location: conferenceDetails.location || "",
      presentationDate: conferenceDetails.presentationDate
        ? moment(conferenceDetails.presentationDate)
        : null,
      acceptanceDate: conferenceDetails.acceptanceDate
        ? moment(conferenceDetails.acceptanceDate)
        : null,
      conferenceFunding: conferenceDetails.conferenceFunding || 0,
    });
    setIsDetailsModalVisible(true);
  };

  const handleDetailsSubmit = async () => {
    try {
      const values = await detailsForm.validateFields();

      const formattedValues = {
        location: values.location,
        presentationDate: values.presentationDate
          ? values.presentationDate.toISOString()
          : null,
        acceptanceDate: values.acceptanceDate
          ? values.acceptanceDate.toISOString()
          : null,
        conferenceFunding: values.conferenceFunding,
      };

      await updateApprovedDetails({
        conferenceId,
        detailsData: formattedValues,
      }).unwrap();

      message.success("Conference details updated successfully");
      setIsDetailsModalVisible(false);
    } catch (error) {
      if (error.name !== "ValidationError") {
        console.error("Failed to update conference details:", error);
        message.error(
          error.data?.message ||
            "Failed to update conference details. Please try again."
        );
      }
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16">
        <Spin size="large" />
        <p className="ml-3 text-gray-600">Loading conference details...</p>
      </div>
    );
  }

  if (!conferenceDetails) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 via-white to-gray-50">
        <div className="max-w-5xl mx-auto">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            Back to Papers
          </Button>
          <Empty
            description="Conference details not found"
            className="bg-white p-12 rounded-lg shadow-sm"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 via-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/active-paper")}
          className="mb-6"
        >
          Back to Papers
        </Button>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            className="shadow-lg rounded-2xl border-0 overflow-hidden mb-8"
            bodyStyle={{ padding: 0 }}
          >
            <div className="relative">
              {/* Gradient background with better height */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-teal-600 to-teal-700 opacity-90"></div>

              <div className="relative px-6 pb-6">
                {/* Top section with header content */}
                <div className="pt-6 pb-4 flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
                      <GlobalOutlined className="text-teal-600 text-3xl" />
                    </div>
                    <div className="ml-4 mt-4">
                      <h1 className="text-3xl font-bold text-white drop-shadow-sm">
                        {conferenceDetails.conferenceName}
                      </h1>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 items-end">
                    <Tag
                      color={getStatusColor(
                        conferenceDetails.conferenceSubmissionStatus
                      )}
                      className="px-4 py-1.5 text-sm font-medium rounded-full border-0 shadow-sm"
                    >
                      {conferenceDetails.conferenceSubmissionStatusName}
                    </Tag>
                    <Tag
                      color={getRankingColor(
                        conferenceDetails.conferenceRanking
                      )}
                      className="px-4 py-1.5 text-sm font-medium rounded-full border-0 shadow-sm"
                    >
                      Ranking: {conferenceDetails.conferenceRankingName}
                    </Tag>
                  </div>
                </div>

                {/* Bottom section with additional info */}
                <div className="bg-white pt-6 px-4 pb-4 rounded-t-2xl shadow-inner flex flex-col md:flex-row justify-between">
                  <div className="flex flex-wrap gap-3 mb-3 md:mb-0">
                    <Tag
                      icon={<GlobalOutlined className="text-base" />}
                      color="teal"
                      className="px-3 py-1.5 text-base rounded-md border-0 flex items-center gap-2 shadow-sm"
                    >
                      Conference
                    </Tag>
                    <Tag
                      icon={<ProjectOutlined className="text-base" />}
                      color="cyan"
                      className="px-3 py-1.5 text-base rounded-md border-0 flex items-center gap-2 shadow-sm"
                    >
                      {conferenceDetails.projectName}
                    </Tag>
                    {conferenceDetails.location && (
                      <Tag
                        icon={<EnvironmentOutlined className="text-base" />}
                        color="purple"
                        className="px-3 py-1.5 text-base rounded-md border-0 flex items-center gap-2 shadow-sm"
                      >
                        {conferenceDetails.location}
                      </Tag>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Statistic
                      title="Funding"
                      value={conferenceDetails.conferenceFunding || 0}
                      precision={0}
                      formatter={(value) => (
                        <span className="text-teal-600 font-semibold">
                          {formatCurrency(value)}
                        </span>
                      )}
                      className="mr-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Conference Details - now wider */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card
                title={
                  <span className="flex items-center">
                    <FileTextOutlined className="mr-2 text-teal-500" />
                    Conference Information
                  </span>
                }
                extra={
                  conferenceDetails.conferenceSubmissionStatus === 1 ? (
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={handleOpenDetailsModal}
                      className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none"
                    >
                      Update Details
                    </Button>
                  ) : null
                }
                className="shadow-md rounded-xl border-0 mb-8"
              >
                <Descriptions
                  bordered
                  column={1}
                  size="middle"
                  className="rounded-lg overflow-hidden"
                >
                  <Descriptions.Item label="Conference Name">
                    {conferenceDetails.conferenceName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ranking">
                    <Tag
                      color={getRankingColor(
                        conferenceDetails.conferenceRanking
                      )}
                    >
                      {conferenceDetails.conferenceRankingName}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Presentation Type">
                    {getPresentationTypeLabel(
                      conferenceDetails.presentationType
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Location">
                    {conferenceDetails.location || "Not specified"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Presentation Date">
                    {formatDate(conferenceDetails.presentationDate)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Acceptance Date">
                    {formatDate(conferenceDetails.acceptanceDate)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Submission Status">
                    <Tag
                      color={getStatusColor(
                        conferenceDetails.conferenceSubmissionStatus
                      )}
                    >
                      {conferenceDetails.conferenceSubmissionStatusName}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Conference Status">
                    <Tag
                      color={
                        conferenceDetails.conferenceStatus === 0
                          ? "green"
                          : "red"
                      }
                    >
                      {conferenceDetails.conferenceStatusName}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Conference Funding">
                    {formatCurrency(conferenceDetails.conferenceFunding)}
                  </Descriptions.Item>
                </Descriptions>

                {conferenceDetails.reviewerComment && (
                  <div className="mt-6">
                    <Title level={5} className="flex items-center mb-3">
                      <CommentOutlined className="mr-2 text-teal-500" />
                      Reviewer Comments
                    </Title>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <Paragraph>{conferenceDetails.reviewerComment}</Paragraph>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Documents Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card
                title={
                  <span className="flex items-center">
                    <FileTextOutlined className="mr-2 text-teal-500" />
                    Conference Documents
                  </span>
                }
                className="shadow-md rounded-xl border-0 mb-8"
                extra={
                  <Button
                    type="primary"
                    icon={<FileTextOutlined />}
                    className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none"
                  >
                    Upload Document
                  </Button>
                }
              >
                {conferenceDetails.documents &&
                conferenceDetails.documents.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={conferenceDetails.documents}
                    renderItem={(doc, index) => (
                      <List.Item
                        actions={[
                          <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            size="small"
                            className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none"
                          >
                            Download
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              icon={<FileTextOutlined />}
                              className="bg-teal-100 text-teal-600"
                            />
                          }
                          title={doc.fileName || `Document ${index + 1}`}
                          description={
                            doc.uploadedAt
                              ? `Uploaded on ${formatDate(doc.uploadedAt)}`
                              : "No upload date"
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty
                    description="No documents uploaded yet"
                    className="py-8"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Project Info and Status */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card
                title={
                  <span className="flex items-center">
                    <ProjectOutlined className="mr-2 text-orange-500" />
                    Related Project
                  </span>
                }
                className="shadow-md rounded-xl border-0 mb-8"
              >
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {conferenceDetails.projectName}
                  </h3>
                  <div className="flex items-center">
                    <Tag
                      color={
                        conferenceDetails.projectStatus === 1
                          ? "success"
                          : "warning"
                      }
                      className="rounded-full px-3 py-1"
                    >
                      {conferenceDetails.projectStatus === 1
                        ? "Approved"
                        : "Pending"}
                    </Tag>
                  </div>
                </div>
                <Button
                  type="primary"
                  block
                  onClick={() =>
                    navigate(`/project-details/${conferenceDetails.projectId}`)
                  }
                  className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none shadow-sm"
                >
                  View Project
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card
                title={
                  <span className="flex items-center">
                    <DollarOutlined className="mr-2 text-green-500" />
                    Financial Information
                  </span>
                }
                className="shadow-md rounded-xl border-0 mb-8"
              >
                <Statistic
                  title="Conference Funding"
                  value={conferenceDetails.conferenceFunding || 0}
                  precision={0}
                  formatter={(value) => formatCurrency(value)}
                  valueStyle={{ color: "#3f8600" }}
                  className="mb-4"
                />

                <Button
                  type="primary"
                  icon={<DollarOutlined />}
                  className="mt-4 w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none"
                >
                  Manage Expenses
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card
                title={
                  <span className="flex items-center">
                    <CalendarOutlined className="mr-2 text-teal-500" />
                    Key Dates
                  </span>
                }
                className="shadow-md rounded-xl border-0"
              >
                <Timeline>
                  {conferenceDetails.acceptanceDate &&
                    new Date(conferenceDetails.acceptanceDate).getFullYear() >
                      1 && (
                      <Timeline.Item
                        color="green"
                        dot={
                          <CheckCircleOutlined className="timeline-clock-icon" />
                        }
                      >
                        <p>Paper Accepted</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(conferenceDetails.acceptanceDate)}
                        </p>
                      </Timeline.Item>
                    )}

                  {conferenceDetails.presentationDate &&
                    new Date(conferenceDetails.presentationDate).getFullYear() >
                      1 && (
                      <Timeline.Item
                        color={
                          new Date() >
                          new Date(conferenceDetails.presentationDate)
                            ? "green"
                            : "blue"
                        }
                        dot={
                          new Date() >
                          new Date(conferenceDetails.presentationDate) ? (
                            <CheckCircleOutlined className="timeline-clock-icon" />
                          ) : (
                            <ClockCircleOutlined className="timeline-clock-icon" />
                          )
                        }
                      >
                        <p>Presentation Date</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(conferenceDetails.presentationDate)}
                        </p>
                      </Timeline.Item>
                    )}
                </Timeline>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Conference Details Update Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <EditOutlined className="text-teal-500 mr-2" />
            <span>Update Conference Details</span>
          </div>
        }
        open={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className="bg-teal-50 p-4 rounded-lg mb-4 border border-teal-200">
          <div className="flex items-start">
            <InfoCircleOutlined className="text-teal-500 text-lg mt-1 mr-3" />
            <div>
              <Text strong className="text-teal-700">
                Update Conference Details
              </Text>
              <Text className="text-teal-600 block">
                Please update the details for this approved conference
                submission.
              </Text>
            </div>
          </div>
        </div>

        <Form
          form={detailsForm}
          layout="vertical"
          onFinish={handleDetailsSubmit}
        >
          <Form.Item
            name="location"
            label="Conference Location"
            rules={[
              {
                required: true,
                message: "Please enter the conference location",
              },
            ]}
          >
            <Input placeholder="Enter the conference location" />
          </Form.Item>

          <Form.Item
            name="acceptanceDate"
            label="Acceptance Date"
            rules={[
              { required: true, message: "Please select the acceptance date" },
            ]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="presentationDate"
            label="Presentation Date"
            rules={[
              {
                required: true,
                message: "Please select the presentation date",
              },
            ]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="conferenceFunding"
            label="Conference Funding (VND)"
            rules={[
              { required: true, message: "Please enter the funding amount" },
              { type: "number", min: 0, message: "Funding cannot be negative" },
            ]}
          >
            <InputNumber
              min={0}
              formatter={(value) =>
                `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/₫\s?|(,*)/g, "")}
              className="w-full"
            />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsDetailsModalVisible(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdatingDetails}
              disabled={isUpdatingDetails}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none"
            >
              {isUpdatingDetails ? "Updating..." : "Update Details"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ActivePaperDetails;
