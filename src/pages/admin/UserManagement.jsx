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
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useGetAllUsersQuery } from "../../features/user/userApiSlice";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;
const { Option } = Select;

const UserManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState(null);
  const [isNavOpen] = useState(true); // We'll assume navbar is open by default

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

  // Generate departments list for filters
  const departments = useMemo(() => {
    if (!users) return [];
    return [...new Set(users.map((user) => user.departmentId))]
      .map((deptId) => {
        const userInDept = users.find((u) => u.departmentId === deptId);
        const deptName =
          userInDept?.department?.departmentName || `Department ${deptId}`;
        return { id: deptId, name: deptName };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  // Define columns inside the component
  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "userId",
        key: "userId",
        sorter: (a, b) => a.userId - b.userId,
        width: 60,
      },
      {
        title: "Name",
        dataIndex: "fullName",
        key: "fullName",
        sorter: (a, b) => (a.fullName || "").localeCompare(b.fullName || ""),
        render: (text, record) => (
          <div>
            <div>{text}</div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.username}
            </Text>
          </div>
        ),
        width: 180,
        ellipsis: true,
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
        dataIndex: ["department", "departmentName"],
        key: "department",
        render: (departmentName, record) => (
          <Tag color="blue" style={{ whiteSpace: "nowrap" }}>
            {departmentName || `Dept ${record.departmentId}`}
          </Tag>
        ),
        filters: departments.map((dept) => ({
          text: dept.name,
          value: dept.id,
        })),
        onFilter: (value, record) => record.departmentId === value,
        width: 140,
      },
      {
        title: "Role",
        dataIndex: "levelText",
        key: "level",
        render: (levelText, record) => {
          let color = "default";
          if (record.level === "0") color = "gold";
          else if (record.level === "1") color = "lime";
          else if (record.level === "2") color = "green";
          else if (record.level === "3") color = "cyan";
          else if (record.level === "4") color = "blue";
          return (
            <Tag color={color} style={{ whiteSpace: "nowrap" }}>
              {levelText || "Student/Staff"}
            </Tag>
          );
        },
        filters: [
          { text: "Professor", value: "0" },
          { text: "Associate Professor", value: "1" },
          { text: "PhD", value: "2" },
          { text: "Master", value: "3" },
          { text: "Bachelor", value: "4" },
          { text: "Student/Staff", value: null },
        ],
        onFilter: (value, record) =>
          value === null ? record.level == null : record.level === value,
        width: 140,
      },
      {
        title: "Status",
        dataIndex: "statusText",
        key: "status",
        render: (statusText, record) => {
          let color = record.status === 1 ? "success" : "error";
          return <Tag color={color}>{statusText}</Tag>;
        },
        filters: [
          { text: "Active", value: 1 },
          { text: "Inactive", value: 0 },
          { text: "Suspended", value: 2 },
        ],
        onFilter: (value, record) => record.status === value,
        width: 90,
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
        width: 120,
        ellipsis: true,
      },
      {
        title: "Actions",
        key: "actions",
        width: 80,
        render: (_, record) => (
          <Space size="small">
            <Tooltip title="Edit User">
              <Button
                type="text"
                icon={<EditOutlined style={{ color: "#1890ff" }} />}
                size="small"
                onClick={() => message.info(`Edit user: ${record.fullName}`)}
              />
            </Tooltip>
            <Tooltip title="Delete User">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
                size="small"
                onClick={() => message.info(`Delete user: ${record.fullName}`)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [departments]
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
      const matchesRole =
        (filterRole === null && user.level == null) ||
        user.level === filterRole;
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
    // Use a more balanced approach with less margin
    <div className="ml-16 px-4">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="m-0">
          User Management
        </Title>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => message.info("Add new user")}
        >
          Add User
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="Search by name, email or username"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Select
          placeholder="Filter by role"
          style={{ width: 200 }}
          value={filterRole}
          onChange={(value) => setFilterRole(value)}
          allowClear
        >
          <Option value="0">Professor</Option>
          <Option value="1">Associate Professor</Option>
          <Option value="2">PhD</Option>
          <Option value="3">Master</Option>
          <Option value="4">Bachelor</Option>
          <Option value={null}>Student/Staff</Option>
        </Select>
        <Select
          placeholder="Filter by department"
          style={{ width: 200 }}
          value={filterDepartment}
          onChange={(value) => setFilterDepartment(value)}
          allowClear
        >
          {departments.map((dept) => (
            <Option key={dept.id} value={dept.id}>
              {dept.name}
            </Option>
          ))}
        </Select>
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          Reset Filters
        </Button>
      </div>

      {/* Users Table with proper margin */}
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="userId"
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} users`,
          pageSizeOptions: ["10", "20", "50"],
        }}
        scroll={{ x: 1020 }}
        size="middle"
      />
    </div>
  );
};

export default UserManagement;
