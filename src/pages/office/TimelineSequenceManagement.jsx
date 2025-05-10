import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Table,
  Tag,
  Space,
  Button,
  Tooltip,
  Badge,
  Spin,
  Empty,
  Modal,
  Form,
  Input,
  Select,
  message,
  Breadcrumb,
  Popconfirm,
} from "antd";
import {
  HomeOutlined,
  CalendarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ProjectOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useGetTimelineSequencesQuery,
  useCreateTimelineSequenceMutation,
  useDeleteTimelineSequenceMutation,
  useUpdateTimelineSequenceMutation,
} from "../../features/timeline/timelineApiSlice";

const { Title, Text } = Typography;
const { Option } = Select;

const TimelineSequenceManagement = () => {
  const navigate = useNavigate();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingSequence, setEditingSequence] = useState(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Fetch timeline sequences
  const {
    data: timelineSequences,
    isLoading: isLoadingSequences,
    isError,
    error,
    refetch: refetchSequences,
  } = useGetTimelineSequencesQuery();

  // Create timeline sequence mutation
  const [createTimelineSequence, { isLoading: isCreating }] =
    useCreateTimelineSequenceMutation();

  // Update timeline sequence mutation
  const [updateTimelineSequence, { isLoading: isUpdating }] =
    useUpdateTimelineSequenceMutation();

  // Delete timeline sequence mutation
  const [deleteTimelineSequence, { isLoading: isDeleting }] =
    useDeleteTimelineSequenceMutation();

  // Handle creating a new sequence
  const handleCreateSequence = async (values) => {
    try {
      await createTimelineSequence({
        sequenceName: values.name,
        sequenceDescription: values.description,
        sequenceColor:
          values.color ||
          "#" + Math.floor(Math.random() * 16777215).toString(16),
        status: 1,
      }).unwrap();

      message.success("Timeline sequence created successfully");
      setCreateModalVisible(false);
      createForm.resetFields();
      refetchSequences();
    } catch (error) {
      message.error(
        "Failed to create timeline sequence: " +
          (error.data?.message || "Unknown error")
      );
    }
  };

  // Open edit modal with sequence data
  const showEditModal = (sequence) => {
    setEditingSequence(sequence);
    editForm.setFieldsValue({
      name: sequence.sequenceName,
      description: sequence.sequenceDescription,
      color: sequence.sequenceColor,
      status: sequence.status !== null ? sequence.status : 1,
    });
    setEditModalVisible(true);
  };

  // Handle updating a sequence
  const handleUpdateSequence = async (values) => {
    if (!editingSequence) return;

    try {
      await updateTimelineSequence({
        id: editingSequence.id,
        sequenceName: values.name,
        sequenceDescription: values.description,
        sequenceColor: values.color,
        status: parseInt(values.status),
      }).unwrap();

      message.success("Timeline sequence updated successfully");
      setEditModalVisible(false);
      setEditingSequence(null);
      refetchSequences();
    } catch (error) {
      message.error(
        "Failed to update timeline sequence: " +
          (error.data?.message || "Unknown error")
      );
    }
  };

  // Handle deleting a sequence
  const handleDeleteSequence = async (id) => {
    try {
      await deleteTimelineSequence(id).unwrap();
      message.success("Timeline sequence deleted successfully");
      refetchSequences();
    } catch (error) {
      message.error(
        "Failed to delete timeline sequence: " +
          (error.data?.message || "Unknown error")
      );
    }
  };

  // Table columns
  const columns = [
    {
      title: "Sequence Name",
      dataIndex: "sequenceName",
      key: "sequenceName",
      render: (text, record) => (
        <div className="flex items-center">
          <div
            className="w-4 h-4 rounded-full mr-2"
            style={{ backgroundColor: record.sequenceColor }}
          ></div>
          <Text strong>{text}</Text>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "sequenceDescription",
      key: "sequenceDescription",
      render: (text) => <Text className="text-gray-600">{text}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let text = "Unknown";

        switch (status) {
          case 0:
            color = "red";
            text = "Inactive";
            break;
          case 1:
            color = "green";
            text = "Active";
            break;
          case 2:
            color = "gray";
            text = "Archived";
            break;
          default:
            color = "blue";
            text = "Active";
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Created By",
      dataIndex: "createdByName",
      key: "createdByName",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Timelines">
            <Button
              type="primary"
              icon={<CalendarOutlined />}
              onClick={() =>
                navigate(`/timeline-management?sequence=${record.id}`)
              }
              className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
            >
              View Timelines
            </Button>
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this sequence?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteSequence(record.id)}
            okButtonProps={{ loading: isDeleting }}
          >
            <Button danger icon={<DeleteOutlined />} loading={isDeleting} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb>
            <Breadcrumb.Item href="/">
              <HomeOutlined /> Home
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <ProjectOutlined /> Project Management
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <CalendarOutlined /> Timeline Sequence Management
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F2722B] to-[#FFA500] mb-2">
              Timeline Sequence Management
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#F2722B] to-[#FFA500] rounded-full"></div>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Manage timeline sequences for organizing research activities and
              funding cycles
            </p>
          </div>
        </motion.div>

        {/* Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <Card className="shadow-md rounded-xl border-0">
            <div className="flex justify-between items-center">
              <Title level={4} className="m-0">
                <CalendarOutlined className="mr-2 text-[#F2722B]" />
                Timeline Sequences
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
                className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none"
              >
                Create New Sequence
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Sequences Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-md rounded-xl border-0">
            {isLoadingSequences ? (
              <div className="flex justify-center items-center p-10">
                <Spin size="large" tip="Loading sequences..." />
              </div>
            ) : isError ? (
              <div className="text-center p-10">
                <InfoCircleOutlined className="text-red-500 text-4xl mb-4" />
                <div className="text-red-500 text-lg font-medium mb-2">
                  Error loading timeline sequences
                </div>
                <div className="text-gray-500 mb-4">
                  {error?.data?.message || "Failed to load timeline sequences."}
                </div>
                <Button
                  type="primary"
                  onClick={refetchSequences}
                  className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
                >
                  Try Again
                </Button>
              </div>
            ) : timelineSequences?.length > 0 ? (
              <Table
                columns={columns}
                dataSource={timelineSequences}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            ) : (
              <Empty
                description="No timeline sequences found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="p-10"
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setCreateModalVisible(true)}
                  className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none mt-4"
                >
                  Create New Sequence
                </Button>
              </Empty>
            )}
          </Card>
        </motion.div>

        {/* Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Card className="shadow-md rounded-xl border-0 bg-blue-50">
            <div className="flex items-start">
              <InfoCircleOutlined className="text-blue-500 text-xl mt-1 mr-3" />
              <div>
                <Text strong className="text-blue-700 block mb-1">
                  Timeline Sequence Information
                </Text>
                <Text className="text-blue-600">
                  Timeline sequences help organize related timelines into
                  groups. Each sequence can contain multiple timelines for
                  different stages of a research cycle. Create sequences for
                  different research cycles, funding periods, or academic years.
                </Text>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Create Sequence Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <CalendarOutlined className="text-[#F2722B] mr-2" />
            <span>Create New Timeline Sequence</span>
          </div>
        }
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateSequence}
        >
          <Form.Item
            name="name"
            label="Sequence Name"
            rules={[
              { required: true, message: "Please enter the sequence name" },
            ]}
          >
            <Input placeholder="e.g., Research Grant Cycle 2024" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Sequence Description"
            rules={[{ required: true, message: "Please enter a description" }]}
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

          <div className="flex justify-end mt-4">
            <Space>
              <Button
                onClick={() => {
                  setCreateModalVisible(false);
                  createForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isCreating}
                className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
              >
                Create Sequence
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Edit Sequence Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <EditOutlined className="text-[#F2722B] mr-2" />
            <span>Edit Timeline Sequence</span>
          </div>
        }
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingSequence(null);
        }}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdateSequence}>
          <Form.Item
            name="name"
            label="Sequence Name"
            rules={[
              { required: true, message: "Please enter the sequence name" },
            ]}
          >
            <Input placeholder="e.g., Research Grant Cycle 2024" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Sequence Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Describe the purpose of this timeline sequence"
            />
          </Form.Item>

          <Form.Item
            name="color"
            label="Sequence Color"
            rules={[{ required: true, message: "Please select a color" }]}
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

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select placeholder="Select status">
              <Option value={0}>Inactive</Option>
              <Option value={1}>Active</Option>
              <Option value={2}>Archived</Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end mt-4">
            <Space>
              <Button
                onClick={() => {
                  setEditModalVisible(false);
                  setEditingSequence(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isUpdating}
                className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
              >
                Update Sequence
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TimelineSequenceManagement;
