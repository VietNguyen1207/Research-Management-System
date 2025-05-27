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
import { useNavigate, useLocation } from "react-router-dom";
import { useGetCouncilGroupsQuery } from "../../features/group/groupApiSlice";
import { useGetAssignedProjectsForCouncilQuery } from "../../features/project/projectApiSlice";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ReviewSchedule = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [filteredReviews, setFilteredReviews] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  const councilGroupId = queryParams.get("councilGroupId");

  const {
    data: assignedProjectsData,
    isLoading: assignedProjectsLoading,
    isError: assignedProjectsError,
    error: assignedProjectsApiError,
  } = useGetAssignedProjectsForCouncilQuery(councilGroupId, {
    skip: !councilGroupId,
  });

  const {
    data: councilGroupsData,
    isLoading: councilLoading,
    isError: councilError,
  } = useGetCouncilGroupsQuery();

  const [reviewSchedules, setReviewSchedules] = useState([]);

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
    if (assignedProjectsData) {
      const schedules = assignedProjectsData.map((project) => {
        let locationDetail = "N/A";
        if (project.notes) {
          const locationMatch = project.notes.match(/Location: (.*)/);
          if (locationMatch && locationMatch[1]) {
            locationDetail = locationMatch[1].replace(/\.$/, "");
          } else {
            locationDetail = project.notes;
          }
        }

        let userRoleInCouncil = "Member";
        if (councilGroupsData?.data && user?.userId) {
          const council = councilGroupsData.data.find(
            (c) => c.groupId === project.assignedCouncilId
          );
          if (council && council.members) {
            const memberInfo = council.members.find(
              (m) => m.userId === user.userId
            );
            if (memberInfo && memberInfo.roleText) {
              userRoleInCouncil = memberInfo.roleText;
            }
          }
        }

        return {
          id: project.assignReviewId,
          councilId: project.assignedCouncilId,
          councilName: project.assignedCouncilName || "Council",
          timelineId: project.assignReviewId,
          event: project.projectName,
          startDate: project.scheduledDate,
          endDate: project.scheduledEndTime,
          location: locationDetail,
          projectIds: [project.projectId],
          role: userRoleInCouncil,
          status: getTimelineStatus(
            project.scheduledDate,
            project.scheduledEndTime
          ),
          projectRequestId: project.requestId,
        };
      });
      setReviewSchedules(schedules);
    } else {
      setReviewSchedules([]);
    }
  }, [assignedProjectsData, councilGroupsData, user]);

  useEffect(() => {
    const currentDate = new Date();

    let filtered = reviewSchedules.filter((review) => {
      const matchesSearch = searchText
        ? review.councilName.toLowerCase().includes(searchText.toLowerCase()) ||
          review.event.toLowerCase().includes(searchText.toLowerCase())
        : true;

      const matchesDateRange = dateRange
        ? new Date(review.startDate) >= dateRange[0].startOf("day").toDate() &&
          new Date(review.endDate) <= dateRange[1].endOf("day").toDate()
        : true;

      const reviewEndDate = new Date(review.endDate);
      const matchesTab =
        activeTab === "all"
          ? true
          : activeTab === "upcoming"
          ? reviewEndDate >= currentDate
          : reviewEndDate < currentDate;

      return matchesSearch && matchesDateRange && matchesTab;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return activeTab === "past" ? dateB - dateA : dateA - dateB;
    });

    setFilteredReviews(filtered);
  }, [reviewSchedules, searchText, dateRange, activeTab]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysFromNow = (dateStr) => {
    if (!dateStr) return "";
    const today = new Date();
    const targetDate = new Date(dateStr);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    } else if (diffDays < 0) {
      return `${Math.abs(diffDays)} day${
        Math.abs(diffDays) !== 1 ? "s" : ""
      } ago`;
    } else if (
      new Date(targetDate).toDateString() === new Date(today).toDateString()
    ) {
      return "today";
    } else {
      return "today";
    }
  };

  const columns = [
    {
      title: "Review Session (Project)",
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
              {location && location.length > 25
                ? `${location.substring(0, 25)}...`
                : location || "N/A"}
            </Text>
          </Space>
        </Tooltip>
      ),
    },
    // {
    //   title: "Your Role",
    //   dataIndex: "role",
    //   key: "role",
    //   render: (role) => <Tag color="blue">{role || "Member"}</Tag>,
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status?.color || "default"}>
          {status?.text || "Unknown"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() =>
            navigate(`/project-request/${record.projectRequestId}`)
          }
        >
          Review Projects
        </Button>
      ),
    },
  ];

  const isLoading = assignedProjectsLoading || councilLoading;

  if (!councilGroupId) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Alert
            message="Council Group Not Specified"
            description="Please access this page via a link that specifies a council group ID in the URL (e.g., /review-schedule?councilGroupId=1)."
            type="warning"
            showIcon
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
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

  if (assignedProjectsError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Alert
            message="Error Loading Schedule"
            description={
              assignedProjectsApiError?.data?.message ||
              "Failed to load review schedule for this council. Please try again later or check the council ID."
            }
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
            View upcoming and past review sessions for council:{" "}
            <Text strong>
              {reviewSchedules[0]?.councilName || `ID ${councilGroupId}`}
            </Text>
          </p>
        </div>

        <Card className="mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <Input
                placeholder="Search by project name or council"
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
                  {councilGroupId && ` for council ID ${councilGroupId}`}
                </span>
              }
            />
            {activeTab === "upcoming" && (
              <Text type="secondary" className="block mt-2">
                This council does not have any upcoming review sessions
                scheduled
              </Text>
            )}
          </Card>
        )}

        <Card className="mt-8 shadow-sm">
          <Title level={5}>Status Legend</Title>
          <Divider className="my-3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Badge status="processing" text="In Progress" className="mr-2" />
              <Text type="secondary">Currently active review session</Text>
            </div>
            <div className="flex items-center">
              <Badge color="blue" text="Upcoming" className="mr-2" />
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
          All times are displayed in your local timezone.
        </div>
      </div>
    </div>
  );
};

export default ReviewSchedule;
