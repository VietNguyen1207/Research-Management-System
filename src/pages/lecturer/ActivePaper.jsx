import React, { useState } from "react";
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
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ActivePaper = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Updated mock data for active papers
  const papers = [
    {
      id: 1,
      type: "Conference",
      title: "Machine Learning Applications in Education",
      abstract:
        "This paper explores innovative applications of machine learning in educational technology, focusing on personalized learning systems and student performance prediction.",
      publisher: "IEEE Transactions on Education",
      department: {
        id: 1,
        name: "Computer Science",
      },
      category: {
        id: 1,
        name: "AI & Machine Learning",
      },
      status: "accepted",
      submissionDate: "2024-02-15",
      publicationDate: "2024-05-20",
      authors: [
        {
          name: "Dr. Emily Smith",
          role: "Main Author",
          email: "emily.smith@university.edu",
        },
        {
          name: "Dr. Michael Chen",
          role: "Co-Author",
          email: "michael.chen@university.edu",
        },
      ],
      progress: 75,
      royalties: {
        total: 15000000,
        received: 5000000,
        pendingPayment: true,
      },
      milestones: [
        {
          title: "Paper Draft Completion",
          deadline: "2024-03-15",
          status: "completed",
        },
        {
          title: "Internal Review",
          deadline: "2024-04-01",
          status: "completed",
        },
        {
          title: "Final Paper Submission",
          deadline: "2024-05-30",
          status: "in_progress",
        },
      ],
    },
    {
      id: 2,
      type: "Journal",
      title: "Digital Transformation in Manufacturing",
      abstract:
        "A comprehensive analysis of Industry 4.0 implementation challenges and solutions in Vietnamese manufacturing sector.",
      publisher: "Journal of Manufacturing Technology Management",
      department: {
        id: 2,
        name: "Information Technology",
      },
      category: {
        id: 5,
        name: "Digital Technology",
      },
      status: "published",
      submissionDate: "2024-01-10",
      publicationDate: "2024-04-15",
      authors: [
        {
          name: "Prof. Sarah Johnson",
          role: "Main Author",
          email: "sarah.johnson@university.edu",
        },
        {
          name: "Dr. Lisa Nguyen",
          role: "Co-Author",
          email: "lisa.nguyen@university.edu",
        },
      ],
      progress: 100,
      royalties: {
        total: 25000000,
        received: 25000000,
        pendingPayment: false,
      },
      milestones: [
        {
          title: "Research Design and Planning",
          deadline: "2024-01-15",
          status: "completed",
        },
        {
          title: "Data Analysis",
          deadline: "2024-02-28",
          status: "completed",
        },
        {
          title: "Final Report",
          deadline: "2024-03-30",
          status: "completed",
        },
      ],
    },
    {
      id: 3,
      type: "Conference",
      title: "Blockchain for Supply Chain Transparency",
      abstract:
        "Exploring how blockchain technology can enhance transparency and traceability in global supply chains.",
      publisher: "International Conference on Supply Chain Management",
      department: {
        id: 1,
        name: "Computer Science",
      },
      category: {
        id: 3,
        name: "Blockchain",
      },
      status: "in_review",
      submissionDate: "2024-03-05",
      publicationDate: null,
      authors: [
        {
          name: "Dr. Emily Smith",
          role: "Main Author",
          email: "emily.smith@university.edu",
        },
        {
          name: "Dr. James Wilson",
          role: "Co-Author",
          email: "james.wilson@university.edu",
        },
      ],
      progress: 40,
      royalties: {
        total: 18000000,
        received: 0,
        pendingPayment: false,
      },
      milestones: [
        {
          title: "Initial Draft",
          deadline: "2024-03-20",
          status: "completed",
        },
        {
          title: "Peer Review",
          deadline: "2024-04-15",
          status: "in_progress",
        },
        {
          title: "Final Submission",
          deadline: "2024-05-10",
          status: "pending",
        },
      ],
    },
  ];

  const departments = [
    { label: "All Departments", value: "all" },
    { label: "Computer Science", value: "cs" },
    { label: "Information Technology", value: "it" },
    { label: "Software Engineering", value: "se" },
  ];

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "In Review", value: "in_review" },
    { label: "Accepted", value: "accepted" },
    { label: "Published", value: "published" },
    { label: "Rejected", value: "rejected" },
  ];

  const typeOptions = [
    { label: "All Types", value: "all" },
    { label: "Conference", value: "Conference" },
    { label: "Journal", value: "Journal" },
  ];

  const getStatusTag = (status) => {
    switch (status) {
      case "published":
        return <Tag color="success">Published</Tag>;
      case "accepted":
        return <Tag color="processing">Accepted</Tag>;
      case "in_review":
        return <Tag color="warning">In Review</Tag>;
      case "rejected":
        return <Tag color="error">Rejected</Tag>;
      default:
        return <Tag color="default">Unknown</Tag>;
    }
  };

  const filteredPapers = papers.filter((paper) => {
    const matchesSearch =
      paper.title.toLowerCase().includes(searchText.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || paper.status === filterStatus;
    const matchesType = filterType === "all" || paper.type === filterType;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "conference" && paper.type === "Conference") ||
      (activeTab === "journal" && paper.type === "Journal");

    return matchesSearch && matchesStatus && matchesType && matchesTab;
  });

  // Calculate statistics
  const stats = {
    totalPapers: papers.length,
    publishedPapers: papers.filter((p) => p.status === "published").length,
    conferenceCount: papers.filter((p) => p.type === "Conference").length,
    journalCount: papers.filter((p) => p.type === "Journal").length,
    totalRoyalties: papers.reduce(
      (sum, paper) => sum + paper.royalties.received,
      0
    ),
  };

  const handleViewPaperDetails = (paper) => {
    // Navigate to paper details page
    // navigate(`/active-paper-details/${paper.id}`);
    navigate(`/active-paper-details`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F2722B] to-[#FFA500] mb-2">
              Active Papers
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#F2722B] to-[#FFA500] rounded-full"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Manage and track your conference and journal papers
          </p>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 rounded-xl overflow-hidden">
              <Statistic
                title={<span className="text-gray-600">Total Papers</span>}
                value={stats.totalPapers}
                prefix={<FileTextOutlined className="text-[#F2722B]" />}
                className="text-center"
              />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 rounded-xl overflow-hidden">
              <Statistic
                title={<span className="text-gray-600">Published Papers</span>}
                value={stats.publishedPapers}
                prefix={<CheckCircleOutlined className="text-green-500" />}
                className="text-center"
              />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 rounded-xl overflow-hidden">
              <Statistic
                title={<span className="text-gray-600">Conference Papers</span>}
                value={stats.conferenceCount}
                prefix={<GlobalOutlined className="text-blue-500" />}
                className="text-center"
              />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 rounded-xl overflow-hidden">
              <Statistic
                title={<span className="text-gray-600">Journal Papers</span>}
                value={stats.journalCount}
                prefix={<BookOutlined className="text-purple-500" />}
                className="text-center"
              />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 rounded-xl overflow-hidden">
              <Statistic
                title={<span className="text-gray-600">Total Royalties</span>}
                value={stats.totalRoyalties}
                prefix={<DollarOutlined className="text-green-600" />}
                suffix="₫"
                className="text-center"
                formatter={(value) => `${value.toLocaleString()}`}
              />
            </Card>
          </motion.div>
        </div>

        {/* Filters Section */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Papers
              </label>
              <Search
                placeholder="Search by title or abstract..."
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full"
                prefix={<SearchOutlined className="text-gray-400" />}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paper Type
              </label>
              <Select
                placeholder="Filter by type"
                options={typeOptions}
                onChange={setFilterType}
                value={filterType}
                className="w-full"
                suffixIcon={<FilterOutlined className="text-gray-400" />}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                placeholder="Filter by status"
                options={statusOptions}
                onChange={setFilterStatus}
                value={filterStatus}
                className="w-full"
                suffixIcon={<FilterOutlined className="text-gray-400" />}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <Select
                placeholder="Filter by department"
                options={departments}
                className="w-full"
                suffixIcon={<FilterOutlined className="text-gray-400" />}
              />
            </div>
          </div>
        </Card>

        {/* Tabs for paper types */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="mb-6"
          type="card"
        >
          <TabPane
            tab={
              <span>
                <ProjectOutlined /> All Papers
              </span>
            }
            key="all"
          />
          <TabPane
            tab={
              <span>
                <GlobalOutlined /> Conference Papers
              </span>
            }
            key="conference"
          />
          <TabPane
            tab={
              <span>
                <BookOutlined /> Journal Papers
              </span>
            }
            key="journal"
          />
        </Tabs>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.length > 0 ? (
            filteredPapers.map((paper) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <Card
                  className="h-full hover:shadow-xl transition-all duration-300 rounded-xl border border-gray-200 overflow-hidden bg-white relative"
                  bodyStyle={{ padding: 0 }}
                  style={{
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <div className="absolute inset-0 border border-gray-200 rounded-xl pointer-events-none"></div>
                  <div className="p-6">
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-4">
                      <Tag
                        color={paper.type === "Conference" ? "blue" : "purple"}
                        className="text-xs"
                      >
                        {paper.type}
                      </Tag>
                      {getStatusTag(paper.status)}
                    </div>

                    {/* Paper Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {paper.title}
                    </h3>

                    {/* Publisher */}
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <BookOutlined className="mr-2" />
                      <span className="line-clamp-1">{paper.publisher}</span>
                    </div>

                    {/* Abstract */}
                    <Paragraph
                      ellipsis={{ rows: 3 }}
                      className="text-sm text-gray-600 mb-4"
                    >
                      {paper.abstract}
                    </Paragraph>

                    {/* Project Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <Text className="text-sm text-gray-500">Progress</Text>
                        <Text className="text-sm font-medium">
                          {paper.progress}%
                        </Text>
                      </div>
                      <Progress
                        percent={paper.progress}
                        size="small"
                        strokeColor={{
                          "0%": "#F2722B",
                          "100%": "#FFA500",
                        }}
                      />
                    </div>

                    {/* Royalties Section - Replacing Budget */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <Text className="text-sm text-gray-500">Royalties</Text>
                        <Text className="text-sm font-medium">
                          ₫{paper.royalties.received.toLocaleString()} / ₫
                          {paper.royalties.total.toLocaleString()}
                        </Text>
                      </div>
                      <Progress
                        percent={
                          (paper.royalties.received / paper.royalties.total) *
                          100
                        }
                        size="small"
                        status="success"
                        strokeColor={{
                          "0%": "#52c41a",
                          "100%": "#1890ff",
                        }}
                      />
                      {paper.royalties.pendingPayment && (
                        <Tag color="gold" className="mt-2 text-xs">
                          <ClockCircleOutlined className="mr-1" /> Payment
                          Pending
                        </Tag>
                      )}
                    </div>

                    {/* Paper Details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarOutlined className="mr-2" />
                          <span>Submitted: {paper.submissionDate}</span>
                        </div>
                        <div className="flex items-center">
                          <Avatar.Group maxCount={2} size="small">
                            {paper.authors.map((author, index) => (
                              <Tooltip title={author.name} key={index}>
                                <Avatar icon={<UserOutlined />} />
                              </Tooltip>
                            ))}
                          </Avatar.Group>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <Button
                      type="primary"
                      icon={<EyeOutlined />}
                      onClick={() => handleViewPaperDetails(paper)}
                      className="w-full bg-gradient-to-r from-[#F2722B] to-[#FFA500] hover:from-[#E65D1B] hover:to-[#FF9500] border-none"
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full">
              <Empty
                description={
                  <span className="text-gray-500">No papers found</span>
                }
                className="my-8"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivePaper;
