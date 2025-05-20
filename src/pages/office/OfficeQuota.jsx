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
  Skeleton,
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
  CalendarOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useGetQuotasQuery } from "../../features/quota/quotaApiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { apiSlice } from "../../features/api/apiSlice";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const OfficeQuota = () => {
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [yearFilter, setYearFilter] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
            quotaYear: quota.quotaYear || new Date().getFullYear(),
            numProjects: quota.numProjects || 0,
            totalBudget: quota.allocatedBudget || 0,
            usedBudget: quota.projectSpentBudget || 0,
            disbursedAmount: quota.disbursedAmount || 0,
            status: quota.status === 0 ? "Active" : "Inactive",
            createdAt: quota.createdAt,
            updateAt: quota.updateAt,
            allocatedBy: quota.allocatedBy,
            allocatorName: quota.allocatorName,
            quotaId: quota.quotaId,
          });
        } else {
          // If we have multiple quotas for the same department, update the values
          const dept = deptMap.get(quota.departmentId);

          // Only update if this quota entry is newer
          if (new Date(quota.createdAt) > new Date(dept.createdAt)) {
            dept.totalBudget = quota.allocatedBudget || dept.totalBudget;
            dept.quotaYear = quota.quotaYear || dept.quotaYear;
            dept.numProjects = quota.numProjects || dept.numProjects;
            dept.updateAt = quota.updateAt;
            dept.quotaId = quota.quotaId;
          }

          // Always add to the used budget and disbursed amount
          if (quota.projectSpentBudget) {
            dept.usedBudget += quota.projectSpentBudget;
          }
          if (quota.disbursedAmount) {
            dept.disbursedAmount += quota.disbursedAmount;
          }
        }
      });

      // Calculate remaining budget
      deptMap.forEach((dept) => {
        dept.remainingBudget = dept.totalBudget - dept.usedBudget;
        dept.pendingDisbursement = dept.totalBudget - dept.disbursedAmount;
      });

      setDepartmentData(Array.from(deptMap.values()));
    }
  }, [quotasData]);

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
              <CalendarOutlined className="text-gray-400" />
              <span>Fiscal Year: {record.quotaYear}</span>
            </div>
            <div className="flex items-center space-x-2">
              <TeamOutlined className="text-gray-400" />
              <span>Project Quota: {record.numProjects}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MailOutlined className="text-gray-400" />
              <span>{record.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneOutlined className="text-gray-400" />
              <span>{record.phone}</span>
            </div>
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
              <Tooltip title="Allocated by">
                <Tag className="text-xs bg-gray-100 text-gray-600">
                  {record.allocatorName}
                </Tag>
              </Tooltip>
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
              <Tooltip title="Date Allocated">
                <div className="text-gray-500">
                  Allocated: {new Date(record.createdAt).toLocaleDateString()}
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
            Modify Budget
          </Button>
          <Button
            type="default"
            icon={<EyeOutlined />}
            className="w-full border-[#F2722B] text-[#F2722B] hover:bg-[#F2722B]/10"
            onClick={() => handleViewDetails(record)}
          >
            View Projects
          </Button>
        </motion.div>
      ),
    },
  ];

  const handleAssignBudget = (record) => {
    setSelectedDepartment(record);
    form.resetFields();
    form.setFieldsValue({
      amount: record.totalBudget,
      numProjects: record.numProjects,
      fiscalYear: record.quotaYear,
    });
    setIsBudgetModalVisible(true);
  };

  const handleViewDetails = (record) => {
    dispatch(apiSlice.util.invalidateTags(["Quotas"]));
    navigate(`/project-quota/${record.key}`);
  };

  const handleBudgetSubmit = async (values) => {
    try {
      // API call to update budget would go here
      message.success("Budget allocation updated successfully");
      setIsBudgetModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to update budget allocation");
      console.error("Budget allocation error:", error);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  const handleYearFilter = (value) => {
    setYearFilter(value);
  };

  // Get unique fiscal years from the data for the filter
  const fiscalYears = [
    ...new Set(departmentData.map((dept) => dept.quotaYear)),
  ].sort((a, b) => b - a);

  const filteredData = departmentData.filter((dept) => {
    const matchesSearch =
      searchText === "" ||
      dept.name.toLowerCase().includes(searchText.toLowerCase()) ||
      dept.department.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      !statusFilter || dept.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesYear = !yearFilter || dept.quotaYear === yearFilter;

    return matchesSearch && matchesStatus && matchesYear;
  });

  // Show loading or error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section Skeleton */}
          <div className="text-center mb-16">
            <Skeleton.Input
              style={{ width: 250, height: 40 }}
              active
              size="large"
            />
            <div className="mt-4">
              <Skeleton.Input style={{ width: 500, height: 20 }} active />
            </div>
          </div>

          {/* Statistics Cards Skeleton */}
          <Row gutter={[16, 16]} className="mb-12">
            {[1, 2, 3, 4].map((i) => (
              <Col xs={24} sm={12} md={6} key={i}>
                <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <Skeleton
                    active
                    paragraph={{ rows: 1 }}
                    title={{ width: "60%" }}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Filters Section Skeleton */}
          <Card className="mb-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <Skeleton.Input
                    style={{ width: 140, height: 16, marginBottom: 16 }}
                    active
                    size="small"
                  />
                  <Skeleton.Input
                    style={{ width: "100%", height: 40 }}
                    active
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Main Table Skeleton */}
          <Card className="shadow-lg rounded-xl border-0">
            <Skeleton active>
              <Skeleton.Node active style={{ width: "100%", height: 400 }}>
                <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                  <div className="text-gray-500 flex flex-col items-center">
                    <BankOutlined style={{ fontSize: 48 }} />
                    <span className="mt-2">Loading department data...</span>
                  </div>
                </div>
              </Skeleton.Node>
            </Skeleton>
          </Card>
        </div>
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
            Manage and monitor department budget allocations and quotas
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
                title={<Text className="text-gray-600">Disbursed Amount</Text>}
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
                title={<Text className="text-gray-600">Project Quota</Text>}
                value={departmentData.reduce(
                  (sum, dept) => sum + dept.numProjects,
                  0
                )}
                prefix={<TeamOutlined className="text-[#F2722B]" />}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters Section */}
        <Card className="mb-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4">
            <Title level={4} className="m-0 text-gray-700">
              Department Quotas
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="bg-gradient-to-r from-[#F2722B] to-[#FFA500] border-none"
              onClick={() => navigate("/assign-quota")}
            >
              Assign New Quota
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Departments
              </label>
              <Search
                placeholder="Search by name..."
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
                Fiscal Year
              </label>
              <Select
                placeholder="Filter by fiscal year"
                allowClear
                className="w-full"
                onChange={handleYearFilter}
                value={yearFilter}
              >
                {fiscalYears.map((year) => (
                  <Select.Option key={year} value={year}>
                    {year}
                  </Select.Option>
                ))}
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
          title="Update Budget Allocation"
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
              name="numProjects"
              label="Project Quota"
              rules={[{ required: true }]}
            >
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item
              name="fiscalYear"
              label="Fiscal Year"
              rules={[{ required: true }]}
            >
              <InputNumber className="w-full" min={2020} max={2100} />
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
                  Update Allocation
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
