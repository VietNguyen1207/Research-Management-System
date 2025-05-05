import React, { useState, useMemo } from "react";
import {
  Table,
  Tag,
  Input,
  Button,
  Select,
  Space,
  Typography,
  message,
  Tooltip,
  Card,
  Badge,
  Avatar,
  Divider,
  Statistic,
  Row,
  Col,
  Breadcrumb,
  Skeleton,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  ReloadOutlined,
  TeamOutlined,
  UserOutlined,
  FilterOutlined,
  DashboardOutlined,
  HomeOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useGetAllUsersQuery } from "../../features/user/userApiSlice";
import { useSelector } from "react-redux";
import { useGetDepartmentsQuery } from "../../features/department/departmentApiSlice";

const { Title, Text } = Typography;
const { Option } = Select;

const UserManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data: departmentsData, isLoading: isDepartmentsLoading } =
    useGetDepartmentsQuery();

  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllUsersQuery();

  if (isError) {
    message.error(`Failed to load users: ${error?.message || "Unknown error"}`);
  }

  // Create a mapping from department ID to department name
  const departmentMap = useMemo(() => {
    if (!departmentsData) return {};
    return departmentsData.reduce((map, dept) => {
      map[dept.departmentId] = dept.departmentName;
      return map;
    }, {});
  }, [departmentsData]);

  // Generate departments list for filters using the API data
  const departments = useMemo(() => {
    if (!departmentsData) return [];
    return departmentsData
      .map((dept) => ({
        id: dept.departmentId,
        name: dept.departmentName,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [departmentsData]);

  // User statistics
  const userStats = useMemo(() => {
    if (!users) return { total: 0, active: 0, departments: 0 };

    const activeUsers = users.filter((user) => user.status === 1).length;
    const uniqueDepts = new Set(users.map((user) => user.departmentId)).size;

    return {
      total: users.length,
      active: activeUsers,
      departments: uniqueDepts,
    };
  }, [users]);

  // Define columns inside the component
  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "userId",
        key: "userId",
        sorter: (a, b) => a.userId - b.userId,
        width: 70,
        fixed: "left",
      },
      {
        title: "Name",
        dataIndex: "fullName",
        key: "fullName",
        sorter: (a, b) => (a.fullName || "").localeCompare(b.fullName || ""),
        render: (text, record) => (
          <div className="flex items-center space-x-3">
            <Avatar
              style={{
                backgroundColor: record.level ? "#1890ff" : "#87d068",
                verticalAlign: "middle",
              }}
            >
              {text?.charAt(0)?.toUpperCase() || <UserOutlined />}
            </Avatar>
            <div>
              <div className="font-medium">{text}</div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {record.username}
              </Text>
            </div>
          </div>
        ),
        width: 220,
        ellipsis: true,
        fixed: "left",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 200,
        ellipsis: true,
      },
      {
        title: "Department",
        dataIndex: "departmentId",
        key: "department",
        render: (departmentId) => (
          <Tag
            color="blue"
            className="rounded-lg px-2 py-1"
            style={{ whiteSpace: "nowrap" }}
          >
            <BankOutlined className="mr-1" />
            {departmentMap[departmentId] || `Dept ${departmentId}`}
          </Tag>
        ),
        filters: departments.map((dept) => ({
          text: dept.name,
          value: dept.id,
        })),
        onFilter: (value, record) => record.departmentId === value,
        width: 150,
      },
      {
        title: "Role",
        dataIndex: "levelText",
        key: "level",
        render: (levelText, record) => {
          let color = "default";
          if (record.level === "1") color = "gold";
          else if (record.level === "2") color = "lime";
          else if (record.level === "3") color = "green";
          else if (record.level === "4") color = "cyan";
          else if (record.level === "5") color = "blue";

          return (
            <Tag
              color={color}
              className="rounded-lg px-2 py-1"
              style={{ whiteSpace: "nowrap" }}
            >
              {levelText || "Student/Staff"}
            </Tag>
          );
        },
        filters: [
          { text: "No Level", value: "0" },
          { text: "Professor", value: "1" },
          { text: "Associate Professor", value: "2" },
          { text: "PhD", value: "3" },
          { text: "Master", value: "4" },
          { text: "Bachelor", value: "5" },
          { text: "Student/Staff", value: null },
        ],
        onFilter: (value, record) =>
          value === null ? record.level == null : record.level === value,
        width: 150,
      },
      {
        title: "Status",
        dataIndex: "statusText",
        key: "status",
        render: (statusText, record) => {
          const color =
            record.status === 1
              ? "success"
              : record.status === 2
              ? "warning"
              : "error";

          return (
            <Badge
              status={color}
              text={<span className="font-medium">{statusText}</span>}
            />
          );
        },
        filters: [
          { text: "Active", value: 1 },
          { text: "Inactive", value: 0 },
          { text: "Suspended", value: 2 },
        ],
        onFilter: (value, record) => record.status === value,
        width: 100,
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
        width: 130,
        ellipsis: true,
      },
      {
        title: "Actions",
        key: "actions",
        width: 100,
        fixed: "right",
        render: (_, record) => (
          <Space size="small">
            <Tooltip title="Edit User">
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                className="rounded-full"
                ghost
                onClick={() => message.info(`Edit user: ${record.fullName}`)}
              />
            </Tooltip>
            <Tooltip title="Delete User">
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
                className="rounded-full"
                ghost
                onClick={() => message.info(`Delete user: ${record.fullName}`)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [departments, departmentMap]
  );

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((user) => {
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        !searchText ||
        user.fullName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.username?.toLowerCase().includes(searchLower);
      const matchesRole = filterRole === null || user.level === filterRole;
      const matchesDepartment =
        !filterDepartment || user.departmentId === filterDepartment;
      return matchesSearch && matchesRole && matchesDepartment;
    });
  }, [users, searchText, filterRole, filterDepartment]);

  const handleReset = () => {
    setSearchText("");
    setFilterRole(null);
    setFilterDepartment(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen ml-16 md:ml-16 lg:ml-16">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item href="#">
          <HomeOutlined />
          <span className="ml-1">Home</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#">
          <DashboardOutlined />
          <span className="ml-1">Admin</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <TeamOutlined />
          <span className="ml-1">User Management</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Page Header with Stats */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <Title level={2} className="m-0 text-gray-800">
              User Management
            </Title>
            <Text type="secondary">
              Manage and monitor all users in the system
            </Text>
          </div>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            size="large"
            className="rounded-lg shadow-md"
            onClick={() => message.info("Add new user")}
          >
            Add User
          </Button>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} className="mt-4">
          <Col xs={24} sm={8}>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title="Total Users"
                value={userStats.total}
                prefix={<TeamOutlined className="text-blue-500" />}
                loading={isLoading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title="Active Users"
                value={userStats.active}
                prefix={<UserOutlined className="text-green-500" />}
                loading={isLoading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title="Departments"
                value={userStats.departments}
                prefix={<BankOutlined className="text-amber-500" />}
                loading={isLoading}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-md rounded-lg border-0">
        {/* Filters Bar */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Input
              placeholder="Search by name, email or username"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              className="rounded-lg"
              allowClear
            />

            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              className={
                showFilters ? "bg-blue-50 text-blue-500 border-blue-200" : ""
              }
            >
              Filters
            </Button>

            {searchText || filterRole !== null || filterDepartment !== null ? (
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                type="primary"
                ghost
              >
                Reset
              </Button>
            ) : null}

            <Badge
              count={filteredUsers.length}
              className="ml-2"
              style={{ backgroundColor: "#1890ff" }}
            >
              <Text className="text-gray-600">
                {filteredUsers.length === 1 ? "User" : "Users"}
              </Text>
            </Badge>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <div className="mb-2">
                    <Text strong>Role</Text>
                  </div>
                  <Select
                    placeholder="Filter by role"
                    style={{ width: "100%" }}
                    value={filterRole}
                    onChange={(value) => setFilterRole(value)}
                    allowClear
                    className="rounded-lg"
                  >
                    <Option value="0">No Level</Option>
                    <Option value="1">Professor</Option>
                    <Option value="2">Associate Professor</Option>
                    <Option value="3">PhD</Option>
                    <Option value="4">Master</Option>
                    <Option value="5">Bachelor</Option>
                    <Option value={null}>Student/Staff</Option>
                  </Select>
                </Col>
                <Col xs={24} md={12}>
                  <div className="mb-2">
                    <Text strong>Department</Text>
                  </div>
                  <Select
                    placeholder="Filter by department"
                    style={{ width: "100%" }}
                    value={filterDepartment}
                    onChange={(value) => setFilterDepartment(value)}
                    allowClear
                    className="rounded-lg"
                  >
                    {departments.map((dept) => (
                      <Option key={dept.id} value={dept.id}>
                        {dept.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </div>
          )}
        </div>

        <Divider className="my-4" />

        {/* Users Table */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton active />
            <Skeleton active />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={filteredUsers}
              rowKey="userId"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} users`,
                pageSizeOptions: ["10", "20", "50"],
                className: "rounded-lg",
                showQuickJumper: true,
              }}
              scroll={{ x: 1100 }}
              size="middle"
              className="rounded-lg"
              rowClassName="hover:bg-blue-50 transition-colors"
              footer={() => (
                <div className="text-right text-gray-500 text-sm">
                  © 2024 Research Management System. All rights reserved.
                </div>
              )}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserManagement;
