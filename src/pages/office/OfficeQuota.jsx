import React, { useState } from "react";
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Tag,
  Tooltip,
  Progress,
  Modal,
  Form,
  InputNumber,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Statistic,
  Alert,
  message,
} from "antd";
import {
  SearchOutlined,
  TeamOutlined,
  DollarOutlined,
  BankOutlined,
  PhoneOutlined,
  MailOutlined,
  EyeOutlined,
  WalletOutlined,
  PlusOutlined,
  EditOutlined,
  HistoryOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const OfficeQuota = () => {
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [budgetRangeFilter, setBudgetRangeFilter] = useState(null);

  // Enhanced mock data
  const lecturersData = [
    {
      key: 1,
      name: "Dr. Emily Smith",
      email: "emily.smith@university.edu",
      phone: "+84 123 456 789",
      department: "Computer Science",
      title: "Associate Professor",
      ongoingProjects: 3,
      totalBudget: 150000000,
      usedBudget: 95000000,
      remainingBudget: 55000000,
      projectTypes: {
        research: 1,
        conference: 1,
        journal: 1,
      },
      status: "Active",
      budgetHistory: [
        {
          date: "2024-01-15",
          amount: 100000000,
          type: "Initial Allocation",
          approvedBy: "Admin",
        },
        {
          date: "2024-02-01",
          amount: 50000000,
          type: "Additional Funding",
          approvedBy: "Admin",
        },
      ],
      projectQuotas: {
        research: 2,
        conference: 2,
        journal: 1,
      },
    },
    {
      key: 2,
      name: "Prof. John Doe",
      email: "john.doe@university.edu",
      phone: "+84 987 654 321",
      department: "Information Technology",
      title: "Professor",
      ongoingProjects: 2,
      totalBudget: 120000000,
      usedBudget: 45000000,
      remainingBudget: 75000000,
      projectTypes: {
        research: 1,
        conference: 1,
        journal: 0,
      },
      status: "Active",
      budgetHistory: [
        {
          date: "2024-01-10",
          amount: 120000000,
          type: "Initial Allocation",
          approvedBy: "Admin",
        },
      ],
      projectQuotas: {
        research: 2,
        conference: 1,
        journal: 1,
      },
    },
    {
      key: 3,
      name: "Dr. Sarah Johnson",
      email: "sarah.j@university.edu",
      phone: "+84 456 789 123",
      department: "Electrical Engineering",
      title: "Assistant Professor",
      ongoingProjects: 2,
      totalBudget: 100000000,
      usedBudget: 75000000,
      remainingBudget: 25000000,
      projectTypes: {
        research: 1,
        conference: 1,
        journal: 0,
      },
      status: "Active",
      budgetHistory: [
        {
          date: "2024-01-20",
          amount: 100000000,
          type: "Initial Allocation",
          approvedBy: "Admin",
        },
      ],
      projectQuotas: {
        research: 2,
        conference: 1,
        journal: 1,
      },
    },
    {
      key: 4,
      name: "Prof. Michael Chen",
      email: "michael.chen@university.edu",
      phone: "+84 789 123 456",
      department: "Mechanical Engineering",
      title: "Professor",
      ongoingProjects: 1,
      totalBudget: 80000000,
      usedBudget: 60000000,
      remainingBudget: 20000000,
      projectTypes: {
        research: 1,
        conference: 0,
        journal: 0,
      },
      status: "Active",
      budgetHistory: [
        {
          date: "2024-01-05",
          amount: 80000000,
          type: "Initial Allocation",
          approvedBy: "Admin",
        },
      ],
      projectQuotas: {
        research: 2,
        conference: 1,
        journal: 1,
      },
    },
    {
      key: 5,
      name: "Dr. Lisa Wong",
      email: "lisa.wong@university.edu",
      phone: "+84 321 654 987",
      department: "Business Administration",
      title: "Associate Professor",
      ongoingProjects: 2,
      totalBudget: 90000000,
      usedBudget: 40000000,
      remainingBudget: 50000000,
      projectTypes: {
        research: 1,
        conference: 1,
        journal: 0,
      },
      status: "Active",
      budgetHistory: [
        {
          date: "2024-01-25",
          amount: 90000000,
          type: "Initial Allocation",
          approvedBy: "Admin",
        },
      ],
      projectQuotas: {
        research: 2,
        conference: 1,
        journal: 1,
      },
    },
  ];

  const columns = [
    {
      title: "Lecturer Information",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <BankOutlined className="text-[#F2722B] text-xl" />
            <div className="text-lg font-semibold text-gray-800">{text}</div>
          </div>
          <div className="text-sm text-gray-500 pl-6 space-y-1">
            <div className="flex items-center space-x-2">
              <TeamOutlined className="text-gray-400" />
              <span>{record.title}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MailOutlined className="text-gray-400" />
              <span>{record.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneOutlined className="text-gray-400" />
              <span>{record.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BankOutlined className="text-gray-400" />
              <span>{record.department}</span>
            </div>
          </div>
        </motion.div>
      ),
    },
    {
      title: "Projects Overview",
      key: "projects",
      render: (_, record) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TeamOutlined className="text-[#F2722B]" />
              <span className="text-base font-medium">
                Active Projects: {record.ongoingProjects}
              </span>
            </div>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditProjectQuotas(record)}
              className="text-[#F2722B]"
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Tag color="blue" className="text-center">
              <span className="font-medium">Research:</span>{" "}
              {record.projectTypes.research}/{record.projectQuotas.research}
            </Tag>
            <Tag color="green" className="text-center">
              <span className="font-medium">Conference:</span>{" "}
              {record.projectTypes.conference}/{record.projectQuotas.conference}
            </Tag>
            <Tag color="orange" className="text-center">
              <span className="font-medium">Journal:</span>{" "}
              {record.projectTypes.journal}/{record.projectQuotas.journal}
            </Tag>
          </div>
        </motion.div>
      ),
    },
    {
      title: "Budget Allocation",
      key: "budget",
      render: (_, record) => {
        const usagePercentage = (record.usedBudget / record.totalBudget) * 100;
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <WalletOutlined className="text-[#F2722B]" />
                <span className="font-medium">Total Budget:</span>
                <span className="text-green-600">
                  ₫{record.totalBudget.toLocaleString()}
                </span>
              </div>
              <Button
                type="text"
                icon={<HistoryOutlined />}
                onClick={() => handleViewBudgetHistory(record)}
                className="text-[#F2722B]"
              />
            </div>
            <Progress
              percent={Math.round(usagePercentage)}
              strokeColor={{
                "0%": "#F2722B",
                "100%": "#ff4d4f",
              }}
              size="small"
            />
            <div className="grid grid-cols-1 gap-1 text-sm">
              <Tooltip title="Used Budget">
                <div className="text-blue-600">
                  Used: ₫{record.usedBudget.toLocaleString()}
                </div>
              </Tooltip>
              <Tooltip title="Remaining Budget">
                <div className="text-orange-600">
                  Remaining: ₫{record.remainingBudget.toLocaleString()}
                </div>
              </Tooltip>
            </div>
          </motion.div>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      align: "center",
      render: (status) => (
        <Tag
          color={status === "Active" ? "success" : "error"}
          className="px-4 py-1 font-medium"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <Button
            type="primary"
            icon={<DollarOutlined />}
            className="w-full bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
            onClick={() => handleAssignBudget(record)}
          >
            Assign Budget
          </Button>
          <Button
            type="default"
            icon={<EyeOutlined />}
            className="w-full border-[#F2722B] text-[#F2722B] hover:bg-[#F2722B]/10"
            onClick={() => handleViewDetails(record)}
          >
            View Details
          </Button>
        </motion.div>
      ),
    },
  ];

  const handleAssignBudget = (record) => {
    setSelectedDepartment(record);
    form.resetFields();
    setIsBudgetModalVisible(true);
  };

  const handleEditProjectQuotas = (record) => {
    setSelectedDepartment(record);
    form.setFieldsValue({
      researchQuota: record.projectQuotas?.research || 0,
      conferenceQuota: record.projectQuotas?.conference || 0,
      journalQuota: record.projectQuotas?.journal || 0,
    });
    setIsProjectModalVisible(true);
  };

  const handleViewBudgetHistory = (record) => {
    // Implement budget history view
  };

  const handleViewDetails = (record) => {
    // Implement detailed view
  };

  const handleBudgetSubmit = async (values) => {
    try {
      // API call to update budget
      message.success("Budget allocated successfully");
      setIsBudgetModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to allocate budget");
      console.error("Budget allocation error:", error);
    }
  };

  const handleProjectQuotaSubmit = async (values) => {
    try {
      // API call to update project quotas
      message.success("Project quotas updated successfully");
      setIsProjectModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to update project quotas");
      console.error("Project quota update error:", error);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  const handleBudgetRangeFilter = (value) => {
    setBudgetRangeFilter(value);
  };

  const filteredData = lecturersData.filter((lecturer) => {
    const matchesSearch =
      searchText === "" ||
      lecturer.name.toLowerCase().includes(searchText.toLowerCase()) ||
      lecturer.department.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      !statusFilter ||
      lecturer.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesBudget =
      !budgetRangeFilter ||
      (budgetRangeFilter === "high" && lecturer.totalBudget > 50000000) ||
      (budgetRangeFilter === "medium" &&
        lecturer.totalBudget >= 20000000 &&
        lecturer.totalBudget <= 50000000) ||
      (budgetRangeFilter === "low" && lecturer.totalBudget < 20000000);

    return matchesSearch && matchesStatus && matchesBudget;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F2722B] to-[#FFA500] mb-2">
              Lecturer Quota Management
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#F2722B] to-[#FFA500] rounded-full"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Manage and monitor lecturer budgets and project allocations
          </p>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-12">
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={<Text className="text-gray-600">Total Lecturers</Text>}
                value={lecturersData.length}
                prefix={<BankOutlined className="text-[#F2722B]" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={<Text className="text-gray-600">Total Budget</Text>}
                value={lecturersData.reduce(
                  (sum, lecturer) => sum + lecturer.totalBudget,
                  0
                )}
                prefix={<DollarOutlined className="text-[#F2722B]" />}
                suffix="₫"
                formatter={(value) => `${value.toLocaleString()}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={<Text className="text-gray-600">Active Projects</Text>}
                value={lecturersData.reduce(
                  (sum, lecturer) => sum + lecturer.ongoingProjects,
                  0
                )}
                prefix={<TeamOutlined className="text-[#F2722B]" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={
                  <Text className="text-gray-600">Budget Utilization</Text>
                }
                value={Math.round(
                  (lecturersData.reduce(
                    (sum, lecturer) => sum + lecturer.usedBudget,
                    0
                  ) /
                    lecturersData.reduce(
                      (sum, lecturer) => sum + lecturer.totalBudget,
                      0
                    )) *
                    100
                )}
                suffix="%"
                prefix={<BarChartOutlined className="text-[#F2722B]" />}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters Section */}
        <Card className="mb-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Lecturers
              </label>
              <Search
                placeholder="Search by name or department..."
                allowClear
                className="w-full"
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={(e) => handleSearch(e.target.value)}
                value={searchText}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                placeholder="Filter by status"
                allowClear
                className="w-full"
                onChange={handleStatusFilter}
                value={statusFilter}
              >
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range
              </label>
              <Select
                placeholder="Filter by budget range"
                allowClear
                className="w-full"
                onChange={handleBudgetRangeFilter}
                value={budgetRangeFilter}
              >
                <Select.Option value="high">High (&gt;50M₫)</Select.Option>
                <Select.Option value="medium">Medium (20M₫-50M₫)</Select.Option>
                <Select.Option value="low">Low (&lt;20M₫)</Select.Option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Main Table */}
        <Card className="shadow-lg rounded-xl border-0">
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{
              pageSize: 5,
              className: "custom-pagination",
            }}
            rowClassName="align-top hover:bg-gray-50"
          />
        </Card>

        {/* Budget Allocation Modal */}
        <Modal
          title="Allocate Budget"
          open={isBudgetModalVisible}
          onCancel={() => {
            setIsBudgetModalVisible(false);
            form.resetFields();
          }}
          footer={null}
        >
          <Form form={form} onFinish={handleBudgetSubmit} layout="vertical">
            <Form.Item
              name="amount"
              label="Budget Amount (₫)"
              rules={[{ required: true }]}
            >
              <InputNumber
                className="w-full"
                formatter={(value) =>
                  `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/₫\s?|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item
              name="type"
              label="Allocation Type"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="initial">
                  Initial Allocation
                </Select.Option>
                <Select.Option value="additional">
                  Additional Funding
                </Select.Option>
                <Select.Option value="adjustment">
                  Budget Adjustment
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="notes" label="Notes">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Space className="w-full justify-end">
                <Button onClick={() => setIsBudgetModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Allocate Budget
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Project Quota Modal */}
        <Modal
          title="Edit Project Quotas"
          open={isProjectModalVisible}
          onCancel={() => {
            setIsProjectModalVisible(false);
            form.resetFields();
          }}
          footer={null}
        >
          <Form
            form={form}
            onFinish={handleProjectQuotaSubmit}
            layout="vertical"
          >
            <Form.Item
              name="researchQuota"
              label="Research Projects Quota"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item
              name="conferenceQuota"
              label="Conference Projects Quota"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item
              name="journalQuota"
              label="Journal Projects Quota"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item>
              <Space className="w-full justify-end">
                <Button onClick={() => setIsProjectModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Update Quotas
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default OfficeQuota;
