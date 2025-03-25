import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  Table,
  Space,
  Tag,
  Typography,
  Popconfirm,
  Modal,
  Select,
  Row,
  Col,
  Timeline,
  Divider,
  message,
  Tooltip,
  Badge,
} from "antd";
import {
  CalendarOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  FieldTimeOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const TimelineManagement = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timelineGroups, setTimelineGroups] = useState([
    {
      id: 1,
      name: "Research Project Cycle 2024",
      description: "Main timeline for research project management",
      color: "#F2722B",
    },
    {
      id: 2,
      name: "Fund Disbursement Cycle",
      description: "Timeline for fund management and disbursement",
      color: "#4CAF50",
    },
  ]);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [groupForm] = Form.useForm();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Mock data for demonstration - replace with API calls in production
  useEffect(() => {
    // Simulate loading data from an API
    setLoading(true);
    setTimeout(() => {
      setTimelineData([
        {
          id: 1,
          groupId: 1,
          name: "Project Registration Period",
          description: "Open registration for new research projects",
          startDate: "2025-06-01",
          endDate: "2025-06-15",
          type: "registration",
          status: "upcoming",
          department: "All",
        },
        {
          id: 2,
          groupId: 1,
          name: "Project Review Period",
          description: "Review and approval of submitted research projects",
          startDate: "2025-06-16",
          endDate: "2025-06-30",
          type: "review",
          status: "delayed",
          department: "All",
        },
        {
          id: 3,
          groupId: 1,
          name: "Conference Paper Submissions",
          description: "Deadline for conference paper submissions",
          startDate: "2025-08-01",
          endDate: "2025-08-15",
          type: "submission",
          status: "in_review",
          department: "Computer Science",
        },
        {
          id: 4,
          groupId: 1,
          name: "Budget Allocation Review",
          description: "Review and approve department budget allocations",
          startDate: "2025-09-01",
          endDate: "2025-09-10",
          type: "budget",
          status: "upcoming",
          department: "All",
        },
        {
          id: 5,
          groupId: 1,
          name: "Journal Publication Deadline",
          description: "Deadline for journal publication submissions",
          startDate: "2025-10-01",
          endDate: "2025-10-31",
          type: "submission",
          status: "on_hold",
          department: "Electrical Engineering",
        },
        {
          id: 6,
          groupId: 2,
          name: "Initial Budget Assessment",
          description:
            "Review and assess initial budget requirements for all departments",
          startDate: "2025-03-01",
          endDate: "2025-03-15",
          type: "budget",
          status: "upcoming",
          department: "All",
        },
        {
          id: 7,
          groupId: 2,
          name: "Q1 Fund Release",
          description: "First quarter fund disbursement for approved projects",
          startDate: "2025-04-01",
          endDate: "2025-04-07",
          type: "budget",
          status: "active",
          department: "All",
        },
        {
          id: 8,
          groupId: 2,
          name: "Mid-Year Budget Review",
          description:
            "Comprehensive review of budget utilization and adjustments",
          startDate: "2025-06-15",
          endDate: "2025-06-30",
          type: "review",
          status: "upcoming",
          department: "All",
        },
        {
          id: 9,
          groupId: 2,
          name: "Emergency Fund Allocation",
          description: "Special allocation for urgent research requirements",
          startDate: "2025-05-01",
          endDate: "2025-05-05",
          type: "budget",
          status: "on_hold",
          department: "Computer Science",
        },
        {
          id: 10,
          groupId: 2,
          name: "Q2 Fund Release",
          description: "Second quarter fund disbursement for ongoing projects",
          startDate: "2026-01-01",
          endDate: "2026-01-07",
          type: "budget",
          status: "upcoming",
          department: "All",
        },
        {
          id: 11,
          groupId: 2,
          name: "Budget Utilization Report",
          description: "Detailed reporting of fund utilization by departments",
          startDate: "2026-02-15",
          endDate: "2026-02-28",
          type: "review",
          status: "upcoming",
          department: "All",
        },
        {
          id: 12,
          groupId: 2,
          name: "Special Grant Disbursement",
          description: "Distribution of additional research grants",
          startDate: "2026-03-01",
          endDate: "2026-03-15",
          type: "budget",
          status: "upcoming",
          department: "Electrical Engineering",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddTimeline = (values) => {
    // Add limit check (example: 20 timelines)
    if (timelineData.length >= 20) {
      message.error("Maximum number of timelines (20) reached");
      return;
    }

    const { name, dateRange, description, type, department, timelineGroup } =
      values;
    const newTimeline = {
      id: timelineData.length + 1,
      groupId: timelineGroup,
      name,
      description,
      startDate: dateRange[0].format("YYYY-MM-DD"),
      endDate: dateRange[1].format("YYYY-MM-DD"),
      type,
      status: moment().isBefore(dateRange[0])
        ? "upcoming"
        : moment().isAfter(dateRange[1])
        ? "completed"
        : "active",
      department,
    };

    setTimelineData([...timelineData, newTimeline]);
    form.resetFields();
    message.success("Timeline added successfully");
  };

  const handleEditTimeline = (values) => {
    const { name, dateRange, description, type, department } = values;
    const updatedTimelineData = timelineData.map((item) => {
      if (item.id === editingTimeline.id) {
        return {
          ...item,
          name,
          description,
          startDate: dateRange[0].format("YYYY-MM-DD"),
          endDate: dateRange[1].format("YYYY-MM-DD"),
          type,
          status: moment().isBefore(dateRange[0])
            ? "upcoming"
            : moment().isAfter(dateRange[1])
            ? "completed"
            : "active",
          department,
        };
      }
      return item;
    });

    setTimelineData(updatedTimelineData);
    setIsModalVisible(false);
    setEditingTimeline(null);
    message.success("Timeline updated successfully");
  };

  const handleDeleteTimeline = (id) => {
    const updatedTimelineData = timelineData.filter((item) => item.id !== id);
    setTimelineData(updatedTimelineData);
    message.success("Timeline deleted successfully");
  };

  const showEditModal = (record) => {
    setEditingTimeline(record);
    editForm.setFieldsValue({
      name: record.name,
      description: record.description,
      dateRange: [moment(record.startDate), moment(record.endDate)],
      type: record.type,
      department: record.department,
    });
    setIsModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "blue";
      case "active":
        return "green";
      case "completed":
        return "gray";
      case "delayed":
        return "orange";
      case "cancelled":
        return "red";
      case "on_hold":
        return "gold";
      case "in_review":
        return "geekblue";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "registration":
        return <PlusOutlined />;
      case "review":
        return <CheckCircleOutlined />;
      case "submission":
        return <CalendarOutlined />;
      case "budget":
        return <TeamOutlined />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center space-x-2">
          <Tag
            color="orange"
            icon={getTypeIcon(record.type)}
            className="mr-2 py-1 px-2"
          >
            {record.type.toUpperCase()}
          </Tag>
          <Text strong>{text}</Text>
        </div>
      ),
    },
    {
      title: "Period",
      key: "period",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center">
            <CalendarOutlined className="text-[#F2722B] mr-2" />
            <Text>{`${record.startDate} — ${record.endDate}`}</Text>
          </div>
          <Tag color={getStatusColor(record.status)} className="ml-0">
            {record.status.toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Text
          ellipsis={{ tooltip: text }}
          className="max-w-xs block"
          type="secondary"
        >
          {text}
        </Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            className="text-blue-500 hover:text-blue-700"
          />
          <Popconfirm
            title="Are you sure you want to delete this timeline?"
            onConfirm={() => handleDeleteTimeline(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              className="hover:text-red-700"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Generate timeline visualization based on data
  const generateTimelineItems = (groupId) => {
    const groupTimelines = timelineData
      .filter((item) => item.groupId === groupId)
      .sort((a, b) => moment(a.startDate) - moment(b.startDate));

    return groupTimelines.map((item) => {
      const isActive = item.status === "active";
      const isCompleted = item.status === "completed";
      const isExpired = moment().isAfter(moment(item.endDate));
      const canEdit = !isCompleted && !isExpired;

      return (
        <Timeline.Item
          key={item.id}
          color={getStatusColor(item.status)}
          dot={
            isActive ? (
              <ClockCircleOutlined className="timeline-clock-icon" />
            ) : undefined
          }
        >
          <div className={`p-4 ${isCompleted ? "opacity-60" : ""}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Text strong>{item.name}</Text>
                <div className="text-sm text-gray-500">
                  {`${item.startDate} — ${item.endDate}`}
                </div>
                <div className="mt-1">
                  <Tag color="purple">{item.department}</Tag>
                  <Tag color="orange">{item.type.toUpperCase()}</Tag>
                </div>
                <div className="mt-2 text-sm">{item.description}</div>
              </div>
              {canEdit && (
                <Space className="ml-4">
                  <Tooltip title="Edit Timeline">
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => showEditModal(item)}
                      className="text-blue-500 hover:text-blue-700"
                      size="small"
                    />
                  </Tooltip>
                  <Tooltip title="Delete Timeline">
                    <Popconfirm
                      title="Are you sure you want to delete this timeline?"
                      onConfirm={() => handleDeleteTimeline(item.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        className="hover:text-red-700"
                        size="small"
                      />
                    </Popconfirm>
                  </Tooltip>
                </Space>
              )}
            </div>
            {(isCompleted || isExpired) && (
              <Tag color="red" className="mt-2">
                {isCompleted ? "COMPLETED" : "EXPIRED"}
              </Tag>
            )}
          </div>
        </Timeline.Item>
      );
    });
  };

  const showCreateGroupModal = () => {
    setIsSelectOpen(false);
    setTimeout(() => {
      setIsGroupModalVisible(true);
    }, 100);
  };

  const handleCreateGroup = (values) => {
    const newGroup = {
      id: timelineGroups.length + 1,
      name: values.name,
      description: values.description,
      color:
        values.color || "#" + Math.floor(Math.random() * 16777215).toString(16), // Random color if none selected
    };

    setTimelineGroups([...timelineGroups, newGroup]);
    setIsGroupModalVisible(false);
    groupForm.resetFields();
    message.success("Timeline sequence created successfully");
  };

  useEffect(() => {
    if (form.getFieldValue("timelineGroup")) {
      setSelectedGroup(form.getFieldValue("timelineGroup"));
    }
  }, [form.getFieldValue("timelineGroup")]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F2722B] to-[#FFA500] mb-2">
              System Timeline Management
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#F2722B] to-[#FFA500] rounded-full"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Manage and control system-wide timelines for registration periods,
            reviews, submissions, and other important events
          </p>
        </div>

        <Row gutter={[24, 24]}>
          {/* Timeline Visualization */}
          <Col xs={24} lg={10}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                title={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CalendarOutlined className="text-[#F2722B]" />
                      <span>Event Timeline Visualization</span>
                    </div>
                  </div>
                }
                className="shadow-md rounded-xl overflow-hidden border-0"
                bodyStyle={{ height: "500px", overflowY: "auto" }}
              >
                {selectedGroup ? (
                  <Timeline mode="left" className="mt-4 ml-4">
                    {timelineGroups
                      .filter((group) => group.id === selectedGroup)
                      .map((group) => (
                        <React.Fragment key={group.id}>
                          <Timeline.Item
                            dot={
                              <div
                                style={{ backgroundColor: group.color }}
                                className="w-4 h-4 rounded-full"
                              />
                            }
                          >
                            <Text strong className="text-lg">
                              {group.name}
                            </Text>
                            <Text type="secondary" className="block text-sm">
                              {group.description}
                            </Text>
                          </Timeline.Item>
                          {generateTimelineItems(group.id)}
                        </React.Fragment>
                      ))}
                  </Timeline>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <FieldTimeOutlined className="text-4xl text-gray-300 mb-4" />
                    <Text className="text-lg text-gray-500 mb-2">
                      No Timeline Sequence Selected
                    </Text>
                    <Text type="secondary">
                      Please select a Timeline Sequence from the dropdown in the
                      "Create New Timeline" form to view its events.
                    </Text>
                    <div className="mt-4 flex items-center space-x-2 text-[#F2722B]">
                      <ArrowRightOutlined />
                      <Text className="text-[#F2722B]">
                        Select from {timelineGroups.length} available sequences
                      </Text>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </Col>

          {/* Add Timeline Form */}
          <Col xs={24} lg={14}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card
                title={
                  <div className="flex items-center space-x-2">
                    <PlusOutlined className="text-[#F2722B]" />
                    <span>Create New Timeline</span>
                  </div>
                }
                className="shadow-md rounded-xl border-0 mb-6"
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleAddTimeline}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="timelineGroup"
                        label="Timeline Sequence"
                        rules={[
                          {
                            required: true,
                            message:
                              "Please select or create a timeline sequence",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select or create timeline sequence"
                          open={isSelectOpen}
                          onDropdownVisibleChange={(visible) =>
                            setIsSelectOpen(visible)
                          }
                          onChange={(value) => {
                            setSelectedGroup(value); // Sync the visualization when form selection changes
                          }}
                          dropdownRender={(menu) => (
                            <>
                              {menu}
                              <Divider style={{ margin: "8px 0" }} />
                              <Button
                                type="text"
                                icon={<PlusOutlined />}
                                onClick={() => showCreateGroupModal()}
                                style={{ width: "100%" }}
                              >
                                Create New Sequence
                              </Button>
                            </>
                          )}
                        >
                          {timelineGroups.map((group) => (
                            <Option key={group.id} value={group.id}>
                              <Tag color={group.color}>{group.name}</Tag>
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="name"
                        label="Timeline Name"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the timeline name",
                          },
                        ]}
                      >
                        <Input placeholder="e.g., Project Registration Period" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="type"
                        label="Timeline Type"
                        rules={[
                          {
                            required: true,
                            message: "Please select the timeline type",
                          },
                        ]}
                      >
                        <Select placeholder="Select timeline type">
                          <Option value="registration">Registration</Option>
                          <Option value="review">Review</Option>
                          <Option value="submission">Submission</Option>
                          <Option value="budget">Budget</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="dateRange"
                        label="Date Range"
                        rules={[
                          {
                            required: true,
                            message: "Please select date range",
                          },
                        ]}
                      >
                        <RangePicker className="w-full" format="YYYY-MM-DD" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="department"
                        label="Department"
                        rules={[
                          {
                            required: true,
                            message: "Please select department",
                          },
                        ]}
                      >
                        <Select placeholder="Select department">
                          <Option value="All">All Departments</Option>
                          <Option value="Computer Science">
                            Computer Science
                          </Option>
                          <Option value="Information Technology">
                            Information Technology
                          </Option>
                          <Option value="Electrical Engineering">
                            Electrical Engineering
                          </Option>
                          <Option value="Mechanical Engineering">
                            Mechanical Engineering
                          </Option>
                          <Option value="Business Administration">
                            Business Administration
                          </Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                      {
                        required: true,
                        message: "Please enter a description",
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Provide details about this timeline"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
                    >
                      Create Timeline
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </motion.div>

            {/* Timeline Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card
                title={
                  <div className="flex items-center space-x-2">
                    <CalendarOutlined className="text-[#F2722B]" />
                    <span>All Timelines</span>
                  </div>
                }
                className="shadow-md rounded-xl border-0"
              >
                <Table
                  columns={columns}
                  dataSource={timelineData}
                  loading={loading}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  scroll={{ x: "max-content" }}
                  className="timeline-table"
                  rowClassName="timeline-table-row"
                />
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Edit Modal */}
        <Modal
          title="Edit Timeline"
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingTimeline(null);
          }}
          footer={null}
        >
          <Form form={editForm} layout="vertical" onFinish={handleEditTimeline}>
            <Form.Item
              name="name"
              label="Timeline Name"
              rules={[
                {
                  required: true,
                  message: "Please enter the timeline name",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="dateRange"
              label="Date Range"
              rules={[
                {
                  required: true,
                  message: "Please select date range",
                },
              ]}
            >
              <RangePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              name="type"
              label="Timeline Type"
              rules={[
                {
                  required: true,
                  message: "Please select the timeline type",
                },
              ]}
            >
              <Select>
                <Option value="registration">Registration</Option>
                <Option value="review">Review</Option>
                <Option value="submission">Submission</Option>
                <Option value="budget">Budget</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="department"
              label="Department"
              rules={[
                {
                  required: true,
                  message: "Please select department",
                },
              ]}
            >
              <Select>
                <Option value="All">All Departments</Option>
                <Option value="Computer Science">Computer Science</Option>
                <Option value="Information Technology">
                  Information Technology
                </Option>
                <Option value="Electrical Engineering">
                  Electrical Engineering
                </Option>
                <Option value="Mechanical Engineering">
                  Mechanical Engineering
                </Option>
                <Option value="Business Administration">
                  Business Administration
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: "Please enter a description",
                },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <Space className="w-full justify-end">
                <Button
                  onClick={() => {
                    setIsModalVisible(false);
                    setEditingTimeline(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
                >
                  Update
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Create New Timeline Sequence Modal */}
        <Modal
          title="Create New Timeline Sequence"
          open={isGroupModalVisible}
          onCancel={() => {
            setIsGroupModalVisible(false);
            groupForm.resetFields();
          }}
          footer={null}
        >
          <Form form={groupForm} layout="vertical" onFinish={handleCreateGroup}>
            <Form.Item
              name="name"
              label="Sequence Name"
              rules={[
                {
                  required: true,
                  message: "Please enter the sequence name",
                },
              ]}
            >
              <Input placeholder="e.g., Research Grant Cycle 2024" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Sequence Description"
              rules={[
                {
                  required: true,
                  message: "Please enter a description",
                },
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Describe the purpose of this timeline sequence"
              />
            </Form.Item>

            <Form.Item
              name="color"
              label="Sequence Color"
              help="Choose a color to identify this sequence (optional)"
            >
              <Select placeholder="Select a color">
                <Option value="#F2722B">Orange</Option>
                <Option value="#4CAF50">Green</Option>
                <Option value="#2196F3">Blue</Option>
                <Option value="#9C27B0">Purple</Option>
                <Option value="#E91E63">Pink</Option>
                <Option value="#FF9800">Amber</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space className="w-full justify-end">
                <Button
                  onClick={() => {
                    setIsGroupModalVisible(false);
                    groupForm.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
                >
                  Create Sequence
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default TimelineManagement;
