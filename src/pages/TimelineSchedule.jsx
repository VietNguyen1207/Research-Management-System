import React, { useState, useEffect } from "react";
import {
  Card,
  Timeline,
  Tabs,
  Tag,
  Select,
  Empty,
  Typography,
  DatePicker,
  Spin,
  Row,
  Col,
  Divider,
  Badge,
  Skeleton,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  FileOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useGetAllTimelinesQuery } from "../features/timeline/timelineApiSlice";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// Timeline type mapping
const TIMELINE_TYPE = {
  1: { name: "Submission", icon: <FileOutlined />, color: "blue" },
  2: { name: "Review", icon: <TeamOutlined />, color: "orange" },
  3: { name: "Funding", icon: <DollarOutlined />, color: "green" },
};

const TimelineSchedule = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [sequences, setSequences] = useState([]);
  const [selectedSequence, setSelectedSequence] = useState("all");
  const [viewType, setViewType] = useState("upcoming"); // upcoming, all, past

  // Fetch timelines data from API
  const {
    data: timelineData,
    isLoading,
    isError,
    error,
  } = useGetAllTimelinesQuery();

  // Extract unique sequences and set initial data when API response is received
  useEffect(() => {
    if (timelineData) {
      // Process the data to get unique sequences
      const uniqueSequences = [
        ...new Set(timelineData.map((item) => item.sequenceId)),
      ].map((id) => {
        const item = timelineData.find((d) => d.sequenceId === id);
        return {
          id,
          name: item.sequenceName,
          color: item.sequenceColor,
        };
      });

      setSequences(uniqueSequences);
      setFilteredData(timelineData);
    }
  }, [timelineData]);

  // Filter data based on selected sequence and view type
  useEffect(() => {
    if (!timelineData) return;

    let filtered = timelineData;

    // Filter by sequence
    if (selectedSequence !== "all") {
      const sequenceId = parseInt(selectedSequence);
      filtered = filtered.filter((item) => item.sequenceId === sequenceId);
    }

    // Filter by date
    const now = new Date();
    if (viewType === "upcoming") {
      filtered = filtered.filter((item) => new Date(item.endDate) >= now);
    } else if (viewType === "past") {
      filtered = filtered.filter((item) => new Date(item.endDate) < now);
    }

    // Sort by start date
    filtered = [...filtered].sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );

    setFilteredData(filtered);
  }, [selectedSequence, viewType, timelineData]);

  // Check if an event is current (ongoing)
  const isCurrentEvent = (startDate, endDate) => {
    const now = new Date();
    return new Date(startDate) <= now && new Date(endDate) >= now;
  };

  // Format date for display
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status of the timeline item
  const getTimelineItemStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { status: "upcoming", color: "blue" };
    } else if (now > end) {
      return { status: "past", color: "gray" };
    } else {
      return { status: "current", color: "green" };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton active paragraph={{ rows: 2 }} />
          <div className="mt-8">
            <Skeleton.Button active style={{ width: "100%", height: 40 }} />
            <Row gutter={16} className="mt-4">
              <Col xs={24} md={8}>
                <Skeleton active paragraph={{ rows: 5 }} />
              </Col>
              <Col xs={24} md={8}>
                <Skeleton active paragraph={{ rows: 5 }} />
              </Col>
              <Col xs={24} md={8}>
                <Skeleton active paragraph={{ rows: 5 }} />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Title level={3} className="text-red-500">
            Error Loading Academic Calendar
          </Title>
          <p className="text-gray-600 mt-2">
            {error?.data?.message ||
              "Failed to load timeline data. Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F2722B] to-[#FFA500] mb-2">
              Academic Calendar
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#F2722B] to-[#FFA500] rounded-full"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Important dates and submission windows for the academic year
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Card className="shadow-sm">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <Text strong className="mr-2">
                  Cycle:
                </Text>
                <Select
                  value={selectedSequence}
                  onChange={setSelectedSequence}
                  style={{ width: 240 }}
                  options={[
                    { value: "all", label: "All Cycles" },
                    ...sequences.map((seq) => ({
                      value: seq.id.toString(),
                      label: (
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: seq.color }}
                          ></div>
                          {seq.name}
                        </div>
                      ),
                    })),
                  ]}
                />
              </div>

              <Tabs defaultActiveKey="upcoming" onChange={setViewType}>
                <TabPane tab="Upcoming & Current" key="upcoming" />
                <TabPane tab="All Events" key="all" />
                <TabPane tab="Past Events" key="past" />
              </Tabs>
            </div>
          </Card>
        </div>

        {/* Timeline Content */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Grouped by sequence */}
            {sequences
              .filter(
                (seq) =>
                  selectedSequence === "all" ||
                  seq.id.toString() === selectedSequence
              )
              .map((sequence) => {
                const sequenceEvents = filteredData.filter(
                  (item) => item.sequenceId === sequence.id
                );
                if (sequenceEvents.length === 0) return null;

                return (
                  <Card
                    key={sequence.id}
                    title={
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: sequence.color }}
                        ></div>
                        <span>{sequence.name}</span>
                      </div>
                    }
                    className="shadow-md"
                    bodyStyle={{ padding: "12px 24px" }}
                  >
                    <Timeline mode="left">
                      {sequenceEvents.map((event) => {
                        const { status, color } = getTimelineItemStatus(
                          event.startDate,
                          event.endDate
                        );
                        const timelineType = TIMELINE_TYPE[event.timelineType];
                        const isCurrent = isCurrentEvent(
                          event.startDate,
                          event.endDate
                        );

                        return (
                          <Timeline.Item
                            key={event.id}
                            color={isCurrent ? "green" : color}
                            dot={
                              timelineType ? (
                                timelineType.icon
                              ) : (
                                <ClockCircleOutlined />
                              )
                            }
                          >
                            <div
                              className={`pb-4 ${
                                isCurrent ? "font-medium" : ""
                              }`}
                            >
                              <div className="flex items-center">
                                <Text
                                  strong
                                  className={isCurrent ? "text-green-600" : ""}
                                >
                                  {event.event}
                                </Text>
                                {isCurrent && (
                                  <Badge
                                    status="processing"
                                    text="ACTIVE NOW"
                                    className="ml-2 text-xs text-green-600"
                                  />
                                )}
                              </div>

                              <div className="text-sm text-gray-500 mt-1">
                                <CalendarOutlined className="mr-1" />
                                {formatDate(event.startDate)} -{" "}
                                {formatDate(event.endDate)}
                              </div>

                              <div className="mt-2">
                                <Tag color={timelineType?.color || "default"}>
                                  {timelineType?.name || "Other"} Period
                                </Tag>
                              </div>

                              {status === "upcoming" && (
                                <Text
                                  type="secondary"
                                  className="text-xs block mt-2"
                                >
                                  Starts in{" "}
                                  {Math.ceil(
                                    (new Date(event.startDate) - new Date()) /
                                      (1000 * 60 * 60 * 24)
                                  )}{" "}
                                  days
                                </Text>
                              )}

                              {isCurrent && (
                                <Text
                                  type="success"
                                  className="text-xs block mt-2"
                                >
                                  Ends in{" "}
                                  {Math.ceil(
                                    (new Date(event.endDate) - new Date()) /
                                      (1000 * 60 * 60 * 24)
                                  )}{" "}
                                  days
                                </Text>
                              )}
                            </div>
                          </Timeline.Item>
                        );
                      })}
                    </Timeline>
                  </Card>
                );
              })}
          </div>
        ) : (
          <Empty
            description={
              <span>
                No timeline events found
                {selectedSequence !== "all" ? " for selected cycle" : ""}
              </span>
            }
          />
        )}

        {/* Legend */}
        <Card className="mt-8 shadow-sm">
          <Title level={5}>Timeline Legend</Title>
          <Divider className="my-3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(TIMELINE_TYPE).map(([key, type]) => (
              <div key={key} className="flex items-center">
                <Tag color={type.color} icon={type.icon} className="mr-2">
                  {type.name}
                </Tag>
                <Text type="secondary">{type.name} windows for projects</Text>
              </div>
            ))}
          </div>
          <Divider className="my-3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Badge status="processing" text="Active Now" className="mr-2" />
              <Text type="secondary">Currently active period</Text>
            </div>
            <div className="flex items-center">
              <Badge status="warning" text="Upcoming" className="mr-2" />
              <Text type="secondary">Future period</Text>
            </div>
            <div className="flex items-center">
              <Badge status="default" text="Past" className="mr-2" />
              <Text type="secondary">Completed period</Text>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <ExclamationCircleOutlined className="mr-1" />
          All times are in your local timezone. Please plan submissions
          accordingly.
        </div>
      </div>
    </div>
  );
};

export default TimelineSchedule;
