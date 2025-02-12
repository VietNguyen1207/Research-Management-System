import React from "react";
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Tag,
  Tooltip,
  Progress,
} from "antd";
import {
  SearchOutlined,
  TeamOutlined,
  DollarOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EyeOutlined,
  WalletOutlined,
} from "@ant-design/icons";

const DepartmentQuota = () => {
  const currentDepartment = {
    name: "Computer Science",
    code: "CS",
    faculty: "School of Computing",
    head: "Dr. Emily Smith",
  };

  const lecturersData = [
    {
      key: 1,
      name: "Dr. Emily Smith",
      email: "emily.smith@university.edu",
      phone: "+84 123 456 789",
      position: "Senior Lecturer",
      department: {
        name: "Computer Science",
        code: "CS",
        faculty: "School of Computing",
      },
      ongoingProjects: 3,
      totalBudget: 120000000,
      usedBudget: 80000000,
      remainingBudget: 40000000,
      projectTypes: {
        research: 1,
        conference: 1,
        caseStudy: 1,
      },
      status: "Active",
    },
    {
      key: 2,
      name: "Prof. John Watson",
      email: "john.watson@university.edu",
      phone: "+84 987 654 321",
      position: "Professor",
      department: {
        name: "Computer Science",
        code: "CS",
        faculty: "School of Computing",
      },
      ongoingProjects: 2,
      totalBudget: 150000000,
      usedBudget: 50000000,
      remainingBudget: 100000000,
      projectTypes: {
        research: 1,
        conference: 1,
        caseStudy: 0,
      },
      status: "Active",
    },
  ];

  const columns = [
    {
      title: "Lecturer Information",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <UserOutlined className="text-[#F2722B] text-xl" />
            <div>
              <div className="text-lg font-semibold text-gray-800">{text}</div>
              <div className="text-sm text-gray-500">
                {record.department?.name} ({record.department?.code})
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500 pl-6 space-y-1">
            <div className="flex items-center space-x-2">
              <TeamOutlined className="text-gray-400" />
              <span>{record.position}</span>
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
        </div>
      ),
    },
    {
      title: "Projects Overview",
      key: "projects",
      render: (_, record) => (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <TeamOutlined className="text-[#F2722B]" />
            <span className="text-base font-medium">
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
              <span className="font-medium">Case Study:</span>{" "}
              {record.projectTypes.caseStudy}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Budget Allocation",
      key: "budget",
      render: (_, record) => {
        const usagePercentage = (record.usedBudget / record.totalBudget) * 100;
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <WalletOutlined className="text-[#F2722B]" />
              <span className="font-medium">Total Budget:</span>
              <span className="text-green-600">
                ₫{record.totalBudget.toLocaleString()}
              </span>
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
          </div>
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
        <div className="space-y-2">
          <Button
            type="primary"
            icon={<DollarOutlined />}
            className="w-full bg-[#F2722B] hover:bg-[#F2722B]/90 border-none"
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
        </div>
      ),
    },
  ];

  const handleAssignBudget = (record) => {
    console.log("Assign budget for:", record.name);
  };

  const handleViewDetails = (record) => {
    console.log("View details for:", record.name);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {currentDepartment.name} Department
              </h2>
              <div className="text-sm text-gray-500 mt-1">
                <span className="font-medium">Faculty:</span>{" "}
                {currentDepartment.faculty} |
                <span className="font-medium ml-2">Department Code:</span>{" "}
                {currentDepartment.code} |
                <span className="font-medium ml-2">Head:</span>{" "}
                {currentDepartment.head}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-500">
              Manage and monitor lecturer quotas and project allocations
            </div>
            <div className="flex gap-4">
              <Input.Search
                placeholder="Search Lecturers"
                className="w-64"
                prefix={<SearchOutlined className="text-gray-400" />}
              />
              <Select
                placeholder="Filter by Status"
                className="w-40"
                allowClear
              >
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
              </Select>
            </div>
          </div>
        </div>

        <Card className="shadow-md rounded-lg" bodyStyle={{ padding: "24px" }}>
          <Table
            columns={columns}
            dataSource={lecturersData}
            pagination={{
              pageSize: 5,
              className: "custom-pagination",
            }}
            rowClassName="align-top hover:bg-gray-50"
          />
        </Card>
      </div>
    </div>
  );
};

export default DepartmentQuota;
