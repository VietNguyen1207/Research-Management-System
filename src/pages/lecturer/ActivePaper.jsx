import React, { useState, useEffect } from "react";
import {
  Card,
  Tag,
  Button,
  Input,
  Select,
  Empty,
  Tooltip,
  Badge,
  Row,
  Col,
  Statistic,
  Avatar,
  Space,
  Progress,
  Typography,
  Divider,
  Table,
  Tabs,
  Spin,
  message,
  Dropdown,
  Menu,
  Skeleton,
  List,
  Pagination,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ProjectOutlined,
  TeamOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  BulbOutlined,
  UserOutlined,
  FileTextOutlined,
  BookOutlined,
  GlobalOutlined,
  DownloadOutlined,
  EyeOutlined,
  DollarOutlined,
  PlusOutlined,
  SettingOutlined,
  MoreOutlined,
  ReloadOutlined,
  EnvironmentOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useGetUserConferencesQuery,
  useGetUserJournalsQuery,
} from "../../features/project/conference/conferenceApiSlice";

const { Search } = Input;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ActivePaper = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch real data from API
  const {
    data: conferencesResponse,
    isLoading: isLoadingConferences,
    isError: isErrorConferences,
    error: errorConferences,
    refetch: refetchConferences,
  } = useGetUserConferencesQuery();

  // Fetch journal data from API
  const {
    data: journalsResponse,
    isLoading: isLoadingJournals,
    isError: isErrorJournals,
    error: errorJournals,
    refetch: refetchJournals,
  } = useGetUserJournalsQuery();

  // Extract conference data
  const conferencesList = conferencesResponse?.data || [];

  // Extract journal data
  const journalsList = journalsResponse?.data || [];

  // Add useEffect to refetch data when component mounts
  useEffect(() => {
    // Refetch data when component mounts to ensure we have the newest data
    refetchConferences();
    refetchJournals();
  }, [refetchConferences, refetchJournals]);

  // Add this useEffect for grouping projects
  useEffect(() => {
    if (
      (conferencesList && conferencesList.length > 0) ||
      (journalsList && journalsList.length > 0)
    ) {
      // Group papers by project
      const projectMap = new Map();

      // Add conferences
      conferencesList.forEach((conference) => {
        if (!projectMap.has(conference.projectId)) {
          projectMap.set(conference.projectId, {
            projectId: conference.projectId,
            projectName: conference.projectName,
            conferences: [],
            journals: [],
            totalCount: 0,
            pendingCount: 0,
            approvedCount: 0,
            rejectedCount: 0,
          });
        }

        const project = projectMap.get(conference.projectId);
        project.conferences.push(conference);
        project.totalCount += 1;

        if (conference.conferenceSubmissionStatus === 0) {
          project.pendingCount += 1;
        } else if (conference.conferenceSubmissionStatus === 1) {
          project.approvedCount += 1;
        } else if (conference.conferenceSubmissionStatus === 2) {
          project.rejectedCount += 1;
        }
      });

      // Add journals
      journalsList.forEach((journal) => {
        if (!projectMap.has(journal.projectId)) {
          projectMap.set(journal.projectId, {
            projectId: journal.projectId,
            projectName: journal.projectName,
            conferences: [],
            journals: [],
            totalCount: 0,
            pendingCount: 0,
            approvedCount: 0,
            rejectedCount: 0,
          });
        }

        const project = projectMap.get(journal.projectId);
        project.journals.push(journal);
        project.totalCount += 1;

        if (journal.publisherStatus === 0) {
          project.pendingCount += 1;
        } else if (journal.publisherStatus === 2) {
          project.approvedCount += 1; // Status 2 is Approved
        } else if (journal.publisherStatus === 1) {
          project.rejectedCount += 1; // Status 1 is Rejected
        }
      });

      setProjectsData(Array.from(projectMap.values()));
    }
  }, [conferencesList, journalsList]);

  // Add state for projects data
  const [projectsData, setProjectsData] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  if (isErrorConferences || isErrorJournals) {
    message.error(
      `Failed to load conferences or journals: ${
        errorConferences?.data?.message ||
        errorJournals?.data?.message ||
        "Unknown error"
      }`
    );
  }

  const getStatusTag = (status) => {
    switch (status) {
      case 0: // Pending
        return <Tag color="warning">Pending</Tag>;
      case 1: // Approved
        return <Tag color="success">Approved</Tag>;
      case 2: // Rejected
        return <Tag color="error">Rejected</Tag>;
      default:
        return <Tag color="default">Unknown</Tag>;
    }
  };

  // Modify your filtering logic to work with projects
  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch =
      searchText === "" ||
      project.projectName.toLowerCase().includes(searchText.toLowerCase()) ||
      project.conferences.some((conference) =>
        conference.conferenceName
          .toLowerCase()
          .includes(searchText.toLowerCase())
      ) ||
      project.journals.some(
        (journal) =>
          journal.journalName
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          journal.publisherName.toLowerCase().includes(searchText.toLowerCase())
      );

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "in_review" && project.pendingCount > 0) ||
      (filterStatus === "accepted" && project.approvedCount > 0) ||
      (filterStatus === "rejected" && project.rejectedCount > 0);

    const matchesType =
      filterType === "all" ||
      (filterType === "Conference" && project.conferences.length > 0) ||
      (filterType === "Journal" && project.journals.length > 0);

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "conference" && project.conferences.length > 0) ||
      (activeTab === "journal" && project.journals.length > 0);

    return matchesSearch && matchesStatus && matchesType && matchesTab;
  });

  // Paginate the filtered projects
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset page on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filterStatus, filterType, activeTab, projectsData]);

  // Calculate statistics
  const stats = {
    totalPapers: conferencesList.length + journalsList.length,
    publishedPapers:
      conferencesList.filter((p) => p.conferenceSubmissionStatus === 1).length +
      journalsList.filter(
        (j) => j.publisherStatus === 2 // Only status 2 is Approved
      ).length,
    conferenceCount: conferencesList.length,
    journalCount: journalsList.length,
    totalRoyalties: 0, // We don't have royalties data yet
  };

  const handleViewPaperDetails = (conference) => {
    // First refetch the latest data
    refetchConferences().then(() => {
      navigate(`/active-paper-details/${conference.conferenceId}`);
    });
  };

  const handleViewJournalDetails = (journal) => {
    // First refetch the latest data
    refetchJournals().then(() => {
      navigate(`/journal-details/${journal.journalId}`);
    });
  };

  // Show loading state with skeleton
  if (isLoadingConferences || isLoadingJournals) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <Skeleton.Input style={{ width: 300, height: 40 }} active />
            <Skeleton.Input
              style={{ width: 500, height: 20, marginTop: 16 }}
              active
            />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} active paragraph={{ rows: 1 }} />
            ))}
          </div>

          {/* Filters Skeleton */}
          <Skeleton active paragraph={{ rows: 2 }} className="mb-8" />

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} active paragraph={{ rows: 4 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block mb-3">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F2722B] to-[#FFA500] mb-2">
                Academic Publications
              </h2>
              <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#F2722B] to-[#FFA500] rounded-full"></div>
            </div>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Manage and track your conference and journal papers
            </p>
          </motion.div>
        </div>

        {/* Enhanced Statistics Section with animations */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card
              className="shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 rounded-xl overflow-hidden"
              bodyStyle={{ padding: "20px" }}
            >
              <Statistic
                title={
                  <span className="text-gray-600 font-medium">
                    Total Papers
                  </span>
                }
                value={stats.totalPapers}
                prefix={<FileTextOutlined className="text-[#F2722B] mr-2" />}
                className="text-center"
              />
              <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-[#F2722B] to-[#FFA500]"
                />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card
              className="shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 rounded-xl overflow-hidden"
              bodyStyle={{ padding: "20px" }}
            >
              <Statistic
                title={
                  <span className="text-gray-600 font-medium">
                    Approved Papers
                  </span>
                }
                value={stats.publishedPapers}
                prefix={<CheckCircleOutlined className="text-green-500 mr-2" />}
                className="text-center"
              />
              <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: stats.totalPapers
                      ? `${(stats.publishedPapers / stats.totalPapers) * 100}%`
                      : "0%",
                  }}
                  transition={{ duration: 1 }}
                  className="h-full bg-green-500"
                />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card
              className="shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 rounded-xl overflow-hidden"
              bodyStyle={{ padding: "20px" }}
            >
              <Statistic
                title={
                  <span className="text-gray-600 font-medium">
                    Conference Papers
                  </span>
                }
                value={stats.conferenceCount}
                prefix={<GlobalOutlined className="text-blue-500 mr-2" />}
                className="text-center"
              />
              <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: stats.totalPapers
                      ? `${(stats.conferenceCount / stats.totalPapers) * 100}%`
                      : "0%",
                  }}
                  transition={{ duration: 1 }}
                  className="h-full bg-blue-500"
                />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card
              className="shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 rounded-xl overflow-hidden"
              bodyStyle={{ padding: "20px" }}
            >
              <Statistic
                title={
                  <span className="text-gray-600 font-medium">
                    Journal Papers
                  </span>
                }
                value={stats.journalCount}
                prefix={<BookOutlined className="text-purple-500 mr-2" />}
                className="text-center"
              />
              <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: stats.totalPapers
                      ? `${(stats.journalCount / stats.totalPapers) * 100}%`
                      : "0%",
                  }}
                  transition={{ duration: 1 }}
                  className="h-full bg-purple-500"
                />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card
              className="shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 rounded-xl overflow-hidden"
              bodyStyle={{ padding: "20px" }}
            >
              <Statistic
                title={
                  <span className="text-gray-600 font-medium">
                    Total Expenses
                  </span>
                }
                value={0}
                prefix={<DollarOutlined className="text-green-600 mr-2" />}
                suffix="₫"
                className="text-center"
                formatter={(value) => `${value.toLocaleString()}`}
              />
              <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 1 }}
                  className="h-full bg-green-600"
                />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              type="primary"
              size="large"
              icon={<ReloadOutlined />}
              onClick={() => refetchConferences()}
              className="mr-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none shadow-md"
            >
              Refresh
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate("/register-paper")}
              className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none shadow-md"
            >
              Create New Paper
            </Button>
          </motion.div>
        </div>

        {/* Enhanced Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="mb-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Papers
                </label>
                <Search
                  placeholder="Search by conference or project name..."
                  allowClear
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full"
                  size="large"
                  prefix={<SearchOutlined className="text-gray-400" />}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paper Type
                </label>
                <Select
                  placeholder="Filter by type"
                  options={[
                    { label: "All Types", value: "all" },
                    { label: "Conference", value: "Conference" },
                    { label: "Journal", value: "Journal" },
                  ]}
                  onChange={setFilterType}
                  value={filterType}
                  className="w-full"
                  size="large"
                  suffixIcon={<FilterOutlined className="text-gray-400" />}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  placeholder="Filter by status"
                  options={[
                    { label: "All Status", value: "all" },
                    { label: "Pending", value: "in_review" },
                    { label: "Approved", value: "accepted" },
                    { label: "Rejected", value: "rejected" },
                  ]}
                  onChange={setFilterStatus}
                  value={filterStatus}
                  className="w-full"
                  size="large"
                  suffixIcon={<FilterOutlined className="text-gray-400" />}
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="default"
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setSearchText("");
                    setFilterStatus("all");
                    setFilterType("all");
                  }}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="mb-6 paper-tabs"
            type="card"
            size="large"
            tabBarStyle={{
              marginBottom: 24,
              backgroundColor: "white",
              padding: "8px",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <TabPane
              tab={
                <span className="px-4 py-2">
                  <ProjectOutlined /> All Papers
                </span>
              }
              key="all"
            />
            <TabPane
              tab={
                <span className="px-4 py-2">
                  <GlobalOutlined /> Conference Papers
                </span>
              }
              key="conference"
            />
            <TabPane
              tab={
                <span className="px-4 py-2">
                  <BookOutlined /> Journal Papers
                  {stats.journalCount > 0 && (
                    <Badge
                      count={stats.journalCount}
                      style={{ marginLeft: 8 }}
                      color="purple"
                    />
                  )}
                </span>
              }
              key="journal"
            />
          </Tabs>
        </motion.div>

        {/* Status Summary */}
        {filteredProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mb-6"
          >
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 justify-center sm:justify-start">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">
                  Status Summary:
                </span>
              </div>
              <Tag color="default" className="rounded-full px-3 py-1">
                <span className="font-medium">
                  Total: {filteredProjects.length}
                </span>
              </Tag>
              <Tag color="warning" className="rounded-full px-3 py-1">
                <span className="font-medium">
                  Pending:{" "}
                  {filteredProjects.filter((p) => p.pendingCount > 0).length}
                </span>
              </Tag>
              <Tag color="success" className="rounded-full px-3 py-1">
                <span className="font-medium">
                  Approved:{" "}
                  {filteredProjects.filter((p) => p.approvedCount > 0).length}
                </span>
              </Tag>
              <Tag color="error" className="rounded-full px-3 py-1">
                <span className="font-medium">
                  Rejected:{" "}
                  {filteredProjects.filter((p) => p.rejectedCount > 0).length}
                </span>
              </Tag>
            </div>
          </motion.div>
        )}

        {/* Enhanced Papers Grid with staggered animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProjects.length > 0 ? (
            paginatedProjects.map((project, index) => (
              <motion.div
                key={project.projectId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="h-full"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card
                  className="h-full hover:shadow-xl transition-all duration-300 rounded-xl border border-gray-200 overflow-hidden bg-white relative"
                  bodyStyle={{ padding: 0 }}
                  style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}
                  cover={
                    <div className="h-4 bg-gradient-to-r from-[#F2722B] to-[#FFA500] opacity-90"></div>
                  }
                >
                  <div className="absolute inset-0 border border-gray-200 rounded-xl pointer-events-none"></div>
                  <div className="p-6">
                    {/* Project Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <Avatar
                          icon={<ProjectOutlined />}
                          className="bg-orange-100 text-orange-600 mr-2"
                        />
                        <Tag color="orange" className="text-xs">
                          Project
                        </Tag>
                      </div>
                      <div className="flex gap-1">
                        {project.pendingCount > 0 && (
                          <Tag color="warning" className="text-xs">
                            {project.pendingCount} Pending
                          </Tag>
                        )}
                        {project.approvedCount > 0 && (
                          <Tag color="success" className="text-xs">
                            {project.approvedCount} Approved
                          </Tag>
                        )}
                        {project.rejectedCount > 0 && (
                          <Tag color="error" className="text-xs">
                            {project.rejectedCount} Rejected
                          </Tag>
                        )}
                      </div>
                    </div>

                    {/* Project Name */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      {project.projectName}
                    </h3>

                    {/* Papers Overview - Compact Version */}
                    <div className="grid grid-cols-1 gap-2 mb-4">
                      <div className="flex items-center">
                        <GlobalOutlined className="text-teal-500 mr-2" />
                        <span className="text-gray-600 font-medium">
                          Papers Overview:
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pl-2">
                        <Tag color="teal" className="text-center">
                          <span className="font-medium">Conference:</span>{" "}
                          {project.conferences.length}
                        </Tag>
                        <Tag color="purple" className="text-center">
                          <span className="font-medium">Journal:</span>{" "}
                          {project.journals.length}
                        </Tag>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <Button
                      type="primary"
                      icon={<EyeOutlined />}
                      onClick={() => {
                        // First refetch the latest data
                        refetchConferences().then(() => {
                          navigate(`/project-details/${project.projectId}`);
                        });
                      }}
                      className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none"
                    >
                      View Project
                    </Button>

                    <Button
                      type="default"
                      icon={<GlobalOutlined />}
                      onClick={() => {
                        // First refetch the latest data
                        refetchConferences().then(() => {
                          // Always navigate to ProjectPaper page regardless of paper count
                          navigate(`/project-papers/${project.projectId}`);
                        });
                      }}
                      className="border-teal-500 text-teal-500 hover:bg-teal-50"
                    >
                      View Papers
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="col-span-full"
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="mt-4">
                    <p className="text-gray-500 mb-4">
                      No projects found matching your filters
                    </p>
                    <Button
                      type="primary"
                      onClick={() => {
                        setSearchText("");
                        setFilterStatus("all");
                        setFilterType("all");
                      }}
                      className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none"
                    >
                      Clear Filters
                    </Button>
                  </div>
                }
                className="my-16 bg-white p-12 rounded-2xl shadow-sm border border-gray-100"
              />
            </motion.div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredProjects.length > 0 && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredProjects.length}
              showSizeChanger
              pageSizeOptions={[6, 9, 12, 18]}
              onChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
              showTotal={(total) => `Total ${total} projects`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivePaper;
