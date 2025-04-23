import React, { useState, useEffect } from "react";
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
  Spin,
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
import { useGetQuotasQuery } from "../../features/quota/quotaApiSlice";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const OfficeQuota = () => {
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [budgetRangeFilter, setBudgetRangeFilter] = useState(null);
  const navigate = useNavigate();

  // Fetch quota data from API
  const { data: quotasData, isLoading, isError, error } = useGetQuotasQuery();
  const [departmentData, setDepartmentData] = useState([]);

  // Transform API data to our component format
  useEffect(() => {
    if (quotasData) {
      // Group quotas by department
      const deptMap = new Map();

      quotasData.forEach((quota) => {
        if (!deptMap.has(quota.departmentId)) {
          deptMap.set(quota.departmentId, {
            key: quota.departmentId,
            name: quota.departmentName,
            email: "department@university.edu", // Default values since API doesn't provide these
            phone: "+84 123 456 789", // Default values
            department: quota.departmentName,
            title: "Department",
            ongoingProjects: 0,
            totalBudget: 0,
            usedBudget: 0,
            disbursedAmount: 0, // Add to track total disbursed amount
            remainingBudget: 0,
            projectTypes: {
              research: 0,
              conference: 0,
              journal: 0,
            },
            status: "Active",
            budgetHistory: [],
            projectQuotas: {
              research: 2,
              conference: 1,
              journal: 1,
            },
            projects: [],
          });
        }

        const dept = deptMap.get(quota.departmentId);

        // Add project to department
        dept.projects.push(quota);

        // Update budget totals
        dept.totalBudget += quota.projectApprovedBudget;
        dept.usedBudget += quota.projectSpentBudget;
        dept.disbursedAmount +=
          typeof quota.disbursedAmount === "number" ? quota.disbursedAmount : 0;

        // Update project count by type
        dept.ongoingProjects += 1;

        // Update project types count
        if (quota.projectTypeName === "Research") {
          dept.projectTypes.research += 1;
        } else if (quota.projectTypeName === "Conference") {
          dept.projectTypes.conference += 1;
        } else if (quota.projectTypeName === "Journal") {
          dept.projectTypes.journal += 1;
        }

        // Add to budget history if not already there
        const historyEntry = {
          date: quota.createdAt,
          amount: quota.allocatedBudget,
          type: "Initial Allocation",
          approvedBy: quota.allocatorName,
        };

        if (!dept.budgetHistory.some((h) => h.date === historyEntry.date)) {
          dept.budgetHistory.push(historyEntry);
        }
      });

      // Calculate remaining budget
      deptMap.forEach((dept) => {
        dept.remainingBudget = dept.totalBudget - dept.usedBudget;
        dept.pendingDisbursement = dept.totalBudget - dept.disbursedAmount; // Calculate pending disbursement
      });

      setDepartmentData(Array.from(deptMap.values()));
    }
  }, [quotasData]);

  // Enhanced mock data - commented out but preserved
  /*
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
  */

  const columns = [
    {
      title: "Department Information",
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
          <div className="flex items-center">
            <TeamOutlined className="text-[#F2722B]" />
            <span className="text-base font-medium ml-2">
              Active Projects: {record.ongoingProjects}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Tag color="blue" className="text-center">
              <span className="font-medium">Research:</span>{" "}
              {record.projectTypes.research}
            </Tag>
            <Tag color="green" className="text-center">
              <span className="font-medium">Conference:</span>{" "}
              {record.projectTypes.conference}
            </Tag>
            <Tag color="orange" className="text-center">
              <span className="font-medium">Journal:</span>{" "}
              {record.projectTypes.journal}
            </Tag>
          </div>
        </motion.div>
      ),
    },
    {
      title: "Budget Allocation",
      key: "budget",
      render: (_, record) => {
        const usagePercentage =
          record.totalBudget === 0
            ? 0
            : (record.usedBudget / record.totalBudget) * 100;

        const disbursementPercentage =
          record.totalBudget === 0
            ? 0
            : (record.disbursedAmount / record.totalBudget) * 100;

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
              format={() => `${Math.round(usagePercentage)}% Used`}
            />
            <Progress
              percent={Math.round(disbursementPercentage)}
              strokeColor={{
                "0%": "#1890ff",
                "100%": "#52c41a",
              }}
              size="small"
              format={() => `${Math.round(disbursementPercentage)}% Disbursed`}
            />
            <div className="grid grid-cols-1 gap-1 text-sm">
              <Tooltip title="Used Budget">
                <div className="text-blue-600">
                  Used: ₫{record.usedBudget.toLocaleString()}
                </div>
              </Tooltip>
              <Tooltip title="Disbursed Amount">
                <div className="text-green-600">
                  Disbursed: ₫{record.disbursedAmount.toLocaleString()}
                </div>
              </Tooltip>
              <Tooltip title="Remaining Budget">
                <div className="text-orange-600">
                  Remaining: ₫{record.remainingBudget.toLocaleString()}
                </div>
              </Tooltip>
              <Tooltip title="Pending Disbursement">
                <div className="text-purple-600">
                  To Disburse: ₫{record.pendingDisbursement.toLocaleString()}
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

  const handleViewBudgetHistory = (record) => {
    // Implement budget history view
  };

  const handleViewDetails = (record) => {
    navigate(`/project-quota/${record.key}`);
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

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  const handleBudgetRangeFilter = (value) => {
    setBudgetRangeFilter(value);
  };

  const filteredData = departmentData.filter((dept) => {
    const matchesSearch =
      searchText === "" ||
      dept.name.toLowerCase().includes(searchText.toLowerCase()) ||
      dept.department.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      !statusFilter || dept.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesBudget =
      !budgetRangeFilter ||
      (budgetRangeFilter === "high" && dept.totalBudget > 50000000) ||
      (budgetRangeFilter === "medium" &&
        dept.totalBudget >= 20000000 &&
        dept.totalBudget <= 50000000) ||
      (budgetRangeFilter === "low" && dept.totalBudget < 20000000);

    return matchesSearch && matchesStatus && matchesBudget;
  });

  // Show loading or error states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Loading quota data..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <Alert
          message="Error loading quotas"
          description={
            error?.data?.message ||
            "Failed to load quota data. Please try again later."
          }
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F2722B] to-[#FFA500] mb-2">
              Quota Management
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#F2722B] to-[#FFA500] rounded-full"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Manage and monitor department budgets and project allocations
          </p>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-12">
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={<Text className="text-gray-600">Total Departments</Text>}
                value={departmentData.length}
                prefix={<BankOutlined className="text-[#F2722B]" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={<Text className="text-gray-600">Total Budget</Text>}
                value={departmentData.reduce(
                  (sum, dept) => sum + dept.totalBudget,
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
                title={<Text className="text-gray-600">Total Disbursed</Text>}
                value={departmentData.reduce(
                  (sum, dept) => sum + dept.disbursedAmount,
                  0
                )}
                prefix={<WalletOutlined className="text-[#F2722B]" />}
                suffix="₫"
                formatter={(value) => `${value.toLocaleString()}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={<Text className="text-gray-600">Active Projects</Text>}
                value={departmentData.reduce(
                  (sum, dept) => sum + dept.ongoingProjects,
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
                value={
                  departmentData.length
                    ? Math.round(
                        (departmentData.reduce(
                          (sum, dept) => sum + dept.usedBudget,
                          0
                        ) /
                          departmentData.reduce(
                            (sum, dept) => sum + dept.totalBudget,
                            0
                          )) *
                          100
                      )
                    : 0
                }
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
                Search Departments
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
      </div>
    </div>
  );
};

export default OfficeQuota;
