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
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ActivePaperDetails = () => {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [isConferenceModalVisible, setIsConferenceModalVisible] =
    useState(false);
  const [isPublisherModalVisible, setIsPublisherModalVisible] = useState(false);
  const [isTravelExpenseModalVisible, setIsTravelExpenseModalVisible] =
    useState(false);
  const [form] = Form.useForm();

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

  if (!paper) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <Card
          className="mb-8 shadow-lg border-0 rounded-xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Tag
                  color={paper.type === "Conference" ? "blue" : "purple"}
                  className="px-4 py-1 rounded-full text-sm font-medium"
                >
                  {paper.type}
                </Tag>
                <Tag
                  color={paper.status === "accepted" ? "success" : "processing"}
                  className="px-4 py-1 rounded-full text-sm font-medium"
                >
                  {paper.status}
                </Tag>
              </div>
              <Title level={2} className="mb-4 text-gradient">
                {paper.title}
              </Title>
              <Paragraph className="text-gray-600 text-lg mb-4">
                {paper.abstract}
              </Paragraph>

              {/* Authors Section */}
              {paper.authors && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {paper.authors.map((author, index) => (
                    <Tag
                      key={index}
                      className="rounded-full px-3 py-1"
                      style={{
                        background:
                          "linear-gradient(135deg, #f0f2f5 0%, #e6e9ec 100%)",
                        border: "none",
                      }}
                    >
                      <Space>
                        <UserOutlined />
                        {author.name}
                      </Space>
                    </Tag>
                  ))}
                </div>
              )}
            </div>

            {/* Progress Circle */}
            <div className="flex flex-col items-center">
              <Progress
                type="circle"
                percent={paper.progress}
                strokeColor={{
                  "0%": "#F2722B",
                  "100%": "#FFA500",
                }}
                strokeWidth={8}
                width={120}
              />
              <Text className="mt-2 text-gray-600">Overall Progress</Text>
            </div>
          </div>
        </Card>

        {/* Main Content with Enhanced Grid */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            {/* Enhanced Milestones Card */}
            <Card
              title={
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold flex items-center gap-2">
                    <ClockCircleOutlined className="text-[#F2722B]" />
                    Milestones
                  </span>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setEditingMilestone({})}
                    className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-0 rounded-full"
                  >
                    Add Milestone
                  </Button>
                </div>
              }
              className="mb-6 shadow-md rounded-xl border-0"
              bodyStyle={{ padding: "24px" }}
            >
              <Timeline>
                {paper.milestones.map((milestone) => (
                  <Timeline.Item
                    key={milestone.id}
                    color={
                      milestone.status === "completed"
                        ? "#52c41a"
                        : milestone.status === "in_progress"
                        ? "#F2722B"
                        : "#d9d9d9"
                    }
                    dot={
                      milestone.status === "completed" ? (
                        <CheckCircleOutlined className="text-success" />
                      ) : milestone.status === "in_progress" ? (
                        <ClockCircleOutlined className="text-[#F2722B]" />
                      ) : (
                        <CloseCircleOutlined className="text-gray-400" />
                      )
                    }
                  >
                    <Card
                      size="small"
                      className="mb-4 hover:shadow-md transition-shadow duration-300"
                      bordered={false}
                      style={{ background: "#f8f9fa" }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <Text strong className="text-lg">
                            {milestone.title}
                          </Text>
                          <div className="mt-2">
                            <Tag color="blue" className="rounded-full">
                              <CalendarOutlined className="mr-1" />
                              {milestone.deadline}
                            </Tag>
                          </div>
                          {milestone.notes && (
                            <Paragraph className="text-gray-600 mt-2 mb-0">
                              {milestone.notes}
                            </Paragraph>
                          )}
                        </div>
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => handleMilestoneEdit(milestone)}
                          className="hover:text-[#F2722B]"
                        />
                      </div>
                    </Card>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>

            {/* Enhanced Conference/Journal Specific Cards */}
            {paper.type === "Conference" ? (
              <Card
                title={
                  <span className="text-lg font-semibold flex items-center gap-2">
                    <GlobalOutlined className="text-[#F2722B]" />
                    Conference Details
                  </span>
                }
                className="mb-6 shadow-md rounded-xl border-0"
                bodyStyle={{ padding: "24px" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Descriptions column={1} className="conference-details">
                      <Descriptions.Item
                        label={
                          <>
                            <EnvironmentOutlined /> Location
                          </>
                        }
                      >
                        {paper.conferenceDetails.location}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={
                          <>
                            <CalendarOutlined /> Date
                          </>
                        }
                      >
                        {paper.conferenceDetails.date}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={
                          <>
                            <GlobalOutlined /> Presentation
                          </>
                        }
                      >
                        {paper.conferenceDetails.presentationType}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                  <div className="flex flex-col gap-4">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => setIsConferenceModalVisible(true)}
                      className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-0"
                      block
                    >
                      Update Conference Details
                    </Button>
                    <Button
                      icon={<DollarOutlined />}
                      onClick={() => setIsTravelExpenseModalVisible(true)}
                      className="border-[#F2722B] text-[#F2722B] hover:text-white hover:bg-[#F2722B]"
                      block
                    >
                      Submit Travel Expense
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card
                title={
                  <span className="text-lg font-semibold flex items-center gap-2">
                    <BookOutlined className="text-[#F2722B]" />
                    Publisher History
                  </span>
                }
                className="mb-6 shadow-md rounded-xl border-0"
              >
                <Timeline>
                  {paper.publisherHistory.map((history, index) => (
                    <Timeline.Item
                      key={index}
                      color={
                        history.status === "approved"
                          ? "#52c41a"
                          : history.status === "rejected"
                          ? "#ff4d4f"
                          : "#F2722B"
                      }
                    >
                      <Card
                        size="small"
                        className="mb-4 hover:shadow-md transition-shadow duration-300"
                        bordered={false}
                        style={{ background: "#f8f9fa" }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <Text strong className="text-lg">
                              {history.name}
                            </Text>
                            <div className="mt-2 space-y-1">
                              <Tag color="blue" className="rounded-full">
                                <CalendarOutlined className="mr-1" />
                                {history.submissionDate}
                              </Tag>
                              <Tag
                                color={
                                  history.status === "approved"
                                    ? "success"
                                    : history.status === "rejected"
                                    ? "error"
                                    : "processing"
                                }
                                className="rounded-full"
                              >
                                {history.status}
                              </Tag>
                            </div>
                            {history.notes && (
                              <Paragraph className="text-gray-600 mt-2 mb-0">
                                {history.notes}
                              </Paragraph>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Timeline.Item>
                  ))}
                </Timeline>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsPublisherModalVisible(true)}
                  className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-0 mt-4"
                  block
                >
                  Update Publisher Status
                </Button>
              </Card>
            )}
          </Col>

          <Col xs={24} lg={8}>
            {/* Enhanced Status Card */}
            <Card
              title={
                <span className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircleOutlined className="text-[#F2722B]" />
                  Status & Actions
                </span>
              }
              className="mb-6 shadow-md rounded-xl border-0"
            >
              <Space direction="vertical" className="w-full">
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-0"
                  block
                >
                  Mark as Complete
                </Button>
                {paper.type === "Journal" && (
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => setIsPublisherModalVisible(true)}
                    className="border-[#F2722B] text-[#F2722B] hover:text-white hover:bg-[#F2722B]"
                    block
                  >
                    Add New Publisher
                  </Button>
                )}
              </Space>
            </Card>

            {/* Enhanced Info Cards */}
            {paper.keywords && (
              <Card
                title={
                  <span className="text-lg font-semibold flex items-center gap-2">
                    <TagsOutlined className="text-[#F2722B]" />
                    Keywords
                  </span>
                }
                className="mb-6 shadow-md rounded-xl border-0"
              >
                <div className="flex flex-wrap gap-2">
                  {paper.keywords.map((keyword, index) => (
                    <Tag
                      key={index}
                      className="rounded-full px-3 py-1"
                      style={{
                        background:
                          "linear-gradient(135deg, #f0f2f5 0%, #e6e9ec 100%)",
                        border: "none",
                      }}
                    >
                      {keyword}
                    </Tag>
                  ))}
                </div>
              </Card>
            )}

            {/* Travel Expense Status Card */}
            {paper.type === "Conference" &&
              paper.conferenceDetails?.travelExpense && (
                <Card
                  title={
                    <span className="text-lg font-semibold flex items-center gap-2">
                      <DollarOutlined className="text-[#F2722B]" />
                      Travel Expense Status
                    </span>
                  }
                  className="mb-6 shadow-md rounded-xl border-0"
                >
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Descriptions column={1}>
                        <Descriptions.Item label="Status">
                          <Tag
                            color={
                              paper.conferenceDetails.travelExpense.status ===
                              "approved"
                                ? "success"
                                : "processing"
                            }
                            className="rounded-full"
                          >
                            {paper.conferenceDetails.travelExpense.status}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Amount">
                          <Text className="text-lg font-semibold">
                            ₫
                            {paper.conferenceDetails.travelExpense.amount.toLocaleString()}
                          </Text>
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                    <Paragraph className="text-gray-600">
                      {paper.conferenceDetails.travelExpense.details}
                    </Paragraph>
                  </div>
                </Card>
              )}
          </Col>
        </Row>

        {/* Modals */}
        <Modal
          title="Edit Milestone"
          visible={!!editingMilestone}
          onCancel={() => setEditingMilestone(null)}
          footer={null}
        >
          <Form form={form} onFinish={handleMilestoneSave} layout="vertical">
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="deadline"
              label="Deadline"
              rules={[{ required: true }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="in_progress">In Progress</Select.Option>
                <Select.Option value="completed">Completed</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="notes" label="Notes">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Space className="w-full justify-end">
                <Button onClick={() => setEditingMilestone(null)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Update Conference Details"
          visible={isConferenceModalVisible}
          onCancel={() => setIsConferenceModalVisible(false)}
          footer={null}
        >
          <Form onFinish={handleConferenceUpdate} layout="vertical">
            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              name="presentationType"
              label="Presentation Type"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="oral">Oral Presentation</Select.Option>
                <Select.Option value="poster">
                  Poster Presentation
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Space className="w-full justify-end">
                <Button onClick={() => setIsConferenceModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Submit Travel Expense"
          visible={isTravelExpenseModalVisible}
          onCancel={() => setIsTravelExpenseModalVisible(false)}
          footer={null}
        >
          <Form onFinish={handleTravelExpenseSubmit} layout="vertical">
            <Form.Item
              name="amount"
              label="Amount (₫)"
              rules={[{ required: true }]}
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
              name="details"
              label="Expense Details"
              rules={[{ required: true }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item name="documents" label="Supporting Documents">
              <Upload>
                <Button icon={<UploadOutlined />}>Upload Files</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Space className="w-full justify-end">
                <Button onClick={() => setIsTravelExpenseModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Update Publisher Status"
          visible={isPublisherModalVisible}
          onCancel={() => setIsPublisherModalVisible(false)}
          footer={null}
        >
          <Form onFinish={handlePublisherUpdate} layout="vertical">
            <Form.Item
              name="publisherName"
              label="Publisher Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="submitted">Submitted</Select.Option>
                <Select.Option value="under_review">Under Review</Select.Option>
                <Select.Option value="approved">Approved</Select.Option>
                <Select.Option value="rejected">Rejected</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="doi" label="DOI (if approved)">
              <Input />
            </Form.Item>
            <Form.Item name="notes" label="Notes">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Space className="w-full justify-end">
                <Button onClick={() => setIsPublisherModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

// Add these styles to your CSS
const styles = `
.text-gradient {
  background: linear-gradient(to right, #F2722B, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.conference-details .ant-descriptions-item-label {
  color: #666;
}

.ant-timeline-item-head {
  background-color: #fff;
}

.ant-card {
  transition: all 0.3s ease;
}

.ant-card:hover {
  transform: translateY(-2px);
}

.ant-tag {
  transition: all 0.3s ease;
}

.ant-tag:hover {
  transform: scale(1.05);
}

.ant-btn {
  transition: all 0.3s ease;
}

.ant-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
`;

export default ActivePaperDetails;
