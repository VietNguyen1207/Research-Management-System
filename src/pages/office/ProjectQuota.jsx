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
  Breadcrumb,
} from "antd";
import {
  SearchOutlined,
  TeamOutlined,
  DollarOutlined,
  BankOutlined,
  CalendarOutlined,
  FileTextOutlined,
  EyeOutlined,
  WalletOutlined,
  EditOutlined,
  HistoryOutlined,
  BarChartOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useGetQuotasQuery } from "../../features/quota/quotaApiSlice";
import { useNavigate, useParams } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const ProjectQuota = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [projectsData, setProjectsData] = useState([]);
  const [departmentInfo, setDepartmentInfo] = useState(null);

  // Fetch quota data from API
  const { data: quotasData, isLoading, isError, error } = useGetQuotasQuery();

  // Filter and transform API data for the specific department
  useEffect(() => {
    if (quotasData && departmentId) {
      const deptProjects = quotasData.filter(
        (quota) => quota.departmentId.toString() === departmentId.toString()
      );

      if (deptProjects.length > 0) {
        // Set department info
        setDepartmentInfo({
          id: deptProjects[0].departmentId,
          name: deptProjects[0].departmentName,
          totalBudget: deptProjects.reduce(
            (sum, project) => sum + project.projectApprovedBudget,
            0
          ),
          usedBudget: deptProjects.reduce(
            (sum, project) => sum + project.projectSpentBudget,
            0
          ),
          projectCount: deptProjects.length,
        });

        // Format projects data
        const projects = deptProjects.map((project) => ({
          key: project.projectId,
          id: project.projectId,
          name: project.projectName,
          group: project.groupName,
          type: project.projectTypeName,
          approvedBudget: project.projectApprovedBudget,
          spentBudget: project.projectSpentBudget,
          remainingBudget:
            project.projectApprovedBudget - project.projectSpentBudget,
          allocatedBy: project.allocatorName,
          createdAt: new Date(project.createdAt).toLocaleDateString(),
          status: project.status === 0 ? "Active" : "Completed",
          quotaId: project.quotaId,
          allocatedBudget: project.allocatedBudget,
          departmentId: project.departmentId,
          departmentName: project.departmentName,
          groupId: project.groupId,
          rawData: project, // Store the raw data for later use
        }));

        setProjectsData(projects);
      }
    }
  }, [quotasData, departmentId]);

  const columns = [
    {
      title: "Project Information",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <FileTextOutlined className="text-[#F2722B] text-xl" />
            <div className="text-lg font-semibold text-gray-800">{text}</div>
          </div>
          <div className="text-sm text-gray-500 pl-6 space-y-1">
            <div className="flex items-center space-x-2">
              <TeamOutlined className="text-gray-400" />
              <span>Group: {record.group}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ExperimentOutlined className="text-gray-400" />
              <span>Type: {record.type}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarOutlined className="text-gray-400" />
              <span>Created: {record.createdAt}</span>
            </div>
            <div className="flex items-center space-x-2">
              <UserOutlined className="text-gray-400" />
              <span>Allocator: {record.allocatedBy}</span>
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
          record.approvedBudget === 0
            ? 0
            : (record.spentBudget / record.approvedBudget) * 100;
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
                  ₫{record.approvedBudget.toLocaleString()}
                </span>
              </div>
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
                  Used: ₫{record.spentBudget.toLocaleString()}
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
          color={status === "Active" ? "success" : "default"}
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
            onClick={() => handleModifyBudget(record)}
          >
            Modify Budget
          </Button>
        </motion.div>
      ),
    },
  ];

  const handleModifyBudget = (record) => {
    setSelectedProject(record);
    form.setFieldsValue({
      amount: record.approvedBudget,
    });
    setIsBudgetModalVisible(true);
  };

  const handleBudgetSubmit = async (values) => {
    try {
      // API call to update budget would go here
      message.success("Budget modified successfully");
      setIsBudgetModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to modify budget");
      console.error("Budget modification error:", error);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  const handleTypeFilter = (value) => {
    setTypeFilter(value);
  };

  const filteredData = projectsData.filter((project) => {
    const matchesSearch =
      searchText === "" ||
      project.name.toLowerCase().includes(searchText.toLowerCase()) ||
      project.group.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      !statusFilter ||
      project.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesType =
      !typeFilter || project.type.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
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

  if (!departmentInfo) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <Alert
          message="Department not found"
          description="The requested department could not be found."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a onClick={() => navigate("/quota-management")}>
                <BankOutlined /> Departments
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span className="text-[#F2722B]">
                <FileTextOutlined /> {departmentInfo.name} Projects
              </span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <Button
                type="default"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/quota-management")}
                className="mb-4"
              >
                Back to Departments
              </Button>
              <div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F2722B] to-[#FFA500]">
                  {departmentInfo.name} Projects
                </h2>
                <p className="text-gray-600">
                  Manage and monitor project budgets for {departmentInfo.name}{" "}
                  department
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-12">
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={<Text className="text-gray-600">Total Projects</Text>}
                value={projectsData.length}
                prefix={<FileTextOutlined className="text-[#F2722B]" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={<Text className="text-gray-600">Department Budget</Text>}
                value={departmentInfo.totalBudget}
                prefix={<DollarOutlined className="text-[#F2722B]" />}
                suffix="₫"
                formatter={(value) => `${value.toLocaleString()}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Statistic
                title={<Text className="text-gray-600">Spent Budget</Text>}
                value={departmentInfo.usedBudget}
                prefix={<WalletOutlined className="text-[#F2722B]" />}
                suffix="₫"
                formatter={(value) => `${value.toLocaleString()}`}
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
                  departmentInfo.totalBudget === 0
                    ? 0
                    : Math.round(
                        (departmentInfo.usedBudget /
                          departmentInfo.totalBudget) *
                          100
                      )
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
                Search Projects
              </label>
              <Search
                placeholder="Search by name or group..."
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
                <Select.Option value="completed">Completed</Select.Option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <Select
                placeholder="Filter by project type"
                allowClear
                className="w-full"
                onChange={handleTypeFilter}
                value={typeFilter}
              >
                <Select.Option value="research">Research</Select.Option>
                <Select.Option value="conference">Conference</Select.Option>
                <Select.Option value="journal">Journal</Select.Option>
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

        {/* Budget Modification Modal */}
        <Modal
          title="Modify Project Budget"
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
              name="reason"
              label="Reason for Modification"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="budget_increase">
                  Budget Increase
                </Select.Option>
                <Select.Option value="budget_reduction">
                  Budget Reduction
                </Select.Option>
                <Select.Option value="correction">
                  Budget Correction
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
                  Update Budget
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ProjectQuota;
