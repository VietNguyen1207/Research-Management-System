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

const ActiveResearch = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState(approvedProjects);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Active Research Projects
          </h2>
          <p className="text-lg text-gray-600">
            Monitor and manage your ongoing research projects
          </p>
        </div>

        <div className="grid gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="shadow-lg rounded-xl border-0 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Project Header */}
              <div className="flex justify-between items-start mb-8 border-b pb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {project.title}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <Tag color="blue" className="px-3 py-1 rounded-full">
                      {project.department.name}
                    </Tag>
                    <Tag color="orange" className="px-3 py-1 rounded-full">
                      {project.category.name}
                    </Tag>
                    <div className="text-sm text-gray-500">
                      <CalendarOutlined className="mr-2" />
                      {project.projectDuration.startDate} -{" "}
                      {project.projectDuration.endDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Project Details */}
                <div className="space-y-6">
                  <div className="bg-orange-50 p-6 rounded-xl">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <ProjectOutlined className="text-[#F2722B] mr-2" />
                      Project Overview
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Middle Column - Team Members */}
                <div className="space-y-6">
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <TeamOutlined className="text-blue-500 mr-2" />
                      Research Team
                    </h4>

                    {/* Supervisor */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm">
                        <UserOutlined className="text-[#F2722B]" />
                        <div>
                          <div className="font-medium">
                            {project.supervisor.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {project.supervisor.role}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Research Group */}
                    <div className="space-y-3">
                      {project.researchGroup.members.map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                        >
                          <div className="flex items-center space-x-3">
                            {member.role === "Leader" ? (
                              <CrownOutlined className="text-[#F2722B]" />
                            ) : (
                              <UserOutlined className="text-gray-400" />
                            )}
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <Tag
                                color={
                                  member.role === "Leader"
                                    ? "orange"
                                    : "default"
                                }
                                className="rounded-full mt-1"
                              >
                                {member.role}
                              </Tag>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Milestones */}
                <div className="space-y-6">
                  <div className="bg-green-50 p-6 rounded-xl">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <CalendarOutlined className="text-green-500 mr-2" />
                      Project Milestones
                    </h4>
                    <Timeline className="mt-4">
                      {project.projectMilestones.map((milestone) => (
                        <Timeline.Item
                          key={milestone.id}
                          dot={
                            <motion.div
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              {milestone.status === "completed" ? (
                                <CheckOutlined className="text-green-500" />
                              ) : milestone.status === "in_progress" ? (
                                <ClockCircleOutlined className="text-blue-500" />
                              ) : (
                                <ClockCircleOutlined className="text-gray-400" />
                              )}
                            </motion.div>
                          }
                          color={
                            milestone.status === "completed"
                              ? "green"
                              : milestone.status === "in_progress"
                              ? "blue"
                              : "gray"
                          }
                        >
                          <div className="flex items-center justify-between group">
                            <div>
                              <div className="font-medium">
                                {milestone.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                Deadline: {milestone.deadline}
                              </div>
                              <AnimatePresence mode="wait">
                                <motion.div
                                  key={milestone.status}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Tag
                                    color={
                                      milestone.status === "completed"
                                        ? "success"
                                        : milestone.status === "in_progress"
                                        ? "processing"
                                        : "default"
                                    }
                                    className="mt-1"
                                  >
                                    {milestone.status === "completed"
                                      ? "Completed"
                                      : milestone.status === "in_progress"
                                      ? "In Progress"
                                      : "Pending"}
                                  </Tag>
                                </motion.div>
                              </AnimatePresence>
                            </div>
                            <Dropdown
                              menu={{
                                items: getStatusMenuItems(
                                  project.id,
                                  milestone
                                ),
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
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Update Milestones Modal */}
      <Modal
        title="Update Project Milestones"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.List name="milestones">
            {(fields) =>
              fields.map((field) => (
                <div key={field.key} className="border-b pb-4 mb-4">
                  <Form.Item
                    {...field}
                    label="Milestone Title"
                    name={[field.name, "title"]}
                  >
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    label="Deadline"
                    name={[field.name, "deadline"]}
                  >
                    <DatePicker className="w-full" />
                  </Form.Item>
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
                    />
                  </Form.Item>
                </div>
              ))
            }
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default ActiveResearch;
