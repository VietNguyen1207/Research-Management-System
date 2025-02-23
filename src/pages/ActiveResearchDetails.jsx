import React, { useState } from "react";
import {
  Card,
  Tag,
  Timeline,
  Button,
  Modal,
  Form,
  DatePicker,
  Input,
  message,
  Dropdown,
  Space,
  Upload,
  Progress,
  List,
  Avatar,
  Tabs,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  ProjectOutlined,
  TeamOutlined,
  CalendarOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  UserOutlined,
  EditOutlined,
  MoreOutlined,
  UploadOutlined,
  DollarOutlined,
  FileTextOutlined,
  PlusOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

// Move mock data outside the component
const approvedProjects = [
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
    methodology:
      "The research employs a mixed-methods approach combining quantitative analysis of healthcare data with qualitative assessment of system implementation...",
    innovative_aspects:
      "This research introduces novel deep learning architectures specifically designed for healthcare diagnostics...",
    research_subjects:
      "The study will involve analysis of anonymized patient records, healthcare practitioners' workflow patterns...",
    research_scope:
      "The research encompasses three major city hospitals in Vietnam...",
    scientific_significance:
      "This research advances the field of medical AI by developing new algorithms...",
    practical_significance:
      "The outcomes will directly improve patient care through faster diagnosis...",

    department: {
      id: 1,
      name: "Computer Science",
    },
    category: {
      id: 1,
      name: "AI & Machine Learning",
    },
    approvedBudget: 500000000,

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
        id: 1,
        title: "Literature Review",
        deadline: "2024-04-30",
        status: "completed",
      },
      {
        id: 2,
        title: "Data Collection",
        deadline: "2024-07-31",
        status: "in_progress",
      },
      {
        id: 3,
        title: "Algorithm Development",
        deadline: "2024-11-30",
        status: "pending",
      },
    ],
  },
];

