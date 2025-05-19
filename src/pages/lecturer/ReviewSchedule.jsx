import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Table,
  Tag,
  Empty,
  Spin,
  Select,
  Input,
  DatePicker,
  Badge,
  Tabs,
  Space,
  Button,
  Tooltip,
  Alert,
  Timeline,
  Divider,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  ProjectOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetCouncilGroupsQuery } from "../../features/group/groupApiSlice";
import { useGetAllTimelinesQuery } from "../../features/timeline/timelineApiSlice";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ReviewSchedule = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [filteredReviews, setFilteredReviews] = useState([]);

  // Fetch council data - Skipping API call for mock data
  const {
    data: councilGroupsData,
    isLoading: councilLoading,
    isError: councilError,
  } = useGetCouncilGroupsQuery({ skip: true });

  // Fetch timeline data - Skipping API call for mock data
  const {
    data: timelineData,
    isLoading: timelineLoading,
    isError: timelineError,
  } = useGetAllTimelinesQuery({ skip: true });

  // Combine council and timeline data to get review schedules
  const [reviewSchedules, setReviewSchedules] = useState([]);

  // Helper function to get timeline status (remains the same)
  const getTimelineStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { text: "Upcoming", color: "blue" };
    } else if (now > end) {
      return { text: "Completed", color: "gray" };
    } else {
      return { text: "In Progress", color: "green" };
    }
  };

  useEffect(() => {
    // MOCK DATA IMPLEMENTATION
    const mockSchedules = [
      {
        id: "council1-timelineA",
        councilId: "council1",
        councilName: "Engineering Project Review Council",
        timelineId: "timelineA",
        event: "Final Year Project Defense - Session 1",
        startDate: new Date(
          new Date().setDate(new Date().getDate() + 7)
        ).toISOString(), // 1 week from now
        endDate: new Date(
          new Date().setDate(new Date().getDate() + 7) + 2 * 60 * 60 * 1000
        ).toISOString(), // 2 hours duration
        location: "Room A101, Engineering Block",
        projectIds: ["P001", "P002", "P003"],
        role: "Council Chairman",
        status: getTimelineStatus(
          new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
          new Date(
            new Date().setDate(new Date().getDate() + 7) + 2 * 60 * 60 * 1000
          ).toISOString()
        ),
      },
      {
        id: "council2-timelineB",
        councilId: "council2",
        councilName: "IT Research Grant Committee",
        timelineId: "timelineB",
        event: "Grant Proposal Review - Phase 2",
        startDate: new Date(
          new Date().setDate(new Date().getDate() + 14)
        ).toISOString(), // 2 weeks from now
        endDate: new Date(
          new Date().setDate(new Date().getDate() + 14) + 3 * 60 * 60 * 1000
        ).toISOString(), // 3 hours duration
        location: "Online via Zoom - Link in Calendar",
        projectIds: ["G004", "G005"],
        role: "Council Member",
        status: getTimelineStatus(
          new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
          new Date(
            new Date().setDate(new Date().getDate() + 14) + 3 * 60 * 60 * 1000
          ).toISOString()
        ),
      },
      {
        id: "council1-timelineC",
        councilId: "council1",
        councilName: "Engineering Project Review Council",
        timelineId: "timelineC",
        event: "Mid-term Project Review - Group Alpha",
        startDate: new Date(
          new Date().setDate(new Date().getDate() - 7)
        ).toISOString(), // 1 week ago
        endDate: new Date(
          new Date().setDate(new Date().getDate() - 7) + 2 * 60 * 60 * 1000
        ).toISOString(), // 2 hours duration
        location: "Room A102, Engineering Block",
        projectIds: ["P006"],
        role: "Secretary",
        status: getTimelineStatus(
          new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
          new Date(
            new Date().setDate(new Date().getDate() - 7) + 2 * 60 * 60 * 1000
          ).toISOString()
        ),
      },
      {
        id: "council3-timelineD",
        councilId: "council3",
        councilName: "University Ethics Committee",
        timelineId: "timelineD",
        event: "Ethics Clearance Review - Batch 5",
        startDate: new Date().toISOString(), // Today
        endDate: new Date(
          new Date().getTime() + 1 * 60 * 60 * 1000
        ).toISOString(), // 1 hour from now
        location: "Conference Hall 3",
        projectIds: ["E007", "E008", "E009"],
        role: "Council Member",
        status: getTimelineStatus(
          new Date().toISOString(),
          new Date(new Date().getTime() + 1 * 60 * 60 * 1000).toISOString()
        ),
      },
      {
        id: "council2-timelineE",
        councilId: "council2",
        councilName: "IT Research Grant Committee",
        timelineId: "timelineE",
        event: "Emergency Grant Proposal Review",
        startDate: new Date(
          new Date().setDate(new Date().getDate() + 1)
        ).toISOString(), // Tomorrow
        endDate: new Date(
          new Date().setDate(new Date().getDate() + 1) + 1.5 * 60 * 60 * 1000
        ).toISOString(), // 1.5 hours duration
        location: "Dean's Office Meeting Room",
        projectIds: ["G010"],
        role: "Council Chairman",
        status: getTimelineStatus(
          new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
          new Date(
            new Date().setDate(new Date().getDate() + 1) + 1.5 * 60 * 60 * 1000
          ).toISOString()
        ),
      },
    ];
    setReviewSchedules(mockSchedules);
    // END OF MOCK DATA IMPLEMENTATION

    // Original API data processing logic (commented out for mock data)
    /*
    if (councilGroupsData?.data && timelineData) {
      // Find all councils where the current user is a member
      const userCouncils = councilGroupsData.data.filter((council) =>
        council.members.some(
          (member) => member.userId === user?.userId && member.status === 1 // Assuming status 1 is 'active'
        )
      );

      // Find all review timelines
      const reviewTimelines = timelineData.filter(
        (timeline) => timeline.timelineType === 2 // Assuming 2 is the review timeline type
      );

      // Combine the data
      const schedules = userCouncils.flatMap((council) => {
        // Find timelines associated with this council
        // This is an assumption - you might need to adjust based on your actual data model
        const councilTimelines = reviewTimelines.filter(
          (timeline) => timeline.groupId === council.groupId
        );

        return councilTimelines.map((timeline) => ({
          id: `${council.groupId}-${timeline.id}`,
          councilId: council.groupId,
          councilName: council.name,
          timelineId: timeline.id,
          event: timeline.event,
          startDate: timeline.startDate,
          endDate: timeline.endDate,
          location: timeline.location || "Online",
          projectIds: timeline.projectIds || [], // Assuming this exists
          role: council.members.find((m) => m.userId === user?.userId)?.roleText || "Member",
          status: getTimelineStatus(timeline.startDate, timeline.endDate),
        }));
      });

      setReviewSchedules(schedules);
    }
    */
  }, [councilGroupsData, timelineData, user]); // user dependency is kept for potential future use if mock data considers user roles

  // Filter reviews based on search, date range, and tab
  useEffect(() => {
    const currentDate = new Date();

    let filtered = reviewSchedules.filter((review) => {
      // Text search
      const matchesSearch = searchText
        ? review.councilName.toLowerCase().includes(searchText.toLowerCase()) ||
          review.event.toLowerCase().includes(searchText.toLowerCase())
        : true;

      // Date range filter
      const matchesDateRange = dateRange
        ? new Date(review.startDate) >= dateRange[0].startOf("day").toDate() &&
          new Date(review.endDate) <= dateRange[1].endOf("day").toDate()
        : true;

      // Tab filter (upcoming, past, all)
      const reviewEndDate = new Date(review.endDate);
      const matchesTab =
        activeTab === "all"
          ? true
          : activeTab === "upcoming"
          ? reviewEndDate >= currentDate
          : reviewEndDate < currentDate;

      return matchesSearch && matchesDateRange && matchesTab;
    });

    // Sort by date (nearest upcoming first for "upcoming", most recent first for "past")
    filtered.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return activeTab === "past" ? dateB - dateA : dateA - dateB;
    });

    setFilteredReviews(filtered);
  }, [reviewSchedules, searchText, dateRange, activeTab]);

  // Helper functions (formatDate, formatTime, getDaysFromNow) remain the same
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysFromNow = (dateStr) => {
    const today = new Date();
    const targetDate = new Date(dateStr);
    const diffTime = Math.abs(targetDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (targetDate > today) {
      return `in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    } else if (targetDate < today) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    } else {
      return "today";
    }
  };

  // Table columns (remains the same)
  const columns = [
    {
      title: "Review Session",
      dataIndex: "event",
      key: "event",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            <TeamOutlined /> {record.councilName}
          </Text>
        </Space>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "startDate",
      key: "startDate",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>
            <CalendarOutlined className="mr-1" />
            {formatDate(record.startDate)}
          </Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            <ClockCircleOutlined className="mr-1" />
            {formatTime(record.startDate)} - {formatTime(record.endDate)}
          </Text>
          {record.status.text === "Upcoming" && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Starts {getDaysFromNow(record.startDate)}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (location) => (
        <Tooltip title={location}>
          <Space>
            <EnvironmentOutlined />
            <Text>
              {location.length > 25
                ? `${location.substring(0, 25)}...`
                : location}
            </Text>
          </Space>
        </Tooltip>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={status.color}>{status.text}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() =>
            navigate(`/review-project?councilId=${record.councilId}`)
          }
        >
          Review Projects
        </Button>
      ),
    },
  ];

  // MODIFIED Loading and Error states for mock data:
  // We assume mock data is always available and loaded without errors.
  // You can reinstate the original loading/error logic when removing mock data.
  const MOCK_DATA_LOADED_SUCCESSFULLY = true;

  if (!MOCK_DATA_LOADED_SUCCESSFULLY && (councilLoading || timelineLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <Spin size="large" />
            <Text className="block mt-2">Loading review schedule...</Text>
          </div>
        </div>
      </div>
    );
  }

  if (!MOCK_DATA_LOADED_SUCCESSFULLY && (councilError || timelineError)) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Alert
            message="Error"
            description="Failed to load review schedule. Please try again later."
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F2722B] to-[#FFA500] mb-2">
              Council Review Schedule
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#F2722B] to-[#FFA500] rounded-full"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            View your upcoming and past research review sessions as a council
            member
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <Input
                placeholder="Search by council name or event"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: "100%", maxWidth: "300px" }}
              />
              <RangePicker
                onChange={(dates) => setDateRange(dates)}
                style={{ width: "100%", maxWidth: "300px" }}
              />
            </div>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Upcoming" key="upcoming" />
              <TabPane tab="Past" key="past" />
              <TabPane tab="All" key="all" />
            </Tabs>
          </div>
        </Card>

        {/* Review Schedule Table */}
        {filteredReviews.length > 0 ? (
          <Card className="shadow-md">
            <Table
              dataSource={filteredReviews}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        ) : (
          <Card className="shadow-md text-center py-8">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span>
                  No review sessions found
                  {activeTab !== "all" && ` for ${activeTab} reviews`}
                  {searchText && ` matching "${searchText}"`}
                </span>
              }
            />
            {activeTab === "upcoming" && (
              <Text type="secondary" className="block mt-2">
                You don't have any upcoming review sessions scheduled
              </Text>
            )}
          </Card>
        )}

        {/* Legend */}
        <Card className="mt-8 shadow-sm">
          <Title level={5}>Status Legend</Title>
          <Divider className="my-3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Badge status="processing" text="In Progress" className="mr-2" />
              <Text type="secondary">Currently active review session</Text>
            </div>
            <div className="flex items-center">
              <Badge status="blue" text="Upcoming" className="mr-2" />
              <Text type="secondary">Future review session</Text>
            </div>
            <div className="flex items-center">
              <Badge status="default" text="Completed" className="mr-2" />
              <Text type="secondary">Past review session</Text>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <InfoCircleOutlined className="mr-1" />
          All times are in your local timezone. Please plan accordingly.
        </div>
      </div>
    </div>
  );
};

export default ReviewSchedule;
