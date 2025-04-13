import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Timeline,
  Tag,
  Select,
  Space,
  Button,
  Row,
  Col,
  Empty,
  Tooltip,
  Table,
  Spin,
  Alert,
} from "antd";
import {
  CalendarOutlined,
  FilterOutlined,
  TeamOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useGetAllTimelinesQuery } from "../../features/timeline/timelineApiSlice";

const { Title, Text } = Typography;
const { Option } = Select;

// Timeline type enum mapping
const timelineTypeMap = {
  1: "PROJECT REGISTRATION",
  2: "REVIEW PERIOD",
  3: "FUND REQUEST",
  4: "FUND APPROVAL",
  5: "CONFERENCE SUBMISSION",
  6: "PAPER REVIEW",
};

const AllTimelines = () => {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const {
    data: timelines,
    isLoading,
    isError,
    error,
  } = useGetAllTimelinesQuery();

  // Get unique sequences from timeline data
  const uniqueSequences = timelines
    ? [...new Map(timelines.map((item) => [item.sequenceId, item])).values()]
    : [];

  // Calculate timeline status based on dates
  const getTimelineStatus = (startDate, endDate) => {
    const now = moment();
    const start = moment(startDate);
    const end = moment(endDate);

    if (now.isBefore(start)) return "upcoming";
    if (now.isAfter(end)) return "completed";
    if (now.isBetween(start, end)) return "active";
    return "upcoming";
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

  // Process timelines to add status
  const processedTimelines = timelines
    ? timelines.map((timeline) => ({
        ...timeline,
        status: getTimelineStatus(timeline.startDate, timeline.endDate),
      }))
    : [];

  const filteredTimelines = processedTimelines.filter((timeline) => {
    const matchesGroup =
      selectedGroup === "all" ||
      timeline.sequenceId.toString() === selectedGroup;
    const matchesDepartment =
      selectedDepartment === "all" ||
      (timeline.department
        ? timeline.department === selectedDepartment
        : false);
    const matchesStatus =
      selectedStatus === "all" || timeline.status === selectedStatus;
    return matchesGroup && matchesDepartment && matchesStatus;
  });

  const sortedTimelines = [...(filteredTimelines || [])].sort(
    (a, b) => moment(a.startDate) - moment(b.startDate)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <Alert
          message="Error Loading Timelines"
          description={error?.data?.message || "Failed to load timelines"}
          type="error"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/timeline-management")}
              className="mb-4"
            >
              Back to Timeline Management
            </Button>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F2722B] to-[#FFA500] mb-2">
              All System Timelines
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#F2722B] to-[#FFA500] rounded-full"></div>
          </motion.div>
        </div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="mb-6 shadow-md rounded-xl border-0">
            <Row gutter={16} align="middle">
              <Col xs={24} sm={8}>
                <div className="mb-4 sm:mb-0">
                  <Text strong>Timeline Sequence</Text>
                  <Select
                    className="w-full mt-2"
                    value={selectedGroup}
                    onChange={setSelectedGroup}
                  >
                    <Option value="all">All Sequences</Option>
                    {uniqueSequences.map((sequence) => (
                      <Option
                        key={sequence.sequenceId}
                        value={sequence.sequenceId.toString()}
                      >
                        <Tag color={sequence.sequenceColor}>
                          {sequence.sequenceName}
                        </Tag>
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className="mb-4 sm:mb-0">
                  <Text strong>Department</Text>
                  <Select
                    className="w-full mt-2"
                    value={selectedDepartment}
                    onChange={setSelectedDepartment}
                  >
                    <Option value="all">All Departments</Option>
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
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div>
                  <Text strong>Status</Text>
                  <Select
                    className="w-full mt-2"
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                  >
                    <Option value="all">All Statuses</Option>
                    <Option value="upcoming">Upcoming</Option>
                    <Option value="active">Active</Option>
                    <Option value="completed">Completed</Option>
                    <Option value="delayed">Delayed</Option>
                    <Option value="cancelled">Cancelled</Option>
                    <Option value="on_hold">On Hold</Option>
                    <Option value="in_review">In Review</Option>
                  </Select>
                </div>
              </Col>
            </Row>
          </Card>
        </motion.div>

        {/* Timeline Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-md rounded-xl border-0">
            {sortedTimelines.length > 0 ? (
              <Timeline mode="left" className="mt-4">
                {sortedTimelines.map((timeline) => (
                  <Timeline.Item
                    key={timeline.id}
                    color={getStatusColor(timeline.status)}
                    dot={
                      <div
                        style={{ backgroundColor: timeline.sequenceColor }}
                        className="w-3 h-3 rounded-full"
                      />
                    }
                  >
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <Text strong className="text-lg">
                            {timeline.event}
                          </Text>
                          <div className="text-sm text-gray-500 mt-1">
                            <CalendarOutlined className="mr-2" />
                            {`${moment(timeline.startDate).format(
                              "YYYY-MM-DD"
                            )} — ${moment(timeline.endDate).format(
                              "YYYY-MM-DD"
                            )}`}
                          </div>
                        </div>
                        <Tag color={getStatusColor(timeline.status)}>
                          {timeline.status.toUpperCase()}
                        </Tag>
                      </div>
                      <div className="mt-2">
                        <Tag color={timeline.sequenceColor}>
                          {timeline.sequenceName}
                        </Tag>
                        {timeline.department && (
                          <Tag color="purple">{timeline.department}</Tag>
                        )}
                        <Tag color="orange">
                          {timelineTypeMap[timeline.timelineType] ||
                            `TYPE ${timeline.timelineType}`}
                        </Tag>
                      </div>
                      <Text type="secondary" className="mt-2 block">
                        {timeline.description || "No description available"}
                      </Text>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : (
              <Empty
                description="No timelines match the selected filters"
                className="my-8"
              />
            )}
          </Card>
        </motion.div>

        {/* Timeline Table View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card
            title={<Text strong>Timeline Details</Text>}
            className="shadow-md rounded-xl border-0 mt-6"
          >
            <Table
              dataSource={sortedTimelines}
              columns={[
                {
                  title: "Event",
                  dataIndex: "event",
                  key: "event",
                },
                {
                  title: "Sequence",
                  dataIndex: "sequenceName",
                  key: "sequenceName",
                  render: (text, record) => (
                    <Tag color={record.sequenceColor}>{text}</Tag>
                  ),
                },
                {
                  title: "Type",
                  dataIndex: "timelineType",
                  key: "timelineType",
                  render: (type) => (
                    <Tag color="orange">
                      {timelineTypeMap[type] || `TYPE ${type}`}
                    </Tag>
                  ),
                },
                {
                  title: "Start Date",
                  dataIndex: "startDate",
                  key: "startDate",
                  render: (date) => moment(date).format("YYYY-MM-DD"),
                  sorter: (a, b) => moment(a.startDate) - moment(b.startDate),
                },
                {
                  title: "End Date",
                  dataIndex: "endDate",
                  key: "endDate",
                  render: (date) => moment(date).format("YYYY-MM-DD"),
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  render: (status) => (
                    <Tag color={getStatusColor(status)}>
                      {status.toUpperCase()}
                    </Tag>
                  ),
                  filters: [
                    { text: "Upcoming", value: "upcoming" },
                    { text: "Active", value: "active" },
                    { text: "Completed", value: "completed" },
                  ],
                  onFilter: (value, record) => record.status === value,
                },
                {
                  title: "Created By",
                  dataIndex: "createdByName",
                  key: "createdByName",
                },
              ]}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: "max-content" }}
            />
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AllTimelines;
