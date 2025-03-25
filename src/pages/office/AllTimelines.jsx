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

const { Title, Text } = Typography;
const { Option } = Select;

const AllTimelines = () => {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [timelineData, setTimelineData] = useState([]);
  const [timelineGroups, setTimelineGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load data from the same source as TimelineManagement
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTimelineGroups([
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

  const filteredTimelines = timelineData.filter((timeline) => {
    const matchesGroup =
      selectedGroup === "all" || timeline.groupId.toString() === selectedGroup;
    const matchesDepartment =
      selectedDepartment === "all" ||
      timeline.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "all" || timeline.status === selectedStatus;
    return matchesGroup && matchesDepartment && matchesStatus;
  });

  const sortedTimelines = [...filteredTimelines].sort(
    (a, b) => moment(a.startDate) - moment(b.startDate)
  );

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
                    {timelineGroups.map((group) => (
                      <Option key={group.id} value={group.id.toString()}>
                        <Tag color={group.color}>{group.name}</Tag>
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
          <Card className="shadow-md rounded-xl border-0" loading={loading}>
            {sortedTimelines.length > 0 ? (
              <Timeline mode="left" className="mt-4">
                {sortedTimelines.map((timeline) => {
                  const group = timelineGroups.find(
                    (g) => g.id === timeline.groupId
                  );
                  return (
                    <Timeline.Item
                      key={timeline.id}
                      color={getStatusColor(timeline.status)}
                      dot={
                        <div
                          style={{ backgroundColor: group?.color }}
                          className="w-3 h-3 rounded-full"
                        />
                      }
                    >
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <Text strong className="text-lg">
                              {timeline.name}
                            </Text>
                            <div className="text-sm text-gray-500 mt-1">
                              <CalendarOutlined className="mr-2" />
                              {`${timeline.startDate} — ${timeline.endDate}`}
                            </div>
                          </div>
                          <Tag color={getStatusColor(timeline.status)}>
                            {timeline.status.toUpperCase().replace("_", " ")}
                          </Tag>
                        </div>
                        <div className="mt-2">
                          <Tag color={group?.color}>{group?.name}</Tag>
                          <Tag color="purple">{timeline.department}</Tag>
                          <Tag color="orange">
                            {timeline.type.toUpperCase()}
                          </Tag>
                        </div>
                        <Text type="secondary" className="mt-2 block">
                          {timeline.description}
                        </Text>
                      </div>
                    </Timeline.Item>
                  );
                })}
              </Timeline>
            ) : (
              <Empty
                description="No timelines match the selected filters"
                className="my-8"
              />
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AllTimelines;