const ActiveResearchDetails = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState(approvedProjects);
  const [activeTab, setActiveTab] = useState("milestones");
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const handleUpdateMilestone = (project) => {
    setSelectedProject(project);
    setIsModalVisible(true);
    form.setFieldsValue({
      milestones: project.projectMilestones,
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      // Here you would typically make an API call to update the milestones
      message.success("Milestones updated successfully");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleStatusChange = (projectId, milestoneId, newStatus) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            projectMilestones: project.projectMilestones.map((milestone) =>
              milestone.id === milestoneId
                ? { ...milestone, status: newStatus }
                : milestone
            ),
          };
        }
        return project;
      })
    );

    message.success({
      content: (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Space>
            <CheckOutlined style={{ color: "#52c41a" }} />
            {`Status updated successfully`}
          </Space>
        </motion.div>
      ),
      className: "custom-message",
      duration: 2,
    });
  };

  const getStatusMenuItems = (projectId, milestone) => [
    {
      key: "pending",
      label: "Pending",
      onClick: () => handleStatusChange(projectId, milestone.id, "pending"),
    },
    {
      key: "in_progress",
      label: "In Progress",
      onClick: () => handleStatusChange(projectId, milestone.id, "in_progress"),
    },
    {
      key: "completed",
      label: "Completed",
      onClick: () => handleStatusChange(projectId, milestone.id, "completed"),
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return {
          icon: <CheckOutlined />,
          color: "green",
          tagColor: "success",
          label: "Completed",
        };
      case "in_progress":
        return {
          icon: <ClockCircleOutlined />,
          color: "blue",
          tagColor: "processing",
          label: "In Progress",
        };
      default:
        return {
          icon: <ClockCircleOutlined />,
          color: "gray",
          tagColor: "default",
          label: "Pending",
        };
    }
  };

  const handleOpenTaskModal = (project) => {
    setSelectedProject(project);
    setShowTaskModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
            Active Research Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Monitor and manage your ongoing research projects efficiently
          </p>
        </div>

        {/* Projects Grid */}
        <div className="space-y-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 rounded-2xl">
                {/* Project Header */}
                <div className="px-8 pt-6 pb-4 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 font-display">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-4 flex-wrap">
                        <Tag
                          color="blue"
                          className="px-4 py-1.5 rounded-full text-sm font-medium"
                        >
                          {project.department.name}
                        </Tag>
                        <Tag
                          color="orange"
                          className="px-4 py-1.5 rounded-full text-sm font-medium"
                        >
                          {project.category.name}
                        </Tag>
                        <div className="text-sm text-gray-500 flex items-center">
                          <CalendarOutlined className="mr-2" />
                          <span>
                            {project.projectDuration.startDate} -{" "}
                            {project.projectDuration.endDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Project Overview */}
                    <div className="space-y-6">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 rounded-xl"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <ProjectOutlined className="text-orange-500 mr-2" />
                          Project Overview
                        </h4>

                        {/* Description */}
                        <div className="mb-6">
                          <h5 className="text-sm font-semibold text-gray-700 mb-2">
                            Description
                          </h5>
                          <p className="text-gray-700 leading-relaxed">
                            {project.description}
                          </p>
                        </div>

                        {/* Objectives */}
                        <div className="mb-6">
                          <h5 className="text-sm font-semibold text-gray-700 mb-2">
                            Objectives
                          </h5>
                          <ul className="list-disc list-inside space-y-2">
                            {project.objectives.map((objective, index) => (
                              <li key={index} className="text-gray-700">
                                {objective}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Methodology */}
                        <div className="mb-6">
                          <h5 className="text-sm font-semibold text-gray-700 mb-2">
                            Methodology
                          </h5>
                          <p className="text-gray-700 leading-relaxed">
                            {project.methodology}
                          </p>
                        </div>

                        {/* Research Scope */}
                        <div className="mb-6">
                          <h5 className="text-sm font-semibold text-gray-700 mb-2">
                            Research Scope
                          </h5>
                          <p className="text-gray-700 leading-relaxed">
                            {project.research_scope}
                          </p>
                        </div>

                        {/* Significance */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">
                              Scientific Significance
                            </h5>
                            <p className="text-gray-700 leading-relaxed">
                              {project.scientific_significance}
                            </p>
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">
                              Practical Significance
                            </h5>
                            <p className="text-gray-700 leading-relaxed">
                              {project.practical_significance}
                            </p>
                          </div>
                        </div>

                        {/* Budget */}
                        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
                          <h5 className="text-sm font-semibold text-gray-700 mb-2">
                            Approved Budget
                          </h5>
                          <div className="flex items-center text-lg font-medium text-green-600">
                            <span>
                              ₫ {project.approvedBudget.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Research Team */}
                    <div className="space-y-6">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-xl"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <TeamOutlined className="text-blue-500 mr-2" />
                          Research Team
                        </h4>

                        {/* Supervisor Card */}
                        <div className="mb-6">
                          <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="bg-orange-100 p-2 rounded-lg">
                              <UserOutlined className="text-orange-500 text-lg" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {project.supervisor.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {project.supervisor.role}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Team Members */}
                        <div className="space-y-4">
                          {project.researchGroup.members.map(
                            (member, index) => (
                              <motion.div
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-lg ${
                                      member.role === "Leader"
                                        ? "bg-orange-100"
                                        : "bg-gray-100"
                                    }`}
                                  >
                                    {member.role === "Leader" ? (
                                      <CrownOutlined className="text-orange-500 text-lg" />
                                    ) : (
                                      <UserOutlined className="text-gray-500 text-lg" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {member.name}
                                    </div>
                                    <Tag
                                      color={
                                        member.role === "Leader"
                                          ? "orange"
                                          : "default"
                                      }
                                      className="mt-1 rounded-full"
                                    >
                                      {member.role}
                                    </Tag>
                                  </div>
                                </div>
                              </motion.div>
                            )
                          )}
                        </div>
                      </motion.div>
                    </div>

                    {/* Project Milestones */}
                    <div className="space-y-6">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-green-50 to-green-100/50 p-6 rounded-xl"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                            <CalendarOutlined className="text-green-500 mr-2" />
                            Project Milestones
                          </h4>
                          <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => handleUpdateMilestone(project)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Update Milestones
                          </Button>
                        </div>

                        {/* Budget Progress */}
                        <div className="mb-6 bg-white rounded-xl p-4 shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-semibold text-gray-700">
                              Budget Progress
                            </h5>
                            <span className="text-sm text-gray-500">
                              {(
                                (project.current_budget /
                                  project.approvedBudget) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                              style={{
                                width: `${
                                  (project.current_budget /
                                    project.approvedBudget) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between mt-2 text-sm">
                            <span className="text-gray-600">
                              Used: ₫
                              {project.current_budget?.toLocaleString() || 0}
                            </span>
                            <span className="text-gray-600">
                              Total: ₫{project.approvedBudget.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Milestones Timeline */}
                        <Timeline className="mt-6">
                          {project.projectMilestones.map((milestone) => (
                            <Timeline.Item
                              key={milestone.id}
                              dot={
                                <motion.div
                                  initial={{ scale: 0.8 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleStatusChange(
                                      project.id,
                                      milestone.id,
                                      "completed"
                                    )
                                  }
                                >
                                  {getStatusStyle(milestone.status).icon}
                                </motion.div>
                              }
                              color={getStatusStyle(milestone.status).color}
                            >
                              <motion.div
                                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                                whileHover={{ scale: 1.02 }}
                              >
                                <div className="flex items-center justify-between group">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">
                                      {milestone.title}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1 flex items-center">
                                      <CalendarOutlined className="mr-1" />
                                      Deadline: {milestone.deadline}
                                    </div>
                                    <motion.div
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="mt-2 flex items-center gap-2"
                                    >
                                      <Tag
                                        color={
                                          getStatusStyle(milestone.status)
                                            .tagColor
                                        }
                                        className="cursor-pointer hover:opacity-80"
                                        onClick={() =>
                                          handleStatusChange(
                                            project.id,
                                            milestone.id,
                                            "completed"
                                          )
                                        }
                                      >
                                        {getStatusStyle(milestone.status).label}
                                      </Tag>
                                      {milestone.budget && (
                                        <Tag color="blue">
                                          ₫{milestone.budget.toLocaleString()}
                                        </Tag>
                                      )}
                                    </motion.div>
                                  </div>
                                  <Dropdown
                                    menu={{
                                      items: [
                                        ...getStatusMenuItems(
                                          project.id,
                                          milestone
                                        ),
                                        {
                                          key: "edit",
                                          label: "Edit Details",
                                          icon: <EditOutlined />,
                                          onClick: () =>
                                            handleUpdateMilestone(project),
                                        },
                                      ],
                                    }}
                                    trigger={["click"]}
                                  >
                                    <Button
                                      type="text"
                                      icon={<MoreOutlined />}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    />
                                  </Dropdown>
                                </div>
                              </motion.div>
                            </Timeline.Item>
                          ))}
                        </Timeline>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-100 pt-8">
                  <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    className="custom-tabs"
                    items={[
                      {
                        key: "milestones",
                        label: (
                          <span>
                            <CalendarOutlined className="mr-2" />
                            Milestones
                          </span>
                        ),
                        children: (
                          <div className="p-4">
                            {/* Existing Milestones Content */}
                            {/* ... Your existing milestone timeline ... */}
                          </div>
                        ),
                      },
                      {
                        key: "budget",
                        label: (
                          <span>
                            <DollarOutlined className="mr-2" />
                            Budget
                          </span>
                        ),
                        children: (
                          <div className="p-4">
                            <Row gutter={16} className="mb-6">
                              <Col span={8}>
                                <Card className="bg-green-50">
                                  <Statistic
                                    title="Total Budget"
                                    value={project.approvedBudget}
                                    precision={2}
                                    prefix="₫"
                                  />
                                </Card>
                              </Col>
                              <Col span={8}>
                                <Card className="bg-blue-50">
                                  <Statistic
                                    title="Spent"
                                    value={project.current_budget || 0}
                                    precision={2}
                                    prefix="₫"
                                  />
                                </Card>
                              </Col>
                              <Col span={8}>
                                <Card className="bg-orange-50">
                                  <Statistic
                                    title="Remaining"
                                    value={
                                      project.approvedBudget -
                                      (project.current_budget || 0)
                                    }
                                    precision={2}
                                    prefix="₫"
                                  />
                                </Card>
                              </Col>
                            </Row>

                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-lg font-semibold">
                                Expense Tracking
                              </h4>
                              <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setShowBudgetModal(true)}
                              >
                                Add Expense
                              </Button>
                            </div>

                            <List
                              className="demo-loadmore-list"
                              itemLayout="horizontal"
                              dataSource={project.expenses || []}
                              renderItem={(item) => (
                                <List.Item>
                                  <List.Item.Meta
                                    avatar={
                                      <DollarOutlined className="text-2xl text-green-500" />
                                    }
                                    title={item.description}
                                    description={`Date: ${item.date} | Category: ${item.category}`}
                                  />
                                  <div className="text-right">
                                    <div className="font-semibold text-lg">
                                      ₫{item.amount.toLocaleString()}
                                    </div>
                                    <Tag
                                      color={
                                        item.status === "approved"
                                          ? "success"
                                          : "processing"
                                      }
                                    >
                                      {item.status}
                                    </Tag>
                                  </div>
                                </List.Item>
                              )}
                            />
                          </div>
                        ),
                      },
                      {
                        key: "team",
                        label: (
                          <span>
                            <TeamOutlined className="mr-2" />
                            Team
                          </span>
                        ),
                        children: (
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-lg font-semibold">
                                Team Tasks
                              </h4>
                              <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => handleOpenTaskModal(project)}
                              >
                                Assign Task
                              </Button>
                            </div>

                            <List
                              className="demo-loadmore-list"
                              itemLayout="horizontal"
                              dataSource={project.tasks || []}
                              renderItem={(item) => (
                                <List.Item
                                  actions={[
                                    <Button type="link" key="edit">
                                      Edit
                                    </Button>,
                                    <Button type="link" key="complete">
                                      Complete
                                    </Button>,
                                  ]}
                                >
                                  <List.Item.Meta
                                    avatar={
                                      <Avatar src={item.assignee.avatar} />
                                    }
                                    title={item.title}
                                    description={
                                      <div>
                                        <div>{item.description}</div>
                                        <div className="mt-2">
                                          <Tag color="blue">
                                            {item.assignee.name}
                                          </Tag>
                                          <Tag
                                            color={
                                              item.priority === "high"
                                                ? "red"
                                                : "orange"
                                            }
                                          >
                                            {item.priority}
                                          </Tag>
                                        </div>
                                      </div>
                                    }
                                  />
                                  <div>
                                    <Tag
                                      color={
                                        getStatusStyle(item.status).tagColor
                                      }
                                    >
                                      {item.status}
                                    </Tag>
                                  </div>
                                </List.Item>
                              )}
                            />
                          </div>
                        ),
                      },
                      {
                        key: "documents",
                        label: (
                          <span>
                            <FileTextOutlined className="mr-2" />
                            Documents
                          </span>
                        ),
                        children: (
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-lg font-semibold">
                                Project Documents
                              </h4>
                              <Upload
                                action="/api/upload"
                                listType="text"
                                className="upload-list-inline"
                              >
                                <Button icon={<UploadOutlined />}>
                                  Upload Document
                                </Button>
                              </Upload>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {["Reports", "Datasets", "Drafts", "Other"].map(
                                (category) => (
                                  <Card
                                    key={category}
                                    title={category}
                                    className="shadow-sm hover:shadow-md transition-shadow"
                                    extra={
                                      <Button
                                        type="link"
                                        icon={<PlusOutlined />}
                                      >
                                        Add
                                      </Button>
                                    }
                                  >
                                    <List
                                      size="small"
                                      dataSource={
                                        project.documents?.filter(
                                          (doc) => doc.category === category
                                        ) || []
                                      }
                                      renderItem={(item) => (
                                        <List.Item
                                          actions={[
                                            <Button type="link" key="download">
                                              Download
                                            </Button>,
                                            <Button type="link" key="delete">
                                              Delete
                                            </Button>,
                                          ]}
                                        >
                                          <List.Item.Meta
                                            avatar={<FileTextOutlined />}
                                            title={item.name}
                                            description={`Uploaded on ${item.uploadDate}`}
                                          />
                                        </List.Item>
                                      )}
                                    />
                                  </Card>
                                )
                              )}
                            </div>
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Milestone Modal */}
      <Modal
        title="Update Project Milestones"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        className="rounded-2xl"
      >
        <Form form={form} layout="vertical">
          <Form.List name="milestones">
            {(fields) =>
              fields.map((field) => (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b pb-6 mb-6 last:border-b-0"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      {...field}
                      label="Milestone Title"
                      name={[field.name, "title"]}
                    >
                      <Input disabled className="rounded-lg" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Deadline"
                      name={[field.name, "deadline"]}
                    >
                      <DatePicker className="w-full rounded-lg" />
                    </Form.Item>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      {...field}
                      label="Status"
                      name={[field.name, "status"]}
                    >
                      <Input.Select
                        options={[
                          { label: "Pending", value: "pending" },
                          { label: "In Progress", value: "in_progress" },
                          { label: "Completed", value: "completed" },
                        ]}
                        className="rounded-lg"
                      />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Budget Allocation"
                      name={[field.name, "budget"]}
                    >
                      <Input
                        type="number"
                        prefix="₫"
                        className="rounded-lg"
                        placeholder="Enter budget amount"
                      />
                    </Form.Item>
                  </div>
                  <Form.Item
                    {...field}
                    label="Notes"
                    name={[field.name, "notes"]}
                  >
                    <Input.TextArea
                      className="rounded-lg"
                      rows={3}
                      placeholder="Add any additional notes or comments"
                    />
                  </Form.Item>
                </motion.div>
              ))
            }
          </Form.List>
        </Form>
      </Modal>

      <Modal
        title="Add Expense"
        open={showBudgetModal}
        onOk={() => setShowBudgetModal(false)}
        onCancel={() => setShowBudgetModal(false)}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <Form.Item label="Amount" name="amount">
            <Input prefix="₫" type="number" />
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Input.Select
              options={[
                { label: "Equipment", value: "equipment" },
                { label: "Materials", value: "materials" },
                { label: "Travel", value: "travel" },
                { label: "Other", value: "other" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Date" name="date">
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item label="Notes" name="notes">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Assign Task"
        open={showTaskModal}
        onOk={() => setShowTaskModal(false)}
        onCancel={() => setShowTaskModal(false)}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="Task Title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Assignee" name="assignee">
            <Input.Select
              options={
                selectedProject?.researchGroup?.members?.map((member) => ({
                  label: member.name,
                  value: member.id,
                })) || []
              }
            />
          </Form.Item>
          <Form.Item label="Priority" name="priority">
            <Input.Select
              options={[
                { label: "High", value: "high" },
                { label: "Medium", value: "medium" },
                { label: "Low", value: "low" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Deadline" name="deadline">
            <DatePicker className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ActiveResearchDetails;
