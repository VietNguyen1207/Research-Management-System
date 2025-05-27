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
  Statistic,
  Spin,
  ConfigProvider,
  Skeleton,
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
  PieChartOutlined,
  ScheduleOutlined,
  FileOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useGetTimelineSequencesQuery,
  useGetTimelinesBySequenceQuery,
  useCreateTimelineSequenceMutation,
  useCreateTimelineMutation,
  useUpdateTimelineMutation,
  useDeleteTimelineMutation,
} from "../../features/timeline/timelineApiSlice";
import viVN from "antd/lib/locale/vi_VN";

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Register the plugins
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const TimelineManagement = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState(null);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [groupForm] = Form.useForm();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [editStartDate, setEditStartDate] = useState(null);
  const [editEndDate, setEditEndDate] = useState(null);
  const [createStartDate, setCreateStartDate] = useState(null);
  const [createEndDate, setCreateEndDate] = useState(null);

  const navigate = useNavigate();

  // Fetch timeline sequences from API
  const {
    data: timelineSequences,
    isLoading: isLoadingSequences,
    isError: isErrorSequences,
    error: sequencesError,
    refetch: refetchSequences,
  } = useGetTimelineSequencesQuery();

  // Fetch timelines for selected sequence
  const {
    data: timelineData,
    isLoading: isLoadingTimelines,
    isError: isErrorTimelines,
    error: timelinesError,
    refetch: refetchTimelines,
  } = useGetTimelinesBySequenceQuery(selectedGroup, {
    skip: !selectedGroup,
  });

  const [createTimelineSequence] = useCreateTimelineSequenceMutation();
  const [createTimeline] = useCreateTimelineMutation();
  const [updateTimeline, { isLoading: isUpdating }] =
    useUpdateTimelineMutation();
  const [deleteTimeline, { isLoading: isDeleting }] =
    useDeleteTimelineMutation();

  // Map timelineType to display values
  const getTimelineTypeLabel = (type) => {
    switch (type) {
      case 0:
        return "registration";
      case 1:
        return "registration";
      case 2:
        return "review";
      default:
        return "other";
    }
  };

  const handleAddTimeline = async (values) => {
    console.log("Form values submitted:", values);

    // Get the values from state if the form values are missing
    const startDate = values.startDate || createStartDate;
    const endDate = values.endDate || createEndDate;

    // Check if dates are available either in values or state
    if (!startDate || !endDate) {
      message.error("Start date and end date are required");
      return;
    }

    const { name, type, timelineGroup } = values;

    try {
      // Map the timeline type to its enum value
      let timelineTypeEnum;
      switch (type) {
        case "registration":
          timelineTypeEnum = 1; // ProjectRegistration
          break;
        case "review":
          timelineTypeEnum = 2; // ReviewPeriod
          break;
        default:
          timelineTypeEnum = 1; // Default to ProjectRegistration
      }

      // Prepare the request body according to the API requirements
      const timelineData = {
        sequenceId: timelineGroup,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        event: name,
        timelineType: timelineTypeEnum,
        status: 1, // Active
      };

      // Call the API
      await createTimeline(timelineData).unwrap();
      message.success("Timeline added successfully");

      // Reset form and state
      form.resetFields();
      setCreateStartDate(null);
      setCreateEndDate(null);

      // Refetch the timelines to get the updated data
      if (selectedGroup) {
        refetchTimelines();
      }
    } catch (error) {
      console.error("Failed to create timeline:", error);
      message.error(
        "Failed to create timeline: " + (error.data?.message || error.message)
      );
    }
  };

  const handleEditTimeline = async (values) => {
    console.log("Edit form values:", values); // Add debugging

    const { name, startDate, endDate, type, timelineSequence } = values;

    if (!startDate || !endDate) {
      message.error("Start date and end date are required");
      return;
    }

    try {
      // Format dates consistently using dayjs's format method
      const formattedStartDate = startDate.format("YYYY-MM-DD");
      const formattedEndDate = endDate.format("YYYY-MM-DD");

      // Map the timeline type to its enum value
      let timelineTypeEnum;
      switch (type) {
        case "registration":
          timelineTypeEnum = 1; // ProjectRegistration
          break;
        case "review":
          timelineTypeEnum = 2; // ReviewPeriod
          break;
        default:
          timelineTypeEnum = 1; // Default to ProjectRegistration
      }

      // Updated request body
      const updateData = {
        id: editingTimeline.id,
        sequenceId: timelineSequence,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        event: name,
        timelineType: timelineTypeEnum,
        status: 1, // Default to Active
      };

      console.log("Sending to API:", updateData); // Add this to debug

      // Call the API
      await updateTimeline(updateData).unwrap();
      message.success("Timeline updated successfully");
      setIsModalVisible(false);
      setEditingTimeline(null);

      // Refetch the timelines to get the updated data
      if (selectedGroup) {
        refetchTimelines();
      }
    } catch (error) {
      console.error("Failed to update timeline:", error);
      message.error(
        "Failed to update timeline: " + (error.data?.message || error.message)
      );
    }
  };

  const handleDeleteTimeline = async (id) => {
    try {
      await deleteTimeline(id).unwrap();
      message.success("Timeline deleted successfully");

      // Refetch the timelines to get the updated data
      if (selectedGroup) {
        refetchTimelines();
      }
    } catch (error) {
      console.error("Failed to delete timeline:", error);
      message.error(
        "Failed to delete timeline: " + (error.data?.message || error.message)
      );
    }
  };

  const showEditModal = (record) => {
    console.log("Opening edit modal for record:", record);

    // Parse dates
    const startDate = dayjs(record.startDate);
    const endDate = dayjs(record.endDate);

    // Set the state variables
    setEditStartDate(startDate);
    setEditEndDate(endDate);

    // Set the record data
    setEditingTimeline(record);

    // Reset form before setting values
    editForm.resetFields();

    // Open the modal and set form values after a short delay
    setIsModalVisible(true);

    setTimeout(() => {
      try {
        // Set form values
        editForm.setFieldsValue({
          name: record.event,
          timelineSequence: record.sequenceId,
          startDate: startDate,
          endDate: endDate,
          type: getTimelineTypeLabel(record.timelineType),
        });

        console.log("Form values set:", editForm.getFieldsValue());
      } catch (error) {
        console.error("Error setting form values:", error);
        message.error("Error preparing the edit form");
      }
    }, 100);
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
        return <FileOutlined />;
      case "review":
        return <TeamOutlined />;
      case "submission":
        return <CalendarOutlined />;
      case "budget":
        return <TeamOutlined />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  // Generate timeline visualization based on data
  const generateTimelineItems = () => {
    if (!timelineData) return [];

    const sortedTimelines = [...timelineData].sort(
      (a, b) => dayjs(a.startDate).unix() - dayjs(b.startDate).unix()
    );

    return sortedTimelines.map((item) => {
      const now = dayjs();
      const startDate = dayjs(item.startDate);
      const endDate = dayjs(item.endDate);

      const isActive = now.isBetween(startDate, endDate, "day", "[]");
      const isCompleted = now.isAfter(endDate, "day");
      const isExpired = now.isAfter(endDate, "day");

      const status = isActive
        ? "active"
        : isCompleted
        ? "completed"
        : "upcoming";

      return {
        key: item.id,
        color: getStatusColor(status),
        dot: isActive ? (
          <ClockCircleOutlined className="timeline-clock-icon" />
        ) : undefined,
        children: (
          <div className={`p-4 ${isCompleted ? "opacity-60" : ""}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Text strong>{item.event}</Text>
                <div className="text-sm text-gray-500">
                  {`${dayjs(item.startDate).format("YYYY-MM-DD")} — ${dayjs(
                    item.endDate
                  ).format("YYYY-MM-DD")}`}
                </div>
                <div className="mt-1">
                  <Tag color="purple">All</Tag>
                  <Tag color="orange">
                    {getTimelineTypeLabel(item.timelineType).toUpperCase()}
                  </Tag>
                </div>
                <div className="mt-2 text-sm">
                  {item.description || `Event in ${item.sequenceName}`}
                </div>
              </div>
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
            </div>
            {(isCompleted || isExpired) && (
              <Tag color="red" className="mt-2">
                {isCompleted ? "COMPLETED" : "EXPIRED"}
              </Tag>
            )}
          </div>
        ),
      };
    });
  };

  const showCreateGroupModal = () => {
    setIsSelectOpen(false);
    setTimeout(() => {
      setIsGroupModalVisible(true);
    }, 100);
  };

  const handleCreateGroup = async (values) => {
    try {
      await createTimelineSequence({
        sequenceName: values.name,
        sequenceDescription: values.description,
        sequenceColor:
          values.color ||
          "#" + Math.floor(Math.random() * 16777215).toString(16),
      }).unwrap();

      message.success("Timeline sequence created successfully");
      refetchSequences();
      setIsGroupModalVisible(false);
      groupForm.resetFields();
    } catch (error) {
      message.error("Failed to create timeline sequence");
    }
  };

  useEffect(() => {
    if (form.getFieldValue("timelineGroup")) {
      setSelectedGroup(form.getFieldValue("timelineGroup"));
    }
  }, [form.getFieldValue("timelineGroup")]);

  // Select the first timeline sequence by default when data is loaded
  useEffect(() => {
    if (timelineSequences && timelineSequences.length > 0 && !selectedGroup) {
      setSelectedGroup(timelineSequences[0].id);
      form.setFieldsValue({ timelineGroup: timelineSequences[0].id });
    }
  }, [timelineSequences, form, selectedGroup]);

  // Updated columns definition for the timeline table
  const columns = [
    {
      title: "Name",
      dataIndex: "event",
      key: "event",
      render: (text, record) => (
        <div className="flex items-center space-x-2">
          <Tag
            color="orange"
            icon={getTypeIcon(getTimelineTypeLabel(record.timelineType))}
            className="mr-2 py-1 px-2"
          >
            {getTimelineTypeLabel(record.timelineType).toUpperCase()}
          </Tag>
          <Text strong>{text}</Text>
        </div>
      ),
    },
    {
      title: "Period",
      key: "period",
      render: (_, record) => {
        const now = dayjs();
        const startDate = dayjs(record.startDate);
        const endDate = dayjs(record.endDate);

        const isActive = now.isBetween(startDate, endDate, "day", "[]");
        const isCompleted = now.isAfter(endDate, "day");
        const status = isActive
          ? "active"
          : isCompleted
          ? "completed"
          : "upcoming";

        return (
          <div className="space-y-1">
            <div className="flex items-center">
              <CalendarOutlined className="text-[#F2722B] mr-2" />
              <Text>{`${dayjs(record.startDate).format("YYYY-MM-DD")} — ${dayjs(
                record.endDate
              ).format("YYYY-MM-DD")}`}</Text>
            </div>
            <Tag color={getStatusColor(status)} className="ml-0">
              {status.toUpperCase()}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Created By",
      dataIndex: "createdByName",
      key: "createdByName",
      render: (text) => <span className="text-gray-600">{text}</span>,
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

  // Add this useEffect in your component to track form values
  useEffect(() => {
    const values = editForm.getFieldsValue();
    console.log("Current edit form values:", values);
  }, [editingTimeline, isModalVisible]); // Track when modal or editing timeline changes

  // Add this useEffect hook after your existing ones
  useEffect(() => {
    if (editingTimeline && isModalVisible) {
      const startDate = dayjs(editingTimeline.startDate);
      const endDate = dayjs(editingTimeline.endDate);

      // Force another update of date fields after modal is fully visible
      setTimeout(() => {
        editForm.setFieldsValue({
          startDate: startDate,
          endDate: endDate,
        });

        // Update state vars as well
        setEditStartDate(startDate);
        setEditEndDate(endDate);

        console.log(
          "Re-setting date values:",
          startDate.format("YYYY-MM-DD"),
          endDate.format("YYYY-MM-DD")
        );
      }, 200);
    }
  }, [editingTimeline, isModalVisible]);

  // Timeline Visualization Card Skeleton
  const TimelineVisualizationSkeleton = () => (
    <div className="p-4">
      <Skeleton.Input style={{ width: 150, marginBottom: 16 }} active />
      <Skeleton paragraph={{ rows: 1, width: "90%" }} active />
      <div className="ml-4 mt-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="mb-6">
            <div className="flex">
              <div className="mr-4">
                <Skeleton.Avatar size="small" active />
              </div>
              <div className="flex-1">
                <Skeleton.Input style={{ width: "100%" }} active />
                <Skeleton paragraph={{ rows: 1, width: ["60%"] }} active />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Timeline Table Skeleton
  const TimelineTableSkeleton = () => (
    <div className="p-4">
      <Skeleton
        active
        paragraph={{
          rows: 6,
          width: ["100%", "100%", "100%", "100%", "100%", "100%"],
        }}
      />
    </div>
  );

  // Timeline Sequence Cards Skeleton
  const TimelineSequencesSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((item) => (
        <Card key={item} className="border border-gray-200">
          <Skeleton active avatar paragraph={{ rows: 2 }} />
        </Card>
      ))}
    </div>
  );

  // Update the TIMELINE_TYPE constant that's used for the timeline visualization
  const TIMELINE_TYPE = {
    1: { name: "Registration", icon: <FileOutlined />, color: "blue" },
    2: { name: "Review", icon: <TeamOutlined />, color: "orange" },
  };

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
          <Space className="mt-4">
            <Button
              type="primary"
              icon={<CalendarOutlined />}
              onClick={() => navigate("/all-timelines")}
              className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
            >
              View All Timelines
            </Button>
            <Button
              type="primary"
              icon={<ScheduleOutlined />}
              onClick={() => navigate("/timeline-sequence-management")}
              className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
            >
              Timeline Sequence Management
            </Button>
          </Space>
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
                      <span>Current Available Timelines</span>
                    </div>
                  </div>
                }
                className="shadow-md rounded-xl overflow-hidden border-0"
                styles={{ body: { height: "500px", overflowY: "auto" } }}
              >
                {isLoadingSequences ? (
                  <TimelineVisualizationSkeleton />
                ) : isErrorSequences ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <ExclamationCircleOutlined className="text-4xl text-red-500 mb-4" />
                    <Text className="text-lg text-red-500 mb-2">
                      Error Loading Timeline Sequences
                    </Text>
                    <Text type="secondary" className="mb-4">
                      {sequencesError?.data?.message ||
                        "Failed to load timeline sequences"}
                    </Text>
                    <Button
                      type="primary"
                      onClick={() => refetchSequences()}
                      className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : selectedGroup ? (
                  isLoadingTimelines ? (
                    <TimelineVisualizationSkeleton />
                  ) : isErrorTimelines ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <ExclamationCircleOutlined className="text-4xl text-red-500 mb-4" />
                      <Text className="text-lg text-red-500 mb-2">
                        Error Loading Timelines
                      </Text>
                      <Text type="secondary" className="mb-4">
                        {timelinesError?.data?.message ||
                          "Failed to load timelines for the selected sequence"}
                      </Text>
                      <Button
                        type="primary"
                        onClick={() => refetchTimelines()}
                        className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : timelineData && timelineData.length > 0 ? (
                    <Timeline
                      mode="left"
                      className="mt-4 ml-4"
                      items={[
                        // First item is the group header
                        {
                          key: "header",
                          dot: (
                            <div
                              style={{
                                backgroundColor:
                                  timelineSequences?.find(
                                    (seq) => seq.id === selectedGroup
                                  )?.sequenceColor || "#F2722B",
                              }}
                              className="w-4 h-4 rounded-full"
                            />
                          ),
                          children: (
                            <>
                              <Text strong className="text-lg">
                                {timelineSequences?.find(
                                  (seq) => seq.id === selectedGroup
                                )?.sequenceName || "Timeline Sequence"}
                              </Text>
                              <Text type="secondary" className="block text-sm">
                                {timelineSequences?.find(
                                  (seq) => seq.id === selectedGroup
                                )?.sequenceDescription || ""}
                              </Text>
                            </>
                          ),
                        },
                        // Then spread the timeline items
                        ...generateTimelineItems(),
                      ]}
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <InfoCircleOutlined className="text-4xl text-gray-300 mb-4" />
                      <Text className="text-lg text-gray-500 mb-2">
                        No Timelines Found
                      </Text>
                      <Text type="secondary">
                        This sequence doesn't have any timelines yet. Create one
                        using the form.
                      </Text>
                    </div>
                  )
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
                        Select from {timelineSequences?.length || 0} available
                        sequences
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
                          loading={isLoadingSequences}
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
                          {timelineSequences?.map((sequence) => (
                            <Option key={sequence.id} value={sequence.id}>
                              <Tag color={sequence.sequenceColor}>
                                {sequence.sequenceName}
                              </Tag>
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
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="startDate"
                        label="Start Date"
                        rules={[
                          { required: true, message: "Start date is required" },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value) return Promise.resolve();

                              // Start date should not be in the past
                              if (value.isBefore(dayjs().startOf("day"))) {
                                return Promise.reject(
                                  new Error("Start date cannot be in the past")
                                );
                              }

                              // Start date should be before end date (if end date is selected)
                              const endDate = getFieldValue("endDate");
                              if (endDate && value.isAfter(endDate)) {
                                return Promise.reject(
                                  new Error(
                                    "Start date must be before end date"
                                  )
                                );
                              }

                              return Promise.resolve();
                            },
                          }),
                        ]}
                      >
                        <ConfigProvider locale={viVN}>
                          <DatePicker
                            className="w-full"
                            format="YYYY-MM-DD"
                            placeholder="Start Date"
                            inputReadOnly={true}
                            picker="date"
                            showToday={true}
                            disabledDate={(current) =>
                              current && current < dayjs().startOf("day")
                            }
                            onChange={(date) => {
                              if (date) {
                                setCreateStartDate(date);
                                form.setFieldsValue({ startDate: date });

                                // If end date exists but is before start date, clear it
                                const endDate = form.getFieldValue("endDate");
                                if (endDate && date.isAfter(endDate)) {
                                  form.setFieldsValue({ endDate: null });
                                  setCreateEndDate(null);
                                }
                              }
                            }}
                          />
                        </ConfigProvider>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="endDate"
                        label="End Date"
                        rules={[
                          { required: true, message: "End date is required" },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value) return Promise.resolve();

                              // End date should be after start date
                              const startDate = getFieldValue("startDate");
                              if (startDate && value.isBefore(startDate)) {
                                return Promise.reject(
                                  new Error("End date must be after start date")
                                );
                              }

                              // Minimum duration validation (at least 1 day after start date)
                              if (startDate && !value.isAfter(startDate)) {
                                return Promise.reject(
                                  new Error(
                                    "Timeline must be at least 1 day long"
                                  )
                                );
                              }

                              return Promise.resolve();
                            },
                          }),
                        ]}
                      >
                        <ConfigProvider locale={viVN}>
                          <DatePicker
                            className="w-full"
                            format="YYYY-MM-DD"
                            placeholder="End Date"
                            inputReadOnly={true}
                            picker="date"
                            showToday={true}
                            disabledDate={(current) => {
                              const startDate = form.getFieldValue("startDate");
                              // Disable dates before start date or before today
                              return (
                                current &&
                                (current < dayjs().startOf("day") ||
                                  (startDate && current < startDate))
                              );
                            }}
                            onChange={(date) => {
                              if (date) {
                                setCreateEndDate(date);
                                form.setFieldsValue({ endDate: date });
                              }
                            }}
                          />
                        </ConfigProvider>
                      </Form.Item>
                    </Col>
                  </Row>

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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CalendarOutlined className="text-[#F2722B]" />
                      <span>All Timelines</span>
                    </div>
                    {selectedGroup && (
                      <Tag
                        color={
                          timelineSequences?.find(
                            (seq) => seq.id === selectedGroup
                          )?.sequenceColor || "#F2722B"
                        }
                      >
                        {timelineSequences?.find(
                          (seq) => seq.id === selectedGroup
                        )?.sequenceName || "Selected Sequence"}
                      </Tag>
                    )}
                  </div>
                }
                className="shadow-md rounded-xl border-0"
              >
                <Table
                  columns={columns}
                  dataSource={timelineData}
                  loading={{
                    spinning: isLoadingTimelines,
                    indicator: <></>,
                  }}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  scroll={{ x: "max-content" }}
                  className="timeline-table"
                  rowClassName="timeline-table-row"
                  locale={{
                    emptyText: selectedGroup
                      ? "No timelines found for this sequence"
                      : "Please select a timeline sequence",
                  }}
                />
                {isLoadingTimelines && <TimelineTableSkeleton />}
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
            setEditStartDate(null);
            setEditEndDate(null);
          }}
          afterOpenChange={(visible) => {
            if (visible && editingTimeline) {
              // Re-set form values when modal becomes visible
              const startDate = dayjs(editingTimeline.startDate);
              const endDate = dayjs(editingTimeline.endDate);

              editForm.setFieldsValue({
                name: editingTimeline.event,
                timelineSequence: editingTimeline.sequenceId,
                startDate: startDate,
                endDate: endDate,
                type: getTimelineTypeLabel(editingTimeline.timelineType),
              });
            }
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
              name="timelineSequence"
              label="Timeline Sequence"
              rules={[
                {
                  required: true,
                  message: "Please select a timeline sequence",
                },
              ]}
            >
              <Select
                placeholder="Select a timeline sequence"
                loading={isLoadingSequences}
              >
                {timelineSequences?.map((sequence) => (
                  <Option key={sequence.id} value={sequence.id}>
                    <Tag color={sequence.sequenceColor}>
                      {sequence.sequenceName}
                    </Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Date Range" required style={{ marginBottom: 8 }}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="startDate"
                    rules={[
                      { required: true, message: "Start date is required" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value) return Promise.resolve();

                          // Start date should be before end date (if end date is selected)
                          const endDate = getFieldValue("endDate");
                          if (endDate && value.isAfter(endDate)) {
                            return Promise.reject(
                              new Error("Start date must be before end date")
                            );
                          }

                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <ConfigProvider locale={viVN}>
                      <DatePicker
                        className="w-full"
                        format="YYYY-MM-DD"
                        placeholder="Start Date"
                        inputReadOnly={true}
                        picker="date"
                        showToday={true}
                        allowClear={false}
                        key={
                          editingTimeline
                            ? editingTimeline.startDate
                            : "default-start"
                        }
                        value={editForm.getFieldValue("startDate")}
                        onChange={(date) => {
                          if (date) {
                            setEditStartDate(date);
                            editForm.setFieldsValue({ startDate: date });

                            // If end date exists but is before start date, clear it
                            const endDate = editForm.getFieldValue("endDate");
                            if (endDate && date.isAfter(endDate)) {
                              editForm.setFieldsValue({ endDate: null });
                              setEditEndDate(null);
                            }
                          }
                        }}
                      />
                    </ConfigProvider>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="endDate"
                    rules={[
                      { required: true, message: "End date is required" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value) return Promise.resolve();

                          // End date should be after start date
                          const startDate = getFieldValue("startDate");
                          if (startDate && value.isBefore(startDate)) {
                            return Promise.reject(
                              new Error("End date must be after start date")
                            );
                          }

                          // Minimum duration validation (at least 1 day after start date)
                          if (startDate && !value.isAfter(startDate)) {
                            return Promise.reject(
                              new Error("Timeline must be at least 1 day long")
                            );
                          }

                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <ConfigProvider locale={viVN}>
                      <DatePicker
                        className="w-full"
                        format="YYYY-MM-DD"
                        placeholder="End Date"
                        inputReadOnly={true}
                        picker="date"
                        showToday={true}
                        allowClear={false}
                        key={
                          editingTimeline
                            ? editingTimeline.endDate
                            : "default-end"
                        }
                        value={editForm.getFieldValue("endDate")}
                        disabledDate={(current) => {
                          const startDate = editForm.getFieldValue("startDate");
                          // Disable dates before start date
                          return startDate && current && current < startDate;
                        }}
                        onChange={(date) => {
                          if (date) {
                            setEditEndDate(date);
                            editForm.setFieldsValue({ endDate: date });
                          }
                        }}
                      />
                    </ConfigProvider>
                  </Form.Item>
                </Col>
              </Row>
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
                <Option value="registration">Project Registration</Option>
                <Option value="review">Review Period</Option>
              </Select>
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
                  loading={isUpdating}
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

        {/* Timeline Sequence Management Panel */}
        {timelineSequences && timelineSequences.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Card
              title={
                <div className="flex items-center space-x-2">
                  <FieldTimeOutlined className="text-[#F2722B]" />
                  <span>Timeline Sequences Overview</span>
                </div>
              }
              className="shadow-md rounded-xl border-0"
            >
              {isLoadingSequences ? (
                <TimelineSequencesSkeleton />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {timelineSequences.map((sequence) => (
                    <Card
                      key={sequence.id}
                      hoverable
                      className={`border border-gray-200 hover:shadow-md transition-all duration-300 ${
                        selectedGroup === sequence.id
                          ? "border-[#F2722B] shadow-md"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedGroup(sequence.id);
                        form.setFieldsValue({ timelineGroup: sequence.id });
                      }}
                    >
                      <div className="flex items-start">
                        <div
                          className="w-4 h-4 rounded-full mt-1 mr-3 flex-shrink-0"
                          style={{ backgroundColor: sequence.sequenceColor }}
                        ></div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 mb-1">
                            {sequence.sequenceName}
                          </div>
                          <Text
                            type="secondary"
                            ellipsis={{ tooltip: sequence.sequenceDescription }}
                            className="text-sm mb-2 block"
                          >
                            {sequence.sequenceDescription}
                          </Text>
                          <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                            <div>Created by: {sequence.createdByName}</div>
                            <div>
                              {new Date(
                                sequence.createdAt
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Timeline Statistics Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Card
            title={
              <div className="flex items-center space-x-2">
                <PieChartOutlined className="text-[#F2722B]" />
                <span>Timeline Statistics</span>
              </div>
            }
            className="shadow-md rounded-xl border-0"
          >
            {isLoadingSequences || isLoadingTimelines ? (
              <>
                <Row gutter={[16, 16]}>
                  {[1, 2, 3, 4].map((item) => (
                    <Col xs={24} sm={12} md={6} key={item}>
                      <Card className="text-center border-0 bg-gray-50">
                        <Skeleton.Input
                          style={{ width: "60%", height: 16 }}
                          active
                        />
                        <Skeleton.Input
                          style={{ width: "40%", height: 32, marginTop: 12 }}
                          active
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
                <div className="mt-6">
                  <Skeleton.Input
                    style={{ width: 180, height: 24, marginBottom: 16 }}
                    active
                  />
                  <Skeleton.Input
                    style={{ width: "100%", height: 40 }}
                    active
                  />
                </div>
              </>
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={6}>
                    <Card className="text-center border-0 bg-gray-50">
                      <Statistic
                        title={<span className="text-gray-600">Sequences</span>}
                        value={timelineSequences?.length || 0}
                        valueStyle={{ color: "#F2722B" }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card className="text-center border-0 bg-gray-50">
                      <Statistic
                        title={
                          <span className="text-gray-600">Total Timelines</span>
                        }
                        value={timelineData?.length || 0}
                        valueStyle={{ color: "#F2722B" }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card className="text-center border-0 bg-gray-50">
                      <Statistic
                        title={<span className="text-gray-600">Active</span>}
                        value={
                          timelineData?.filter(
                            (item) => item.status === "active"
                          ).length
                        }
                        valueStyle={{ color: "#4CAF50" }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card className="text-center border-0 bg-gray-50">
                      <Statistic
                        title={<span className="text-gray-600">Upcoming</span>}
                        value={
                          timelineData?.filter(
                            (item) => item.status === "upcoming"
                          ).length
                        }
                        valueStyle={{ color: "#2196F3" }}
                      />
                    </Card>
                  </Col>
                </Row>

                <div className="mt-6">
                  <Title level={5} className="mb-4">
                    Timeline Distribution by Type
                  </Title>
                  <div className="flex flex-wrap gap-3">
                    {[
                      {
                        type: "registration",
                        color: "#F2722B",
                        label: "Registration",
                      },
                      { type: "review", color: "#4CAF50", label: "Review" },
                    ].map((item) => {
                      const count = timelineData?.filter(
                        (timeline) => timeline.type === item.type
                      ).length;
                      return (
                        <Badge
                          key={item.type}
                          count={count}
                          showZero
                          style={{
                            backgroundColor: item.color,
                          }}
                        >
                          <Tag
                            color={item.color}
                            style={{ padding: "5px 12px" }}
                            className="mr-0"
                          >
                            {item.label}
                          </Tag>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </Card>
        </motion.div>

        {/* Information Alert Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <Card className="shadow-md rounded-xl border-0 bg-blue-50">
            <div className="flex items-start">
              <InfoCircleOutlined className="text-blue-500 text-xl mt-1 mr-3" />
              <div>
                <Text strong className="text-blue-700 block mb-1">
                  Timeline Management Information
                </Text>
                <Text className="text-blue-600">
                  Timelines help organize research activities and funding cycles
                  within the system. Each timeline belongs to a sequence, and
                  users across the platform will see relevant timelines based on
                  their department and role. Create sequences for different
                  research cycles, funding periods, or academic years.
                </Text>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TimelineManagement;
